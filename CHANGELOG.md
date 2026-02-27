# Changelog

All notable changes to SolarInvest are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Redis integration for distributed caching
- Email notifications via SendGrid (investment confirmation, password reset)
- Zod schema validation for all API inputs
- Real payment gateway integration (Razorpay)
- WebSocket support for real-time portfolio value updates
- Unit and integration test suite

---

## [3.0.0] — 2024-02-24

### Added
- **Service → Repository → Model architecture** — Complete separation of concerns across 4 layers
- **Immutable financial Ledger** — Every money movement (INVEST / WITHDRAW / GROWTH) creates a permanent record
- **Background growth worker** — Separate process calculating portfolio growth every 5 minutes with cursor-based batching
- **In-memory cache** — TTL-based Map cache with prefix invalidation (drop-in Redis compatible)
- **Audit logging** — Every significant action logged with IP, user agent, before/after state
- **Typed error system** — 13 typed `AppError` codes with consistent HTTP status mapping
- **Standard response envelope** — `{ success, data, meta: { requestId, timestamp } }` for all responses
- **Request tracing** — UUID `requestId` on every request, in response headers and log lines
- **Tiered rate limiting** — 4 different limiters: global, auth, invest, admin
- **Brute-force protection** — Account lock after 5 failed logins (15-minute cooldown)
- **Soft delete** — Projects have `deletedAt` with automatic pre-hook filtering
- **Mongoose virtuals** — `currentValue`, `totalReturns`, `co2OffsetTons`, `monthsElapsed` on Investment; `fundingProgress` on Project
- **MongoDB aggregation pipelines** — `monthlyActivity`, `roiDistribution` ($bucket), `topByFunding`
- **CSV export** — Portfolio downloadable as CSV with all investment details
- **Admin analytics dashboard** — Platform KPIs, monthly activity chart, ROI distribution pie, top funded projects
- **Dark mode** — Toggle persisted to localStorage
- **ROI lock** — Investment locks project ROI at time of investment (isolated from future project changes)
- **Portfolio growth chart** — 12-month historical portfolio value computed retroactively
- **CO₂ offset tracking** — Estimated carbon offset calculated per investment

### Security
- Helmet.js with full CSP, HSTS, Referrer-Policy configuration
- httpOnly + Secure + SameSite JWT cookies
- Input sanitization: XSS, NoSQL injection ($-prefix stripping), prototype pollution prevention
- SHA-256 hashed password reset tokens (raw token never stored)
- `toSafeObject()` method strips sensitive fields before returning user data
- Body size limit: 10kb to prevent payload attacks

### Infrastructure
- Docker + docker-compose setup (backend + frontend + MongoDB)
- Nginx reverse proxy configuration for frontend
- Graceful shutdown handling (SIGTERM, SIGINT)
- Structured JSON logging with severity levels

---

## [2.0.0] — 2024-01-15

### Added
- Repository pattern (database access layer)
- CORS whitelist with environment-based configuration
- Rate limiting (basic — single tier)

### Changed
- Migrated from CommonJS to ES Modules (`import`/`export`)

---

## [1.0.0] — 2023-12-01

### Added
- Initial release
- Basic CRUD for users, projects, investments
- JWT authentication
- React frontend with Tailwind

---

[Unreleased]: https://github.com/YOUR_USERNAME/solarinvest/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/YOUR_USERNAME/solarinvest/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/YOUR_USERNAME/solarinvest/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/YOUR_USERNAME/solarinvest/releases/tag/v1.0.0
