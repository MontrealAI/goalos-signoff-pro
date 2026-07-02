#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), site=path.join(root,'site');
const required=['ask-goalos-live.html','ask-goalos.html','chat.html','site-navigator.html','goalos-v22-v40-command-center.html','public-demo-labs.html','index.html','assets/goalos-v40-concierge.css','assets/goalos-v40-concierge.js','goalos-v40-knowledge-map.json','goalos-v40-chat-policy.json','goalos-v40-question-route-map.json','goalos-v40-live-ai-endpoint-spec.json'];
const missing=required.filter(r=>!fs.existsSync(path.join(site,r)));
if(missing.length){console.error('Missing v40 files:', missing.join(', ')); process.exit(1)}
const policy=JSON.parse(fs.readFileSync(path.join(site,'goalos-v40-chat-policy.json'),'utf8'));
if(policy.externalEndpoint?.enabled){console.error('Default v40 external endpoint must be disabled for public GitHub Pages mode.'); process.exit(1)}
const knowledge=JSON.parse(fs.readFileSync(path.join(site,'goalos-v40-knowledge-map.json'),'utf8'));
if(!Array.isArray(knowledge.topics)||knowledge.topics.length<20){console.error('v40 knowledge map is too small.'); process.exit(1)}
const index=fs.readFileSync(path.join(site,'index.html'),'utf8');
for(const phrase of ['Ask GoalOS','Know when AI work is actually done','19']){if(!index.includes(phrase)){console.error('Homepage missing phrase', phrase); process.exit(1)}}
const js=fs.readFileSync(path.join(site,'assets/goalos-v40-concierge.js'),'utf8');
if(/apiKey|OPENAI_API_KEY|sk-/.test(js)){console.error('Client JS appears to contain secret/API-key pattern.'); process.exit(1)}
console.log(`GoalOS Autonomous AI Concierge v40 verification PASS: ${knowledge.topics.length} topics, external endpoint disabled by default.`);
