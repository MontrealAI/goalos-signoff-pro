import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
function run(script, required=false){
  if(!fs.existsSync(script)){ const msg=`Skipping missing optional script ${script}`; if(required){ console.error(msg); process.exit(1); } console.log(msg); return; }
  const r=spawnSync('node',[script],{stdio:'inherit'}); if(r.status!==0) process.exit(r.status ?? 1);
}
run('scripts/build-goalos-signoff-public-labs-v22-v35.mjs', false);
run('scripts/enhance-goalos-v22-v35-ultimate-public-experience.mjs', false);
run('scripts/repair-goalos-v22-v35-html-integrity.mjs', false);
run('scripts/build-goalos-signoff-product-protocol-ladder-v36.mjs', true);
console.log('GoalOS Signoff Pro public labs v22-v36 global build complete.');
