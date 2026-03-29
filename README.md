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
npx prisma migrate deploy  # Apply database migrations
npm run dev # Start backend server
```
Before starting the backend, create `backend/.env` with:
```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/english_app?schema=public"
JWT_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```
3. Install DB & dependencies for frontend:
 ```bash
cd frontend 
npm install  # Install frontend dependencies
npm run dev  # Start frontend server
```

4. Open the app in your browser at http://localhost:5173/
