import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import fs from 'node:fs';
import path from 'node:path';

const required = ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','ANCHOR_RPC_URL','ANCHOR_RELAYER_PRIVATE_KEY','ANCHOR_SERVICE_SIGNER_PRIVATE_KEY','ANCHOR_CONTRACT_ADDRESS'];
for (const name of required) if (!process.env[name]) throw new Error(`Missing ${name}`);
if (!process.env.ANCHOR_RPC_URL.startsWith('https://')) throw new Error('ANCHOR_RPC_URL must be HTTPS');
if (process.env.ANCHOR_CHAIN_ID === '1' && process.env.ALLOW_MAINNET_ANCHORING !== 'I_HAVE_AUDIT_AND_PRODUCTION_AUTHORIZATION') throw new Error('Mainnet anchoring is disabled by default. Use Sepolia first.');

const root = path.resolve(import.meta.dirname, '..', '..', '..');
const artifactPath = path.join(root, 'artifacts/contracts/GoalOSSignoffAnchorV1.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const provider = new ethers.JsonRpcProvider(process.env.ANCHOR_RPC_URL);
const relayer = new ethers.Wallet(process.env.ANCHOR_RELAYER_PRIVATE_KEY, provider);
const serviceSigner = new ethers.Wallet(process.env.ANCHOR_SERVICE_SIGNER_PRIVATE_KEY);
const contract = new ethers.Contract(process.env.ANCHOR_CONTRACT_ADDRESS, artifact.abi, relayer);
const dryRun = process.env.ANCHOR_DRY_RUN === '1';

const { data: requests, error } = await supabase.from('blockchain_anchor_requests').select('*').eq('status', 'queued').order('created_at', { ascending: true }).limit(Number(process.env.ANCHOR_BATCH_SIZE || 5));
if (error) throw new Error(error.message);

for (const req of requests || []) {
  try {
    const receiptHash = req.receipt_hash;
    const publicIdHash = req.public_id_hash;
    const evidenceRoot = req.evidence_root;
    const receiptCid = req.receipt_cid || '';
    const evidenceCid = req.evidence_cid || '';
    const acceptedAt = BigInt(req.accepted_at_unix);
    const receiptCidHash = ethers.keccak256(ethers.toUtf8Bytes(receiptCid));
    const evidenceCidHash = ethers.keccak256(ethers.toUtf8Bytes(evidenceCid));
    const payload = await contract.anchorPayloadHash(receiptHash, publicIdHash, evidenceRoot, receiptCidHash, evidenceCidHash, acceptedAt);
    const signature = await serviceSigner.signMessage(ethers.getBytes(payload));
    if (dryRun) {
      console.log(JSON.stringify({ id: req.id, status: 'DRY_RUN_READY', receiptHash, publicIdHash, evidenceRoot, receiptCid, evidenceCid, acceptedAt: acceptedAt.toString(), signer: serviceSigner.address }, null, 2));
      continue;
    }
    const tx = await contract.anchorReceipt(receiptHash, publicIdHash, evidenceRoot, receiptCid, evidenceCid, acceptedAt, signature);
    const receipt = await tx.wait();
    const explorerUrl = process.env.ANCHOR_EXPLORER_BASE ? `${process.env.ANCHOR_EXPLORER_BASE}/tx/${receipt.hash}` : receipt.hash;
    await supabase.from('blockchain_anchors').insert({ receipt_id: req.receipt_id, receipt_hash: receiptHash, chain_id: Number((await provider.getNetwork()).chainId), contract_address: process.env.ANCHOR_CONTRACT_ADDRESS, transaction_hash: receipt.hash, block_number: Number(receipt.blockNumber), receipt_cid: receiptCid, evidence_cid: evidenceCid, status: 'anchored', explorer_url: explorerUrl });
    await supabase.from('blockchain_anchor_requests').update({ status: 'anchored', transaction_hash: receipt.hash, updated_at: new Date().toISOString() }).eq('id', req.id);
    console.log(`Anchored ${req.id}: ${receipt.hash}`);
  } catch (e) {
    await supabase.from('blockchain_anchor_requests').update({ status: 'failed', last_error: e?.message || String(e), updated_at: new Date().toISOString() }).eq('id', req.id);
    console.error(`Failed ${req.id}: ${e?.message || e}`);
  }
}
