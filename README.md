# API Store

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![Sequelize](https://img.shields.io/badge/Sequelize-6-52B0E7?logo=sequelize)
![Tests](https://img.shields.io/badge/tests-14%20passed-brightgreen?logo=jest)
![Security](https://img.shields.io/badge/security-helmet%20%2B%20CORS-orange)
![License](https://img.shields.io/badge/license-ISC-blue)

REST API for an online store built with Node.js, Express and Sequelize (MySQL).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| ORM | Sequelize 6 + MySQL (mysql2) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | express-validator |
| Security headers | helmet |
| Auth hardening | express-rate-limit |
| File uploads | multer (images only, max 2 MB) |
| Docs | Swagger UI (`/api/v1/doc`) |
| Testing | Jest + Supertest |
| Linter | Standard JS |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MySQL database

### Installation

```bash
git clone <repo-url>
cd api-store
npm install
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host (e.g. `localhost`) |
| `DB_USER` | MySQL user |
| `DB_PASS` | MySQL password |
| `DB_DATA_BASE` | Database name |
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 chars recommended) |
| `ALLOWED_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:4200`) |
| `API_WINDOW_MS` | Global API rate-limit window in milliseconds (default `900000` = 15 min) |
| `API_MAX_REQUESTS` | Max requests allowed for the whole API per window (default `200`) |
| `LOGIN_WINDOW_MS` | Login rate-limit window in milliseconds (default `900000` = 15 min) |
| `LOGIN_MAX_ATTEMPTS` | Max failed login attempts allowed per window (default `5`) |
| `SIGNUP_WINDOW_MS` | Signup rate-limit window in milliseconds (default `3600000` = 60 min) |
| `SIGNUP_MAX_ATTEMPTS` | Max signup attempts allowed per window (default `3`) |
| `WRITE_WINDOW_MS` | Write rate-limit window for POST/PATCH/DELETE routes (default `900000` = 15 min) |
| `WRITE_MAX_REQUESTS` | Max write requests allowed per window (default `30`) |
| `DOCS_WINDOW_MS` | Swagger docs rate-limit window in milliseconds (default `900000` = 15 min) |
| `DOCS_MAX_REQUESTS` | Max Swagger requests allowed per window (default `20`) |
| `GOOGLE_API_KEY` | Google API key (optional) |
| `PORT` | Server port (default `3000`) |

### Run

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The server will sync Sequelize models with the database on startup and listen on the configured port.

## API Endpoints

All routes except `POST /signup` and `POST /login` require a **Bearer token** in the `Authorization` header.

```
Authorization: Bearer <token>
```

### Users `/api/v1/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signup` | No | Register a new user (supports `multipart/form-data` for photo) |
| POST | `/login` | No | Login — returns JWT token |
| GET | `/` | Yes | List all users |
| GET | `/:userId` | Yes | Get user by id |
| PATCH | `/` | Yes | Update user |
| DELETE | `/:userId` | Yes | Delete user |

**Login request body:**
```json
{ "identity": "email@example.com", "password": "12345678" }
```

**Login success response:**
```json
{
  "data": {
    "id": 1,
    "userName": "jonier.edu",
    "email": "email@example.com",
    "token": "<jwt>"
  }
}
```

---

### Products `/api/v1/products`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | List all products |
| GET | `/:productId` | Yes | Get product by id |
| POST | `/` | Yes | Create product |
| PATCH | `/` | Yes | Update product |
| DELETE | `/:productId` | Yes | Delete product |

---

### Category `/api/v1/kindofproduct`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | List all categories |
| GET | `/:kindOfProductId` | Yes | Get category by id |
| POST | `/` | Yes | Create category |
| PATCH | `/` | Yes | Update category |
| DELETE | `/:kindOfProductId` | Yes | Delete category |

---

### Order Status `/api/v1/orderstatus`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | List all statuses |
| GET | `/:orderStatusId` | Yes | Get status by id |
| POST | `/` | Yes | Create status |
| PATCH | `/` | Yes | Update status |
| DELETE | `/:orderStatusId` | Yes | Delete status |

---

### Orders `/api/v1/order`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | List orders for the authenticated user |
| GET | `/:orderId` | Yes | Get one order (must belong to authenticated user) |
| POST | `/` | Yes | Add product to cart / create order |
| DELETE | `/:orderId` | Yes | *(Not implemented — returns 501)* |

**POST body:**
```json
{ "productId": 1, "numberOfItems": 2 }
```

The price is read from the database — the client cannot override it.  
If the user already has an open order (`orderStatusId = 1`), the product is added to it; otherwise a new order is created. The operation is wrapped in a database transaction.

---

### API Documentation

Interactive Swagger UI available at:

```
http://localhost:3000/api/v1/doc
```

## Technical Decisions

**Price integrity** — The product price is always read from the database when creating an order. The client cannot send or override the price, which prevents price manipulation attacks.

**Database transactions** — Cart operations (create order + add item + recalculate totals) are wrapped in a Sequelize transaction. If any step fails, the entire operation is rolled back, guaranteeing data consistency.

**JWT authentication** — The user identity (`userId`) is extracted exclusively from the signed JWT token, never from the request body. This prevents users from accessing or modifying other users' orders.

**Layered rate limiting** — The API uses separate limiters for global traffic, Swagger, login, signup, and write operations. This keeps normal reads usable while applying tighter limits to authentication and state-changing routes.

**Password protection** — The `User` model uses a Sequelize `defaultScope` that excludes the `password` field from every query by default. Only the login flow uses the `withPassword` scope explicitly.

**Testability** — The Express app is decoupled from the database startup in `src/app.js`, allowing the test suite to import the app and run 14 integration tests completely offline with mocked models.

**Error responses** — All errors follow a consistent JSON contract:

```json
{ "message": "The product 99 does not exist" }
```

Validation errors (400) return:

```json
{ "error": { "errors": [{ "type": "field", "msg": "The productId can not be empty", "path": "productId", "location": "body" }] } }
```

---

## Security

| Threat | Protection |
|--------|------------|
| **SQL Injection** | Sequelize uses prepared statements for all queries — user input is never interpolated into SQL |
| **CSRF** | Stateless JWT auth via `Authorization` header — the browser never sends it automatically, so CSRF has no attack vector |
| **XSS / data injection** | `express-validator` `.trim().escape()` sanitizes all text inputs before they reach the database |
| **Sensitive HTTP headers** | `helmet` removes `X-Powered-By` and sets `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, etc. |
| **CORS** | Restricted to `ALLOWED_ORIGIN` env var — only the configured frontend domain is accepted |
| **API flooding** | A global limiter on `/api/v1` reduces abusive traffic spikes before they reach the routers |
| **Brute-force login attempts** | `express-rate-limit` restricts failed login attempts per IP and returns `429 Too Many Requests` |
| **Mass account creation** | Signup requests are rate-limited separately from login to reduce automated account creation |
| **Write abuse / spam** | POST, PATCH and DELETE operations use a stricter limiter than read routes |
| **Swagger scraping** | `/api/v1/doc` has its own limiter to reduce automated enumeration of API documentation |
| **Malicious file uploads** | `multer` rejects non-image MIME types and enforces a 2 MB size limit |
| **Password exposure** | Sequelize `defaultScope` excludes the `password` field from every query — only the login flow fetches it explicitly |
| **Token secret** | JWT secret is read from `process.env.JWT_SECRET` — never hardcoded |

---

## Data Model

```
User ──< Product ──< OrderDetail >── Order >── OrderStatus
User ──< Order
KindOfProduct ──< Product
```

## Testing

Tests run fully offline — no database connection required (models are mocked with Jest).

```bash
# Run all tests
npm test

# Watch mode
npx jest --watch

# Coverage report
npx jest --coverage
```

**Test suites:**

| File | Scenarios |
|------|-----------|
| `src/__tests__/auth.test.js` | Login 200, 401 wrong password, 401 user not found, 429 brute-force protection |
| `src/__tests__/orders.test.js` | GET/POST orders — 200, 400, 401, 404 |

## Project Structure

```
src/
├── app.js                  # Express app (no DB, no listen)
├── index.js                # Entry point — DB sync + server start
├── controllers/            # Business logic
├── db/db.js                # Sequelize instance
├── library/error/          # HttpError class + status codes
├── middleware/checkAuth.js # JWT verification middleware
├── models/                 # Sequelize models
├── uploads/                # Local file storage for images
└── v1/
    ├── routes/             # Express routers + Swagger JSDoc
    └── swagger.js          # Swagger spec config
```

## Roadmap

- [ ] Image storage in S3 / Cloudinary (replace local `uploads/` folder)
- [ ] Integration tests against a real in-memory database (SQLite)
- [ ] Pagination and filtering on list endpoints
- [ ] Order cancellation and status transition workflow
- [ ] Docker + docker-compose for local development

## License

ISC
