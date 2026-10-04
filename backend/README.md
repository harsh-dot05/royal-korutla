# 👑 Royal Korutla Express Backend API

Complete production-grade Express.js & Prisma backend for Royal Korutla Town Directory & Portal.

---

## 1. Architecture Overview

- **Runtime**: Node.js v22.x
- **Framework**: Express.js
- **Language**: TypeScript (Strict Mode)
- **Database ORM**: Prisma ORM v6
- **Database Engine**: PostgreSQL (Supported with graceful in-memory dev fallback)
- **Authentication**: JWT & HttpOnly Secure Cookies (`rk_session_token`)
- **Validation**: Zod Schemas
- **Security**: Helmet, CORS, Express Rate Limiting
- **Testing**: Jest & Supertest

### Directory Structure

```
backend/
├── src/
│   ├── config/          # Environment variables & runtime configuration
│   ├── controllers/     # Route logic for auth, businesses, photography, promotions, orders, homepage
│   ├── middleware/      # Auth check, Zod validation, error handler
│   ├── prisma/
│   │   ├── schema.prisma # PostgreSQL Prisma schema
│   │   └── seed.ts       # Database seed script
│   ├── routes/          # Express route definitions
│   ├── utils/           # JWT, password hashing, response helpers, seed fallback
│   ├── validators/      # Zod validation schemas
│   ├── app.ts           # Express application setup
│   └── server.ts        # Server listener
├── tests/               # Jest & Supertest API suite
├── .env.example
├── jest.config.js
├── package.json
└── tsconfig.json
```

---

## 2. Database Models & Entities

Derived strictly from Royal Korutla frontend requirements:

1. **User**: Single Owner Admin (`admin@royalkorutla.com`), Business Owners, Customers.
2. **Category**: 12 Korutla categories (`food`, `groceries`, `shopping`, `services`, `hospitals`, `education`, `public-places`, `jobs`, `real-estate`, `businesses`, `offers`, `photography`).
3. **Business**: Local town business listings, verified badges, featured status, ratings, reviews, opening hours, tags.
4. **PhotographyBusiness**: Korutla photo studios, camera rentals, wedding photography, portfolio galleries.
5. **Promotion**: Paid homepage & category banner placements, festival campaigns, business of the week.
6. **Offer**: Discount coupons, store deals, promo codes, expiry dates.
7. **FoodMenuItem**: Restaurant menus, veg/non-veg tags, bestsellers.
8. **Order**: Customer food orders logged to database & dispatched via WhatsApp.
9. **JobListing**: Local Korutla job openings (Sales, Cashier, Kitchen, AC Tech).
10. **RealEstateProperty**: Plots, independent houses, commercial leases.
11. **Hospital & Doctor**: 24/7 hospitals, specialist doctors, consultation fees.
12. **ServiceProvider & ServiceRequest**: Electrician, plumber, home appliance technician requests.

---

## 3. Entity Relationships

- `Business` 1-to-Many `BusinessImage` (Cascade Delete)
- `Business` 1-to-Many `BusinessTag` (Cascade Delete)
- `Business` 1-to-Many `Review` (Cascade Delete)
- `Business` 1-to-Many `Promotion` (Set Null)
- `PhotographyBusiness` 1-to-Many `PhotographyImage` (Cascade Delete)
- `RealEstateProperty` 1-to-Many `PropertyImage` (Cascade Delete)
- `Hospital` 1-to-Many `Doctor` (Set Null)
- `Order` 1-to-Many `OrderItem` (Cascade Delete)

---

## 4. Environment Variables

Create `.env` based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/royalkorutla?schema=public"
JWT_SECRET=rk_super_secret_jwt_key_korutla_2026
COOKIE_SECRET=rk_cookie_secret_key_2026
ADMIN_EMAIL=admin@royalkorutla.com
ADMIN_PASSWORD=RoyalKorutla@Owner2026!
```

---

## 5. Commands & Usage

### Installation
```bash
cd backend
npm install
```

### Prisma Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to PostgreSQL database
npm run prisma:db:push

# Run migrations
npm run prisma:migrate

# Seed initial Royal Korutla data
npm run prisma:seed
```

### Development & Production
```bash
# Run in development mode
npm run dev

# Build TypeScript code
npm run build

# Start production server
npm start
```

### Running Tests
```bash
npm test
```

---

## 6. API Endpoint Reference

### Health Check
- **METHOD**: `GET`
- **PATH**: `/health`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "status": "UP", "message": "Royal Korutla Express Backend operational 👑" }`

### Admin Login
- **METHOD**: `POST`
- **PATH**: `/api/admin/login`
- **AUTH REQUIRED**: No
- **REQUEST BODY**: `{ "email": "admin@royalkorutla.com", "password": "..." }`
- **RESPONSE**: `{ "success": true, "data": { "user": {...}, "token": "..." } }`
- **ERRORS**: `401 Unauthorized`

### Admin Session Profile
- **METHOD**: `GET`
- **PATH**: `/api/admin/me`
- **AUTH REQUIRED**: Yes (Admin Token in Cookie or Bearer Header)
- **ROLE**: `ADMIN`
- **RESPONSE**: `{ "success": true, "data": { "user": {...} } }`

### Admin Logout
- **METHOD**: `POST`
- **PATH**: `/api/admin/logout`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "message": "Logged out successfully" }`

### Homepage Payload
- **METHOD**: `GET`
- **PATH**: `/api/home`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "data": { "slider": [...], "categories": [...], "featuredBusinesses": [...] } }`

### Businesses Listing
- **METHOD**: `GET`
- **PATH**: `/api/businesses`
- **QUERY PARAMS**: `category`, `q`, `page`, `limit`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "data": { "items": [...], "total": 10, "page": 1, "totalPages": 1 } }`

### Business Details
- **METHOD**: `GET`
- **PATH**: `/api/businesses/:id`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "data": { "id": "biz-1", "name": "...", "reviews": [...] } }`

### Create Business (Admin Only)
- **METHOD**: `POST`
- **PATH**: `/api/businesses`
- **AUTH REQUIRED**: Yes (`ADMIN`)
- **REQUEST BODY**: `{ "name": "New Shop", "categorySlug": "food", "phone": "+91 98480 00000", "address": "Korutla" }`
- **RESPONSE**: `201 Created`

### Photography Studios Listing
- **METHOD**: `GET`
- **PATH**: `/api/photography`
- **QUERY PARAMS**: `type`, `q`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "data": [...] }`

### Create Photography Studio (Admin Only)
- **METHOD**: `POST`
- **PATH**: `/api/admin/photography`
- **AUTH REQUIRED**: Yes (`ADMIN`)
- **REQUEST BODY**: `{ "name": "Studio Name", "phone": "+91 98480 00000" }`
- **RESPONSE**: `201 Created`

### Active Promotions
- **METHOD**: `GET`
- **PATH**: `/api/promotions`
- **AUTH REQUIRED**: No
- **RESPONSE**: `{ "success": true, "data": [...] }`

### Create Promotion (Admin Only)
- **METHOD**: `POST`
- **PATH**: `/api/admin/promotions`
- **AUTH REQUIRED**: Yes (`ADMIN`)
- **REQUEST BODY**: `{ "businessName": "Store Name", "promotionType": "HOMEPAGE_FEATURED" }`
- **RESPONSE**: `201 Created`

### Create Food Order
- **METHOD**: `POST`
- **PATH**: `/api/orders`
- **AUTH REQUIRED**: No
- **REQUEST BODY**: `{ "customerName": "Customer", "customerPhone": "...", "deliveryAddress": "...", "totalAmount": 280, "items": [...] }`
- **RESPONSE**: `201 Created`
