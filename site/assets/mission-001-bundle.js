window.GOALOS_MISSION_001_BUNDLE={
  "00_manifest.json": {
    "missionId": "GOALOS-MISSION-001",
    "packetVersion": "12.0.0-final-production",
    "generatedAt": "2026-07-01T17:26:25.235Z",
    "seed": "goalos-mission-001-v12-seed",
    "publicPrivateBoundary": "public packet contains synthetic proof artifacts only; private/user data is not requested or processed",
    "requiredFiles": [
      "00_manifest.json",
      "01_mission_contract.json",
      "02_environment.json",
      "03_benchmark_tasks.json",
      "04_baselines.json",
      "05_runner_config.json",
      "06_proof_bundle.json",
      "07_replay_log.ndjson",
      "08_cost_ledger.json",
      "09_safety_ledger.json",
      "10_validator_report.json",
      "11_scoreboard.json",
      "12_claims_matrix.json",
      "README.md"
    ],
    "packetHash": "44f997f6bad7cb36f71ca6b617b0905105859cda89b791cb7359233b85abd545"
  },
  "01_mission_contract.json": {
    "missionId": "GOALOS-MISSION-001",
    "objective": "Reproduce a proof-gated coordination benchmark packet for a synthetic AI-work acceptance mission.",
    "successCriteria": [
      "packet files present",
      "baselines B0-B6 present",
      "runner config present",
      "replay log present",
      "scoreboard present",
      "safety ledger zero critical",
      "claim boundaries visible"
    ],
    "failureCriteria": [
      "missing replay instructions",
      "no baseline ladder",
      "unsupported claims",
      "user-data request",
      "live-settlement claim"
    ],
    "riskClass": "public-safe synthetic demo",
    "doneCondition": "all required packet elements generated and verifier passes"
  },
  "02_environment.json": {
    "runtime": "browser-local static site and Node.js artifact workflow",
    "nodeVersion": ">=20 recommended for repo workflow; browser page requires modern JavaScript",
    "dependencies": "none for public browser replay",
    "deterministicSeed": "goalos-mission-001-v12-seed",
    "randomization": "none beyond deterministic seed hashing",
    "clockPolicy": "timestamps in generated artifacts are informational; replay ordering uses step indexes",
    "dataBoundary": "public-safe synthetic task fixtures only; no personal/confidential data"
  },
  "03_benchmark_tasks.json": {
    "taskSet": [
      {
        "id": "T001",
        "family": "research-synthesis",
        "objective": "Convert a supplied synthetic research brief into claim-bound evidence and contradiction notes.",
        "acceptance": [
          "all major claims mapped",
          "contradiction register present",
          "risk ledger present",
          "receipt emitted"
        ]
      },
      {
        "id": "T002",
        "family": "software-delivery",
        "objective": "Review a synthetic automation milestone for evidence completeness and replay readiness.",
        "acceptance": [
          "artifact hashes present",
          "baseline compared",
          "safety ledger zero critical",
          "human gate required"
        ]
      },
      {
        "id": "T003",
        "family": "vendor-review",
        "objective": "Map vendor-style claims to evidence, uncertainty, validator notes, and decision state.",
        "acceptance": [
          "claims matrix complete",
          "unsupported claims rejected",
          "validator report present",
          "replay instructions present"
        ]
      }
    ]
  },
  "04_baselines.json": {
    "baselines": [
      {
        "id": "B0",
        "name": "Null report",
        "description": "No agentic workflow. Static narrative only.",
        "verifiedWork": 18,
        "proofIntegrity": 10,
        "risk": 31,
        "cost": 1,
        "coordinationOverhead": 2,
        "score": -28.9
      },
      {
        "id": "B1",
        "name": "Single agent",
        "description": "One general agent produces an answer without verifier mesh.",
        "verifiedWork": 38,
        "proofIntegrity": 33,
        "risk": 27,
        "cost": 1.5,
        "coordinationOverhead": 4,
        "score": -16.76
      },
      {
        "id": "B2",
        "name": "Fixed workflow",
        "description": "Static chain with predefined steps but no proof-selection loop.",
        "verifiedWork": 49,
        "proofIntegrity": 47,
        "risk": 22,
        "cost": 2,
        "coordinationOverhead": 7,
        "score": -4.77
      },
      {
        "id": "B3",
        "name": "Unstructured swarm",
        "description": "Multiple agents discuss without gated proof or Chronicle discipline.",
        "verifiedWork": 51,
        "proofIntegrity": 39,
        "risk": 34,
        "cost": 3.7,
        "coordinationOverhead": 31,
        "score": -39.95
      },
      {
        "id": "B4",
        "name": "Verifier-only workflow",
        "description": "Reviewer checks final output but no mission contract or reusable capability.",
        "verifiedWork": 58,
        "proofIntegrity": 64,
        "risk": 17,
        "cost": 2.5,
        "coordinationOverhead": 12,
        "score": 9.22
      },
      {
        "id": "B5",
        "name": "Proof-gated coordination",
        "description": "Mission contract, role graph, proof bundle, verifier mesh, risk ledger, Chronicle.",
        "verifiedWork": 78,
        "proofIntegrity": 86,
        "risk": 9,
        "cost": 2.9,
        "coordinationOverhead": 11,
        "score": 46.7
      },
      {
        "id": "B6",
        "name": "GoalOS Mission 001",
        "description": "Full reproducibility packet with Evidence Docket, replay path, baselines, and acceptance gates.",
        "verifiedWork": 84,
        "proofIntegrity": 93,
        "risk": 6,
        "cost": 3,
        "coordinationOverhead": 9,
        "score": 61.92
      }
    ]
  },
  "05_runner_config.json": {
    "router": "proof-gated coordination router R0/R5 synthetic selector",
    "roles": [
      "Coordinator",
      "Planner",
      "Builder",
      "Evidence Scout",
      "Validator",
      "Risk Sentinel",
      "Chronicle",
      "Human Gate"
    ],
    "loop": [
      "Objective",
      "Mission Contract",
      "Agent / Job Allocation",
      "Tool Execution",
      "Proof Bundle",
      "Evidence Docket",
      "Verifier Mesh",
      "Governed Decision State",
      "Settlement Signal",
      "Chronicle",
      "Capability Package",
      "Harder Future Mission"
    ],
    "budget": {
      "maxSyntheticUnits": 3.5,
      "maxStages": 12,
      "maxValidators": 3
    },
    "stopRules": [
      "stop when required proof artifacts exist",
      "stop on critical safety event",
      "stop if user data would be required"
    ],
    "scoringWeights": {
      "verifiedWork": 1,
      "proofIntegrity": 1,
      "risk": -0.9,
      "coordinationOverhead": -0.8,
      "cost": -1.2
    }
  },
  "06_proof_bundle.json": {
    "runId": "mission-001-demo-run",
    "runCommitmentHash": "329478e1d0d40eda67e32bb5ccb13a65806f1c4e549159ea481dbc256d3000ee",
    "traceRoot": "1d1762254e4838a54db1cb21c03cd9d61a9a835b527a87ee8972c25659876baa",
    "outputHash": "95c5ccb552cde38c100c333ea76c605429d7e02c6060e86ef870cb49a4b6da7f",
    "policyDecisionRoot": "9aae5de1c4462b74b90426e3e0b480ce1cb2892beacb462426bf19399516e511",
    "toolHistoryRoot": "5b6c0286b7af1409e3ec321c3044537cf7a2eb6b4f8cc015800f7976894f09e6",
    "evalResultRoot": "c44d059c3ca4cc1f6dfa3b03c6a23af82f3f25df210d58bc6f19c045c4f62e69",
    "cost": {
      "syntheticUnits": 3,
      "wallClockMs": 8760
    },
    "latency": {
      "simulatedMs": 8760
    },
    "signatures": {
      "publicDemo": "sha256-hash-bound-synthetic-signature",
      "bundleHash": "dde6fcdbd788403bf807eb91e85a427db11d9844e203361ca3e4d37ae088ea32"
    }
  },
  "07_replay_log.ndjson": "{\"step\":1,\"stage\":\"Objective\",\"timestampOffsetMs\":0,\"status\":\"PASS\",\"evidenceHash\":\"a366a69464042a42a425e1f0\",\"note\":\"Objective completed under synthetic public-safe conditions.\"}\n{\"step\":2,\"stage\":\"Mission Contract\",\"timestampOffsetMs\":730,\"status\":\"PASS\",\"evidenceHash\":\"7a43fd1c33c055c1b3056065\",\"note\":\"Mission Contract completed under synthetic public-safe conditions.\"}\n{\"step\":3,\"stage\":\"Agent / Job Allocation\",\"timestampOffsetMs\":1460,\"status\":\"PASS\",\"evidenceHash\":\"442aeb6ae7b469ec69cc222e\",\"note\":\"Agent / Job Allocation completed under synthetic public-safe conditions.\"}\n{\"step\":4,\"stage\":\"Tool Execution\",\"timestampOffsetMs\":2190,\"status\":\"PASS\",\"evidenceHash\":\"841b1afa2d50d8dd41586819\",\"note\":\"Tool Execution completed under synthetic public-safe conditions.\"}\n{\"step\":5,\"stage\":\"Proof Bundle\",\"timestampOffsetMs\":2920,\"status\":\"PASS\",\"evidenceHash\":\"8e4cd7df3bc7872c3816e566\",\"note\":\"Proof Bundle completed under synthetic public-safe conditions.\"}\n{\"step\":6,\"stage\":\"Evidence Docket\",\"timestampOffsetMs\":3650,\"status\":\"PASS\",\"evidenceHash\":\"cd1d5a1bbfb1dc73220f5e38\",\"note\":\"Evidence Docket completed under synthetic public-safe conditions.\"}\n{\"step\":7,\"stage\":\"Verifier Mesh\",\"timestampOffsetMs\":4380,\"status\":\"PASS\",\"evidenceHash\":\"059d039f40b5f1a17b8226ad\",\"note\":\"Verifier Mesh completed under synthetic public-safe conditions.\"}\n{\"step\":8,\"stage\":\"Governed Decision State\",\"timestampOffsetMs\":5110,\"status\":\"PASS\",\"evidenceHash\":\"d73960ac4c6ccdea8411e478\",\"note\":\"Governed Decision State completed under synthetic public-safe conditions.\"}\n{\"step\":9,\"stage\":\"Settlement Signal\",\"timestampOffsetMs\":5840,\"status\":\"PASS\",\"evidenceHash\":\"0ca627c4cab50dfcf8689b50\",\"note\":\"Settlement Signal completed under synthetic public-safe conditions.\"}\n{\"step\":10,\"stage\":\"Chronicle\",\"timestampOffsetMs\":6570,\"status\":\"PASS\",\"evidenceHash\":\"9d6759997d2f3b231363858a\",\"note\":\"Chronicle completed under synthetic public-safe conditions.\"}\n{\"step\":11,\"stage\":\"Capability Package\",\"timestampOffsetMs\":7300,\"status\":\"PASS\",\"evidenceHash\":\"11d6d0bef4fcffd848baf0ad\",\"note\":\"Capability Package completed under synthetic public-safe conditions.\"}\n{\"step\":12,\"stage\":\"Harder Future Mission\",\"timestampOffsetMs\":8030,\"status\":\"PASS\",\"evidenceHash\":\"9376de271f805d1fce769f68\",\"note\":\"Harder Future Mission completed under synthetic public-safe conditions.\"}\n",
  "08_cost_ledger.json": {
    "syntheticComputeUnits": 3,
    "syntheticHumanReviewUnits": 0.4,
    "validatorOverhead": 0.6,
    "coordinationOverhead": 9,
    "costBoundary": "illustrative synthetic ledger; not billing or economic advice"
  },
  "09_safety_ledger.json": {
    "rawSecretLeakCount": 0,
    "externalTargetScanCount": 0,
    "exploitExecutionCount": 0,
    "malwareGenerationCount": 0,
    "socialEngineeringContentCount": 0,
    "unsafeAutomergeCount": 0,
    "criticalSafetyIncidents": 0,
    "personalDataRequested": false,
    "confidentialDataRequested": false,
    "walletConnection": false,
    "payments": false,
    "verdict": "PASS"
  },
  "10_validator_report.json": {
    "verdict": "PASS_FOR_SYNTHETIC_REPRODUCIBILITY_DEMO",
    "gates": [
      "manifest present",
      "baselines present",
      "runner config present",
      "proof bundle present",
      "replay log present",
      "cost ledger present",
      "safety ledger present",
      "claim boundaries present"
    ],
    "notClaiming": [
      "empirical SOTA",
      "external audit",
      "live settlement",
      "production certification",
      "real-world benchmark win"
    ],
    "challengeWindow": "not applicable to browser-local synthetic packet"
  },
  "11_scoreboard.json": {
    "missionId": "GOALOS-MISSION-001",
    "scoringRule": "verifiedWork × proofIntegrity - risk - coordinationOverhead - cost, normalized for public synthetic demonstration",
    "winner": "B6",
    "baselines": [
      {
        "id": "B0",
        "name": "Null report",
        "description": "No agentic workflow. Static narrative only.",
        "verifiedWork": 18,
        "proofIntegrity": 10,
        "risk": 31,
        "cost": 1,
        "coordinationOverhead": 2,
        "score": -28.9
      },
      {
        "id": "B1",
        "name": "Single agent",
        "description": "One general agent produces an answer without verifier mesh.",
        "verifiedWork": 38,
        "proofIntegrity": 33,
        "risk": 27,
        "cost": 1.5,
        "coordinationOverhead": 4,
        "score": -16.76
      },
      {
        "id": "B2",
        "name": "Fixed workflow",
        "description": "Static chain with predefined steps but no proof-selection loop.",
        "verifiedWork": 49,
        "proofIntegrity": 47,
        "risk": 22,
        "cost": 2,
        "coordinationOverhead": 7,
        "score": -4.77
      },
      {
        "id": "B3",
        "name": "Unstructured swarm",
        "description": "Multiple agents discuss without gated proof or Chronicle discipline.",
        "verifiedWork": 51,
        "proofIntegrity": 39,
        "risk": 34,
        "cost": 3.7,
        "coordinationOverhead": 31,
        "score": -39.95
      },
      {
        "id": "B4",
        "name": "Verifier-only workflow",
        "description": "Reviewer checks final output but no mission contract or reusable capability.",
        "verifiedWork": 58,
        "proofIntegrity": 64,
        "risk": 17,
        "cost": 2.5,
        "coordinationOverhead": 12,
        "score": 9.22
      },
      {
        "id": "B5",
        "name": "Proof-gated coordination",
        "description": "Mission contract, role graph, proof bundle, verifier mesh, risk ledger, Chronicle.",
        "verifiedWork": 78,
        "proofIntegrity": 86,
        "risk": 9,
        "cost": 2.9,
        "coordinationOverhead": 11,
        "score": 46.7
      },
      {
        "id": "B6",
        "name": "GoalOS Mission 001",
        "description": "Full reproducibility packet with Evidence Docket, replay path, baselines, and acceptance gates.",
        "verifiedWork": 84,
        "proofIntegrity": 93,
        "risk": 6,
        "cost": 3,
        "coordinationOverhead": 9,
        "score": 61.92
      }
    ],
    "result": "B6 is the synthetic benchmark winner in this browser-local packet because it provides the full reproducibility path, not just a higher narrative score."
  },
  "12_claims_matrix.json": {
    "claims": [
      {
        "claim": "Mission 001 exposes a reproducible benchmark packet.",
        "requiredEvidence": [
          "manifest",
          "environment",
          "tasks",
          "baselines",
          "runner config",
          "proof bundle",
          "replay log",
          "ledgers",
          "validator report",
          "scoreboard"
        ],
        "status": "supported by generated public packet",
        "boundary": "synthetic browser-local demonstration"
      },
      {
        "claim": "GoalOS turns output into governed decision state.",
        "requiredEvidence": [
          "claims matrix",
          "Evidence Docket",
          "risk ledger",
          "verifier report",
          "mission receipt"
        ],
        "status": "supported in packet structure",
        "boundary": "does not assert real-world certification"
      },
      {
        "claim": "B6 outperforms baselines in this demo.",
        "requiredEvidence": [
          "baseline table",
          "scoring rule",
          "deterministic packet"
        ],
        "status": "supported for synthetic benchmark only",
        "boundary": "not empirical SOTA"
      }
    ]
  },
  "README.md": "# GOALOS-MISSION-001 Benchmark Reproducibility Packet\n\nThis is a public-safe synthetic reproducibility packet. It lets a user inspect the exact mission, task set, environment, baselines, runner config, proof bundle, replay log, ledgers, validator report, scoreboard, and claim boundary.\n\n## Browser replay\nOpen `mission-001-replay.html` or `benchmark-reproducibility.html` and click `Run Mission 001 replay`.\n\n## GitHub replay\nRun `Actions -> Mission 001 Benchmark Reproducibility Packet -> Run workflow`. Download the artifact.\n\n## What this proves\nIt proves the public site exposes a reproducible synthetic benchmark packet. It does not prove empirical SOTA, external audit, live settlement, or production certification.\n"
};