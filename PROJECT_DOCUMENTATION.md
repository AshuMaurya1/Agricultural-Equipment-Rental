# TractorHub Project Documentation

## Overview

TractorHub is a full-stack agricultural equipment rental platform. Customers discover tractors, configure a rental by day, hour, or acre, add implements or an operator, and manage bookings. Owners list equipment, control availability, assign operators, and use a dashboard to manage operations.

## Technology stack

| Layer | Technology |
| --- | --- |
| Client | React 19, Vite, React Router, Tailwind CSS, Axios |
| UI | Motion, React Hot Toast, Recharts, jsPDF |
| Server | Node.js, Express 5 |
| Database | MongoDB and Mongoose |
| Security | JWT, bcrypt, Helmet, CORS, Express Rate Limit |
| Email and MFA | Nodemailer and otplib (TOTP) |
| Media | Multer and ImageKit |

## Project structure

```text
Client/
  src/Components/   Shared UI, login, payment modal, owner UI
  src/Pages/        Customer, owner, and security pages
  src/context/      Application and language state
  src/utils/        Invoice generation
Server/
  controllers/      Authentication, booking, and owner logic
  models/           MongoDB schemas
  router/           Express API routes
  Middlewere/       Auth and upload middleware
  utils/            Session-token and email helpers
```

## Local setup

### Prerequisites

- Node.js 20 or newer
- MongoDB Atlas or another MongoDB deployment
- SMTP credentials for production email delivery

### API setup

1. Copy `Server/.env.example` to `Server/.env`.
2. Set a long, random `JWT_SECRET`.
3. Configure either `MONGODB_URI` or both `MONGODB_USERNAME` and `MONGODB_PASSWORD`.
4. Configure `CLIENT_URL` and SMTP values.
5. Install and run the API:

```bash
cd Server
npm install
npm run dev
```

### Client setup

Create `Client/.env`:

```env
VITE_BASE_URL=http://localhost:4000
VITE_CURRENCY=₹
```

Then run:

```bash
cd Client
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:4000` by default.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `4000`. |
| `NODE_ENV` | Use `production` in deployment so refresh cookies are secure. |
| `JWT_SECRET` | Signs access tokens and protects encrypted TOTP secrets. |
| `CLIENT_URL` | Browser origin used by CORS and security-email links. |
| `MONGODB_URI` | Complete MongoDB connection string. |
| `MONGODB_USERNAME`, `MONGODB_PASSWORD` | Alternative MongoDB Atlas credentials. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP server configuration. |
| `SMTP_SECURE` | `true` for implicit TLS; otherwise `false`. |
| `SMTP_FROM` | Sender name and address for account emails. |

Without SMTP settings, email contents are written to the server console for local development only.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Home and featured tractor listings. |
| `/tractor` | Browse and search tractors. |
| `/tractor-details/:id` | Pricing, implements, driver, transport, and booking. |
| `/mybooking` | Customer booking history, review, and invoice access. |
| `/security-sessions` | Device sessions, email verification, audit events, and owner 2FA. |
| `/reset-password` | Password reset with a one-time email token. |
| `/verify-email` | Email verification with a one-time email token. |
| `/owner` | Owner dashboard. |
| `/owner/add-tractor` | Create a tractor listing. |
| `/owner/manage-tractor` | Update listings and availability. |
| `/owner/manage-booking` | Review bookings and assign operators. |

## Booking flow

1. A customer opens a tractor detail page and selects dates.
2. They choose rental unit: day, hour, or acre.
3. Optional implements, a driver, and delivery distance are added.
4. The application calculates and presents the total.
5. The protected API validates availability and creates a booking.
6. Customers manage their bookings, submit reviews, and download invoices.
7. Owners set availability, block dates, assign operators, and manage booking status.

## Data model reference

### User

The `User` model stores account, role, security, and session data.

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `email`, `password` | String | Email is unique; password is bcrypt-hashed. |
| `role` | `user` or `owner` | Owners can create and manage tractor listings. |
| `image` | String | Hosted profile image URL. |
| `emailVerified` | Boolean | Set after a valid verification link is used. |
| `emailVerificationTokenHash` | String | SHA-256 hash of an active email-verification token. |
| `passwordResetTokenHash` | String | SHA-256 hash of an active password-reset token. |
| `twoFactor` | Object | TOTP enabled state and encrypted TOTP setup secret. |
| `sessions` | Array | Per-device refresh session records. |

Each session contains a unique session ID, refresh-token hash, previous refresh-token hash, expiry, device name, user agent, IP, activity dates, suspicious status, and revocation state.

### Tractor

| Field group | Important fields |
| --- | --- |
| Ownership | `owner`, `isAvailable`, `blockedDates` |
| Identity | `brand`, `model`, `year`, `category`, `image`, `description` |
| Specifications | `horsePower`, `seatingCapacity`, `fuelType`, `transmission`, `location` |
| Rental rates | `pricePerDay`, `pricePerHour`, `pricePerAcre`, `transportRatePerKm` |
| Add-ons | `implementsAvailable`, `driverAvailable`, `driverDailyRate`, `driverHourlyRate` |
| Reputation | `rating`, `ratingCount` |

`blockedDates` uses `YYYY-MM-DD` strings. A booking is unavailable when its date range overlaps a non-cancelled booking or an owner-blocked date.

### Booking

| Field group | Important fields |
| --- | --- |
| References | `tractor`, `user`, `owner` |
| Schedule | `startDate`, `endDate`, `rentalUnit`, `unitsBooked` |
| Price breakdown | `price`, `implementsPrice`, `driverPrice`, `transportPrice` |
| Add-ons | `selectedImplements`, `withDriver`, `transportDistanceKm` |
| Payment | `paymentMethod`, `paymentStatus`, `advanceAmount`, `transactionId` |
| Workflow | `status`, `operatorAssigned`, `customerNotes` |

Booking status is one of `pending`, `confirmed`, or `cancelled`. Payment methods are `pay_on_delivery`, `online_advance`, `full_online`, or `offline`.

### Review and audit log

- A review belongs to a tractor and customer, can reference a booking, and has a rating from 1 through 5 plus a comment.
- `AuditLog` stores a user, action, IP address, user agent, details object, and timestamps for account-security activity.

## Pricing rules

The server recalculates the final price. The client display is for convenience only and is not trusted as the source of truth.

| Rental unit | Tractor total | Implements total | Driver total |
| --- | --- | --- | --- |
| Day | Number of days × `pricePerDay` | Days × combined `pricePerDay` | Days × `driverDailyRate` |
| Hour | Requested hours × `pricePerHour` | Hours × combined `pricePerHour` | Hours × `driverHourlyRate` |
| Acre | Requested acres × `pricePerAcre` | Acres × combined `pricePerAcre` | Acres × 250 |

Delivery is calculated as `transportDistanceKm × transportRatePerKm` and is added to the booking total.

For `online_advance`, the booking records 20% of the calculated total as the advance amount. For `full_online`, the full calculated total is recorded as paid. The current implementation records payment selection and transaction references; connect a payment-gateway webhook before treating a real external payment as settled.

## Example API requests

### Register

```http
POST /api/user/register
Content-Type: application/json

{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "StrongPassword123"
}
```

The response includes a short-lived access token and sets an HTTP-only refresh cookie. The user receives an email verification link.

### Login with 2FA

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "owner@example.com",
  "password": "StrongPassword123"
}
```

If owner 2FA is enabled, the response has `requiresTwoFactor: true` and a five-minute `challengeToken` instead of an access token. Complete the login with:

```http
POST /api/user/login/2fa
Content-Type: application/json

{
  "challengeToken": "<five-minute-challenge-token>",
  "code": "123456"
}
```

### Create a booking

```http
POST /api/booking/create
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "tractorId": "<tractor-object-id>",
  "startDate": "2026-10-20",
  "endDate": "2026-10-22",
  "rentalUnit": "day",
  "unitsBooked": 2,
  "selectedImplements": [
    { "name": "Rotavator (42-blades)", "pricePerDay": 500 }
  ],
  "withDriver": true,
  "transportDistanceKm": 15,
  "paymentMethod": "online_advance",
  "customerNotes": "Please deliver before 8 AM"
}
```

### Start owner 2FA setup

```http
POST /api/user/2fa/setup
Authorization: Bearer <access-token>
```

The response contains a temporary TOTP secret and an `otpauth://` URI. Add it to an authenticator app, then confirm it:

```http
POST /api/user/2fa/enable
Authorization: Bearer <access-token>
Content-Type: application/json

{ "code": "123456" }
```

## Detailed security flows

### Access and refresh tokens

1. A successful login creates a device session in MongoDB.
2. The API returns a 15-minute access token; the browser keeps it only in memory.
3. The API sets a 30-day HTTP-only refresh cookie.
4. The client refreshes the access token periodically.
5. The refresh endpoint replaces the stored refresh-token hash with a new one.
6. A token matching the immediately previous hash indicates replay, so active sessions are revoked.

Because the access token includes a session ID, protected requests check that the linked server session has not been revoked. This makes logout and force logout effective before access-token expiry.

### Email verification

1. Registration creates a cryptographically random token.
2. Only its SHA-256 hash is stored, with a 24-hour expiry.
3. The raw token is sent in a client URL by email.
4. The verification page sends the raw token to the API.
5. The API finds a non-expired hash match, marks the email verified, and destroys the token.

### Password reset

1. A password-reset request always returns a generic success message to avoid exposing whether an email exists.
2. When an account exists, a hashed one-hour reset token is saved and emailed.
3. The reset page submits the link token and a new eight-character-minimum password.
4. The API hashes the password with bcrypt cost 12, clears the one-time token, and revokes all sessions.

### Suspicious login and sessions

The server compares a new login's user agent against active sessions. A different user agent is marked as a suspicious/new-device login. The event is displayed in Security Sessions and sends an email alert when SMTP is configured. This is a lightweight detection signal; production systems can improve it with trusted-device fingerprints, geolocation, and risk scoring.

## Email configuration and testing

Use a transactional SMTP provider in production. Common settings are port `587` with `SMTP_SECURE=false` (STARTTLS) or port `465` with `SMTP_SECURE=true` (implicit TLS).

For development without SMTP, the server writes the message content and link to its console. Do not use this mode in production.

Test these scenarios after configuring mail:

1. Register a new account and open the verification link.
2. Request a password reset and verify that the old session is revoked.
3. Sign in on a second browser and verify the new-device email alert.
4. Enable owner 2FA, sign out, and confirm that a valid TOTP is required on the next login.

## Deployment guidance

### Client deployment

Build the client with `npm run build` in `Client`. Host the generated `dist` directory with a static hosting provider. Set `VITE_BASE_URL` to the deployed API URL at build time.

### API deployment

- Run `npm start` from `Server`.
- Set all production environment variables through the deployment platform's secret manager.
- Serve the API through HTTPS.
- Set `CLIENT_URL` to the exact deployed client origin.
- Keep the API and client on the same site where possible; it simplifies secure cookie behavior.

### Important production checks

- Refresh cookies use `secure: true` when `NODE_ENV=production`; HTTPS is therefore required.
- CORS permits only `CLIENT_URL` and supports credentialed refresh requests.
- Do not expose `JWT_SECRET`, SMTP credentials, MongoDB credentials, or ImageKit private keys to the client.
- Back up MongoDB before applying schema-affecting releases.

## Troubleshooting

| Problem | Checks |
| --- | --- |
| API cannot connect to MongoDB | Check `MONGODB_URI`, network allowlist, and database credentials. |
| Browser receives CORS error | Ensure `CLIENT_URL` exactly matches the browser origin including protocol and port. |
| User cannot stay signed in | Confirm HTTPS/`NODE_ENV=production` cookie settings and `axios` credentials support. |
| No verification or reset email | Check SMTP variables and server logs; local mode logs links instead of sending them. |
| 2FA code is rejected | Confirm phone time is automatic/correct, then use a fresh six-digit code. |
| Image upload fails | Verify ImageKit configuration and that the uploaded file is present. |
| Booking says unavailable | Check overlapping non-cancelled bookings and tractor blocked dates. |

## Maintenance and testing

Run these before a release:

```bash
cd Client
npm run lint
npm run build

cd ../Server
node --check server.js
npm audit
```

Recommended future automated tests include booking-price unit tests, date-overlap tests, refresh-token rotation/replay tests, password-reset expiry tests, and end-to-end owner 2FA login tests.

## Product and technical roadmap

This roadmap distinguishes features already implemented from the next recommended development phases. Dates should be assigned by the project owner based on team capacity and business priorities.

### Completed foundation

- Customer and owner account roles.
- Tractor listings, search, availability, blocked dates, and booking management.
- Rental pricing by day, hour, and acre with implements, driver, and delivery options.
- Booking payment-state tracking, invoices, ratings, reviews, and owner dashboard.
- Access-token revocation, refresh-token rotation, device sessions, suspicious-login alerts, and force logout.
- Email verification, password reset, owner TOTP two-factor authentication, and security audit logs.

### Phase 1 — Account recovery and trust

| Item | Outcome | Priority |
| --- | --- | --- |
| TOTP recovery codes | Owners can regain access when they lose an authenticator device. | High |
| Change-password screen | Signed-in users can change passwords after confirming the current password; revoke other sessions automatically. | High |
| QR code in 2FA setup | Faster, less error-prone authenticator enrollment. | High |
| Email-change verification | Confirm ownership of both the existing and replacement email address. | High |
| Failed-login lockout | Temporary account lock and alerts after repeated failed password or TOTP attempts. | High |

### Phase 2 — Payments and booking operations

| Item | Outcome | Priority |
| --- | --- | --- |
| Payment-gateway integration | Collect real online advance/full payments through a verified provider. | High |
| Signed payment webhooks | Update booking payment status only after gateway verification. | High |
| Cancellation and refund rules | Clear customer/owner cancellation windows and calculated refund amounts. | Medium |
| Owner payout tracking | Track rental earnings, pending settlement, and payouts. | Medium |
| Notifications | Send booking confirmation, reminder, cancellation, and operator-assignment alerts through email/SMS/WhatsApp. | Medium |

### Phase 3 — Marketplace experience

| Item | Outcome | Priority |
| --- | --- | --- |
| Location-based search | Search nearby tractors using district, PIN code, or map radius. | High |
| Rich filters | Filter by horsepower, price, brand, category, driver availability, and rating. | Medium |
| Saved tractors and alerts | Customers can save equipment and receive availability/price notifications. | Medium |
| Availability calendar | Customers see open and blocked dates before starting checkout. | Medium |
| Owner verification | Add identity, phone, and equipment-document verification badges. | High |

### Phase 4 — Admin, analytics, and support

| Item | Outcome | Priority |
| --- | --- | --- |
| Admin portal | Manage users, owners, tractors, bookings, reports, and moderation. | High |
| Security dashboard | Review suspicious logins, account locks, audit activity, and session revocations. | High |
| Reporting | Track bookings, revenue, utilization, cancellations, and top locations. | Medium |
| Dispute workflow | Customers and owners can raise, review, and resolve booking disputes. | Medium |
| Support ticket system | Structured customer-support requests and status tracking. | Low |

### Phase 5 — Engineering quality and scale

| Item | Outcome | Priority |
| --- | --- | --- |
| Automated tests | Unit, integration, and end-to-end coverage for booking and account-security flows. | High |
| CI/CD pipeline | Run lint, build, tests, and deployment checks for each pull request. | High |
| Observability | Centralized error monitoring, structured logs, uptime checks, and alerts. | High |
| Background jobs | Move email, notifications, cleanup, and reporting work into a queue. | Medium |
| Database indexes and archival | Maintain query speed and retain audit/booking data safely as usage grows. | Medium |
| API documentation | Publish an OpenAPI/Swagger specification for frontend and partner integrations. | Medium |

### Recommended implementation order

1. Add recovery codes, a change-password flow, and QR-based 2FA enrollment.
2. Integrate a payment provider with webhook signature validation.
3. Build location search, availability calendar, and notifications.
4. Add admin/security dashboards and owner verification.
5. Establish CI/CD, automated test coverage, monitoring, and queued background jobs.

## API reference

All endpoints begin with `/api`. Protected endpoints require `Authorization: Bearer <access-token>`.

### Account and user APIs

| Method | Endpoint | Access | Purpose |
| --- | --- | --- |
| `POST` | `/user/register` | Public | Create user and send verification email. |
| `POST` | `/user/login` | Public | Password login; can issue a 2FA challenge. |
| `POST` | `/user/login/2fa` | Public | Complete owner TOTP login. |
| `POST` | `/user/refresh` | Refresh cookie | Rotate refresh token and issue an access token. |
| `POST` | `/user/logout` | Protected | Revoke the active session. |
| `POST` | `/user/logout-all` | Protected | Revoke every active session. |
| `GET` | `/user/data` | Protected | Retrieve safe profile data. |
| `POST` | `/user/forgot-password` | Public | Send password reset link if account exists. |
| `POST` | `/user/reset-password` | Public | Reset password using a valid one-time token. |
| `POST` | `/user/email-verification` | Protected | Send a new verification message. |
| `POST` | `/user/verify-email` | Public | Confirm a verification token. |
| `GET` | `/user/sessions` | Protected | List device sessions. |
| `DELETE` | `/user/sessions/:sessionId` | Protected | Revoke one device. |
| `GET` | `/user/audit-logs` | Protected | Read recent security activity. |
| `POST` | `/user/2fa/setup` | Owner | Start authenticator setup. |
| `POST` | `/user/2fa/enable` | Owner | Verify and enable TOTP. |
| `POST` | `/user/2fa/disable` | Owner | Disable TOTP with a valid code. |
| `GET` | `/user/tractors` | Public | List available tractors. |
| `POST` | `/user/review` | Protected | Submit a review. |
| `GET` | `/user/reviews/:tractorId` | Public | List reviews for a tractor. |

### Booking APIs

| Method | Endpoint | Access | Purpose |
| --- | --- | --- |
| `POST` | `/booking/check-availability` | Public | Check booking dates. |
| `POST` | `/booking/create` | Protected | Create a booking. |
| `GET` | `/booking/user` | Protected | List a customer's bookings. |
| `GET` | `/booking/owner` | Owner | List owner bookings. |
| `POST` | `/booking/change-status` | Protected | Update a booking when authorized. |

### Owner APIs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/owner/change-role` | Change the authenticated user to owner. |
| `POST` | `/owner/add-tractor` | Add a tractor and image. |
| `GET` | `/owner/tractors` | List owned tractors. |
| `PUT` | `/owner/tractors/:tractorId` | Edit a tractor. |
| `PUT` | `/owner/tractors/:tractorId/availability` | Toggle availability. |
| `POST` | `/owner/tractors/:tractorId/block-date` | Block or unblock a date. |
| `DELETE` | `/owner/tractors/:tractorId` | Delete a tractor. |
| `POST` | `/owner/bookings/:bookingId/assign-operator` | Assign an operator. |
| `GET` | `/owner/dashboard` | Retrieve dashboard data. |
| `POST` | `/owner/update-image` | Update profile image. |

## Authentication and security

### Session protection

- Access tokens expire after 15 minutes.
- Refresh tokens are HTTP-only cookies and rotate on every refresh.
- The database stores only SHA-256 refresh-token hashes.
- Previous refresh token reuse is treated as replay and revokes active sessions.
- Sessions track a device name, user agent, IP, timestamps, revocation reason, and suspicious-login state.

### Account protection

- Users can revoke a device or sign out from all devices.
- New device/browser logins are flagged and email an alert when SMTP is configured.
- Email verification tokens are single-use and expire after 24 hours.
- Password reset tokens are single-use and expire after one hour.
- Password resets revoke all active sessions.
- Passwords require at least eight characters and use bcrypt with 12 rounds.
- Login, registration, and password-reset requests are rate limited.

### Owner two-factor authentication

- Only owners can enable TOTP-based two-factor authentication.
- TOTP setup keys are encrypted using AES-256-GCM before storage.
- Enabled owners must provide their current authenticator-app code after password login.

### Audit logs

Security actions are recorded in the `AuditLog` collection. Users can view recent logins, logouts, session revocations, password-reset activity, email verification, and 2FA changes from **Security**.

## Validation commands

```bash
cd Client
npm run lint
npm run build

cd ../Server
node --check server.js
```

## Production checklist

- Use HTTPS and set `NODE_ENV=production`.
- Set a high-entropy `JWT_SECRET` and keep it private.
- Set `CLIENT_URL` to the exact deployed web origin.
- Configure a trusted SMTP provider and verify delivery of reset and verification links.
- Use restricted MongoDB credentials and maintain regular backups.
- Run `npm audit` regularly and update dependencies after review.
- Define retention and backup policies for user data and audit logs.
