<div align="center">

# ☀️ SolarInvest

**A full-stack investment marketplace for solar energy projects**

[![CI](https://github.com/YOUR_USERNAME/solarinvest/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/solarinvest/actions/workflows/ci.yml)
[![CodeQL](https://github.com/YOUR_USERNAME/solarinvest/actions/workflows/codeql.yml/badge.svg)](https://github.com/YOUR_USERNAME/solarinvest/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen.svg)](https://www.mongodb.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)

[Live Demo](#) · [Report Bug](../../issues/new?template=bug_report.yml) · [Request Feature](../../issues/new?template=feature_request.yml)

</div>

---

## 📖 Overview

SolarInvest is a production-grade investment platform where users invest in real solar energy projects and earn compound interest returns. Think of it as **Zerodha for solar farms**.

### Key Features

- 🔐 JWT cookie auth with brute-force protection
- 📊 Real compound interest with live portfolio charts
- 📒 Immutable financial ledger for every money movement
- 🔄 Background growth worker (runs every 5 minutes)
- ⚡ In-memory TTL cache for projects and portfolios
- 🛡 Helmet, CORS whitelist, XSS/NoSQL sanitization, tiered rate limiting
- 🌿 CO₂ offset tracking per investment
- 📁 CSV portfolio export
- 🌙 Dark mode
- 👑 Admin dashboard with platform analytics

---

## 🏗 Architecture

```
Controller → Service → Repository → Model
```

| Layer | Job |
|-------|-----|
| **Controller** | Extract HTTP params, call service, return response |
| **Service** | Business logic, validates rules, throws typed errors |
| **Repository** | All DB queries — only layer that touches Mongoose |
| **Model** | Schema, indexes, virtuals, pre-hooks |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)

### Local Development

```bash
git clone https://github.com/YOUR_USERNAME/solarinvest.git
cd solarinvest

# Backend
cd backend
npm install
cp .env.example .env   
npm run seed
npm run dev            

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev            
```

### Docker

```bash
cp backend/.env.example backend/.env   
docker-compose up --build
# App: http://localhost  |  API: http://localhost:5000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Investor | `investor@solarinvest.com` | `Demo@123` |
| Admin | `admin@solarinvest.com` | `Admin@123` |

---

## 📡 API Reference

All responses: `{ success, data, meta: { requestId, timestamp } }`

### Auth `/api/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Create account |
| POST | `/login` | Login (20/15min rate limit) |
| POST | `/logout` | Clear session |
| GET | `/me` | Current user |
| PUT | `/profile` | Update name |
| PUT | `/change-password` | Change password |
| POST | `/forgot-password` | Request reset token |
| POST | `/reset-password` | Reset with token |

### Projects `/api/projects`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List with `?search=&status=&page=&limit=` |
| GET | `/:id` | Single project |
| POST | `/` | Create (admin only) |
| PUT | `/:id` | Update (admin only) |
| DELETE | `/:id` | Soft delete (admin only) |

### Investments `/api/investments`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Invest (10/min rate limit) |
| POST | `/:id/withdraw` | Withdraw |
| GET | `/portfolio` | Portfolio + 12-month chart |
| GET | `/transactions` | Transaction history |
| GET | `/export/csv` | Download as CSV |

### Admin `/api/admin`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/analytics` | Platform KPIs + charts |

---

## 🔐 Security Layers

| Layer | Mechanism |
|-------|-----------|
| Tokens | JWT in `httpOnly` cookies |
| Brute-force | Account lock after 5 failed logins (15 min) |
| Rate limiting | 4 tiers: 300/15min global, 20/15min auth, 10/min invest, 100/5min admin |
| Headers | Helmet: CSP, HSTS, Referrer-Policy |
| Input | XSS, NoSQL injection (`$` prefix), prototype pollution |
| Passwords | bcrypt 12 rounds |
| Audit | All sensitive actions logged with IP + user agent |

See [SECURITY.md](SECURITY.md) to report a vulnerability.

---

## 🗃 MongoDB Collections

- **Users** — auth, roles, login lock
- **Projects** — solar projects, soft delete, text search
- **Investments** — compound interest virtuals, ROI locking
- **Ledger** — immutable financial records (INVEST / WITHDRAW / GROWTH)
- **AuditLog** — action trail, auto-expires after 1 year (TTL index)

---

## 🚢 Production Deployment

| Service | Platform |
|---------|----------|
| Backend | Render or Railway (root: `backend/`) |
| Frontend | Vercel or Netlify (root: `frontend/`, publish: `dist/`) |
| Database | MongoDB Atlas |

---

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. Branch off `develop`.

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">Made with ☀️ for greener investments</div>
