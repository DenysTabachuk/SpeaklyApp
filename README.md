# Speakly / English Learning App

This application is currently under development. It is intended to become a web application for learning English interactively. The app will help users practice vocabulary, grammar, and listening skills through personalized exercises.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express 
- **Database:** PostgreSQL 
- **Other:** Axios for API requests, React Router, Redux for state management

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DenysTabachuk/SpeaklyApp.git
cd SpeaklyApp
```

2. Install DB & dependencies for backend:
 ```bash
cd backend
docker-compose up -d   # Start PostgreSQL
npm install   # Install backend dependencies
npx prisma generate  # Generate Prisma Client
npm run dev # Start backend server
```
Before starting the backend, create `backend/.env` with:
```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=english_app
DB_USER=admin
DB_PASSWORD=admin
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```
The backend now builds `DATABASE_URL` from `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`, and automatically runs `prisma migrate deploy` during startup.

3. Install DB & dependencies for frontend:
 ```bash
cd frontend 
npm install  # Install frontend dependencies
npm run dev  # Start frontend server
```
Before starting the frontend, create `frontend/.env` with:
```env
VITE_API_BASE_URL=http://localhost:3000/
VITE_BACKEND_ASSET_URL=http://localhost:3000
```

4. Open the app in your browser at http://localhost:5173/

## Tests

Run all tests for backend and frontend from the repository root:

```bash
npm test
```
