const mode = process.env.NEXT_PUBLIC_GOALOS_WEB3_MODE || 'disabled';
const mainnet = process.env.GOALOS_MAINNET_ANCHORING_ENABLED === 'true';
const address = process.env.NEXT_PUBLIC_GOALOS_ANCHOR_CONTRACT_ADDRESS || '';
const relayer = process.env.GOALOS_ANCHOR_RELAYER_PRIVATE_KEY || '';
const problems = [];
if (!['disabled','sepolia','mainnet-anchor-only'].includes(mode)) problems.push('NEXT_PUBLIC_GOALOS_WEB3_MODE must be disabled, sepolia, or mainnet-anchor-only');
if (mode === 'mainnet-anchor-only' && !mainnet) problems.push('mainnet mode requires GOALOS_MAINNET_ANCHORING_ENABLED=true');
if (mainnet && mode !== 'mainnet-anchor-only') problems.push('GOALOS_MAINNET_ANCHORING_ENABLED=true requires mainnet-anchor-only mode');
if (address && !/^0x[0-9a-fA-F]{40}$/.test(address)) problems.push('anchor contract address is malformed');
if (relayer && !/^0x[0-9a-fA-F]{64}$/.test(relayer)) problems.push('relayer private key is malformed');
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(JSON.stringify({status:'PASS', mode, mainnet, anchorContractConfigured: Boolean(address), relayerConfigured: Boolean(relayer)}, null, 2));
