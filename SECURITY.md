# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest (main) | ✅ |
| Older branches | ❌ |

We only actively maintain and patch the latest version on the `main` branch.

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability, please report it through one of these private channels:

### Option 1 — GitHub Security Advisories (Preferred)

Use GitHub's built-in private disclosure process:

1. Go to the [Security Advisories page](../../security/advisories/new)
2. Click **"Report a vulnerability"**
3. Fill in the details

This keeps the report private until we've released a patch.

### Option 2 — Email

Send an email to: **security@solarinvest.example.com**

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested mitigation (if known)

**Do not include exploit code** in your initial report.

---

## What to Expect

| Timeline | Action |
|----------|--------|
| **48 hours** | We acknowledge receipt of your report |
| **7 days** | We provide an initial assessment (confirmed / not confirmed) |
| **30 days** | We aim to have a patch ready for confirmed vulnerabilities |
| **90 days** | Public disclosure (coordinated with you) |

We follow **coordinated disclosure** — we ask that you give us reasonable time to patch before publishing details publicly.

---

## Scope

### In Scope

- Authentication and session management (JWT, cookies)
- Authorization flaws (accessing other users' data, privilege escalation)
- Injection attacks (NoSQL injection, XSS, command injection)
- Insecure direct object references (IDOR)
- Sensitive data exposure
- Rate limiting bypasses on financial endpoints
- Business logic flaws in investment / withdrawal flows
- Dependency vulnerabilities with a working exploit

### Out of Scope

- Theoretical vulnerabilities without a working proof of concept
- Social engineering attacks
- Physical security
- Vulnerabilities in third-party services (MongoDB Atlas, Render, Vercel)
- Rate limiting on non-sensitive endpoints
- Missing security headers that don't have a demonstrated impact
- Issues that require physical access to a device

---

## Bug Bounty

This is an open-source portfolio project and does not currently offer a paid bug bounty program. However, we will:

- Credit you in the changelog and CONTRIBUTORS file (with your permission)
- Write you a letter of recognition for your contribution

---

## Security Architecture Notes

For transparency, here is a high-level overview of our security measures:

- **Authentication**: JWT tokens in `httpOnly` cookies (XSS-resistant)
- **Brute-force protection**: Account lock after 5 failed login attempts (15-minute cooldown)
- **Rate limiting**: Tiered rate limits on all API surfaces
- **Input sanitization**: XSS, NoSQL injection, and prototype pollution prevention on all inputs
- **Security headers**: Helmet.js with Content-Security-Policy, HSTS, Referrer-Policy
- **Password hashing**: bcrypt with 12 salt rounds
- **Audit logging**: All sensitive actions logged with IP and user agent
- **Soft deletes**: User/project data never permanently deleted (preserves audit trail)
