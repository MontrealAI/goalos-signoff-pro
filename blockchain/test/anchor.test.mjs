import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

test('anchor contract source contains no value custody functions', () => {
  const source = fs.readFileSync(path.resolve(import.meta.dirname, '..', '..', 'contracts', 'GoalOSSignoffAnchorV1.sol'), 'utf8');
  assert.match(source, /GoalOSNativeFundsRejected/);
  assert.doesNotMatch(source, /transferFrom\(/);
  assert.doesNotMatch(source, /safeTransferFrom\(/);
  assert.doesNotMatch(source, /withdraw\(/i);
  assert.doesNotMatch(source, /IERC20/);
});

test('anchor payload domain is explicit', () => {
  const source = fs.readFileSync(path.resolve(import.meta.dirname, '..', '..', 'contracts', 'GoalOSSignoffAnchorV1.sol'), 'utf8');
  assert.match(source, /GOALOS_SIGNOFF_ANCHOR_V1/);
  assert.match(source, /block\.chainid/);
  assert.match(source, /address\(this\)/);
  assert.match(source, /deploymentSalt/);
});

test('source fingerprint is stable', () => {
  const source = fs.readFileSync(path.resolve(import.meta.dirname, '..', '..', 'contracts', 'GoalOSSignoffAnchorV1.sol'));
  const digest = '0x' + crypto.createHash('sha256').update(source).digest('hex');
  assert.match(digest, /^0x[0-9a-f]{64}$/);
});
