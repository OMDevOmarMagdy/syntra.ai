# Node.js + Express + MongoDB Application

A professional, production-ready template for building RESTful APIs with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js >= 16.x
- MongoDB >= 4.4 (local or Atlas)
- npm >= 8.x

## Installation

```bash
npm install
```

## Configuration

1. Update `.env` with your MongoDB connection string
2. Set other environment variables as needed

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
├── models/          # MongoDB models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── validations/     # Input validation schemas
├── utils/           # Utility functions
└── server.js        # Application entry point
```

## Getting Started

1. Ensure MongoDB is running
2. Update `.env` with your MongoDB URI
3. Run: `npm run dev`
4. API available at `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check endpoint

## Middleware Stack

- Helmet: Security headers
- CORS: Cross-origin resource sharing
- Morgan: HTTP request logging
- Express: Web framework
- Mongoose: MongoDB ODM

## License

MIT
