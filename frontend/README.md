# QuizMaster

A complete full-stack quiz and learning platform built with Next.js, React, TypeScript, Express, MongoDB/Mongoose, JWT cookies, Zod, and Tailwind CSS.

## Features

- Public landing page and searchable quiz discovery
- Registration, login, logout, HTTP-only JWT sessions
- Secure MongoDB-backed quiz attempts and server-side answer grading
- Attempt history and completed quiz views
- Daily challenges, duplicate reward prevention, streak tracking
- Dashboard statistics and weekly progress
- Public leaderboards and editable profiles

## Run locally

1. Install dependencies:

```powers
npm install
npm install --prefix backend
npm install --prefix frontend
npm install concurrently
```

2. Copy environment templates:

```powers
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

3. Put a MongoDB Atlas connection string and long JWT secret in `backend/.env`.

4. Seed sample quizzes:

```powers
npm run seed
```

5. Start both applications:

```powers
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000

## MongoDB Atlas

Create a database user and allow your network IP in MongoDB Atlas. Use the Atlas connection string in `MONGODB_URI`. The platform creates the required collections through Mongoose when requests are made. Transactions require a replica set or Atlas deployment.
