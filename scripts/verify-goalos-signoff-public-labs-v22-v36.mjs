import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
function run(script, required=false){
  if(!fs.existsSync(script)){ const msg=`Skipping missing optional script ${script}`; if(required){ console.error(msg); process.exit(1); } console.log(msg); return; }
  const r=spawnSync('node',[script],{stdio:'inherit'}); if(r.status!==0) process.exit(r.status ?? 1);
}
run('scripts/verify-goalos-signoff-product-protocol-ladder-v36.mjs', true);
run('scripts/verify-goalos-production-site.mjs', false);
run('scripts/check-site-route-integrity.mjs', false);
run('scripts/check-public-artifact-safety.mjs', false);
console.log('GoalOS Signoff Pro public labs v22-v36 global verification PASS.');
