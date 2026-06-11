# Trotot App Backend

This is the backend server for the `trotot-app` project.

## Start the backend

1. Install dependencies:

   ```bash
   cd server
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

The backend listens on port `4000` by default and exposes the following endpoints:

- `GET /api/ping`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/listings`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`

If the data file does not exist, it will be created automatically in `server/data/db.json`.
