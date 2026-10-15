# Security Overhaul Implementation Plan - Shosti Nature

## Overview
Rebuilding the authentication and backend security architecture to be robust, secure, and production-ready.

## Key Changes
1.  **Authentication**:
    -   Replace plaintext password storage with `bcryptjs` hashed passwords.
    -   Replace insecure token array with JWT (JSON Web Tokens) for secure session management.
    -   Strict validation on all admin API routes.
2.  **Backend Security**:
    -   Implement `requireAdmin` middleware using `jwt.verify`.
    -   Add rate limiting (or at least basic brute-force protection logic).
    -   Secure password reset flow using `bcrypt` and email OTP verification.
3.  **Database Migration**:
    -   Migrate `store.json` from `adminPassword` to `adminPasswordHash`.
4.  **Security Best Practices**:
    -   Environment variables for secrets (`JWT_SECRET`, `ADMIN_EMAIL`).
    -   No hardcoded master keys or default passwords after bootstrapping.

## Implementation Steps
1.  **Preparation**: Update `package.json` with `bcryptjs` and `jsonwebtoken` (Done).
2.  **Database Migration**: Run a script to hash the current password and migrate `store.json`.
3.  **Refactor `server.ts`**:
    -   Add middleware for JWT verification.
    -   Update login/reset routes to use `bcrypt`.
    -   Update admin API routes to use `requireAdmin` middleware with JWT.
4.  **Frontend Cleanup**: Update `AdminLogin.tsx` to handle JWT token storage instead of the previous insecure string.
5.  **Testing**: Verify login, unauthorized access, and password changes.

## Environment Variables Required
- `JWT_SECRET` (A strong, random string)
- `ADMIN_EMAIL` (For identification)
