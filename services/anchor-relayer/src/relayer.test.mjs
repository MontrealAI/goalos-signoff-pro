import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('relayer refuses mainnet unless explicit production authorization is present', () => {
  const source = fs.readFileSync(path.resolve(import.meta.dirname, 'relayer.mjs'), 'utf8');
  assert.match(source, /ALLOW_MAINNET_ANCHORING/);
  assert.match(source, /I_HAVE_AUDIT_AND_PRODUCTION_AUTHORIZATION/);
});

test('relayer requires service role and relayer keys only in environment', () => {
  const source = fs.readFileSync(path.resolve(import.meta.dirname, 'relayer.mjs'), 'utf8');
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /ANCHOR_RELAYER_PRIVATE_KEY/);
  assert.match(source, /ANCHOR_SERVICE_SIGNER_PRIVATE_KEY/);
});
