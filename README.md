# MemDev

MemDev is a personal knowledge management application designed to help users capture, organize, search, and revisit useful information from the web.

The project consists of a web application, backend API, and Chrome browser extension, with PostgreSQL/Prisma planned as the persistence layer and OpenAI planned for AI-powered summarization.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* TanStack Query
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* Zod
* REST API
* ESLint

### Database

* PostgreSQL
* Prisma ORM

### Browser Extension

* Chrome Manifest V3
* TypeScript

### AI

* OpenAI API

---

## Project Structure

```text
memdev/
├── apps/
│   ├── web/                 # React web application
│   ├── backend/             # Express REST API
│   └── extension/           # Chrome browser extension
│
├── packages/
│   ├── shared/              # Shared types and utilities
│   └── config/              # Shared configuration
│
├── prisma/                  # Prisma schema and database configuration
├── docs/                    # Project documentation
│
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

---

# Development Progress

The project is being developed incrementally using a pnpm monorepo. Each meaningful development milestone is committed to Git and pushed to GitHub.

## Phase 1 — Project Setup

### Completed

* Initialized the MemDev monorepo
* Configured pnpm workspaces
* Created the `apps/` and `packages/` structure
* Added shared and config workspace packages
* Added root environment variable template
* Added repository-wide `.gitignore`
* Added initial project documentation
* Configured Git and GitHub repository workflow
* Ensured `node_modules` is excluded from Git tracking

### Git milestones

```text
chore: initialize MemDev monorepo
chore: stop tracking node_modules
```

---

# Phase 2 — Frontend Foundation

## React + TypeScript + Vite

The web application was scaffolded using Vite with React and TypeScript.

Location:

```text
apps/web/
```

The frontend currently includes:

* React 19
* TypeScript
* Vite
* ESLint

The application successfully runs locally at:

```text
http://localhost:5173
```

## Tailwind CSS

Tailwind CSS was integrated using the Vite plugin.

The current frontend styling pipeline is:

```text
React
  ↓
Vite
  ↓
Tailwind CSS
```

A basic MemDev landing screen has been created to verify that Tailwind is working correctly.

## Frontend Dependencies

The following libraries have been added:

* React Router
* TanStack Query
* Lucide React

These provide the foundation for:

* Client-side routing
* Server-state/API management
* UI icons

## Frontend Routing

The initial application routes are implemented:

```text
/
├── /login
├── /register
└── /dashboard
```

Current pages:

```text
apps/web/src/pages/
├── Landing/
├── Login/
├── Register/
└── Dashboard/
```

The application is configured with:

```text
BrowserRouter
      ↓
QueryClientProvider
      ↓
App
      ↓
React Router
```

### Frontend validation

The following checks currently pass:

```bash
pnpm --filter web build
pnpm --filter web lint
```

### Git milestones

```text
chore: setup React frontend
feat: configure frontend dependencies
feat: add frontend routing foundation
```

---

# Phase 3 — Backend Foundation

## Express + TypeScript

The backend was created from scratch using:

* Node.js
* Express
* TypeScript
* Zod
* CORS
* ESLint

Location:

```text
apps/backend/
```

Current backend structure:

```text
apps/backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
│
├── eslint.config.js
├── package.json
└── tsconfig.json
```

## Health API

The backend currently exposes:

```http
GET /api/health
```

Running locally at:

```text
http://localhost:5000
```

Example response:

```json
{
  "status": "ok",
  "service": "memdev-backend"
}
```

The endpoint has been tested successfully.

## Backend Architecture

The backend now has separate areas for:

```text
config/
middleware/
routes/
```

The current request flow is:

```text
HTTP Request
     ↓
Express
     ↓
CORS / JSON middleware
     ↓
/api router
     ↓
Route handler
     ↓
Response
```

## Error Handling

A centralized error handler has been added.

Unknown routes return:

```http
404 Not Found
```

with a response structure:

```json
{
  "success": false,
  "message": "Route not found"
}
```

The backend also contains a centralized internal error handler for unexpected server errors.

## Environment Configuration

Backend configuration is validated using Zod.

Current local configuration includes:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Environment files containing secrets are excluded from Git.

## Backend validation

The following checks currently pass:

```bash
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

The backend also successfully starts using:

```bash
pnpm --filter @memdev/backend dev
```

### Git milestones

```text
feat: setup backend foundation
feat: add backend architecture
```

---

# Current System Status

At this point, the project has a working frontend and backend foundation:

```text
                 MemDev
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      React Web          Express API
      :5173                :5000
          │                   │
          │                   │
          └─────── Future ────┘
                    │
                    ▼
               PostgreSQL
                    │
                  Prisma
```

### Currently working

* [x] pnpm monorepo
* [x] React + TypeScript + Vite
* [x] Tailwind CSS
* [x] React Router
* [x] TanStack Query
* [x] Lucide React
* [x] Frontend routes
* [x] Express backend
* [x] TypeScript backend build
* [x] Backend ESLint
* [x] CORS configuration
* [x] Environment validation
* [x] API routing
* [x] Health-check endpoint
* [x] 404 handling
* [x] Centralized error handling
* [x] Git/GitHub development workflow

### Not implemented yet

* [ ] PostgreSQL database
* [ ] Prisma ORM integration
* [ ] Database schema
* [ ] User registration
* [ ] User login
* [ ] JWT authentication
* [ ] Notes CRUD
* [ ] Collections
* [ ] Tags
* [ ] Search
* [ ] Favorites
* [ ] Archive/trash
* [ ] Dashboard statistics
* [ ] Chrome extension functionality
* [ ] Web clipping
* [ ] OpenAI summarization
* [ ] AI-generated tags
* [ ] Production deployment
* [ ] Automated tests

---

# Development Roadmap

The remaining implementation will proceed incrementally:

```text
1. Project / Monorepo Setup                 ✓
2. Frontend Foundation                      ✓
3. Backend Foundation                      ✓
4. Backend Architecture                    ✓
5. PostgreSQL + Prisma                     → Next
6. Database Schema
7. Authentication
8. Notes CRUD
9. Collections & Tags
10. Search & Filtering
11. Dashboard Statistics
12. Frontend Authentication
13. Dashboard & Notes UI
14. Chrome Extension
15. OpenAI Integration
16. UI Polish
17. Testing
18. Deployment
19. Documentation & Resume Polish
```

Each major milestone will be tested locally and committed to Git before moving to the next stage.

---

## Local Development

### Start the frontend

```bash
pnpm --filter web dev
```

Frontend:

```text
http://localhost:5173
```

### Start the backend

```bash
pnpm --filter @memdev/backend dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Build the frontend

```bash
pnpm --filter web build
```

### Lint the frontend

```bash
pnpm --filter web lint
```

### Build the backend

```bash
pnpm --filter @memdev/backend build
```

### Lint the backend

```bash
pnpm --filter @memdev/backend lint
```

---

## Git Development Workflow

The project uses meaningful incremental commits.

Example:

```text
chore: initialize MemDev monorepo
chore: stop tracking node_modules
chore: setup React frontend
feat: configure frontend dependencies
feat: add frontend routing foundation
feat: setup backend foundation
feat: add backend architecture
```

Future commits will follow the same convention as functionality is implemented.
