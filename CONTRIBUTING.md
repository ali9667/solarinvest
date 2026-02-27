# Contributing to SolarInvest

First, thank you for your interest in contributing! This document covers everything you need to know to get started.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Branch Naming](#branch-naming)
5. [Commit Convention](#commit-convention)
6. [Architecture Rules](#architecture-rules)
7. [Code Style](#code-style)
8. [Testing Guidelines](#testing-guidelines)
9. [Submitting a PR](#submitting-a-pr)
10. [Review Process](#review-process)

---

## Code of Conduct

Be respectful. Treat others how you'd like to be treated. No harassment, discrimination, or personal attacks. See our [Code of Conduct](CODE_OF_CONDUCT.md) for details.

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/solarinvest.git
cd solarinvest
git remote add upstream https://github.com/ORIGINAL_OWNER/solarinvest.git
```

### 2. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm run seed     # Creates demo data
npm run dev      # Starts on http://localhost:5000
```

### 3. Set Up the Frontend

```bash
# In a new terminal:
cd frontend
npm install
npm run dev      # Starts on http://localhost:5173
```

### 4. Verify Everything Works

- Open http://localhost:5173
- Log in as `investor@solarinvest.com` / `Demo@123`
- Check that the dashboard loads and API calls succeed

---

## Development Workflow

```
main           ← Production. Only receives merges from develop after testing.
develop        ← Integration branch. All features merge here first.
feature/xxx    ← Your work. Branch off develop.
bugfix/xxx     ← Bug fixes. Branch off develop (or main for hotfixes).
hotfix/xxx     ← Critical production fixes. Branch off main.
```

Always branch off `develop` (not `main`) unless it's a hotfix.

```bash
# Keep your fork up to date
git fetch upstream
git checkout develop
git merge upstream/develop

# Create your feature branch
git checkout -b feature/add-email-notifications
```

---

## Branch Naming

```
feature/short-description
bugfix/short-description
hotfix/short-description
chore/short-description      # Config, deps, tooling
docs/short-description       # Documentation only
refactor/short-description   # No functional change
```

Use lowercase and hyphens. Keep it short but descriptive.

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer: Closes #123]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `security` | Security improvement |
| `perf` | Performance improvement |
| `refactor` | Code change with no functional effect |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `chore` | Build, deps, CI/CD, config |
| `style` | Formatting, linting (no logic change) |

### Scopes

`auth`, `investments`, `projects`, `portfolio`, `admin`, `middleware`, `models`, `worker`, `frontend`, `ci`, `docker`

### Examples

```
feat(investments): add CSV export with CO₂ offset column

fix(auth): clear lockUntil on successful login after expiry

security(middleware): block prototype pollution keys in sanitize

chore(ci): add CodeQL weekly scan workflow

Closes #42
```

---

## Architecture Rules

This project uses a strict 4-layer architecture. **Do not skip layers.**

```
HTTP Request
    ↓
Controller       ← Extract params only. Call service. Return response. MAX ~10 lines.
    ↓
Service          ← All business logic. Validate rules. Throw typed errors.
    ↓
Repository       ← All database queries. Only layer that imports models.
    ↓
Model            ← Schema, indexes, virtuals, pre-hooks. No business logic.
```

### Rules

1. **Controllers never import models.** They call services only.
2. **Services never write raw Mongoose queries.** They call repositories only.
3. **Repositories never contain business logic.** Just DB operations.
4. **All errors must use `Errors.*` factory functions** from `utils/errors.js`. Never `throw new Error('...')`.
5. **All API responses must use `success()` / `failure()`** from `utils/response.js`. Never `res.json({...})` directly.
6. **Audit-worthy actions must be logged** via `auditRepo.log(AUDIT.ACTION_NAME, ...)`.
7. **New magic numbers / config values go in `config/constants.js`**, never hardcoded inline.

### Adding a New Endpoint — Checklist

- [ ] Route added to the correct `routes/*.js` file
- [ ] Controller function created (thin — calls service)
- [ ] Service function created (business logic)
- [ ] Repository method created if new DB query needed
- [ ] Appropriate rate limiter applied on the route
- [ ] `protect()` middleware applied if auth required
- [ ] `authorize('admin')` applied if admin-only
- [ ] Audit log created for significant actions
- [ ] Error cases handled with typed `Errors.*`

---

## Code Style

We use ESLint. Run it before committing:

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

### General Style Guidelines

- Use `const` by default. `let` only when reassignment is necessary.
- Use `async/await`. Never raw `.then()/.catch()` chains in application code.
- Use ES module syntax (`import`/`export`), not CommonJS.
- Prefer early returns over deep nesting.
- Keep functions small. If a function does more than one thing, split it.
- Name booleans with `is`, `has`, or `can` prefixes: `isActive`, `hasPermission`.
- Destructure objects: `const { name, email } = req.body` not `req.body.name`.

### Environment Variables

- All new env vars must be added to `backend/.env.example` with a descriptive comment.
- Never hardcode secrets. Never commit `.env`.

---

## Testing Guidelines

*(Test suite coming soon — PRs adding tests are very welcome!)*

When adding tests, use this structure:

```
backend/
  tests/
    unit/
      services/        # Test business logic in isolation (mock repos)
      utils/           # Test pure utility functions
    integration/
      auth.test.js     # Full request → response tests with real MongoDB
      investments.test.js
```

For integration tests:
- Use a separate test database (`MONGO_URI=mongodb://localhost:27017/solarinvest_test`)
- Seed necessary data in `beforeEach`
- Clean up in `afterEach`

---

## Submitting a PR

1. Make sure CI passes locally:
   ```bash
   cd backend && npm run lint && npm test --if-present
   cd frontend && npm run lint && npm run build
   ```

2. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a PR against `develop` (not `main`) on GitHub.

4. Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE/pull_request_template.md) completely.

5. Link the relevant issue with `Closes #<issue-number>` in the PR description.

---

## Review Process

- All PRs require at least **1 approving review** before merge.
- CI must be green (all checks passing).
- Resolve all review comments before requesting re-review.
- We use **squash merges** into `develop` to keep history clean.
- PRs that have been inactive for 14 days will be marked stale automatically.

---

## Questions?

Open a [Discussion](../../discussions) — we're happy to help you get oriented before you start coding.
