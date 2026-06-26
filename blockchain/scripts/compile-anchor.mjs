#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '../..');
const contractPath = path.join(root, 'contracts/GoalOSSignoffAnchorV1.sol');
if (!fs.existsSync(contractPath)) throw new Error('Missing contracts/GoalOSSignoffAnchorV1.sol');
const source = fs.readFileSync(contractPath, 'utf8');
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({ status: 'PASS_DRY_RUN', contract: 'GoalOSSignoffAnchorV1.sol', sourceSha256: '0x' + crypto.createHash('sha256').update(source).digest('hex') }, null, 2));
  process.exit(0);
}
const solc = await import('solc');
const input = {
  language: 'Solidity',
  sources: { 'contracts/GoalOSSignoffAnchorV1.sol': { content: source } },
  settings: { optimizer: { enabled: true, runs: 200 }, viaIR: false, outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object', 'metadata', 'storageLayout'] } } }
};
const output = JSON.parse(solc.default.compile(JSON.stringify(input)));
const errors = (output.errors || []).filter(e => e.severity === 'error');
if (errors.length) throw new Error(errors.map(e => e.formattedMessage).join('\n'));
const c = output.contracts['contracts/GoalOSSignoffAnchorV1.sol'].GoalOSSignoffAnchorV1;
const artifact = {
  contractName: 'GoalOSSignoffAnchorV1',
  sourceName: 'contracts/GoalOSSignoffAnchorV1.sol',
  compiler: solc.default.version(),
  settings: input.settings,
  abi: c.abi,
  bytecode: '0x' + c.evm.bytecode.object,
  deployedBytecode: '0x' + c.evm.deployedBytecode.object,
  metadataHash: '0x' + crypto.createHash('sha256').update(c.metadata).digest('hex'),
  sourceSha256: '0x' + crypto.createHash('sha256').update(source).digest('hex'),
  storageLayout: c.storageLayout
};
const outDir = path.join(root, 'artifacts/contracts');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'GoalOSSignoffAnchorV1.json'), JSON.stringify(artifact, null, 2) + '\n');
const legacyDir = path.join(root, 'blockchain/artifacts');
fs.mkdirSync(legacyDir, { recursive: true });
fs.writeFileSync(path.join(legacyDir, 'GoalOSSignoffAnchorV1.abi.json'), JSON.stringify(artifact.abi, null, 2) + '\n');
fs.writeFileSync(path.join(legacyDir, 'GoalOSSignoffAnchorV1.bytecode.txt'), artifact.bytecode.slice(2) + '\n');
fs.writeFileSync(path.join(legacyDir, 'GoalOSSignoffAnchorV1.deployed-bytecode.txt'), artifact.deployedBytecode.slice(2) + '\n');
fs.mkdirSync(path.join(root, 'verification'), { recursive: true });
fs.writeFileSync(path.join(root, 'verification/anchor-compile-summary.json'), JSON.stringify({ status: 'PASS', compiler: artifact.compiler, sourceSha256: artifact.sourceSha256, bytecodeBytes: (artifact.bytecode.length - 2) / 2, deployedBytecodeBytes: (artifact.deployedBytecode.length - 2) / 2 }, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', sourceSha256: artifact.sourceSha256, bytecodeBytes: (artifact.bytecode.length - 2) / 2, deployedBytecodeBytes: (artifact.deployedBytecode.length - 2) / 2 }, null, 2));
