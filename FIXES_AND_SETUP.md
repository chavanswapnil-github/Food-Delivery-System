# What was broken, and how to run the project now

## 1. The critical bug: the app looked "stuck" on OTP / login / register

`server/config/db.js` uses `mysql2/promise` (a Promise-based connection
pool). But several files were written in the old **callback** style —
`db.query(sql, params, (err, results) => {...})`. A promise pool simply
**ignores** a callback passed as the 3rd argument and returns a Promise
instead, so those callbacks were never called. The request would just
hang forever (or silently do nothing) until the browser gave up.

This affected:
- OTP send / verify (`sendRegisterOTP`, `sendLoginOTP`, `verifyOTPController`)
- Register / Login (`authService.js`)
- Profile get/update (`userController.js`)
- Admin dashboard + analytics (`adminModel.js`, `adminService.js`)
- Owner/Admin stats widget (`dashboardModel.js`, `dashboardService.js`)
- **Placing an order** (`orderService.js` also called `db.beginTransaction`
  / `db.commit` / `db.rollback` directly on the pool, which don't exist
  on a promise pool at all — checkout was completely broken)

All of these were rewritten to proper `async/await` against the promise
pool (order placement now correctly uses a single checked-out connection
with `beginTransaction / commit / rollback` so the order + its items are
inserted atomically).

## 2. Local MySQL couldn't even connect

`db.js` forced `ssl: { rejectUnauthorized: false }` on every connection.
Local MySQL installs almost never have SSL configured, so the pool
failed to connect at all. SSL is now **opt-in** via `DB_SSL=true` in
`server/.env` (leave it `false`/unset for local MySQL).

## 3. There was no database schema anywhere in the project

Only two `ALTER TABLE` migration files existed
(`server/sql/admin_module_migration.sql`,
`server/sql/add_lat_lng_to_addresses.sql`) — there was no base
`CREATE TABLE` script, so a fresh MySQL database had nothing to migrate
*onto*. Added **`server/sql/schema.sql`**, reverse-engineered from every
query in the codebase (users, restaurants, foods, orders, order_items,
addresses, favorites, reviews, coupons).

### To set up the database from scratch:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS food_delivery"
mysql -u root -p food_delivery < server/sql/schema.sql
```
Then edit `server/.env` with your MySQL credentials (`DB_USER`,
`DB_PASSWORD`, etc). To make an account an admin, register normally
through the app, then run:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## 4. Forgot-password linked to a page that didn't exist

`authController.js` emails a link to `/reset-password/:token`, but the
React app had no matching route or page, so clicking the emailed link
was a dead end. Added `client/src/pages/ResetPassword.jsx`, wired it up
in `App.jsx`, and added a "Forgot password?" link + flow to the Login
page (plus `forgotPassword`/`resetPassword` calls in
`client/src/services/authService.js`).

## 5. File uploads used a fragile relative path

`server/middleware/upload.js` saved uploads to the relative path
`"uploads/"`, which resolves against whatever directory `node` happens
to be launched from — not necessarily `server/`. If the server is ever
started from the repo root instead of from inside `server/`, images
would silently save to the wrong folder and 404 when the frontend tried
to load them. It's now an absolute path derived from the file's own
location, and the folder is auto-created if missing.

## 6. Mobile responsiveness

- The navbar had no mobile breakpoint at all (fixed nav links + a
  240px search box + login/register buttons all in one row) — it just
  overflowed sideways on any phone. It now collapses into a hamburger
  menu with a slide-down panel below 900px.
- Login page was rebuilt to match Register's responsive `auth-container`
  layout (it was previously raw inline styles with a fixed 400px box and
  no mobile handling at all).
- Added `client/src/responsive.css` (imported globally, last) with
  breakpoints for the hero section, category/restaurant grids, the
  admin/owner dashboard + sidebar (which used a fixed 280px sidebar +
  `margin-left: 260px` that broke on any phone), tables (horizontal
  scroll instead of blowing out the page), the cart drawer (fixed
  380px → full width on small phones), and form/button sizing.
- `input`/`select`/`textarea` font-size is forced to 16px on mobile to
  stop iOS Safari's auto-zoom-on-focus.

This covers the highest-traffic screens (nav, home, auth, checkout,
dashboards). Some lower-traffic admin sub-pages may still want extra
polish — the responsive layer is additive, so you can keep extending
`responsive.css` the same way without touching each component file.

## Running the project

```bash
# Backend
cd server
npm install
npm run dev          # http://localhost:5000

# Frontend (separate terminal)
cd client
npm install
npm run dev           # http://localhost:5173
```

Make sure `server/.env` has working MySQL credentials and that you've
run `schema.sql` against your database first (step 3 above), and that
`EMAIL_USER` / `EMAIL_PASS` are a valid Gmail address + App Password if
you want OTP emails to actually send.
