import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateRegisterData, validateUpdateData } from '../src/middleware/validators.js';

describe('validateRegisterData', () => {
  it('accepts valid data', () => {
    const data = {
      name: 'Тестовый пользователь',
      email: 'test@example.com',
      password: 'secret123',
      phone: '+996700000000',
    };
    const { valid, errors } = validateRegisterData(data);
    assert.equal(valid, true);
    assert.equal(errors.length, 0);
  });

  it('rejects short name and invalid email and short password', () => {
    const data = { name: 'A', email: 'bad', password: '123' };
    const { valid, errors } = validateRegisterData(data);
    assert.equal(valid, false);
    assert(errors.find(e => e.field === 'name'));
    assert(errors.find(e => e.field === 'email'));
    assert(errors.find(e => e.field === 'password'));
  });
});

describe('validateUpdateData', () => {
  it('accepts empty update', () => {
    const { valid, errors } = validateUpdateData({});
    assert.equal(valid, true);
    assert.equal(errors.length, 0);
  });

  it('rejects invalid phone and short password', () => {
    const { valid, errors } = validateUpdateData({ phone: 'abc', password: '12' });
    assert.equal(valid, false);
    assert(errors.find(e => e.field === 'phone'));
    assert(errors.find(e => e.field === 'password'));
  });
});
