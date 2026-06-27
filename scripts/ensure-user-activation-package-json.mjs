import fs from 'node:fs';
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['demo:proof-mission'] = 'node scripts/generate-demo-proof-mission.mjs';
pkg.scripts['website:quality'] = 'node scripts/verify-website-quality.mjs';
pkg.scripts['website:user-activation'] = 'node scripts/build-user-activation-pages.mjs';
fs.writeFileSync(p, JSON.stringify(pkg,null,2)+'\n');
console.log('package.json updated with GoalOS User Activation scripts');
