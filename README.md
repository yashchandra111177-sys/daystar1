# Daystar catalogue

React/Vite storefront for Daystar rehydration salts, backed by an Express API and MongoDB Atlas. Product images are uploaded directly to Cloudinary using signed parameters from the authenticated API; MongoDB stores image URLs only.

## Local setup

Requirements: Node.js 20.11 or newer, npm, a MongoDB Atlas cluster, and (optionally) a Cloudinary account for uploads.

1. Install dependencies from the project root:

   ```powershell
   npm install
   npm --prefix backend install
   ```

2. Copy the environment templates:

   ```powershell
   Copy-Item .env.example .env
   Copy-Item backend/.env.example backend/.env
   ```

3. Configure Atlas and backend values in `backend/.env`:

   - `MONGODB_URI`: Atlas driver connection string for the `daystar` database.
   - `JWT_SECRET`: generate a private value with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`. Keep it at least 32 characters and never put it in a `VITE_` variable.
   - `FRONTEND_ORIGINS`: exact comma-separated frontend origins. Local development uses `http://localhost:5173`.
   - `ADMIN_SETUP_EMAIL` and `ADMIN_SETUP_PASSWORD`: temporary credentials for the one-time setup script. Use a unique password of at least 14 characters and no more than 72 UTF-8 bytes.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`: required only for uploads from the admin product form. The API secret remains backend-only.
   - `PORT` and `CLOUDINARY_UPLOAD_FOLDER` are optional; defaults are `5000` and `daystar-products`.

4. Set `VITE_API_BASE_URL=http://localhost:5000` in the root `.env` (the same value is already shown in `.env.example`).

5. Provision the first administrator and optionally import the original sample products:

   ```powershell
   npm --prefix backend run create-admin
   npm --prefix backend run seed-products
   ```

   The admin script refuses to create an account if one already exists. There is no public registration endpoint. Remove `ADMIN_SETUP_PASSWORD` (and `ADMIN_SETUP_EMAIL`) from `backend/.env` after setup. The product seed script only inserts when the products collection is empty and will not overwrite an existing catalog.

   To change the existing administrator's email and password, set `ADMIN_UPDATE_EMAIL` and `ADMIN_UPDATE_PASSWORD` in the backend environment and run `npm run update-admin` from the backend directory. This command updates the single existing administrator account, requires a password of at least 14 characters and no more than 72 UTF-8 bytes, and refuses to proceed unless exactly one administrator exists. Remove both temporary variables after it succeeds.

6. Start the API and frontend in separate terminals from the project root:

   ```powershell
   npm run dev:server
   npm run dev
   ```

   The storefront is at `http://localhost:5173`, the API health check at `http://localhost:5000/api/health`, and the admin sign-in at `http://localhost:5173/admin/login`.

## MongoDB Atlas

Create a project and cluster in Atlas, create a database user with read/write access only to `daystar`, and allow the backend host's IP under Network Access. For local development, allow your current public IP; do not use `0.0.0.0/0` in production. Copy the Node.js driver URI from Atlas and replace the username, password and cluster host in `MONGODB_URI`. URL-encode reserved characters in the database password before placing it in the URI. The app creates its collections and indexes when Mongoose connects.

The optional seed command inserts demo Daystar product rows with indicative prices and generic citrus imagery. Replace the sample listings, prices, ingredients, pack sizes, directions, claims and images with the approved product details before launch. Product copy must match the product's approved labeling and local regulations.

## Production configuration

Set `NODE_ENV=production`, `MONGODB_URI`, a private `JWT_SECRET`, the exact deployed frontend origin(s) in `FRONTEND_ORIGINS`, and the backend port in the hosting environment. Deploy the API behind HTTPS. The Vercel rewrite proxies `/api` requests to the backend so admin cookies and the session-bound CSRF token use the frontend's origin. Update the API destination in `vercel.json` if the Render service URL changes. `VITE_API_BASE_URL` is used for local development only; Vite variables are public and must never contain secrets. Configure Cloudinary credentials server-side to enable uploads. Without Cloudinary, administrators can still enter HTTPS image URLs.

Real `.env` files are ignored by Git. Only the `.env.example` templates contain placeholder values.