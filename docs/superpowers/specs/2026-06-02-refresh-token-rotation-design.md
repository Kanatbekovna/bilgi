# Refresh Token Rotation Design

## Overview

Replace the current single 8-hour JWT with a two-token system:
- **Access token** — JWT, 15 minutes, stateless
- **Refresh token** — random hex, 30 days, stored hashed in PostgreSQL, rotates on every use

## Database

Add one new table to `migrate.sql`:

```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

`token_hash` stores the SHA-256 hex digest of the raw token the client holds. The raw token is never stored.

## Token Generation

| Token | Algorithm | Expiry | Storage |
|-------|-----------|--------|---------|
| accessToken | JWT (HS256), payload: `{id, email, role}` | 15 min | Client memory |
| refreshToken | `crypto.randomBytes(64).toString('hex')` | 30 days | DB (hash only) |

## API Endpoints

### Existing — updated responses

`POST /auth/register` and `POST /auth/login` now return:
```json
{ "accessToken": "...", "refreshToken": "...", "user": { ... } }
```

### New

**`POST /auth/refresh`**
- Body: `{ "refreshToken": "..." }`
- Finds SHA-256 hash in DB, checks `expires_at`
- Deletes old row (rotation), inserts new row
- Returns: `{ "accessToken": "...", "refreshToken": "..." }`
- Errors: 401 if not found or expired

**`POST /auth/logout`**
- Body: `{ "refreshToken": "..." }`
- Deletes matching row from DB
- Returns: `{ "message": "Выход выполнен" }`

## Rotation Flow

```
Client                          Server
  │  POST /auth/refresh          │
  │  { refreshToken: T1 }  ───▶  │ hash(T1) → find in DB
  │                               │ delete row for T1
  │                               │ generate T2, insert hash(T2)
  │  { accessToken, T2 }   ◀───  │
```

If T1 is already deleted (reuse attack), the server returns 401. The attacker and legitimate client are both logged out for that session.

## Files Changed

| File | Change |
|------|--------|
| `src/db/migrate.sql` | Add `refresh_tokens` table |
| `src/controllers/authController.ts` | Update `login`/`register`, add `refresh`, `logout` |
| `src/routes/auth.ts` | Add `POST /refresh`, `POST /logout` routes |
