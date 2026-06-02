import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateRefreshToken, hashToken } from '../src/utils/tokens.js';

describe('generateRefreshToken', () => {
  it('returns a 128-char hex string', () => {
    const token = generateRefreshToken();
    assert.equal(token.length, 128);
    assert.match(token, /^[0-9a-f]+$/);
  });

  it('returns a unique token each call', () => {
    const t1 = generateRefreshToken();
    const t2 = generateRefreshToken();
    assert.notEqual(t1, t2);
  });
});

describe('hashToken', () => {
  it('returns a 64-char hex string', () => {
    const hash = hashToken('some-token');
    assert.equal(hash.length, 64);
    assert.match(hash, /^[0-9a-f]+$/);
  });

  it('is deterministic', () => {
    assert.equal(hashToken('abc'), hashToken('abc'));
  });

  it('different inputs give different hashes', () => {
    assert.notEqual(hashToken('abc'), hashToken('xyz'));
  });
});
