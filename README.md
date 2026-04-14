# Node.js + Express + PostgreSQL Application

A professional, production-ready template for building RESTful APIs with Node.js, Express, PostgreSQL, and Prisma ORM.

## Prerequisites

- Node.js >= 16.x
- PostgreSQL database (e.g. Supabase)
- npm >= 8.x

## Installation

```bash
npm install
```

## Configuration

1. Update `.env` with your `DATABASE_URL` for PostgreSQL (Supabase).
2. Set other environment variables as needed.
3. Run `npx prisma generate` and `npx prisma db push` to initialize the database schema.

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── routes/          # API routes
├── middleware/      # Custom middleware
├── validations/     # Input validation schemas
├── utils/           # Utility functions
└── server.js        # Application entry point
```

## Getting Started

1. Ensure your Supabase PostgreSQL project is running
2. Update `.env` with your `DATABASE_URL`
3. Push schema: `npx prisma db push`
4. Run: `npm run dev`
5. API available at `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check endpoint

## Middleware Stack

- Helmet: Security headers
- CORS: Cross-origin resource sharing
- Morgan: HTTP request logging
- Express: Web framework
- Prisma: PostgreSQL ORM

## License

MIT
