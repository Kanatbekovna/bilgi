# Refresh Token Rotation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 8-hour single JWT with a 15-minute access token + 30-day rotating refresh token system backed by PostgreSQL.

**Architecture:** Pure utility functions (`src/utils/tokens.ts`) handle crypto and JWT with no side effects. `authController.ts` owns all DB interactions — login/register now save a refresh token row, new `refresh` and `logout` handlers manage rotation. Routes wired in `routes/auth.ts`.

**Tech Stack:** Node.js `crypto` (built-in), `jsonwebtoken`, `pg`, `node:test`

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/db/migrate.sql` |
| Create | `src/utils/tokens.ts` |
| Modify | `src/controllers/authController.ts` |
| Modify | `src/routes/auth.ts` |
| Create | `tests/tokens.test.js` |

---

### Task 1: Add refresh_tokens table

**Files:**
- Modify: `src/db/migrate.sql`

- [ ] **Step 1: Append table definition**

Add at the end of `src/db/migrate.sql`:

```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

- [ ] **Step 2: Run migration against your DB**

```bash
psql -U postgres -d bilgi_project -f src/db/migrate.sql
```

Expected: `CREATE TABLE` (or `NOTICE: relation already exists` if re-run).

- [ ] **Step 3: Commit**

```bash
git add src/db/migrate.sql
git commit -m "feat: add refresh_tokens table"
```

---

### Task 2: Create token utility functions + tests

**Files:**
- Create: `src/utils/tokens.ts`
- Create: `tests/tokens.test.js`

- [ ] **Step 1: Write the failing tests**

Create `tests/tokens.test.js`:

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend
node --test tests/tokens.test.js
```

Expected: error — `Cannot find module '../src/utils/tokens.js'`

- [ ] **Step 3: Create `src/utils/tokens.ts`**

```typescript
import jwt from "jsonwebtoken";
import crypto from "crypto";

export function generateAccessToken(user: { id: number; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node --test tests/tokens.test.js
```

Expected:
```
▶ generateRefreshToken
  ✔ returns a 128-char hex string
  ✔ returns a unique token each call
▶ hashToken
  ✔ returns a 64-char hex string
  ✔ is deterministic
  ✔ different inputs give different hashes
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (0 errors).

- [ ] **Step 6: Commit**

```bash
git add src/utils/tokens.ts tests/tokens.test.js
git commit -m "feat: add token utility functions with tests"
```

---

### Task 3: Update login and register to issue both tokens

**Files:**
- Modify: `src/controllers/authController.ts`

- [ ] **Step 1: Replace top of authController.ts**

Remove the old `signToken` function and update imports:

```typescript
import bcrypt from "bcryptjs";
import { pool } from "../db/pg.js";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, hashToken } from "../utils/tokens.js";

function refreshExpiresAt(): Date {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

async function saveRefreshToken(userId: number, token: string): Promise<void> {
  await pool.query(
    "INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [hashToken(token), userId, refreshExpiresAt()]
  );
}
```

- [ ] **Step 2: Update `register` — return both tokens**

Replace the final lines of the `register` function (after `const user = result.rows[0];`):

```typescript
    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user.id, refreshToken);

    res.status(201).json({ accessToken, refreshToken, user });
```

- [ ] **Step 3: Update `login` — return both tokens**

Replace the final `res.json(...)` block inside `login`:

```typescript
    const rt = generateRefreshToken();
    await saveRefreshToken(user.id, rt);

    res.json({
      accessToken: generateAccessToken(user),
      refreshToken: rt,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 5: Manual smoke test**

Start the server: `npm run dev`

```bash
curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpass"}' | jq .
```

Expected response shape:
```json
{
  "accessToken": "<jwt-15min>",
  "refreshToken": "<128-char-hex>",
  "user": { "id": 1, "name": "...", "email": "...", "role": "user" }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/controllers/authController.ts
git commit -m "feat: login and register now return accessToken + refreshToken"
```

---

### Task 4: Add /auth/refresh endpoint

**Files:**
- Modify: `src/controllers/authController.ts`
- Modify: `src/routes/auth.ts`

- [ ] **Step 1: Add `refresh` function to authController.ts**

Add after `deleteMe`:

```typescript
export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as any;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  try {
    const deleted = await pool.query(
      `DELETE FROM refresh_tokens
       WHERE token_hash = $1 AND expires_at > NOW()
       RETURNING user_id`,
      [hashToken(refreshToken)]
    );

    if (!deleted.rows[0]) {
      return res.status(401).json({ error: "Токен недействителен или просрочен" });
    }

    const userId: number = deleted.rows[0].user_id;
    const userResult = await pool.query(
      "SELECT id, email, role FROM users WHERE id = $1",
      [userId]
    );

    if (!userResult.rows[0]) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const user = userResult.rows[0];
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    await saveRefreshToken(userId, newRefreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

- [ ] **Step 2: Add route to routes/auth.ts**

Update the import line at the top:

```typescript
import {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
  refresh,
} from "../controllers/authController.js";
```

Add route after the existing routes:

```typescript
router.post("/refresh", refresh);
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Manual smoke test**

```bash
# 1. Login to get tokens
TOKENS=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpass"}')

RT=$(echo $TOKENS | jq -r .refreshToken)

# 2. Call refresh
curl -s -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$RT\"}" | jq .
```

Expected: new `accessToken` and new `refreshToken` (different from `$RT`).

- [ ] **Step 5: Test rotation — old token rejected**

```bash
# Using the OLD $RT again should fail
curl -s -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$RT\"}" | jq .
```

Expected: `{ "error": "Токен недействителен или просрочен" }` with HTTP 401.

- [ ] **Step 6: Commit**

```bash
git add src/controllers/authController.ts src/routes/auth.ts
git commit -m "feat: add POST /auth/refresh with token rotation"
```

---

### Task 5: Add /auth/logout endpoint

**Files:**
- Modify: `src/controllers/authController.ts`
- Modify: `src/routes/auth.ts`

- [ ] **Step 1: Add `logout` function to authController.ts**

Add after `refresh`:

```typescript
export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body as any;
  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken обязателен" });
  }

  try {
    await pool.query(
      "DELETE FROM refresh_tokens WHERE token_hash = $1",
      [hashToken(refreshToken)]
    );
    res.json({ message: "Выход выполнен" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

- [ ] **Step 2: Wire route in routes/auth.ts**

Update the import:

```typescript
import {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
  refresh,
  logout,
} from "../controllers/authController.js";
```

Add route:

```typescript
router.post("/logout", logout);
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Manual smoke test**

```bash
# 1. Login
TOKENS=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpass"}')

RT=$(echo $TOKENS | jq -r .refreshToken)

# 2. Logout
curl -s -X POST http://localhost:5000/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$RT\"}" | jq .
```

Expected: `{ "message": "Выход выполнен" }`

```bash
# 3. Verify refresh now fails
curl -s -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$RT\"}" | jq .
```

Expected: `{ "error": "Токен недействителен или просрочен" }` with HTTP 401.

- [ ] **Step 5: Commit**

```bash
git add src/controllers/authController.ts src/routes/auth.ts
git commit -m "feat: add POST /auth/logout"
```

---

## Final Endpoint Summary

| Method | URL | Auth | Body |
|--------|-----|------|------|
| `POST` | `/auth/register` | — | `name, email, password, ...` |
| `POST` | `/auth/login` | — | `email, password` |
| `POST` | `/auth/refresh` | — | `{ refreshToken }` |
| `POST` | `/auth/logout` | — | `{ refreshToken }` |
| `GET` | `/auth/me` | Bearer accessToken | — |
| `PUT` | `/auth/me` | Bearer accessToken | fields |
| `DELETE` | `/auth/me` | Bearer accessToken | — |
