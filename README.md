# MemDev

MemDev is a personal knowledge management application designed to help users capture, organize, search, and revisit useful information from the web.

The project consists of:

* A React web application
* A Node.js/Express backend API
* A PostgreSQL database accessed through Prisma ORM
* A planned Chrome browser extension for web clipping
* Planned OpenAI-powered summarization and AI-assisted organization

The project is being developed incrementally as a **resume/placement project**, with a focus on demonstrating practical full-stack development, backend architecture, database design, authentication, API development, browser extension integration, and AI integration.

The **SRS document is the source of truth for the intended product functionality**. Implementation is being done phase-by-phase, with every meaningful milestone tested and committed to Git.

---

# Tech Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router
* TanStack Query
* Lucide React

## Backend

* Node.js
* Express
* TypeScript
* Zod
* REST API
* ESLint
* dotenv

## Database

* PostgreSQL 18
* Prisma ORM 7.9.1
* Prisma Client
* `@prisma/adapter-pg`
* `pg`

## Browser Extension

Planned:

* Chrome Manifest V3
* TypeScript

## AI

Planned:

* OpenAI API
* AI-powered summarization
* AI-generated tags

## Package Management

* pnpm
* pnpm workspaces

## Development Environment

* VS Code
* Git
* GitHub
* Windows

---

# Project Structure

Current monorepo structure:

```text
memdev/
├── apps/
│   ├── web/                         # React web application
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Landing/
│   │   │   │   ├── Login/
│   │   │   │   ├── Register/
│   │   │   │   └── Dashboard/
│   │   │   └── ...
│   │   ├── package.json
│   │   └── ...
│   │
│   ├── backend/                     # Express REST API
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   │
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── env.ts
│   │   │   │   └── prisma.ts
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   │   ├── index.ts
│   │   │   │   └── notes.routes.ts
│   │   │   ├── generated/
│   │   │   │   └── prisma/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── prisma.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── extension/                   # Chrome extension - planned
│
├── packages/
│   ├── shared/                      # Shared types/utilities
│   └── config/                      # Shared configuration
│
├── docs/                            # Project documentation - planned/optional
│
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

> Note: Prisma configuration and migrations currently live inside `apps/backend/prisma/`, because the database belongs to the backend application.

---

# Development Progress

The project is being developed incrementally using a pnpm monorepo.

Every meaningful milestone is:

1. Implemented
2. Tested locally
3. Validated with build/lint checks
4. Committed to Git
5. Pushed to GitHub

This provides a clear development history and makes the project easy to continue from another development environment or another ChatGPT conversation.

---

# Phase 1 — Project / Monorepo Setup

## Completed

* Initialized the MemDev Git repository
* Configured pnpm workspaces
* Created the `apps/` structure
* Created the `packages/` structure
* Added `packages/shared`
* Added `packages/config`
* Added root `package.json`
* Added `pnpm-workspace.yaml`
* Added `pnpm-lock.yaml`
* Added `.env.example`
* Added repository-wide `.gitignore`
* Configured Git/GitHub workflow
* Removed `node_modules` from Git tracking
* Added initial README/project documentation

## Git milestones

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

Current frontend stack:

```text
React
TypeScript
Vite
ESLint
```

The application runs locally at:

```text
http://localhost:5173
```

## Tailwind CSS

Tailwind CSS was integrated using the Vite plugin.

Current styling pipeline:

```text
React
  ↓
Vite
  ↓
Tailwind CSS
```

A basic MemDev landing screen was created to verify the frontend and styling pipeline.

## Frontend Dependencies

The following libraries have been installed:

* React Router
* TanStack Query
* Lucide React

They provide the foundation for:

* Client-side routing
* Server-state/API management
* UI icons

## Frontend Routing

The initial routes are:

```text
/
├── /login
├── /register
└── /dashboard
```

Current page structure:

```text
apps/web/src/pages/
├── Landing/
├── Login/
├── Register/
└── Dashboard/
```

The application provider structure is:

```text
BrowserRouter
      ↓
QueryClientProvider
      ↓
App
      ↓
React Router
```

## Frontend Validation

The following commands currently pass:

```bash
pnpm --filter web build
pnpm --filter web lint
```

## Git milestones

```text
chore: setup React frontend
feat: configure frontend dependencies
feat: add frontend routing foundation
```

---

# Phase 3 — Backend Foundation

## Express + TypeScript

The backend was created using:

* Node.js
* Express
* TypeScript
* Zod
* CORS
* dotenv
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
├── prisma/
├── prisma.config.ts
├── eslint.config.js
├── package.json
└── tsconfig.json
```

---

# Phase 4 — Backend Architecture

## API Routing

The backend has a centralized API router.

Current API structure:

```text
/api
├── /health
└── /notes
```

## Health API

The backend exposes:

```http
GET /api/health
```

Running locally at:

```text
http://localhost:5000/api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "memdev-backend"
}
```

The endpoint has been successfully tested.

## Error Handling

A centralized error-handling middleware has been implemented.

Unknown routes return:

```http
404 Not Found
```

with a response structure similar to:

```json
{
  "success": false,
  "message": "Route not found"
}
```

Unexpected server errors are handled through the centralized error middleware.

## Environment Configuration

Backend environment configuration is validated using Zod.

Current local configuration:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=...
```

The actual `.env` file is ignored by Git and must never be committed.

## Backend Validation

The following checks pass:

```bash
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

The backend successfully runs using:

```bash
pnpm --filter @memdev/backend dev
```

## Git milestones

```text
feat: setup backend foundation
feat: add backend architecture
```

---

# Phase 5 — PostgreSQL + Prisma

## PostgreSQL

PostgreSQL is now fully installed and configured locally.

Current development database:

```text
PostgreSQL: 18.3
Host:       localhost
Port:       5432
Database:   memdev
User:       postgres
```

The PostgreSQL Windows service is:

```text
postgresql-x64-18
```

The service has been verified as running.

The PostgreSQL client is located at:

```text
C:\Program Files\PostgreSQL\18\bin\psql.exe
```

## Database Connection

The backend uses a local PostgreSQL connection through:

```env
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/memdev?schema=public"
```

The actual password is stored only in the local `.env` file.

It must never be committed to Git.

## Prisma

Prisma 7.9.1 is installed and working.

Current versions:

```text
Prisma:         7.9.1
@prisma/client: 7.9.1
Node.js:        24.14.0
TypeScript:     6.0.3
```

Prisma uses the PostgreSQL adapter:

```text
@prisma/adapter-pg
```

and:

```text
pg
```

## Prisma Configuration

Prisma configuration is located at:

```text
apps/backend/prisma.config.ts
```

The Prisma schema is located at:

```text
apps/backend/prisma/schema.prisma
```

Generated Prisma Client is located at:

```text
apps/backend/src/generated/prisma/
```

The project uses the Prisma 7 configuration style where the database URL is configured through `prisma.config.ts`.

## Database Schema

The initial database entities are:

```text
User
Note
Collection
Tag
NoteTag
```

Current relationship structure:

```text
User
 ├── Notes
 ├── Collections
 └── Tags

Collection
 └── Notes

Note
 └── NoteTags

Tag
 └── NoteTags

NoteTag
 └── Note + Tag
```

### User

Stores application users.

Important fields:

```text
id
email
passwordHash
createdAt
updatedAt
```

### Note

Stores knowledge-base notes.

Important fields:

```text
id
userId
collectionId
title
content
sourceUrl
summary
isFavorite
isArchived
createdAt
updatedAt
```

### Collection

Groups notes.

Important fields:

```text
id
userId
name
createdAt
updatedAt
```

### Tag

Stores user-specific tags.

Important fields:

```text
id
userId
name
createdAt
```

### NoteTag

Join table implementing the many-to-many relationship between notes and tags.

```text
noteId
tagId
```

## Migration

The initial Prisma migration has been created and successfully applied.

Migration status:

```text
Database schema is up to date!
```

Current PostgreSQL tables:

```text
Collection
Note
NoteTag
Tag
User
_prisma_migrations
```

`_prisma_migrations` is Prisma's internal migration tracking table.

## Prisma Validation

The following commands pass:

```bash
pnpm --filter @memdev/backend exec prisma validate
pnpm --filter @memdev/backend exec prisma generate
pnpm --filter @memdev/backend exec prisma migrate status
```

## Git milestone

```text
feat: add initial database schema
```

---

# Phase 5I — Prisma Backend Integration

Prisma is now integrated into the Express backend.

## Prisma Client

A reusable Prisma Client instance is configured at:

```text
apps/backend/src/config/prisma.ts
```

The current architecture uses:

```text
DATABASE_URL
      ↓
PrismaPg adapter
      ↓
PrismaClient
      ↓
PostgreSQL
```

## Database-backed Notes API

The first database-backed API has been implemented:

```http
GET /api/notes
```

The route queries PostgreSQL through Prisma:

```text
GET /api/notes
      ↓
Express
      ↓
notes.routes.ts
      ↓
Prisma Client
      ↓
Note table
      ↓
PostgreSQL
```

Because there are currently no notes in the database, the endpoint returns:

```json
{
  "notes": []
}
```

This endpoint has been tested successfully.

## Current Backend API

```text
GET /api/health
GET /api/notes
```

## End-to-End Verification

The following complete flow has been successfully tested:

```text
HTTP Request
     ↓
Express
     ↓
API Route
     ↓
Prisma Client
     ↓
PrismaPg Adapter
     ↓
PostgreSQL
     ↓
Note table
```

## Git milestone

```text
feat: integrate prisma withbackend
```

Note: The commit message contains a minor spacing typo (`withbackend`). The commit is intentionally left unchanged because it has already been pushed to GitHub.

---

# Current System Architecture

The current working architecture is:

```text
                         MemDev
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
        React Web                    Express API
        localhost:5173               localhost:5000
             │                             │
             │                             ▼
             │                       API Routes
             │                             │
             │                             ▼
             │                       Prisma Client
             │                             │
             │                        PrismaPg
             │                             │
             │                             ▼
             │                       PostgreSQL 18
             │                             │
             │                         memdev DB
             │
             └──────── Future integration ────────┐
                                                  │
                                                  ▼
                                           Chrome Extension
                                                  │
                                                  ▼
                                           Web Clipping
                                                  │
                                                  ▼
                                            Backend API

Future:

Backend
   ↓
OpenAI API
   ↓
Summarization / AI Tags
```

---

# Current Working Features

## Frontend

* [x] React application
* [x] TypeScript
* [x] Vite
* [x] Tailwind CSS
* [x] React Router
* [x] TanStack Query
* [x] Lucide React
* [x] Landing page
* [x] Login page foundation
* [x] Register page foundation
* [x] Dashboard page foundation
* [x] Frontend build
* [x] Frontend lint

## Backend

* [x] Express server
* [x] TypeScript
* [x] CORS
* [x] Zod environment validation
* [x] API routing
* [x] Health endpoint
* [x] 404 handling
* [x] Centralized error handling
* [x] dotenv
* [x] Backend build
* [x] Backend lint

## Database

* [x] PostgreSQL 18.3
* [x] Local `memdev` database
* [x] Prisma 7.9.1
* [x] Prisma Client
* [x] PostgreSQL Prisma adapter
* [x] Prisma configuration
* [x] Database schema
* [x] Initial migration
* [x] Database migration verification
* [x] Generated Prisma Client
* [x] Database-backed Notes route

## Git

* [x] Git repository
* [x] GitHub remote
* [x] Meaningful incremental commits
* [x] `node_modules` excluded from Git
* [x] Environment secrets excluded from Git
* [x] Milestones pushed to GitHub

---

# Not Implemented Yet

The following functionality is still pending:

## Authentication

* [ ] User registration
* [ ] Password hashing
* [ ] User login
* [ ] JWT access tokens
* [ ] JWT verification middleware
* [ ] Protected routes
* [ ] Logout/token invalidation
* [ ] User-specific data isolation

## Notes

* [ ] Create note
* [ ] Read note details
* [ ] Update note
* [ ] Delete note
* [ ] Favorite note
* [ ] Archive note
* [ ] Restore archived note
* [ ] Trash/delete workflow
* [ ] Source URL support in UI
* [ ] Summary support in UI

## Collections

* [ ] Create collection
* [ ] Rename collection
* [ ] Delete collection
* [ ] Assign notes to collections
* [ ] Filter notes by collection

## Tags

* [ ] Create tags
* [ ] Assign tags to notes
* [ ] Remove tags
* [ ] Filter by tags
* [ ] Tag management UI

## Search

* [ ] Keyword search
* [ ] Search API
* [ ] Search UI
* [ ] Collection filtering
* [ ] Tag filtering
* [ ] Favorite filtering
* [ ] Archived filtering

## Dashboard

* [ ] Total notes statistic
* [ ] Favorite count
* [ ] Collection count
* [ ] Recent notes
* [ ] Recent activity
* [ ] Dashboard data API
* [ ] Dashboard UI integration

## Browser Extension

* [ ] Chrome Manifest V3 setup
* [ ] Extension popup
* [ ] Save current webpage
* [ ] Capture page title
* [ ] Capture source URL
* [ ] Capture selected text/content
* [ ] Send captured data to backend
* [ ] Extension authentication

## AI

* [ ] OpenAI integration
* [ ] Automatic note summarization
* [ ] AI-generated tags
* [ ] AI-assisted organization
* [ ] AI error handling
* [ ] AI usage controls

## Testing

* [ ] Backend unit tests
* [ ] API integration tests
* [ ] Authentication tests
* [ ] Database tests
* [ ] Frontend tests
* [ ] End-to-end tests

## Deployment

* [ ] Production environment configuration
* [ ] Production PostgreSQL
* [ ] Backend deployment
* [ ] Frontend deployment
* [ ] Extension packaging
* [ ] Production OpenAI configuration

---

# Development Roadmap

The project is intentionally being implemented incrementally.

```text
1.  Project / Monorepo Setup             ✓
2.  Frontend Foundation                  ✓
3.  Backend Foundation                   ✓
4.  Backend Architecture                 ✓
5.  PostgreSQL + Prisma                  ✓
6.  Database Schema                      ✓
7.  Prisma Backend Integration           ✓
8.  Authentication                       → Next
9.  Notes CRUD
10. Collections
11. Tags
12. Search & Filtering
13. Dashboard Statistics
14. Frontend Authentication
15. Dashboard & Notes UI
16. Chrome Extension
17. Web Clipping
18. OpenAI Integration
19. AI Summarization
20. AI-generated Tags
21. UI Polish
22. Testing
23. Deployment
24. Documentation & Resume Polish
```

Every major milestone should be:

```text
Implement
   ↓
Build
   ↓
Lint
   ↓
Run/Test locally
   ↓
Debug if necessary
   ↓
Git commit
   ↓
Git push
   ↓
Move to next milestone
```

---

# Current Git History

Recent commits:

```text
4d61c97  feat: integrate prisma withbackend
95af049  feat: add initial database schema
46395b0  docs: update project progress
2bcb982  feat: add backend architecture
ea9e3cf  feat: setup backend foundation
ea50ea5  feat: add frontend routing foundation
0b18921  feat: configure frontend dependencies
cd6ccf6  chore: setup React frontend
3952aa9  chore: stop tracking node_modules
3678fb2  chore: initialize MemDev monorepo
736ae1e  restarting project
```

The repository is currently being developed on:

```text
main
```

with changes pushed to GitHub after each meaningful milestone.

---

# Environment Configuration

## Root

The repository contains:

```text
.env.example
```

## Backend

The actual local backend environment file is:

```text
apps/backend/.env
```

Example structure:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/memdev?schema=public"
```

The actual password must never be committed.

The `.env` file must remain ignored by Git.

---

# Local Development

## Install dependencies

From the project root:

```bash
pnpm install
```

---

## Start frontend

```bash
pnpm --filter web dev
```

Frontend:

```text
http://localhost:5173
```

---

## Start backend

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

---

# Backend Commands

## Build

```bash
pnpm --filter @memdev/backend build
```

## Lint

```bash
pnpm --filter @memdev/backend lint
```

## Development server

```bash
pnpm --filter @memdev/backend dev
```

---

# Frontend Commands

## Development server

```bash
pnpm --filter web dev
```

## Build

```bash
pnpm --filter web build
```

## Lint

```bash
pnpm --filter web lint
```

---

# Prisma Commands

## Validate schema

```bash
pnpm --filter @memdev/backend exec prisma validate
```

## Generate Prisma Client

```bash
pnpm --filter @memdev/backend exec prisma generate
```

## Check migration status

```bash
pnpm --filter @memdev/backend exec prisma migrate status
```

## Create/apply development migration

```bash
pnpm --filter @memdev/backend exec prisma migrate dev --name <migration-name>
```

## Prisma Studio

```bash
pnpm --filter @memdev/backend exec prisma studio
```

---

# PostgreSQL

PostgreSQL is installed locally as:

```text
PostgreSQL 18.3
```

Windows service:

```text
postgresql-x64-18
```

Database:

```text
memdev
```

Host:

```text
127.0.0.1
```

Port:

```text
5432
```

Example connection:

```bash
psql -U postgres -h 127.0.0.1 -d memdev
```

On this Windows development machine, the PostgreSQL client may need to be invoked using:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1 -d memdev
```

---

# Git Development Workflow

The project uses meaningful incremental commits.

The preferred commit style is:

```text
chore: ...
feat: ...
fix: ...
refactor: ...
docs: ...
test: ...
```

Examples:

```text
chore: initialize MemDev monorepo
chore: stop tracking node_modules
chore: setup React frontend
feat: configure frontend dependencies
feat: add frontend routing foundation
feat: setup backend foundation
feat: add backend architecture
feat: add initial database schema
feat: integrate prisma withbackend
```

Before each milestone:

```bash
git status
```

After implementation and successful validation:

```bash
git add <relevant-files>
git commit -m "<meaningful message>"
git push
```

Avoid committing:

```text
node_modules/
.env
generated secrets
local credentials
```

---

# Important Development Rules

## 1. Build incrementally

Do not implement the entire application at once.

Each feature should be developed as a small, testable milestone.

Example:

```text
Registration
    ↓
Build
    ↓
Lint
    ↓
Test API
    ↓
Fix errors
    ↓
Commit
    ↓
Login
```

## 2. Test before committing

At minimum, backend changes should pass:

```bash
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

Frontend changes should pass:

```bash
pnpm --filter web build
pnpm --filter web lint
```

Database changes should be verified with:

```bash
pnpm --filter @memdev/backend exec prisma validate
pnpm --filter @memdev/backend exec prisma migrate status
```

## 3. Do not expose secrets

Never commit:

```text
.env
DATABASE_URL with password
JWT secrets
OpenAI API keys
```

## 4. Preserve working functionality

When adding a new feature, make sure existing endpoints and functionality continue working.

At minimum, keep checking:

```text
GET /api/health
GET /api/notes
```

## 5. Keep the architecture understandable

The project is primarily intended to demonstrate strong software-development fundamentals.

Avoid unnecessary:

* Microservices
* Kubernetes
* Complex infrastructure
* Distributed systems
* Premature scalability work
* Enterprise-level abstractions

Prefer a clean, understandable monolithic backend with clear separation of concerns.

---

# How to Continue This Project in a New Chat

If continuing development in a new ChatGPT conversation, provide:

1. This `README.md`
2. The project SRS document
3. The current Git status/log if necessary
4. Any relevant error output

The new conversation should treat:

```text
README.md
+
SRS
+
current source code
```

as the project context.

## Current checkpoint

The project is currently at:

```text
Phase 7 — Prisma Backend Integration
```

Completed:

```text
Monorepo
   ↓
Frontend
   ↓
Backend
   ↓
PostgreSQL
   ↓
Prisma
   ↓
Database Schema
   ↓
Prisma Backend Integration
```

The next implementation milestone is:

```text
Phase 8 — Authentication
```

Starting with:

```text
User Registration
       ↓
Password Hashing
       ↓
User Creation
       ↓
Login
       ↓
JWT Access Token
       ↓
Authentication Middleware
       ↓
Protected Routes
```

The next Git milestone should be created after the authentication feature is implemented and tested.

---

# Project Goal

The final MemDev application should allow a user to:

```text
Capture information
        ↓
Save it as a note
        ↓
Organize with collections/tags
        ↓
Search and filter knowledge
        ↓
Favorite/archive information
        ↓
Revisit saved knowledge
        ↓
Use AI for summaries and organization
        ↓
Capture information directly from the browser
```

The project should remain focused on delivering a polished, functional full-stack demonstration suitable for a software-development resume and placement portfolio.
