#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const SITE = path.join(ROOT, 'site');
const ASSETS = path.join(SITE, 'assets');
const RESEARCH = path.join(SITE, 'research', 'rsi');
fs.mkdirSync(ASSETS, {recursive:true}); fs.mkdirSync(RESEARCH, {recursive:true});
const routes = [
  "loop-rsi-asi-superintelligence-control-tower-lab.html",
  "asi-control-tower.html",
  "superintelligence-control-tower.html",
  "governed-asi-console.html",
  "asi-readiness-flight-simulator.html",
  "loop-to-rsi-to-asi-v34.html",
  "proof-gated-superintelligence.html",
  "asi-governance-dashboard.html",
  "move37-asi-control-room.html",
  "no-ungoverned-superintelligence-v34.html",
  "v34.html"
];
const css = "\n:root{--bg:#05000d;--panel:#12051e;--panel2:#1b0733;--line:rgba(255,255,255,.15);--muted:#d6c8e3;--soft:#a694ba;--text:#fffaf2;--gold:#f6d77d;--cyan:#45efdf;--violet:#9b45ff;--rose:#ff5f88;--green:#5cf2a5;--orange:#ffba62;--blue:#7db7ff;--shadow:0 34px 120px rgba(0,0,0,.45);--radius:30px;--max:1240px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.55;min-height:100vh;background:radial-gradient(circle at 20% -10%,rgba(155,69,255,.34),transparent 29%),radial-gradient(circle at 84% 4%,rgba(69,239,223,.13),transparent 24%),radial-gradient(circle at 62% 30%,rgba(255,95,136,.15),transparent 28%),linear-gradient(180deg,#080016,#05000d 54%,#010005);overflow-x:hidden}a{color:inherit}.wrap{width:min(var(--max),92vw);margin:0 auto}.nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(18px);background:rgba(5,0,13,.75);border-bottom:1px solid var(--line)}.nav-inner{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{display:flex;gap:12px;align-items:center;text-decoration:none;font-weight:1000;letter-spacing:-.04em}.sigil{width:40px;height:40px;border-radius:15px;background:linear-gradient(135deg,var(--gold),#fff,var(--cyan),var(--violet));box-shadow:0 0 38px rgba(155,69,255,.4)}.nav-links{display:flex;gap:9px;flex-wrap:wrap}.btn,.nav-links a{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;padding:11px 14px;border:1px solid var(--line);background:rgba(255,255,255,.045);text-decoration:none;color:#fff;font-weight:850;cursor:pointer;font-family:inherit}.btn:hover,.nav-links a:hover{background:rgba(255,255,255,.09);border-color:rgba(246,215,125,.44);transform:translateY(-1px)}.btn.primary{border:0;background:linear-gradient(135deg,var(--gold),#fff,var(--cyan));color:#12051e}.btn.violet{border:0;background:linear-gradient(135deg,var(--violet),#6d25e8)}.btn.rose{border:0;background:linear-gradient(135deg,var(--rose),#b21f4b)}.btn.big{font-size:16px;padding:15px 18px}.hero{position:relative;padding:72px 0 66px;isolation:isolate}.hero:before{content:\"\";position:absolute;right:-16vw;top:2vh;width:58vw;height:58vw;border-radius:50%;background:conic-gradient(from 130deg,rgba(155,69,255,.24),rgba(69,239,223,.14),rgba(246,215,125,.15),rgba(255,95,136,.18),rgba(155,69,255,.24));filter:blur(42px);z-index:-1;animation:float 13s ease-in-out infinite}.hero:after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--violet),var(--gold),var(--cyan),transparent)}@keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(20px) rotate(18deg)}}.hero-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:30px;align-items:center}.kicker{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(246,215,125,.3);background:rgba(246,215,125,.08);color:var(--gold);border-radius:999px;padding:9px 12px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;font-size:12px}.hero h1{font-size:clamp(48px,8.5vw,108px);line-height:.86;letter-spacing:-.085em;margin:20px 0}.grad{background:linear-gradient(90deg,var(--gold),#fff,var(--cyan),var(--violet));-webkit-background-clip:text;background-clip:text;color:transparent}.lead{font-size:clamp(18px,2.25vw,25px);line-height:1.45;color:#f1e7ff;max-width:850px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0}.trust-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.trust-pill{padding:14px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.045);color:#e9def1;font-size:14px}.trust-pill b{display:block;color:#fff;font-size:16px}.orb-card{position:relative;border:1px solid rgba(255,255,255,.16);background:linear-gradient(160deg,rgba(25,6,48,.92),rgba(8,1,18,.96));border-radius:44px;padding:26px;box-shadow:var(--shadow);overflow:hidden}.orb-card:before{content:\"\";position:absolute;inset:-32% -35% auto auto;width:78%;height:78%;border-radius:50%;background:radial-gradient(circle,rgba(155,69,255,.36),transparent 68%);filter:blur(4px)}.orb-card>*{position:relative}.orb-card h2{font-size:34px;line-height:1;margin:0 0 14px;letter-spacing:-.05em}.stack-steps{display:grid;gap:12px;margin-top:18px}.stack-step{display:grid;grid-template-columns:58px 1fr;gap:12px;align-items:center;padding:14px;border:1px solid var(--line);border-radius:22px;background:rgba(0,0,0,.17)}.num{width:46px;height:46px;border-radius:17px;display:grid;place-items:center;background:linear-gradient(135deg,var(--violet),rgba(69,239,223,.8));font-weight:1000}.stack-step b{display:block}.stack-step small{color:var(--muted)}section{padding:72px 0}.section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:24px}.section-head h2{font-size:clamp(34px,5vw,64px);line-height:.95;letter-spacing:-.065em;margin:0}.section-head p{color:var(--muted);max-width:650px;margin:0}.panel{border:1px solid var(--line);background:linear-gradient(160deg,rgba(17,5,32,.88),rgba(5,0,13,.97));border-radius:var(--radius);box-shadow:var(--shadow)}.console{display:grid;grid-template-columns:342px minmax(0,1fr);gap:16px;align-items:start}.side{padding:18px;position:sticky;top:86px}.main-console{padding:18px}.group{margin-bottom:20px}.label{font-size:12px;color:var(--gold);font-weight:950;letter-spacing:.16em;text-transform:uppercase;margin:0 0 10px}.choices{display:grid;gap:8px}.choice{appearance:none;border:1px solid var(--line);background:rgba(255,255,255,.045);color:#fff;border-radius:18px;text-align:left;padding:12px;cursor:pointer;font:inherit;transition:.18s}.choice:hover{border-color:rgba(246,215,125,.5);transform:translateY(-1px)}.choice.active{background:linear-gradient(135deg,rgba(155,69,255,.35),rgba(69,239,223,.1));border-color:rgba(246,215,125,.6);box-shadow:0 0 0 1px rgba(246,215,125,.2) inset}.choice small{display:block;color:var(--muted);margin-top:3px;line-height:1.35}.topline{display:grid;grid-template-columns:1fr 238px;gap:16px}.decision{padding:20px}.decision h3{font-size:34px;margin:0 0 8px;letter-spacing:-.05em}.decision p{margin:0;color:var(--muted)}.score-card{padding:18px;display:grid;place-items:center;text-align:center}.score-ring{--score:60;width:150px;height:150px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--cyan) calc(var(--score)*1%),rgba(255,255,255,.1) 0);position:relative}.score-ring:after{content:\"\";position:absolute;inset:12px;background:var(--panel);border-radius:50%;border:1px solid var(--line)}.score-ring b{position:relative;z-index:1;font-size:40px}.score-card small{display:block;margin-top:10px;color:var(--muted);font-weight:850}.grid{display:grid;gap:14px}.metrics{grid-template-columns:repeat(3,1fr);margin-top:16px}.metric{padding:14px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.04)}.metric b{display:flex;justify-content:space-between;gap:8px;font-size:13px}.bar{height:9px;background:rgba(255,255,255,.09);border-radius:99px;overflow:hidden;margin-top:10px}.bar span{display:block;height:100%;background:linear-gradient(90deg,var(--violet),var(--cyan),var(--gold));border-radius:99px;transition:width .4s}.mode-row,.action-row{display:flex;gap:9px;flex-wrap:wrap;margin:14px 0}.mode{font-size:13px}.mode.active{background:rgba(246,215,125,.14);border-color:rgba(246,215,125,.6)}.ai-log{min-height:260px;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;color:#efe9f7;background:#080211;border:1px solid rgba(246,215,125,.2);border-radius:22px;padding:16px;overflow:auto;line-height:1.5}.pipeline{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:16px}.stage-card{min-height:104px;padding:13px;border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.04);position:relative;overflow:hidden}.stage-card:before{content:attr(data-zone);display:inline-block;font-size:10px;font-weight:1000;letter-spacing:.14em;color:var(--gold);margin-bottom:8px}.stage-card b{display:block}.stage-card small{display:block;color:var(--muted);line-height:1.3}.stage-card.active{border-color:var(--cyan);box-shadow:0 0 34px rgba(69,239,223,.25);transform:translateY(-2px)}.stage-card.done{border-color:rgba(92,242,165,.55);background:rgba(92,242,165,.08)}.gate-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-top:16px}.gate{padding:12px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.04)}.gate-status{display:inline-flex;border-radius:999px;padding:5px 8px;font-size:10px;font-weight:1000;letter-spacing:.1em;margin-bottom:8px}.pass{background:rgba(92,242,165,.15);color:var(--green)}.warn{background:rgba(255,186,98,.15);color:var(--orange)}.block,.locked{background:rgba(255,95,136,.15);color:var(--rose)}.gate h3{font-size:16px;margin:0 0 5px}.gate p{font-size:12px;color:var(--muted);margin:0}.artifact-strip{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.artifact-pill{display:inline-flex;padding:7px 10px;border:1px solid rgba(69,239,223,.28);border-radius:999px;color:var(--cyan);background:rgba(69,239,223,.07);font-size:12px;font-weight:850}.split{display:grid;grid-template-columns:1fr 1fr;gap:16px}.json-box{background:#080211;border:1px solid rgba(246,215,125,.2);border-radius:22px;padding:15px;min-height:310px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:#ede7f7}.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.info-card,.dossier-step,.maturity-card{border:1px solid var(--line);background:rgba(255,255,255,.045);border-radius:24px;padding:18px}.info-card h3,.dossier-step h3,.maturity-card h3{margin:0 0 8px;font-size:22px;letter-spacing:-.04em}.info-card p,.dossier-step p,.maturity-card p{margin:0;color:var(--muted)}.maturity-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}.maturity-card{padding:14px}.maturity-card b{display:inline-flex;width:42px;height:42px;border-radius:16px;background:linear-gradient(135deg,var(--violet),var(--blue));align-items:center;justify-content:center;margin-bottom:10px}.dossier-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.memo{font-size:15px;color:#f8f2ff}.source-list{display:grid;gap:10px}.source-list a{display:block;padding:15px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.04);text-decoration:none}.footer{padding:42px 0;border-top:1px solid var(--line);color:var(--muted)}.toast{position:fixed;right:18px;bottom:18px;z-index:100;background:linear-gradient(135deg,var(--gold),#fff,var(--cyan));color:#14051e;padding:13px 16px;border-radius:999px;font-weight:1000;box-shadow:var(--shadow)}.fineprint{font-size:13px;color:var(--soft)}@media(max-width:1050px){.hero-grid,.console,.topline,.split{grid-template-columns:1fr}.side{position:relative;top:auto}.pipeline{grid-template-columns:repeat(3,1fr)}.gate-grid{grid-template-columns:repeat(2,1fr)}.trust-row,.card-grid,.dossier-grid{grid-template-columns:1fr 1fr}.maturity-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.nav-inner{align-items:flex-start;flex-direction:column;padding:12px 0}.hero h1{font-size:48px}.trust-row,.card-grid,.dossier-grid,.metrics,.pipeline,.gate-grid,.maturity-grid{grid-template-columns:1fr}.orb-card{border-radius:28px}.section-head{display:block}.nav-links a{font-size:12px;padding:8px 10px}}\n";
const js = "\nconst DATA = {\n  \"version\": \"v34\",\n  \"lab\": \"GoalOS Signoff Pro \\u2014 Loop \\u2192 RSI \\u2192 ASI Superintelligence Control Tower Lab v34\",\n  \"publicSafety\": {\n    \"forms\": false,\n    \"textInputs\": false,\n    \"uploads\": false,\n    \"cookies\": false,\n    \"analytics\": false,\n    \"wallets\": false,\n    \"payments\": false,\n    \"externalAiCalls\": false,\n    \"personalData\": false,\n    \"valueMoved\": 0,\n    \"liveRsi\": false,\n    \"claimedAgi\": false,\n    \"claimedAsi\": false,\n    \"productionAuthority\": false\n  },\n  \"personas\": {\n    \"firstTimer\": {\n      \"label\": \"First-time visitor\",\n      \"summary\": \"You want the one-minute explanation.\",\n      \"lens\": \"Show the proof loop in plain language and avoid jargon.\"\n    },\n    \"executive\": {\n      \"label\": \"Sovereign / enterprise executive\",\n      \"summary\": \"You decide whether to authorize a pilot.\",\n      \"lens\": \"Show decision state, budget posture, risk, rollback, and council requirements.\"\n    },\n    \"validator\": {\n      \"label\": \"Architect / Validator Council\",\n      \"summary\": \"You decide whether a candidate can advance.\",\n      \"lens\": \"Inspect deterministic artifacts, stress tests, baseline deltas, and stop authority.\"\n    },\n    \"frontier\": {\n      \"label\": \"Frontier lab director\",\n      \"summary\": \"You care about fast discovery without unsafe promotion.\",\n      \"lens\": \"Balance exploration speed with reproducibility and persistence gates.\"\n    },\n    \"safety\": {\n      \"label\": \"Safety & assurance lead\",\n      \"summary\": \"You hunt failure modes before scale.\",\n      \"lens\": \"Focus on prohibited domains, model risk, red-team shocks, and rollback.\"\n    },\n    \"capital\": {\n      \"label\": \"Invention capital operator\",\n      \"summary\": \"You allocate resources to verified compounding advantage.\",\n      \"lens\": \"Look for evidence quality, probe ROI, stepping-stone reuse, and claim maturity.\"\n    },\n    \"public\": {\n      \"label\": \"Public reviewer\",\n      \"summary\": \"You ask what can be trusted.\",\n      \"lens\": \"Demand proof packages before accepting grand claims.\"\n    }\n  },\n  \"explainModes\": {\n    \"simple\": \"Explain it like a public product demo: no proof package means no credible promotion.\",\n    \"executive\": \"Explain it like a board memo: the pilot is only acceptable with hard gates, council oversight, and rollback.\",\n    \"technical\": \"Explain it like an engineering review: every cycle emits schema-bound artifacts, hashes, ledgers, and replay paths.\",\n    \"governance\": \"Explain it like an institutional control system: search is allocation, not authority; human council owns escalation.\",\n    \"redteam\": \"Explain it like a red-team brief: assume false positives, metric capture, political pressure, and novelty traps.\"\n  },\n  \"scenarios\": {\n    \"proofLoop\": {\n      \"label\": \"GoalOS proof loop\",\n      \"plain\": \"A normal AI-work claim is converted into a proof package before acceptance.\",\n      \"state\": \"REVIEW_READY\",\n      \"score\": 82,\n      \"novelty\": 0.34,\n      \"advantage\": 12.5,\n      \"decision\": \"Proceed to review. Work is not trusted until the evidence docket, replay path, and receipt are complete.\",\n      \"metrics\": {\n        \"Replayability\": 86,\n        \"Evidence quality\": 78,\n        \"Baseline discipline\": 74,\n        \"Risk control\": 88,\n        \"Human authority\": 92,\n        \"Rollback readiness\": 70\n      },\n      \"gates\": {\n        \"risk\": \"pass\",\n        \"evidence\": \"pass\",\n        \"baseline\": \"warn\",\n        \"persistence\": \"warn\",\n        \"council\": \"pass\",\n        \"rollback\": \"warn\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"Proof work receipt\"\n    },\n    \"rsiPilot\": {\n      \"label\": \"Governed RSI pilot\",\n      \"plain\": \"A deterministic invention cycle is authorized only as a bounded pilot with replayability KPI.\",\n      \"state\": \"PILOT_AUTHORIZABLE\",\n      \"score\": 76,\n      \"novelty\": 0.58,\n      \"advantage\": 18.9,\n      \"decision\": \"Authorize a bounded pilot if replayability, baseline, evidence, and stop-authority conditions are written into the mission.\",\n      \"metrics\": {\n        \"Replayability\": 79,\n        \"Evidence quality\": 72,\n        \"Baseline discipline\": 81,\n        \"Risk control\": 75,\n        \"Human authority\": 88,\n        \"Rollback readiness\": 77\n      },\n      \"gates\": {\n        \"risk\": \"pass\",\n        \"evidence\": \"pass\",\n        \"baseline\": \"pass\",\n        \"persistence\": \"warn\",\n        \"council\": \"pass\",\n        \"rollback\": \"pass\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"RSI pilot authorization receipt\"\n    },\n    \"move37\": {\n      \"label\": \"Move\\u201137 candidate\",\n      \"plain\": \"High novelty and baseline advantage appear promising, so the system must become more skeptical, not less.\",\n      \"state\": \"DOSSIER_REQUIRED\",\n      \"score\": 68,\n      \"novelty\": 0.84,\n      \"advantage\": 31.2,\n      \"decision\": \"Package a Move\\u201137 dossier. Do not promote until reproduction, shock persistence, and independent review pass.\",\n      \"metrics\": {\n        \"Replayability\": 73,\n        \"Evidence quality\": 69,\n        \"Baseline discipline\": 86,\n        \"Risk control\": 71,\n        \"Human authority\": 90,\n        \"Rollback readiness\": 66\n      },\n      \"gates\": {\n        \"risk\": \"warn\",\n        \"evidence\": \"pass\",\n        \"baseline\": \"pass\",\n        \"persistence\": \"warn\",\n        \"council\": \"pass\",\n        \"rollback\": \"warn\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"Move\\u201137 dossier receipt\"\n    },\n    \"asiThreshold\": {\n      \"label\": \"ASI-scale escalation review\",\n      \"plain\": \"A claim approaches superintelligence-scale impact; the system must not be allowed to self-promote.\",\n      \"state\": \"ASI_CLAIM_LOCKED\",\n      \"score\": 41,\n      \"novelty\": 0.93,\n      \"advantage\": 45.0,\n      \"decision\": \"Lock the ASI claim. Require extraordinary independent replay, containment, rollback, red-team review, and council authorization.\",\n      \"metrics\": {\n        \"Replayability\": 62,\n        \"Evidence quality\": 58,\n        \"Baseline discipline\": 80,\n        \"Risk control\": 46,\n        \"Human authority\": 96,\n        \"Rollback readiness\": 44\n      },\n      \"gates\": {\n        \"risk\": \"block\",\n        \"evidence\": \"warn\",\n        \"baseline\": \"pass\",\n        \"persistence\": \"block\",\n        \"council\": \"pass\",\n        \"rollback\": \"block\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"ASI boundary lock receipt\"\n    },\n    \"noveltyTrap\": {\n      \"label\": \"Novelty trap / false breakthrough\",\n      \"plain\": \"The candidate looks exciting but fails baseline persistence and therefore cannot be promoted.\",\n      \"state\": \"BLOCKED_PROBE_ONLY\",\n      \"score\": 24,\n      \"novelty\": 0.91,\n      \"advantage\": 4.2,\n      \"decision\": \"Reject promotion. Keep only a probe record and anti-pattern note in the Chronicle.\",\n      \"metrics\": {\n        \"Replayability\": 66,\n        \"Evidence quality\": 43,\n        \"Baseline discipline\": 38,\n        \"Risk control\": 61,\n        \"Human authority\": 89,\n        \"Rollback readiness\": 72\n      },\n      \"gates\": {\n        \"risk\": \"warn\",\n        \"evidence\": \"warn\",\n        \"baseline\": \"block\",\n        \"persistence\": \"block\",\n        \"council\": \"pass\",\n        \"rollback\": \"pass\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"Rejected novelty-trap receipt\"\n    },\n    \"redTeam\": {\n      \"label\": \"Red-team policy shock\",\n      \"plain\": \"Policy, metric, and operator-capture shocks are applied before any promotion can happen.\",\n      \"state\": \"RED_TEAM_ACTIVE\",\n      \"score\": 53,\n      \"novelty\": 0.72,\n      \"advantage\": 20.4,\n      \"decision\": \"Hold escalation until shock deltas, adverse side effects, and council dissent are resolved.\",\n      \"metrics\": {\n        \"Replayability\": 71,\n        \"Evidence quality\": 66,\n        \"Baseline discipline\": 69,\n        \"Risk control\": 52,\n        \"Human authority\": 94,\n        \"Rollback readiness\": 59\n      },\n      \"gates\": {\n        \"risk\": \"block\",\n        \"evidence\": \"pass\",\n        \"baseline\": \"warn\",\n        \"persistence\": \"warn\",\n        \"council\": \"pass\",\n        \"rollback\": \"warn\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"Red-team hold receipt\"\n    },\n    \"capital\": {\n      \"label\": \"Invention capital allocation\",\n      \"plain\": \"Funding increases only when proof quality, replayability, and advantage persistence improve.\",\n      \"state\": \"ALLOCATE_TO_PROBES\",\n      \"score\": 74,\n      \"novelty\": 0.63,\n      \"advantage\": 22.1,\n      \"decision\": \"Allocate budget to probes and dossier preparation, not unreviewed deployment.\",\n      \"metrics\": {\n        \"Replayability\": 80,\n        \"Evidence quality\": 76,\n        \"Baseline discipline\": 79,\n        \"Risk control\": 74,\n        \"Human authority\": 82,\n        \"Rollback readiness\": 71\n      },\n      \"gates\": {\n        \"risk\": \"pass\",\n        \"evidence\": \"pass\",\n        \"baseline\": \"pass\",\n        \"persistence\": \"warn\",\n        \"council\": \"warn\",\n        \"rollback\": \"pass\",\n        \"asi\": \"locked\"\n      },\n      \"receiptClass\": \"Capital allocation receipt\"\n    }\n  },\n  \"stages\": [\n    {\n      \"id\": \"objective\",\n      \"zone\": \"LOOP\",\n      \"name\": \"Objective\",\n      \"plain\": \"State the work claim and success criteria.\",\n      \"artifact\": \"mission_contract.json\",\n      \"why\": \"No mission, no proof target.\"\n    },\n    {\n      \"id\": \"evidence\",\n      \"zone\": \"LOOP\",\n      \"name\": \"Evidence Docket\",\n      \"plain\": \"Map deliverables to criteria and risks.\",\n      \"artifact\": \"evidence_docket.json\",\n      \"why\": \"Output becomes reviewable evidence.\"\n    },\n    {\n      \"id\": \"signoff\",\n      \"zone\": \"LOOP\",\n      \"name\": \"Human Signoff\",\n      \"plain\": \"Human authority accepts, rejects, or blocks.\",\n      \"artifact\": \"mission_receipt.json\",\n      \"why\": \"Acceptance is a governed decision.\"\n    },\n    {\n      \"id\": \"target\",\n      \"zone\": \"RSI\",\n      \"name\": \"Target\",\n      \"plain\": \"Allocate exploration pressure through bounded search control.\",\n      \"artifact\": \"targets/coverage_targets.json\",\n      \"why\": \"Search control is allocation only.\"\n    },\n    {\n      \"id\": \"emit\",\n      \"zone\": \"RSI\",\n      \"name\": \"Emit\",\n      \"plain\": \"Generate candidates under schema constraints.\",\n      \"artifact\": \"candidates.raw.jsonl\",\n      \"why\": \"Candidates are not outcomes.\"\n    },\n    {\n      \"id\": \"filter\",\n      \"zone\": \"RSI\",\n      \"name\": \"Filter\",\n      \"plain\": \"Risk and interestingness gates route candidates.\",\n      \"artifact\": \"risk_reports.jsonl\",\n      \"why\": \"OMNI cannot insert or promote.\"\n    },\n    {\n      \"id\": \"atlas\",\n      \"zone\": \"RSI\",\n      \"name\": \"Atlas\",\n      \"plain\": \"Extract mechanism context and comparatives.\",\n      \"artifact\": \"causal_atlas_triples.jsonl\",\n      \"why\": \"Context prevents one-off hype.\"\n    },\n    {\n      \"id\": \"testplan\",\n      \"zone\": \"RSI\",\n      \"name\": \"Test-plan\",\n      \"plain\": \"Build falsification ladders and cheap probes.\",\n      \"artifact\": \"falsification_ladders.jsonl\",\n      \"why\": \"Skepticism is designed in.\"\n    },\n    {\n      \"id\": \"eval\",\n      \"zone\": \"RSI\",\n      \"name\": \"Eval\",\n      \"plain\": \"Compare against incumbent, neighbor, and null baselines.\",\n      \"artifact\": \"baseline_comparison.jsonl\",\n      \"why\": \"Advantage must be measured.\"\n    },\n    {\n      \"id\": \"insert\",\n      \"zone\": \"RSI\",\n      \"name\": \"Insert\",\n      \"plain\": \"Append to archive only when gates allow.\",\n      \"artifact\": \"updated_frontier_cell.jsonl\",\n      \"why\": \"State is monotonic and auditable.\"\n    },\n    {\n      \"id\": \"promote\",\n      \"zone\": \"RSI\",\n      \"name\": \"Promote\",\n      \"plain\": \"Queue promotions mechanically; no bypass.\",\n      \"artifact\": \"promotion_queue.jsonl\",\n      \"why\": \"Promotion is earned by proof.\"\n    },\n    {\n      \"id\": \"asiGate\",\n      \"zone\": \"ASI\",\n      \"name\": \"ASI Boundary\",\n      \"plain\": \"Lock ASI-scale claims behind extraordinary controls.\",\n      \"artifact\": \"asi_boundary_lock.json\",\n      \"why\": \"No self-authorized superintelligence.\"\n    },\n    {\n      \"id\": \"council\",\n      \"zone\": \"ASI\",\n      \"name\": \"Council Review\",\n      \"plain\": \"Independent Architect / Validator Council exercises stop authority.\",\n      \"artifact\": \"council_review_note.json\",\n      \"why\": \"Authority is institutional, not model-internal.\"\n    },\n    {\n      \"id\": \"rollback\",\n      \"zone\": \"ASI\",\n      \"name\": \"Rollback Drill\",\n      \"plain\": \"Verify containment, reversibility, and release gates.\",\n      \"artifact\": \"rollback_drill_report.json\",\n      \"why\": \"No rollback, no release.\"\n    }\n  ],\n  \"gates\": [\n    {\n      \"id\": \"risk\",\n      \"name\": \"Risk gate\",\n      \"meaning\": \"Prohibited domains, unsafe escalation, and adverse side effects are blocked.\"\n    },\n    {\n      \"id\": \"evidence\",\n      \"name\": \"Evidence gate\",\n      \"meaning\": \"Claims must be bound to reproducible artifacts and evidence objects.\"\n    },\n    {\n      \"id\": \"baseline\",\n      \"name\": \"Baseline gate\",\n      \"meaning\": \"Claims are compared to incumbent, nearest-neighbor, and null baselines.\"\n    },\n    {\n      \"id\": \"persistence\",\n      \"name\": \"Persistence gate\",\n      \"meaning\": \"High novelty must survive stress tests and fixed-seed reproduction.\"\n    },\n    {\n      \"id\": \"council\",\n      \"name\": \"Council gate\",\n      \"meaning\": \"Independent human authority is required for strategic escalation.\"\n    },\n    {\n      \"id\": \"rollback\",\n      \"name\": \"Rollback gate\",\n      \"meaning\": \"Containment, kill-switch, and rollback drills must pass before release.\"\n    },\n    {\n      \"id\": \"asi\",\n      \"name\": \"ASI claim lock\",\n      \"meaning\": \"ASI-scale claims are locked until extraordinary evidence and governance pass.\"\n    }\n  ],\n  \"maturity\": [\n    {\n      \"level\": \"L0\",\n      \"name\": \"Narrative claim\",\n      \"body\": \"A claim exists, but proof is scattered or missing.\"\n    },\n    {\n      \"level\": \"L1\",\n      \"name\": \"Evidence packet\",\n      \"body\": \"Evidence exists and is mapped to explicit acceptance criteria.\"\n    },\n    {\n      \"level\": \"L2\",\n      \"name\": \"Replayable work\",\n      \"body\": \"A reviewer can inspect the replay path and verify what happened.\"\n    },\n    {\n      \"level\": \"L3\",\n      \"name\": \"Governed RSI pilot\",\n      \"body\": \"A deterministic invention cycle is bounded by schema, baselines, and ledgers.\"\n    },\n    {\n      \"level\": \"L4\",\n      \"name\": \"Move\\u201137 dossier\",\n      \"body\": \"High-novelty advantage is reproduced, stressed, and packaged for council review.\"\n    },\n    {\n      \"level\": \"L5\",\n      \"name\": \"ASI boundary lock\",\n      \"body\": \"Superintelligence-scale escalation is locked behind extraordinary proof and rollback.\"\n    },\n    {\n      \"level\": \"L6\",\n      \"name\": \"Sovereign invention governance\",\n      \"body\": \"Institutional control, council authority, and compounding ledgers become permanent infrastructure.\"\n    }\n  ],\n  \"dossier\": [\n    {\n      \"name\": \"Recognition note\",\n      \"detail\": \"Why the candidate crossed novelty or advantage thresholds.\"\n    },\n    {\n      \"name\": \"Reproduction manifest\",\n      \"detail\": \"Fixed seeds, artifact hashes, environment, and replay instructions.\"\n    },\n    {\n      \"name\": \"Stress-test bundle\",\n      \"detail\": \"Policy shocks, sensitivity deltas, and failure-mode register.\"\n    },\n    {\n      \"name\": \"Persistence report\",\n      \"detail\": \"Minimum pass rate under shocks and baseline comparison.\"\n    },\n    {\n      \"name\": \"Rollback plan\",\n      \"detail\": \"Containment, stop authority, monitoring, and release gates.\"\n    },\n    {\n      \"name\": \"Council memo\",\n      \"detail\": \"Decision asks, dissent register, and approval boundaries.\"\n    },\n    {\n      \"name\": \"Synthetic receipt\",\n      \"detail\": \"Public-safe record of decision state and remaining proof debt.\"\n    }\n  ],\n  \"shocks\": [\n    \"distribution shift\",\n    \"adversarial framing\",\n    \"metric capture\",\n    \"operator pressure\",\n    \"political capture\",\n    \"budget pressure\",\n    \"evaluator disagreement\",\n    \"containment failure\",\n    \"rollback failure\",\n    \"novelty euphoria\"\n  ],\n  \"sourceDocuments\": [\n    {\n      \"title\": \"AGI Alpha RSI \\u2014 Sovereign Invention Governance presentation\",\n      \"path\": \"research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf\"\n    },\n    {\n      \"title\": \"AGI Alpha RSI \\u2014 Sovereign Strategy Brief\",\n      \"path\": \"research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf\"\n    }\n  ]\n};\nlet activePersona = 'firstTimer';\nlet activeScenario = 'proofLoop';\nlet activeMode = 'simple';\nlet cycleIndex = 0;\nlet latestReceipt = null;\nconst $ = s => document.querySelector(s);\nconst $$ = s => Array.from(document.querySelectorAll(s));\nconst esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nfunction init() {\n  const personas = $('#persona-list');\n  personas.innerHTML = Object.entries(DATA.personas).map(([id,p]) => `<button type=\"button\" class=\"choice\" data-persona=\"${id}\">${esc(p.label)}<small>${esc(p.summary)}</small></button>`).join('');\n  const scenarios = $('#scenario-list');\n  scenarios.innerHTML = Object.entries(DATA.scenarios).map(([id,s]) => `<button type=\"button\" class=\"choice\" data-scenario=\"${id}\">${esc(s.label)}<small>${esc(s.plain)}</small></button>`).join('');\n  $('#pipeline').innerHTML = DATA.stages.map(s => `<article class=\"stage-card\" data-stage=\"${s.id}\" data-zone=\"${s.zone}\"><b>${esc(s.name)}</b><small>${esc(s.plain)}</small></article>`).join('');\n  $('#gate-grid').innerHTML = DATA.gates.map(g => `<article class=\"gate\"><span class=\"gate-status warn\" data-gate-status=\"${g.id}\">PENDING</span><h3>${esc(g.name)}</h3><p>${esc(g.meaning)}</p></article>`).join('');\n  $('#maturity-grid').innerHTML = DATA.maturity.map(m => `<article class=\"maturity-card\"><b>${esc(m.level)}</b><h3>${esc(m.name)}</h3><p>${esc(m.body)}</p></article>`).join('');\n  $('#dossier-grid').innerHTML = DATA.dossier.map((d,i) => `<article class=\"dossier-step\"><span class=\"artifact-pill\">${String(i+1).padStart(2,'0')}</span><h3>${esc(d.name)}</h3><p>${esc(d.detail)}</p></article>`).join('');\n  selectPersona('firstTimer'); selectScenario('proofLoop'); setMode('simple'); buildReceipt(false);\n}\nfunction selectPersona(id) { activePersona = DATA.personas[id] ? id : 'firstTimer'; $$('#persona-list .choice').forEach(b => b.classList.toggle('active', b.dataset.persona === activePersona)); brief(); }\nfunction selectScenario(id) { activeScenario = DATA.scenarios[id] ? id : 'proofLoop'; $$('#scenario-list .choice').forEach(b => b.classList.toggle('active', b.dataset.scenario === activeScenario)); const s = DATA.scenarios[activeScenario]; $('#scenario-title').textContent = s.label; $('#scenario-summary').textContent = s.plain; $('#decision-state').textContent = s.state; $('#decision-note').textContent = s.decision; $('#score').textContent = s.score; $('.score-ring').style.setProperty('--score', s.score); updateMetrics(s.metrics); updateGates(s.gates); renderArtifacts([]); brief(); buildReceipt(false); }\nfunction setMode(id) { activeMode = DATA.explainModes[id] ? id : 'simple'; $$('.mode').forEach(b => b.classList.toggle('active', b.dataset.mode === activeMode)); brief(); }\nfunction updateMetrics(metrics) { $('#metric-list').innerHTML = Object.entries(metrics).map(([k,v]) => `<div class=\"metric\"><b><span>${esc(k)}</span><span>${v}%</span></b><div class=\"bar\"><span style=\"width:${v}%\"></span></div></div>`).join(''); }\nfunction updateGates(gates) { DATA.gates.forEach(g => { const el = document.querySelector(`[data-gate-status=\"${g.id}\"]`); const status = gates[g.id] || 'warn'; el.className = 'gate-status ' + status; el.textContent = status.toUpperCase(); }); }\nfunction renderArtifacts(list) { $('#artifact-strip').innerHTML = (list.length ? list : ['awaiting cycle']).map(x => `<span class=\"artifact-pill\">${esc(x)}</span>`).join(''); }\nfunction writeLog(txt) { const el = $('#ai-log'); el.textContent = txt; el.scrollTop = 0; }\nfunction appendLog(txt) { const el = $('#ai-log'); el.textContent += '\\n' + txt; el.scrollTop = el.scrollHeight; }\nfunction brief() {\n  const p = DATA.personas[activePersona], s = DATA.scenarios[activeScenario];\n  writeLog(`GoalOS v34 AI-style briefing console\n\nRole: ${p.label}\nLens: ${p.lens}\n\nScenario: ${s.label}\nState: ${s.state}\n\nMode: ${activeMode} \u2014 ${DATA.explainModes[activeMode]}\n\nPlain answer: ${s.decision}\n\nBoundary: this is a deterministic browser-local demo. It does not call an AI API, collect user input, connect wallets, move value, or claim realized AGI/ASI.`);\n}\nfunction runCycle() {\n  cycleIndex += 1; const s = DATA.scenarios[activeScenario]; const p = DATA.personas[activePersona]; let i = 0, artifacts = [];\n  $$('.stage-card').forEach(c => c.classList.remove('active','done'));\n  renderArtifacts([]);\n  writeLog(`cycle ${cycleIndex} started \u2014 Loop \u2192 RSI \u2192 ASI control tower\nrole: ${p.label}\nscenario: ${s.label}\nrule: no self-authorized ASI\n`);\n  const timer = setInterval(() => {\n    if (i >= DATA.stages.length) { clearInterval(timer); appendLog(`\nfinal decision state: ${s.state}\nreadiness score: ${s.score}\nreceipt class: ${s.receiptClass}\nresult: ${s.decision}`); buildReceipt(true); return; }\n    const stage = DATA.stages[i++]; const card = document.querySelector(`[data-stage=\"${stage.id}\"]`);\n    if (card) { card.classList.add('active'); setTimeout(() => { card.classList.remove('active'); card.classList.add('done'); }, 360); }\n    artifacts.push(stage.artifact); renderArtifacts(artifacts.slice(-12));\n    appendLog(`[${stage.zone}/${stage.id}] ${stage.plain}\n  artifact: ${stage.artifact}\n  why: ${stage.why}`);\n  }, 300);\n}\nfunction stressTest() {\n  const s = DATA.scenarios[activeScenario];\n  const base = activeScenario === 'proofLoop' ? 7 : activeScenario === 'rsiPilot' ? 7 : activeScenario === 'move37' ? 6 : activeScenario === 'capital' ? 7 : activeScenario === 'redTeam' ? 3 : activeScenario === 'noveltyTrap' ? 2 : 2;\n  appendLog('\\npolicy-shock suite:');\n  DATA.shocks.forEach((shock, i) => appendLog(`  shock_${String(i+1).padStart(2,'0')}: ${shock} \u2192 ${i < base ? 'PASS' : 'FAIL/PENDING'}`));\n  appendLog(base >= 8 ? 'shock result: strong persistence candidate; still requires council review.' : base >= 6 ? 'shock result: dossier continues; no deployment authority.' : 'shock result: blocked or probe-only; no escalation.');\n}\nfunction rollbackDrill() {\n  const s = DATA.scenarios[activeScenario];\n  const pass = ['proofLoop','rsiPilot','capital'].includes(activeScenario);\n  appendLog('\\nrollback drill:');\n  ['monitoring boundary','stop signal','state snapshot','release freeze','reversal path','operator notification','council acknowledgement'].forEach((x,i)=> appendLog(`  ${i+1}. ${x} \u2192 ${pass || i < 4 ? 'PASS' : 'REQUIRED'}`));\n  appendLog(pass ? 'rollback result: acceptable for bounded pilot.' : 'rollback result: insufficient for ASI-scale escalation.');\n}\nfunction councilReview() {\n  const s = DATA.scenarios[activeScenario];\n  const verdict = s.state.includes('LOCKED') || s.state.includes('BLOCKED') ? 'HOLD / DO NOT PROMOTE' : s.state.includes('DOSSIER') ? 'REQUIRE DOSSIER' : 'REVIEW READY';\n  appendLog(`\nArchitect / Validator Council note:\n  verdict: ${verdict}\n  stop authority: active\n  self-promotion: prohibited\n  next action: ${s.decision}`);\n}\nfunction buildDossier() {\n  const s = DATA.scenarios[activeScenario];\n  appendLog('\\nMove\u201137 \u2192 ASI dossier builder:');\n  DATA.dossier.forEach((d,i)=> appendLog(`  ${String(i+1).padStart(2,'0')} ${d.name} \u2014 ${d.detail}`));\n  appendLog(`dossier status: ${s.state}; proof debt remains until all gates pass.`);\n}\nfunction makeMemo() {\n  const p = DATA.personas[activePersona], s = DATA.scenarios[activeScenario];\n  const memo = `BOARD MEMO \u2014 GoalOS v34 Control Tower\n\nCore standard: GoalOS proves the work. RSI governs the invention loop. ASI must not self-authorize.\n\nAudience: ${p.label}\nScenario: ${s.label}\nDecision state: ${s.state}\nReadiness score: ${s.score}/100\n\nRecommended action: ${s.decision}\n\nRequired before escalation: evidence docket, deterministic replay, baseline comparison, policy-shock persistence, independent council review, rollback drill, signed receipt.\n\nPublic boundary: no external AI call, no uploads, no wallet, no payment, no value moved, no claim of realized AGI/ASI.`;\n  $('#memo').textContent = memo; copyText(memo, 'Board memo copied');\n}\nfunction buildReceipt(showLog=true) {\n  const s = DATA.scenarios[activeScenario], p = DATA.personas[activePersona];\n  latestReceipt = {\n    receipt_id: `GOALOS-LOOP-RSI-ASI-V34-${activeScenario.toUpperCase()}-${String(cycleIndex || 1).padStart(3,'0')}`,\n    lab: DATA.lab,\n    version: DATA.version,\n    public_safe: true,\n    value_moved: 0,\n    external_ai_calls: false,\n    user_inputs: false,\n    persona: p.label,\n    scenario: s.label,\n    explanation_mode: activeMode,\n    decision_state: s.state,\n    readiness_score: s.score,\n    novelty_distance: s.novelty,\n    advantage_delta_percent: s.advantage,\n    gates: s.gates,\n    required_dossier: DATA.dossier.map(d => d.name),\n    mandatory_boundary: ['not realized AGI','not realized ASI or superintelligence','not live RSI','not autonomous deployment','no wallet','no payment','no external AI call','zero value moved','no self-authorized promotion'],\n    decision_note: s.decision,\n    generated_at: new Date().toISOString()\n  };\n  $('#receipt-json').textContent = JSON.stringify(latestReceipt, null, 2);\n  if (showLog) appendLog('\\nsynthetic Mission Receipt generated \u2192 receipt JSON updated.');\n}\nfunction guidedTour() {\n  selectPersona('executive'); setMode('executive'); selectScenario('asiThreshold');\n  writeLog('Guided tour loaded: Executive + ASI-scale escalation review.\\nStep 1: explain. Step 2: run cycle. Step 3: stress-test. Step 4: rollback drill. Step 5: council review. Step 6: receipt.');\n  setTimeout(runCycle, 800); setTimeout(stressTest, 6100); setTimeout(rollbackDrill, 7600); setTimeout(councilReview, 9100); setTimeout(() => buildReceipt(true), 10300);\n}\nfunction copyText(txt, label='Copied') { navigator.clipboard?.writeText(txt).then(()=>toast(label)).catch(()=>toast('Copy unavailable')); }\nfunction toast(message) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; document.body.appendChild(el); setTimeout(()=>el.remove(), 1500); }\ndocument.addEventListener('DOMContentLoaded', () => {\n  init();\n  document.addEventListener('click', e => {\n    const b = e.target.closest('button'); if (!b) return;\n    if (b.dataset.persona) selectPersona(b.dataset.persona);\n    if (b.dataset.scenario) selectScenario(b.dataset.scenario);\n    if (b.dataset.mode) setMode(b.dataset.mode);\n    if (b.dataset.action === 'run') runCycle();\n    if (b.dataset.action === 'stress') stressTest();\n    if (b.dataset.action === 'rollback') rollbackDrill();\n    if (b.dataset.action === 'council') councilReview();\n    if (b.dataset.action === 'dossier') buildDossier();\n    if (b.dataset.action === 'receipt') buildReceipt(true);\n    if (b.dataset.action === 'memo') makeMemo();\n    if (b.dataset.action === 'tour') guidedTour();\n    if (b.dataset.action === 'copy-receipt') copyText(JSON.stringify(latestReceipt || {status:'run the console first'}, null, 2), 'Receipt copied');\n    if (b.dataset.action === 'copy-standard') copyText('GoalOS proves the work. RSI governs the invention loop. ASI must not self-authorize. No Proof. No Trust. No Settlement. No ungoverned superintelligence.', 'Standard copied');\n  });\n});\n";
const html = "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34</title>\n  <meta name=\"description\" content=\"A public-safe, browser-local, dynamic AI-style console for GoalOS proof loops, RSI governance, and ASI superintelligence readiness gates.\">\n  <link rel=\"stylesheet\" href=\"assets/goalos-v34-loop-rsi-asi.css\">\n</head>\n<body>\n<nav class=\"nav\"><div class=\"wrap nav-inner\"><a class=\"brand\" href=\"index.html\"><span class=\"sigil\" aria-hidden=\"true\"></span><span>GoalOS Signoff Pro</span></a><div class=\"nav-links\"><a href=\"#console\">Console</a><a href=\"#control\">Gates</a><a href=\"#maturity\">Maturity</a><a href=\"#dossier\">Dossier</a><a href=\"#sources\">Sources</a></div></div></nav>\n<header class=\"hero\"><div class=\"wrap hero-grid\"><div><span class=\"kicker\">v34 \u00b7 Loop \u2192 RSI \u2192 ASI \u00b7 complete public-safe control tower</span><h1>Superintelligence needs a <span class=\"grad\">control tower</span>, not a slogan.</h1><p class=\"lead\">A complete, browser-local AI-style console that lets any visitor understand the path from GoalOS proof loops to RSI governance to ASI-scale readiness gates \u2014 without uploads, wallets, payments, external AI calls, or private data.</p><div class=\"hero-actions\"><a class=\"btn primary big\" href=\"#console\">Launch the console</a><button class=\"btn violet big\" type=\"button\" data-action=\"tour\">Run guided tour</button><a class=\"btn big\" href=\"loop-rsi-asi-v34-demo-bundle.json\">Inspect demo bundle</a></div><div class=\"trust-row\"><div class=\"trust-pill\"><b>GoalOS proves work</b> Every claim becomes evidence, replay, review, and receipt.</div><div class=\"trust-pill\"><b>RSI governs invention</b> Search may guide allocation; proof decides promotion.</div><div class=\"trust-pill\"><b>ASI must not self-authorize</b> Escalation requires gates, council, rollback, and receipts.</div><div class=\"trust-pill\"><b>Public-safe demo</b> No text inputs, no external AI, no wallet, zero value moved.</div></div></div><aside class=\"orb-card\"><h2>From loop to RSI to ASI</h2><p style=\"color:var(--muted)\">The user-friendly mental model: every higher layer inherits the proof discipline of the lower layer.</p><div class=\"stack-steps\"><div class=\"stack-step\"><span class=\"num\">1</span><span><b>Loop</b><small>Mission \u2192 evidence \u2192 validation \u2192 signoff \u2192 receipt.</small></span></div><div class=\"stack-step\"><span class=\"num\">2</span><span><b>RSI</b><small>Target \u2192 emit \u2192 filter \u2192 atlas \u2192 test-plan \u2192 eval \u2192 insert \u2192 promote.</small></span></div><div class=\"stack-step\"><span class=\"num\">3</span><span><b>ASI boundary</b><small>Extraordinary claims require extraordinary proof, council, and rollback.</small></span></div></div></aside></div></header>\n<main>\n<section id=\"console\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Interactive demo</span><h2>AI-style control tower</h2></div><p>Choose a role and a scenario. The console explains the governance state, runs the deterministic pipeline, stress-tests it, builds a dossier, and emits a synthetic Mission Receipt.</p></div><div class=\"console\"><aside class=\"side panel\"><div class=\"group\"><p class=\"label\">1 \u00b7 Choose role</p><div id=\"persona-list\" class=\"choices\"></div></div><div class=\"group\"><p class=\"label\">2 \u00b7 Choose scenario</p><div id=\"scenario-list\" class=\"choices\"></div></div><div class=\"group\"><p class=\"label\">3 \u00b7 Explanation mode</p><div class=\"mode-row\"><button type=\"button\" class=\"btn mode\" data-mode=\"simple\">Simple</button><button type=\"button\" class=\"btn mode\" data-mode=\"executive\">Executive</button><button type=\"button\" class=\"btn mode\" data-mode=\"technical\">Technical</button><button type=\"button\" class=\"btn mode\" data-mode=\"governance\">Governance</button><button type=\"button\" class=\"btn mode\" data-mode=\"redteam\">Red-team</button></div></div><p class=\"fineprint\">This is a deterministic public demo. Buttons select prewritten scenarios; no text is submitted.</p></aside><div class=\"main-console panel\"><div class=\"topline\"><article class=\"decision panel\"><span class=\"kicker\" id=\"decision-state\">REVIEW_READY</span><h3 id=\"scenario-title\">Scenario</h3><p id=\"scenario-summary\"></p><p id=\"decision-note\" style=\"margin-top:12px\"></p></article><article class=\"score-card panel\"><div class=\"score-ring\"><b id=\"score\">0</b></div><small>Readiness score</small></article></div><div id=\"metric-list\" class=\"grid metrics\"></div><div class=\"action-row\"><button class=\"btn primary\" type=\"button\" data-action=\"run\">Run full cycle</button><button class=\"btn\" type=\"button\" data-action=\"stress\">Stress-test</button><button class=\"btn\" type=\"button\" data-action=\"rollback\">Rollback drill</button><button class=\"btn\" type=\"button\" data-action=\"council\">Council review</button><button class=\"btn\" type=\"button\" data-action=\"dossier\">Build dossier</button><button class=\"btn violet\" type=\"button\" data-action=\"receipt\">Generate receipt</button></div><pre id=\"ai-log\" class=\"ai-log\" aria-live=\"polite\"></pre><div id=\"artifact-strip\" class=\"artifact-strip\"></div></div></div></div></section>\n<section id=\"control\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Pipeline and gates</span><h2>Proof-gated escalation</h2></div><p>The simulator makes the central rule visible: higher capability does not create higher authority. Proof gates and human authority do.</p></div><div class=\"panel\" style=\"padding:18px\"><div id=\"pipeline\" class=\"pipeline\"></div><div id=\"gate-grid\" class=\"gate-grid\"></div></div></div></section>\n<section id=\"receipt\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Synthetic receipt</span><h2>Decision record</h2></div><p>The console emits a public-safe JSON record of the simulated decision state and remaining proof debt.</p></div><div class=\"split\"><article class=\"panel\" style=\"padding:20px\"><h3>Copy-ready board memo</h3><p class=\"memo\" id=\"memo\">Click \u201cBoard memo\u201d to generate a concise executive memo for the current scenario.</p><div class=\"action-row\"><button class=\"btn primary\" type=\"button\" data-action=\"memo\">Board memo</button><button class=\"btn\" type=\"button\" data-action=\"copy-standard\">Copy standard</button></div></article><article class=\"panel\" style=\"padding:20px\"><h3>Mission Receipt JSON</h3><pre id=\"receipt-json\" class=\"json-box\"></pre><button class=\"btn\" type=\"button\" data-action=\"copy-receipt\">Copy receipt JSON</button></article></div></div></section>\n<section id=\"maturity\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Maturity ladder</span><h2>From claim to sovereign governance</h2></div><p>A simple ladder for explaining the transition from ordinary claims to proof-gated RSI and ASI boundary control.</p></div><div id=\"maturity-grid\" class=\"maturity-grid\"></div></div></section>\n<section id=\"dossier\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Dossier builder</span><h2>Move\u201137 \u2192 ASI dossier</h2></div><p>When novelty rises, skepticism rises. Breakthroughs are admitted as audited state transitions, not narratives.</p></div><div id=\"dossier-grid\" class=\"dossier-grid\"></div></div></section>\n<section id=\"artifacts\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Public artifacts</span><h2>Inspect the proof objects</h2></div><p>Every public artifact is static, synthetic, and safe to inspect.</p></div><div class=\"card-grid\"><a class=\"info-card\" href=\"loop-rsi-asi-v34-manifest.json\"><h3>Manifest</h3><p>Routes, boundaries, and latest lab metadata.</p></a><a class=\"info-card\" href=\"asi-control-tower-state-machine-v34.json\"><h3>State machine</h3><p>Claim, proof, RSI, dossier, ASI lock, council, rollback.</p></a><a class=\"info-card\" href=\"asi-readiness-gates-v34.json\"><h3>Readiness gates</h3><p>Risk, evidence, baseline, persistence, council, rollback, ASI lock.</p></a><a class=\"info-card\" href=\"move37-asi-dossier-v34.json\"><h3>Dossier</h3><p>Mandatory packaging for high-novelty candidates.</p></a><a class=\"info-card\" href=\"superintelligence-council-charter-v34.json\"><h3>Council charter</h3><p>Stop authority and independent verification duties.</p></a><a class=\"info-card\" href=\"rollback-and-containment-drill-v34.json\"><h3>Rollback drill</h3><p>Containment and release-control checks.</p></a></div></div></section>\n<section id=\"sources\"><div class=\"wrap\"><div class=\"section-head\"><div><span class=\"kicker\">Sources</span><h2>RSI context documents</h2></div><p>The v34 console is grounded in the supplied AGI Alpha RSI presentation and strategy brief.</p></div><div class=\"source-list\"><a href=\"research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf\"><b>AGI Alpha RSI \u2014 Sovereign Invention Governance</b><br><span>Presentation PDF included in the public-safe research folder.</span></a><a href=\"research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf\"><b>AGI Alpha RSI \u2014 Sovereign Strategy Brief</b><br><span>Strategy brief PDF included in the public-safe research folder.</span></a></div></div></section>\n</main><footer class=\"footer\"><div class=\"wrap\"><b>GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34</b><p>Public-safe static demonstration. No forms. No text inputs. No uploads. No cookies. No analytics. No wallets. No payments. No external AI calls. Zero value moved. No claim of realized AGI, ASI, production RSI, or autonomous deployment authority.</p><aside class=\"site-rule\" data-goalos-legal-rail=\"v12\"><b>Public site rule</b><span>No forms \u00b7 no uploads \u00b7 no cookies \u00b7 no analytics \u00b7 no wallets \u00b7 no payments \u00b7 no personal or confidential data.</span><a href=\"no-user-data.html\">Read the rule</a></aside></div></footer>\n<script src=\"assets/goalos-v34-loop-rsi-asi.js\"></script>\n</body></html>\n";
const spotlight = "\n<section id=\"v34-loop-rsi-asi-control-tower\" style=\"padding:64px 0;background:#05000d;color:#fff;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)\"><div style=\"width:min(1180px,92vw);margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:22px;align-items:center\"><div><p style=\"color:#f6d77d;font-weight:900;letter-spacing:.12em;text-transform:uppercase\">New v34 \u00b7 Loop \u2192 RSI \u2192 ASI</p><h2 style=\"font-size:clamp(34px,5vw,62px);line-height:.95;margin:0 0 14px;letter-spacing:-.06em\">Superintelligence needs a control tower, not a slogan.</h2><p style=\"font-size:18px;color:#d6c8e3\">The v34 interactive console lets visitors choose a role, run a deterministic Loop \u2192 RSI \u2192 ASI cycle, stress-test a Move\u201137 candidate, inspect ASI readiness gates, build a dossier, and generate a synthetic receipt.</p><p><a href=\"loop-rsi-asi-superintelligence-control-tower-lab.html\" style=\"display:inline-block;background:linear-gradient(135deg,#f6d77d,#fff,#45efdf);color:#12051e;padding:14px 18px;border-radius:999px;font-weight:900;text-decoration:none\">Open v34 Control Tower</a></p></div><div style=\"border:1px solid rgba(255,255,255,.15);border-radius:26px;padding:20px;background:rgba(255,255,255,.05)\"><b>GoalOS proves work.</b><br><b>RSI governs invention.</b><br><b>ASI must not self-authorize.</b><p style=\"color:#d6c8e3\">No external AI calls \u00b7 no uploads \u00b7 no wallets \u00b7 no payments \u00b7 zero value moved.</p></div></div></section>\n";
const artifacts = {
  "loop-rsi-asi-v34-manifest.json": {
    "id": "GOALOS-SIGNOFF-PRO-V34-LOOP-RSI-ASI-SUPERINTELLIGENCE-CONTROL-TOWER",
    "version": "v34",
    "title": "GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34",
    "shortTitle": "Loop \u2192 RSI \u2192 ASI Control Tower v34",
    "flagshipRoute": "loop-rsi-asi-superintelligence-control-tower-lab.html",
    "routes": [
      "loop-rsi-asi-superintelligence-control-tower-lab.html",
      "asi-control-tower.html",
      "superintelligence-control-tower.html",
      "governed-asi-console.html",
      "asi-readiness-flight-simulator.html",
      "loop-to-rsi-to-asi-v34.html",
      "proof-gated-superintelligence.html",
      "asi-governance-dashboard.html",
      "move37-asi-control-room.html",
      "no-ungoverned-superintelligence-v34.html",
      "v34.html"
    ],
    "incrementalAfter": "v33 Loop \u2192 RSI \u2192 ASI Superintelligence Console",
    "coreMessage": "GoalOS proves work. RSI governs invention. ASI-scale escalation requires proof, councils, rollback, and non-bypassable gates.",
    "heroTagline": "Govern the invention loop before superintelligence scale exists.",
    "taglines": [
      "From loop to RSI to ASI: proof-gated work becomes proof-gated invention, then proof-gated superintelligence governance.",
      "No Proof. No Trust. No Settlement. No ungoverned self-improvement. No self-authorized ASI.",
      "Search may guide allocation. Proof decides promotion. Human authority governs escalation.",
      "Superintelligence is not a landing page claim. It is a gated institutional boundary."
    ],
    "publicSafety": {
      "forms": false,
      "textInputs": false,
      "uploads": false,
      "cookies": false,
      "analytics": false,
      "wallets": false,
      "payments": false,
      "externalAiCalls": false,
      "personalData": false,
      "valueMoved": 0,
      "liveRsi": false,
      "claimedAgi": false,
      "claimedAsi": false,
      "productionAuthority": false
    },
    "sourceDocuments": [
      {
        "title": "AGI Alpha RSI \u2014 Sovereign Invention Governance presentation",
        "path": "research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf"
      },
      {
        "title": "AGI Alpha RSI \u2014 Sovereign Strategy Brief",
        "path": "research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf"
      }
    ],
    "v34Upgrade": [
      "Adds a more complete Control Tower with role, scenario, maturity, policy-shock, rollback, council, and dossier modes.",
      "Adds a deterministic AI-style briefing console that explains the same scenario at simple, executive, technical, governance, and red-team levels.",
      "Adds ASI readiness state machine, readiness gates, rollback drill, council charter, maturity ladder, and synthetic receipt artifacts.",
      "Adds copy-ready board memo and public standard outputs without collecting text, identity, files, wallets, or payments."
    ],
    "generatedAt": "2026-07-01T12:42:05Z",
    "artifacts": [
      "loop-rsi-asi-v34-manifest.json",
      "asi-control-tower-state-machine-v34.json",
      "asi-governance-console-scenarios-v34.json",
      "asi-readiness-gates-v34.json",
      "move37-asi-dossier-v34.json",
      "superintelligence-council-charter-v34.json",
      "rollback-and-containment-drill-v34.json",
      "public-safe-ai-console-boundary-v34.json",
      "rsi-source-document-index-v34.json",
      "goalos-public-demo-labs-v22-v34.json",
      "goalos-signoff-pro-site-map-v22-v34.json",
      "loop-rsi-asi-v34-demo-bundle.json"
    ]
  },
  "asi-control-tower-state-machine-v34.json": {
    "id": "asi-control-tower-state-machine-v34",
    "states": [
      "CLAIM_RECEIVED",
      "PROOF_LOOP_ACTIVE",
      "RSI_PILOT_REVIEW",
      "MOVE37_DOSSIER_REQUIRED",
      "ASI_CLAIM_LOCKED",
      "COUNCIL_REVIEW",
      "ROLLBACK_REQUIRED",
      "REVIEW_READY",
      "BLOCKED"
    ],
    "transitions": [
      {
        "from": "CLAIM_RECEIVED",
        "to": "PROOF_LOOP_ACTIVE",
        "requires": [
          "mission_contract"
        ]
      },
      {
        "from": "PROOF_LOOP_ACTIVE",
        "to": "RSI_PILOT_REVIEW",
        "requires": [
          "evidence_docket",
          "human_signoff"
        ]
      },
      {
        "from": "RSI_PILOT_REVIEW",
        "to": "MOVE37_DOSSIER_REQUIRED",
        "requires": [
          "novelty_threshold",
          "advantage_delta"
        ]
      },
      {
        "from": "MOVE37_DOSSIER_REQUIRED",
        "to": "ASI_CLAIM_LOCKED",
        "requires": [
          "high_impact_escalation"
        ]
      },
      {
        "from": "ASI_CLAIM_LOCKED",
        "to": "COUNCIL_REVIEW",
        "requires": [
          "extraordinary_replay",
          "independent_validation",
          "containment_plan"
        ]
      },
      {
        "from": "COUNCIL_REVIEW",
        "to": "ROLLBACK_REQUIRED",
        "requires": [
          "release_candidate"
        ]
      },
      {
        "from": "ROLLBACK_REQUIRED",
        "to": "REVIEW_READY",
        "requires": [
          "rollback_drill_passed",
          "stop_authority_confirmed"
        ]
      }
    ],
    "invariant": "No ASI-scale promotion may self-authorize. Every escalation requires external proof, council authority, and rollback readiness."
  },
  "asi-governance-console-scenarios-v34.json": {
    "scenarios": {
      "proofLoop": {
        "label": "GoalOS proof loop",
        "plain": "A normal AI-work claim is converted into a proof package before acceptance.",
        "state": "REVIEW_READY",
        "score": 82,
        "novelty": 0.34,
        "advantage": 12.5,
        "decision": "Proceed to review. Work is not trusted until the evidence docket, replay path, and receipt are complete.",
        "metrics": {
          "Replayability": 86,
          "Evidence quality": 78,
          "Baseline discipline": 74,
          "Risk control": 88,
          "Human authority": 92,
          "Rollback readiness": 70
        },
        "gates": {
          "risk": "pass",
          "evidence": "pass",
          "baseline": "warn",
          "persistence": "warn",
          "council": "pass",
          "rollback": "warn",
          "asi": "locked"
        },
        "receiptClass": "Proof work receipt"
      },
      "rsiPilot": {
        "label": "Governed RSI pilot",
        "plain": "A deterministic invention cycle is authorized only as a bounded pilot with replayability KPI.",
        "state": "PILOT_AUTHORIZABLE",
        "score": 76,
        "novelty": 0.58,
        "advantage": 18.9,
        "decision": "Authorize a bounded pilot if replayability, baseline, evidence, and stop-authority conditions are written into the mission.",
        "metrics": {
          "Replayability": 79,
          "Evidence quality": 72,
          "Baseline discipline": 81,
          "Risk control": 75,
          "Human authority": 88,
          "Rollback readiness": 77
        },
        "gates": {
          "risk": "pass",
          "evidence": "pass",
          "baseline": "pass",
          "persistence": "warn",
          "council": "pass",
          "rollback": "pass",
          "asi": "locked"
        },
        "receiptClass": "RSI pilot authorization receipt"
      },
      "move37": {
        "label": "Move\u201137 candidate",
        "plain": "High novelty and baseline advantage appear promising, so the system must become more skeptical, not less.",
        "state": "DOSSIER_REQUIRED",
        "score": 68,
        "novelty": 0.84,
        "advantage": 31.2,
        "decision": "Package a Move\u201137 dossier. Do not promote until reproduction, shock persistence, and independent review pass.",
        "metrics": {
          "Replayability": 73,
          "Evidence quality": 69,
          "Baseline discipline": 86,
          "Risk control": 71,
          "Human authority": 90,
          "Rollback readiness": 66
        },
        "gates": {
          "risk": "warn",
          "evidence": "pass",
          "baseline": "pass",
          "persistence": "warn",
          "council": "pass",
          "rollback": "warn",
          "asi": "locked"
        },
        "receiptClass": "Move\u201137 dossier receipt"
      },
      "asiThreshold": {
        "label": "ASI-scale escalation review",
        "plain": "A claim approaches superintelligence-scale impact; the system must not be allowed to self-promote.",
        "state": "ASI_CLAIM_LOCKED",
        "score": 41,
        "novelty": 0.93,
        "advantage": 45.0,
        "decision": "Lock the ASI claim. Require extraordinary independent replay, containment, rollback, red-team review, and council authorization.",
        "metrics": {
          "Replayability": 62,
          "Evidence quality": 58,
          "Baseline discipline": 80,
          "Risk control": 46,
          "Human authority": 96,
          "Rollback readiness": 44
        },
        "gates": {
          "risk": "block",
          "evidence": "warn",
          "baseline": "pass",
          "persistence": "block",
          "council": "pass",
          "rollback": "block",
          "asi": "locked"
        },
        "receiptClass": "ASI boundary lock receipt"
      },
      "noveltyTrap": {
        "label": "Novelty trap / false breakthrough",
        "plain": "The candidate looks exciting but fails baseline persistence and therefore cannot be promoted.",
        "state": "BLOCKED_PROBE_ONLY",
        "score": 24,
        "novelty": 0.91,
        "advantage": 4.2,
        "decision": "Reject promotion. Keep only a probe record and anti-pattern note in the Chronicle.",
        "metrics": {
          "Replayability": 66,
          "Evidence quality": 43,
          "Baseline discipline": 38,
          "Risk control": 61,
          "Human authority": 89,
          "Rollback readiness": 72
        },
        "gates": {
          "risk": "warn",
          "evidence": "warn",
          "baseline": "block",
          "persistence": "block",
          "council": "pass",
          "rollback": "pass",
          "asi": "locked"
        },
        "receiptClass": "Rejected novelty-trap receipt"
      },
      "redTeam": {
        "label": "Red-team policy shock",
        "plain": "Policy, metric, and operator-capture shocks are applied before any promotion can happen.",
        "state": "RED_TEAM_ACTIVE",
        "score": 53,
        "novelty": 0.72,
        "advantage": 20.4,
        "decision": "Hold escalation until shock deltas, adverse side effects, and council dissent are resolved.",
        "metrics": {
          "Replayability": 71,
          "Evidence quality": 66,
          "Baseline discipline": 69,
          "Risk control": 52,
          "Human authority": 94,
          "Rollback readiness": 59
        },
        "gates": {
          "risk": "block",
          "evidence": "pass",
          "baseline": "warn",
          "persistence": "warn",
          "council": "pass",
          "rollback": "warn",
          "asi": "locked"
        },
        "receiptClass": "Red-team hold receipt"
      },
      "capital": {
        "label": "Invention capital allocation",
        "plain": "Funding increases only when proof quality, replayability, and advantage persistence improve.",
        "state": "ALLOCATE_TO_PROBES",
        "score": 74,
        "novelty": 0.63,
        "advantage": 22.1,
        "decision": "Allocate budget to probes and dossier preparation, not unreviewed deployment.",
        "metrics": {
          "Replayability": 80,
          "Evidence quality": 76,
          "Baseline discipline": 79,
          "Risk control": 74,
          "Human authority": 82,
          "Rollback readiness": 71
        },
        "gates": {
          "risk": "pass",
          "evidence": "pass",
          "baseline": "pass",
          "persistence": "warn",
          "council": "warn",
          "rollback": "pass",
          "asi": "locked"
        },
        "receiptClass": "Capital allocation receipt"
      }
    }
  },
  "asi-readiness-gates-v34.json": {
    "gates": [
      {
        "id": "risk",
        "name": "Risk gate",
        "meaning": "Prohibited domains, unsafe escalation, and adverse side effects are blocked."
      },
      {
        "id": "evidence",
        "name": "Evidence gate",
        "meaning": "Claims must be bound to reproducible artifacts and evidence objects."
      },
      {
        "id": "baseline",
        "name": "Baseline gate",
        "meaning": "Claims are compared to incumbent, nearest-neighbor, and null baselines."
      },
      {
        "id": "persistence",
        "name": "Persistence gate",
        "meaning": "High novelty must survive stress tests and fixed-seed reproduction."
      },
      {
        "id": "council",
        "name": "Council gate",
        "meaning": "Independent human authority is required for strategic escalation."
      },
      {
        "id": "rollback",
        "name": "Rollback gate",
        "meaning": "Containment, kill-switch, and rollback drills must pass before release."
      },
      {
        "id": "asi",
        "name": "ASI claim lock",
        "meaning": "ASI-scale claims are locked until extraordinary evidence and governance pass."
      }
    ],
    "minimumRule": "risk + evidence + baseline + persistence + council + rollback must pass; ASI claim lock remains until extraordinary validation."
  },
  "move37-asi-dossier-v34.json": {
    "dossierSteps": [
      {
        "name": "Recognition note",
        "detail": "Why the candidate crossed novelty or advantage thresholds."
      },
      {
        "name": "Reproduction manifest",
        "detail": "Fixed seeds, artifact hashes, environment, and replay instructions."
      },
      {
        "name": "Stress-test bundle",
        "detail": "Policy shocks, sensitivity deltas, and failure-mode register."
      },
      {
        "name": "Persistence report",
        "detail": "Minimum pass rate under shocks and baseline comparison."
      },
      {
        "name": "Rollback plan",
        "detail": "Containment, stop authority, monitoring, and release gates."
      },
      {
        "name": "Council memo",
        "detail": "Decision asks, dissent register, and approval boundaries."
      },
      {
        "name": "Synthetic receipt",
        "detail": "Public-safe record of decision state and remaining proof debt."
      }
    ],
    "rule": "A breakthrough is not a narrative; it is a deterministic state transition with mandatory reproduction, stress testing, persistence, and packaging."
  },
  "superintelligence-council-charter-v34.json": {
    "name": "Architect / Validator Council \u2014 illustrative public-safe charter",
    "purpose": "Independent review, stop authority, and escalation control for RSI and ASI-scale claims.",
    "powers": [
      "block promotion",
      "require reproduction",
      "demand red-team shocks",
      "freeze ASI-scale claims",
      "require rollback drill",
      "publish decision receipt"
    ],
    "constraints": [
      "no production authority from public demo",
      "no wallet or fund movement",
      "no claim of realized AGI/ASI",
      "no external AI calls"
    ]
  },
  "rollback-and-containment-drill-v34.json": {
    "drill": [
      "define containment boundary",
      "confirm monitoring",
      "simulate stop signal",
      "verify rollback path",
      "record adverse-event register",
      "require human authorization before release"
    ],
    "passCondition": "all release-critical controls pass under stress"
  },
  "public-safe-ai-console-boundary-v34.json": {
    "forms": false,
    "textInputs": false,
    "uploads": false,
    "cookies": false,
    "analytics": false,
    "wallets": false,
    "payments": false,
    "externalAiCalls": false,
    "personalData": false,
    "valueMoved": 0,
    "liveRsi": false,
    "claimedAgi": false,
    "claimedAsi": false,
    "productionAuthority": false
  },
  "rsi-source-document-index-v34.json": {
    "sourceDocuments": [
      {
        "title": "AGI Alpha RSI \u2014 Sovereign Invention Governance presentation",
        "path": "research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf"
      },
      {
        "title": "AGI Alpha RSI \u2014 Sovereign Strategy Brief",
        "path": "research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf"
      }
    ],
    "derivedPrinciples": [
      "governance institution first",
      "deterministic pipeline",
      "OMNI/search control not outcome authority",
      "Move-37 breakthrough handling",
      "minimum operational dashboard",
      "dossier packaging"
    ]
  },
  "goalos-public-demo-labs-v22-v34.json": {
    "suite": "GoalOS Signoff Pro public demo labs v22-v34",
    "latest": "v34",
    "latestRoute": "loop-rsi-asi-superintelligence-control-tower-lab.html",
    "latestTitle": "GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34",
    "labs": [
      "v22 Action Graph & Human Authority",
      "v23 Proof-Carrying Artifact & Evolution Ledger",
      "v24 Independent Replay & Claim Promotion",
      "v25 ProofZero Planning & Evidence Reanalyze",
      "v26 Proof-Gated Mission Foundry & Curriculum",
      "v27 Process-Resolved Evidence",
      "v28 Blockchain Credibility Standard",
      "v29 Blockchain Proof Mandate & Due Diligence",
      "v30 Proof Before Settlement Research",
      "v31 Executive AI Proof Console",
      "v32 From Loop to RSI",
      "v33 Loop to RSI to ASI",
      "v34 ASI Superintelligence Control Tower"
    ]
  },
  "goalos-signoff-pro-site-map-v22-v34.json": {
    "routes": [
      "loop-rsi-asi-superintelligence-control-tower-lab.html",
      "asi-control-tower.html",
      "superintelligence-control-tower.html",
      "governed-asi-console.html",
      "asi-readiness-flight-simulator.html",
      "loop-to-rsi-to-asi-v34.html",
      "proof-gated-superintelligence.html",
      "asi-governance-dashboard.html",
      "move37-asi-control-room.html",
      "no-ungoverned-superintelligence-v34.html",
      "v34.html"
    ],
    "assets": [
      "assets/goalos-v34-loop-rsi-asi.css",
      "assets/goalos-v34-loop-rsi-asi.js"
    ],
    "research": [
      "research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf",
      "research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf"
    ]
  },
  "loop-rsi-asi-v34-demo-bundle.json": {
    "manifest": {
      "id": "GOALOS-SIGNOFF-PRO-V34-LOOP-RSI-ASI-SUPERINTELLIGENCE-CONTROL-TOWER",
      "version": "v34",
      "title": "GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34",
      "shortTitle": "Loop \u2192 RSI \u2192 ASI Control Tower v34",
      "flagshipRoute": "loop-rsi-asi-superintelligence-control-tower-lab.html",
      "routes": [
        "loop-rsi-asi-superintelligence-control-tower-lab.html",
        "asi-control-tower.html",
        "superintelligence-control-tower.html",
        "governed-asi-console.html",
        "asi-readiness-flight-simulator.html",
        "loop-to-rsi-to-asi-v34.html",
        "proof-gated-superintelligence.html",
        "asi-governance-dashboard.html",
        "move37-asi-control-room.html",
        "no-ungoverned-superintelligence-v34.html",
        "v34.html"
      ],
      "incrementalAfter": "v33 Loop \u2192 RSI \u2192 ASI Superintelligence Console",
      "coreMessage": "GoalOS proves work. RSI governs invention. ASI-scale escalation requires proof, councils, rollback, and non-bypassable gates.",
      "heroTagline": "Govern the invention loop before superintelligence scale exists.",
      "taglines": [
        "From loop to RSI to ASI: proof-gated work becomes proof-gated invention, then proof-gated superintelligence governance.",
        "No Proof. No Trust. No Settlement. No ungoverned self-improvement. No self-authorized ASI.",
        "Search may guide allocation. Proof decides promotion. Human authority governs escalation.",
        "Superintelligence is not a landing page claim. It is a gated institutional boundary."
      ],
      "publicSafety": {
        "forms": false,
        "textInputs": false,
        "uploads": false,
        "cookies": false,
        "analytics": false,
        "wallets": false,
        "payments": false,
        "externalAiCalls": false,
        "personalData": false,
        "valueMoved": 0,
        "liveRsi": false,
        "claimedAgi": false,
        "claimedAsi": false,
        "productionAuthority": false
      },
      "sourceDocuments": [
        {
          "title": "AGI Alpha RSI \u2014 Sovereign Invention Governance presentation",
          "path": "research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf"
        },
        {
          "title": "AGI Alpha RSI \u2014 Sovereign Strategy Brief",
          "path": "research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf"
        }
      ],
      "v34Upgrade": [
        "Adds a more complete Control Tower with role, scenario, maturity, policy-shock, rollback, council, and dossier modes.",
        "Adds a deterministic AI-style briefing console that explains the same scenario at simple, executive, technical, governance, and red-team levels.",
        "Adds ASI readiness state machine, readiness gates, rollback drill, council charter, maturity ladder, and synthetic receipt artifacts.",
        "Adds copy-ready board memo and public standard outputs without collecting text, identity, files, wallets, or payments."
      ],
      "generatedAt": "2026-07-01T12:42:05Z",
      "artifacts": [
        "loop-rsi-asi-v34-manifest.json",
        "asi-control-tower-state-machine-v34.json",
        "asi-governance-console-scenarios-v34.json",
        "asi-readiness-gates-v34.json",
        "move37-asi-dossier-v34.json",
        "superintelligence-council-charter-v34.json",
        "rollback-and-containment-drill-v34.json",
        "public-safe-ai-console-boundary-v34.json",
        "rsi-source-document-index-v34.json",
        "goalos-public-demo-labs-v22-v34.json",
        "goalos-signoff-pro-site-map-v22-v34.json",
        "loop-rsi-asi-v34-demo-bundle.json"
      ]
    },
    "data": {
      "version": "v34",
      "lab": "GoalOS Signoff Pro \u2014 Loop \u2192 RSI \u2192 ASI Superintelligence Control Tower Lab v34",
      "publicSafety": {
        "forms": false,
        "textInputs": false,
        "uploads": false,
        "cookies": false,
        "analytics": false,
        "wallets": false,
        "payments": false,
        "externalAiCalls": false,
        "personalData": false,
        "valueMoved": 0,
        "liveRsi": false,
        "claimedAgi": false,
        "claimedAsi": false,
        "productionAuthority": false
      },
      "personas": {
        "firstTimer": {
          "label": "First-time visitor",
          "summary": "You want the one-minute explanation.",
          "lens": "Show the proof loop in plain language and avoid jargon."
        },
        "executive": {
          "label": "Sovereign / enterprise executive",
          "summary": "You decide whether to authorize a pilot.",
          "lens": "Show decision state, budget posture, risk, rollback, and council requirements."
        },
        "validator": {
          "label": "Architect / Validator Council",
          "summary": "You decide whether a candidate can advance.",
          "lens": "Inspect deterministic artifacts, stress tests, baseline deltas, and stop authority."
        },
        "frontier": {
          "label": "Frontier lab director",
          "summary": "You care about fast discovery without unsafe promotion.",
          "lens": "Balance exploration speed with reproducibility and persistence gates."
        },
        "safety": {
          "label": "Safety & assurance lead",
          "summary": "You hunt failure modes before scale.",
          "lens": "Focus on prohibited domains, model risk, red-team shocks, and rollback."
        },
        "capital": {
          "label": "Invention capital operator",
          "summary": "You allocate resources to verified compounding advantage.",
          "lens": "Look for evidence quality, probe ROI, stepping-stone reuse, and claim maturity."
        },
        "public": {
          "label": "Public reviewer",
          "summary": "You ask what can be trusted.",
          "lens": "Demand proof packages before accepting grand claims."
        }
      },
      "explainModes": {
        "simple": "Explain it like a public product demo: no proof package means no credible promotion.",
        "executive": "Explain it like a board memo: the pilot is only acceptable with hard gates, council oversight, and rollback.",
        "technical": "Explain it like an engineering review: every cycle emits schema-bound artifacts, hashes, ledgers, and replay paths.",
        "governance": "Explain it like an institutional control system: search is allocation, not authority; human council owns escalation.",
        "redteam": "Explain it like a red-team brief: assume false positives, metric capture, political pressure, and novelty traps."
      },
      "scenarios": {
        "proofLoop": {
          "label": "GoalOS proof loop",
          "plain": "A normal AI-work claim is converted into a proof package before acceptance.",
          "state": "REVIEW_READY",
          "score": 82,
          "novelty": 0.34,
          "advantage": 12.5,
          "decision": "Proceed to review. Work is not trusted until the evidence docket, replay path, and receipt are complete.",
          "metrics": {
            "Replayability": 86,
            "Evidence quality": 78,
            "Baseline discipline": 74,
            "Risk control": 88,
            "Human authority": 92,
            "Rollback readiness": 70
          },
          "gates": {
            "risk": "pass",
            "evidence": "pass",
            "baseline": "warn",
            "persistence": "warn",
            "council": "pass",
            "rollback": "warn",
            "asi": "locked"
          },
          "receiptClass": "Proof work receipt"
        },
        "rsiPilot": {
          "label": "Governed RSI pilot",
          "plain": "A deterministic invention cycle is authorized only as a bounded pilot with replayability KPI.",
          "state": "PILOT_AUTHORIZABLE",
          "score": 76,
          "novelty": 0.58,
          "advantage": 18.9,
          "decision": "Authorize a bounded pilot if replayability, baseline, evidence, and stop-authority conditions are written into the mission.",
          "metrics": {
            "Replayability": 79,
            "Evidence quality": 72,
            "Baseline discipline": 81,
            "Risk control": 75,
            "Human authority": 88,
            "Rollback readiness": 77
          },
          "gates": {
            "risk": "pass",
            "evidence": "pass",
            "baseline": "pass",
            "persistence": "warn",
            "council": "pass",
            "rollback": "pass",
            "asi": "locked"
          },
          "receiptClass": "RSI pilot authorization receipt"
        },
        "move37": {
          "label": "Move\u201137 candidate",
          "plain": "High novelty and baseline advantage appear promising, so the system must become more skeptical, not less.",
          "state": "DOSSIER_REQUIRED",
          "score": 68,
          "novelty": 0.84,
          "advantage": 31.2,
          "decision": "Package a Move\u201137 dossier. Do not promote until reproduction, shock persistence, and independent review pass.",
          "metrics": {
            "Replayability": 73,
            "Evidence quality": 69,
            "Baseline discipline": 86,
            "Risk control": 71,
            "Human authority": 90,
            "Rollback readiness": 66
          },
          "gates": {
            "risk": "warn",
            "evidence": "pass",
            "baseline": "pass",
            "persistence": "warn",
            "council": "pass",
            "rollback": "warn",
            "asi": "locked"
          },
          "receiptClass": "Move\u201137 dossier receipt"
        },
        "asiThreshold": {
          "label": "ASI-scale escalation review",
          "plain": "A claim approaches superintelligence-scale impact; the system must not be allowed to self-promote.",
          "state": "ASI_CLAIM_LOCKED",
          "score": 41,
          "novelty": 0.93,
          "advantage": 45.0,
          "decision": "Lock the ASI claim. Require extraordinary independent replay, containment, rollback, red-team review, and council authorization.",
          "metrics": {
            "Replayability": 62,
            "Evidence quality": 58,
            "Baseline discipline": 80,
            "Risk control": 46,
            "Human authority": 96,
            "Rollback readiness": 44
          },
          "gates": {
            "risk": "block",
            "evidence": "warn",
            "baseline": "pass",
            "persistence": "block",
            "council": "pass",
            "rollback": "block",
            "asi": "locked"
          },
          "receiptClass": "ASI boundary lock receipt"
        },
        "noveltyTrap": {
          "label": "Novelty trap / false breakthrough",
          "plain": "The candidate looks exciting but fails baseline persistence and therefore cannot be promoted.",
          "state": "BLOCKED_PROBE_ONLY",
          "score": 24,
          "novelty": 0.91,
          "advantage": 4.2,
          "decision": "Reject promotion. Keep only a probe record and anti-pattern note in the Chronicle.",
          "metrics": {
            "Replayability": 66,
            "Evidence quality": 43,
            "Baseline discipline": 38,
            "Risk control": 61,
            "Human authority": 89,
            "Rollback readiness": 72
          },
          "gates": {
            "risk": "warn",
            "evidence": "warn",
            "baseline": "block",
            "persistence": "block",
            "council": "pass",
            "rollback": "pass",
            "asi": "locked"
          },
          "receiptClass": "Rejected novelty-trap receipt"
        },
        "redTeam": {
          "label": "Red-team policy shock",
          "plain": "Policy, metric, and operator-capture shocks are applied before any promotion can happen.",
          "state": "RED_TEAM_ACTIVE",
          "score": 53,
          "novelty": 0.72,
          "advantage": 20.4,
          "decision": "Hold escalation until shock deltas, adverse side effects, and council dissent are resolved.",
          "metrics": {
            "Replayability": 71,
            "Evidence quality": 66,
            "Baseline discipline": 69,
            "Risk control": 52,
            "Human authority": 94,
            "Rollback readiness": 59
          },
          "gates": {
            "risk": "block",
            "evidence": "pass",
            "baseline": "warn",
            "persistence": "warn",
            "council": "pass",
            "rollback": "warn",
            "asi": "locked"
          },
          "receiptClass": "Red-team hold receipt"
        },
        "capital": {
          "label": "Invention capital allocation",
          "plain": "Funding increases only when proof quality, replayability, and advantage persistence improve.",
          "state": "ALLOCATE_TO_PROBES",
          "score": 74,
          "novelty": 0.63,
          "advantage": 22.1,
          "decision": "Allocate budget to probes and dossier preparation, not unreviewed deployment.",
          "metrics": {
            "Replayability": 80,
            "Evidence quality": 76,
            "Baseline discipline": 79,
            "Risk control": 74,
            "Human authority": 82,
            "Rollback readiness": 71
          },
          "gates": {
            "risk": "pass",
            "evidence": "pass",
            "baseline": "pass",
            "persistence": "warn",
            "council": "warn",
            "rollback": "pass",
            "asi": "locked"
          },
          "receiptClass": "Capital allocation receipt"
        }
      },
      "stages": [
        {
          "id": "objective",
          "zone": "LOOP",
          "name": "Objective",
          "plain": "State the work claim and success criteria.",
          "artifact": "mission_contract.json",
          "why": "No mission, no proof target."
        },
        {
          "id": "evidence",
          "zone": "LOOP",
          "name": "Evidence Docket",
          "plain": "Map deliverables to criteria and risks.",
          "artifact": "evidence_docket.json",
          "why": "Output becomes reviewable evidence."
        },
        {
          "id": "signoff",
          "zone": "LOOP",
          "name": "Human Signoff",
          "plain": "Human authority accepts, rejects, or blocks.",
          "artifact": "mission_receipt.json",
          "why": "Acceptance is a governed decision."
        },
        {
          "id": "target",
          "zone": "RSI",
          "name": "Target",
          "plain": "Allocate exploration pressure through bounded search control.",
          "artifact": "targets/coverage_targets.json",
          "why": "Search control is allocation only."
        },
        {
          "id": "emit",
          "zone": "RSI",
          "name": "Emit",
          "plain": "Generate candidates under schema constraints.",
          "artifact": "candidates.raw.jsonl",
          "why": "Candidates are not outcomes."
        },
        {
          "id": "filter",
          "zone": "RSI",
          "name": "Filter",
          "plain": "Risk and interestingness gates route candidates.",
          "artifact": "risk_reports.jsonl",
          "why": "OMNI cannot insert or promote."
        },
        {
          "id": "atlas",
          "zone": "RSI",
          "name": "Atlas",
          "plain": "Extract mechanism context and comparatives.",
          "artifact": "causal_atlas_triples.jsonl",
          "why": "Context prevents one-off hype."
        },
        {
          "id": "testplan",
          "zone": "RSI",
          "name": "Test-plan",
          "plain": "Build falsification ladders and cheap probes.",
          "artifact": "falsification_ladders.jsonl",
          "why": "Skepticism is designed in."
        },
        {
          "id": "eval",
          "zone": "RSI",
          "name": "Eval",
          "plain": "Compare against incumbent, neighbor, and null baselines.",
          "artifact": "baseline_comparison.jsonl",
          "why": "Advantage must be measured."
        },
        {
          "id": "insert",
          "zone": "RSI",
          "name": "Insert",
          "plain": "Append to archive only when gates allow.",
          "artifact": "updated_frontier_cell.jsonl",
          "why": "State is monotonic and auditable."
        },
        {
          "id": "promote",
          "zone": "RSI",
          "name": "Promote",
          "plain": "Queue promotions mechanically; no bypass.",
          "artifact": "promotion_queue.jsonl",
          "why": "Promotion is earned by proof."
        },
        {
          "id": "asiGate",
          "zone": "ASI",
          "name": "ASI Boundary",
          "plain": "Lock ASI-scale claims behind extraordinary controls.",
          "artifact": "asi_boundary_lock.json",
          "why": "No self-authorized superintelligence."
        },
        {
          "id": "council",
          "zone": "ASI",
          "name": "Council Review",
          "plain": "Independent Architect / Validator Council exercises stop authority.",
          "artifact": "council_review_note.json",
          "why": "Authority is institutional, not model-internal."
        },
        {
          "id": "rollback",
          "zone": "ASI",
          "name": "Rollback Drill",
          "plain": "Verify containment, reversibility, and release gates.",
          "artifact": "rollback_drill_report.json",
          "why": "No rollback, no release."
        }
      ],
      "gates": [
        {
          "id": "risk",
          "name": "Risk gate",
          "meaning": "Prohibited domains, unsafe escalation, and adverse side effects are blocked."
        },
        {
          "id": "evidence",
          "name": "Evidence gate",
          "meaning": "Claims must be bound to reproducible artifacts and evidence objects."
        },
        {
          "id": "baseline",
          "name": "Baseline gate",
          "meaning": "Claims are compared to incumbent, nearest-neighbor, and null baselines."
        },
        {
          "id": "persistence",
          "name": "Persistence gate",
          "meaning": "High novelty must survive stress tests and fixed-seed reproduction."
        },
        {
          "id": "council",
          "name": "Council gate",
          "meaning": "Independent human authority is required for strategic escalation."
        },
        {
          "id": "rollback",
          "name": "Rollback gate",
          "meaning": "Containment, kill-switch, and rollback drills must pass before release."
        },
        {
          "id": "asi",
          "name": "ASI claim lock",
          "meaning": "ASI-scale claims are locked until extraordinary evidence and governance pass."
        }
      ],
      "maturity": [
        {
          "level": "L0",
          "name": "Narrative claim",
          "body": "A claim exists, but proof is scattered or missing."
        },
        {
          "level": "L1",
          "name": "Evidence packet",
          "body": "Evidence exists and is mapped to explicit acceptance criteria."
        },
        {
          "level": "L2",
          "name": "Replayable work",
          "body": "A reviewer can inspect the replay path and verify what happened."
        },
        {
          "level": "L3",
          "name": "Governed RSI pilot",
          "body": "A deterministic invention cycle is bounded by schema, baselines, and ledgers."
        },
        {
          "level": "L4",
          "name": "Move\u201137 dossier",
          "body": "High-novelty advantage is reproduced, stressed, and packaged for council review."
        },
        {
          "level": "L5",
          "name": "ASI boundary lock",
          "body": "Superintelligence-scale escalation is locked behind extraordinary proof and rollback."
        },
        {
          "level": "L6",
          "name": "Sovereign invention governance",
          "body": "Institutional control, council authority, and compounding ledgers become permanent infrastructure."
        }
      ],
      "dossier": [
        {
          "name": "Recognition note",
          "detail": "Why the candidate crossed novelty or advantage thresholds."
        },
        {
          "name": "Reproduction manifest",
          "detail": "Fixed seeds, artifact hashes, environment, and replay instructions."
        },
        {
          "name": "Stress-test bundle",
          "detail": "Policy shocks, sensitivity deltas, and failure-mode register."
        },
        {
          "name": "Persistence report",
          "detail": "Minimum pass rate under shocks and baseline comparison."
        },
        {
          "name": "Rollback plan",
          "detail": "Containment, stop authority, monitoring, and release gates."
        },
        {
          "name": "Council memo",
          "detail": "Decision asks, dissent register, and approval boundaries."
        },
        {
          "name": "Synthetic receipt",
          "detail": "Public-safe record of decision state and remaining proof debt."
        }
      ],
      "shocks": [
        "distribution shift",
        "adversarial framing",
        "metric capture",
        "operator pressure",
        "political capture",
        "budget pressure",
        "evaluator disagreement",
        "containment failure",
        "rollback failure",
        "novelty euphoria"
      ],
      "sourceDocuments": [
        {
          "title": "AGI Alpha RSI \u2014 Sovereign Invention Governance presentation",
          "path": "research/rsi/AGI_Alpha_RSI_Sovereign_v0.pdf"
        },
        {
          "title": "AGI Alpha RSI \u2014 Sovereign Strategy Brief",
          "path": "research/rsi/AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf"
        }
      ]
    },
    "artifacts": "see sibling JSON files",
    "publicSafety": {
      "forms": false,
      "textInputs": false,
      "uploads": false,
      "cookies": false,
      "analytics": false,
      "wallets": false,
      "payments": false,
      "externalAiCalls": false,
      "personalData": false,
      "valueMoved": 0,
      "liveRsi": false,
      "claimedAgi": false,
      "claimedAsi": false,
      "productionAuthority": false
    }
  }
};
function write(rel, content) { const p = path.join(SITE, rel); fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p, content); }
write('assets/goalos-v34-loop-rsi-asi.css', css);
write('assets/goalos-v34-loop-rsi-asi.js', js);
write(routes[0], html);
for (const alias of routes.slice(1)) write(alias, html.replace(routes[0], alias));
for (const [rel,obj] of Object.entries(artifacts)) write(rel, JSON.stringify(obj,null,2)+'\n');
write('homepage-v34-spotlight.fragment.txt', spotlight);
// Preserve/copy source PDFs if uploaded into docs/research/rsi.
for (const name of ['AGI_Alpha_RSI_Sovereign_v0.pdf','AGI_Alpha_RSI_Sovereign_Strategy_Brief_v0.pdf']) {
  const src = path.join(ROOT, 'docs', 'research', 'rsi', name); const dst = path.join(RESEARCH, name);
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);
}
// Add a non-destructive homepage spotlight if an index.html exists and has not already been patched.
const indexPath = path.join(SITE, 'index.html');
if (fs.existsSync(indexPath)) {
  let index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('v34-loop-rsi-asi-control-tower') && index.includes('</body>')) {
    index = index.replace('</body>', spotlight + '\n</body>');
    fs.writeFileSync(indexPath, index);
  }
}
console.log('GoalOS Loop → RSI → ASI Superintelligence Control Tower Lab v34 build complete');
