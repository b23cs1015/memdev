# MemDev

MemDev is a personal knowledge management application designed to help users capture, organize, search, and revisit useful information from the web.

The project consists of:

- A React web application
- A Node.js/Express backend API
- A PostgreSQL database accessed through Prisma ORM
- A planned Chrome browser extension for web clipping
- Planned OpenAI-powered summarization and AI-assisted organization

The project is being developed incrementally as a **resume/placement project**, with a focus on demonstrating practical full-stack development, backend architecture, database design, authentication, API development, browser extension integration, and AI integration.

The **SRS document is the source of truth for the intended product functionality**. Implementation is being done phase-by-phase, with every meaningful milestone tested and committed to Git.

---

# Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- Zod
- REST API
- ESLint
- dotenv
- bcryptjs
- jsonwebtoken
- googleapis

## Database

- PostgreSQL 18
- Prisma ORM 7.9.1
- Prisma Client
- `@prisma/adapter-pg`
- `pg`

## Testing

- Vitest
- Supertest
- `@types/supertest`

## Browser Extension

Planned:

- Chrome Manifest V3
- TypeScript

## AI

Planned:

- OpenAI API
- AI-powered summarization
- AI-generated tags

## Package Management

- pnpm
- pnpm workspaces

## Development Environment

- VS Code
- Git
- GitHub
- Windows

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
│   │   │   │   ├── google.ts
│   │   │   │   └── prisma.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── not-found.middleware.ts
│   │   │   ├── routes/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── notes.routes.ts
│   │   │   ├── generated/
│   │   │   │   └── prisma/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── tests/
│   │   │   └── auth.routes.test.ts
│   │   ├── prisma.config.ts
│   │   ├── vitest.config.ts
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

## Current Implementation Status

```text
Phase 1  — Project / Monorepo Setup        ✓
Phase 2  — Frontend Foundation             ✓
Phase 3  — Backend Foundation              ✓
Phase 4  — Backend Architecture            ✓
Phase 5  — PostgreSQL + Prisma             ✓
Phase 5I — Prisma Backend Integration      ✓
Phase 8  — Authentication                  ✓
Phase 9  — Notes CRUD API                  → Next
```

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

- Initialized the MemDev Git repository
- Configured pnpm workspaces
- Created the `apps/` structure
- Created the `packages/` structure
- Added `packages/shared`
- Added `packages/config`
- Added root `package.json`
- Added `pnpm-workspace.yaml`
- Added `pnpm-lock.yaml`
- Added `.env.example`
- Added repository-wide `.gitignore`
- Configured Git/GitHub workflow
- Removed `node_modules` from Git tracking
- Added initial README/project documentation

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

- React Router
- TanStack Query
- Lucide React

They provide the foundation for:

- Client-side routing
- Server-state/API management
- UI icons

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

The following commands pass:

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

- Node.js
- Express
- TypeScript
- Zod
- CORS
- dotenv
- ESLint

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
├── /auth
│   ├── /register
│   ├── /login
│   ├── /me
│   ├── /google
│   └── /google/callback
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

Current local configuration includes:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
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

The current database entities are:

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

## User

Stores application users.

Important fields:

```text
id
email
passwordHash
googleId
createdAt
updatedAt
```

`passwordHash` is nullable for users created exclusively through Google OAuth.

`googleId` is unique and nullable.

## Note

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

## Collection

Groups notes.

Important fields:

```text
id
userId
name
createdAt
updatedAt
```

## Tag

Stores user-specific tags.

Important fields:

```text
id
userId
name
createdAt
```

## NoteTag

Join table implementing the many-to-many relationship between notes and tags.

```text
noteId
tagId
```

## Migrations

The database has migrations for:

```text
Initial database schema
Google authentication fields
```

The Google authentication migration was created and successfully applied.

Example migration:

```text
20260809082050_add_google_auth
```

Migration status has been verified successfully.

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

The route queries PostgreSQL through Prisma.

Current flow:

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
GET  /api/health
GET  /api/notes

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/auth/google
GET  /api/auth/google/callback
```

## End-to-End Verification

The database-backed notes flow has been tested:

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

# Phase 8 — Authentication

Authentication is now implemented as a working backend milestone.

The current authentication implementation supports:

- Email/password registration
- Password hashing
- Email/password login
- JWT access tokens
- JWT verification middleware
- Current authenticated-user endpoint
- Google OAuth
- Google account linking
- Google-only accounts
- Authentication API tests

---

## Email/Password Registration

Endpoint:

```http
POST /api/auth/register
```

Flow:

```text
Request
  ↓
Validate email/password
  ↓
Normalize email
  ↓
Check existing user
  ↓
Hash password with bcryptjs
  ↓
Create User with Prisma
  ↓
Return safe user data
```

Registration validates:

```text
Valid email
Password >= 8 characters
```

Emails are normalized to lowercase.

Duplicate email addresses return:

```http
409 Conflict
```

Example safe response:

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "createdAt": "..."
  }
}
```

The password and password hash are never returned.

---

## Password Hashing

Passwords are hashed using:

```text
bcryptjs
```

The current implementation uses a bcrypt cost factor of:

```text
12
```

Plain-text passwords are never stored in the database.

---

## Email/Password Login

Endpoint:

```http
POST /api/auth/login
```

Flow:

```text
Request
  ↓
Validate credentials
  ↓
Normalize email
  ↓
Find user
  ↓
Verify password
  ↓
Generate JWT
  ↓
Return token + safe user
```

Invalid credentials return:

```json
{
  "message": "Invalid email or password"
}
```

Google-only accounts cannot authenticate through password login because their `passwordHash` is `null`.

---

## JWT Authentication

JWTs are generated using:

```text
jsonwebtoken
```

The token contains the authenticated user's ID.

JWT secret configuration is validated through the environment schema.

The current JWT expiry is:

```text
1 hour
```

The JWT secret must be at least 32 characters long.

---

## Authentication Middleware

Authentication middleware is located at:

```text
apps/backend/src/middleware/auth.middleware.ts
```

It expects:

```http
Authorization: Bearer <token>
```

The middleware:

```text
Read Authorization header
        ↓
Extract Bearer token
        ↓
Verify JWT
        ↓
Validate userId payload
        ↓
Attach authenticated user to request
        ↓
Continue to protected route
```

Invalid or expired tokens return:

```http
401 Unauthorized
```

---

## Current User API

Endpoint:

```http
GET /api/auth/me
```

Required header:

```http
Authorization: Bearer <JWT>
```

The endpoint returns the authenticated user's safe information:

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "createdAt": "..."
  }
}
```

The user's password hash is never exposed.

---

# Google OAuth

Google OAuth has been implemented using:

```text
googleapis
```

Google configuration is located at:

```text
apps/backend/src/config/google.ts
```

The backend environment configuration supports:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
```

## Google Authorization

Endpoint:

```http
GET /api/auth/google
```

The endpoint generates the Google authorization URL and redirects the browser to Google.

Requested scopes:

```text
openid
email
profile
```

## Google Callback

Endpoint:

```http
GET /api/auth/google/callback
```

The callback:

```text
Receive authorization code
        ↓
Exchange code for Google tokens
        ↓
Verify Google ID token
        ↓
Read Google account information
        ↓
Find existing Google user
        ↓
Fallback to existing email
        ↓
Link Google account when appropriate
        ↓
Create user when necessary
```

The Google identity is identified using:

```text
Google subject (sub)
```

and stored as:

```text
googleId
```

## Google Account Linking

If a Google account's email already exists as a normal MemDev user, the implementation can link the Google identity to that existing user.

If a matching Google account does not exist, a new user is created.

Google-only accounts have:

```text
passwordHash = null
googleId = <Google subject>
```

## Google OAuth Verification

Google OAuth has been manually verified locally.

The following flow was successfully tested:

```text
MemDev
  ↓
Google authorization
  ↓
Google callback
  ↓
Authorization successful
  ↓
User created / linked
  ↓
Same user ID returned through /me
```

Automated Google OAuth tests are not currently included because the OAuth provider interaction is external.

---

# Authentication Testing

Authentication API tests were added using:

```text
Vitest
Supertest
```

Test file:

```text
apps/backend/tests/auth.routes.test.ts
```

Vitest configuration:

```text
apps/backend/vitest.config.ts
```

The current automated authentication suite contains **9 passing tests**.

## Registration tests

```text
1. Rejects invalid email and short password
2. Creates a user with a hashed password
3. Rejects an existing email
```

## Login tests

```text
4. Rejects invalid login data
5. Rejects an unknown user
6. Logs in a user with valid credentials
7. Rejects a Google-only account using password login
```

## Current-user tests

```text
8. Rejects requests without authentication
9. Rejects an invalid JWT
```

Prisma is mocked during these tests so that authentication tests do not modify the development database.

## Authentication Validation

The following commands currently pass:

```bash
pnpm --filter @memdev/backend test
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

---

# Current System Architecture

The current working architecture is:

```text
                         MemDev
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
        React Web                   Express API
        localhost:5173              localhost:5000
             │                             │
             │                             ▼
             │                        API Routes
             │                             │
             │              ┌──────────────┴──────────────┐
             │              │                             │
             │              ▼                             ▼
             │       Authentication                    Notes
             │              │                             │
             │              └──────────────┬──────────────┘
             │                             │
             │                             ▼
             │                       Prisma Client
             │                             │
             │                         PrismaPg
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

- [x] React application
- [x] TypeScript
- [x] Vite
- [x] Tailwind CSS
- [x] React Router
- [x] TanStack Query
- [x] Lucide React
- [x] Landing page
- [x] Login page foundation
- [x] Register page foundation
- [x] Dashboard page foundation
- [x] Frontend build
- [x] Frontend lint

## Backend

- [x] Express server
- [x] TypeScript
- [x] CORS
- [x] Zod environment validation
- [x] API routing
- [x] Health endpoint
- [x] 404 handling
- [x] Centralized error handling
- [x] dotenv
- [x] Backend build
- [x] Backend lint
- [x] User registration API
- [x] Registration validation
- [x] Password hashing with bcryptjs
- [x] User login API
- [x] JWT access-token generation
- [x] JWT authentication middleware
- [x] Current-user endpoint
- [x] Google OAuth
- [x] Google account linking
- [x] Authentication API tests

## Database

- [x] PostgreSQL 18.3
- [x] Local `memdev` database
- [x] Prisma 7.9.1
- [x] Prisma Client
- [x] PostgreSQL Prisma adapter
- [x] Prisma configuration
- [x] Database schema
- [x] Initial migration
- [x] Google authentication migration
- [x] Database migration verification
- [x] Generated Prisma Client
- [x] Database-backed Notes route

## Git

- [x] Git repository
- [x] GitHub remote
- [x] Meaningful incremental commits
- [x] `node_modules` excluded from Git
- [x] Environment secrets excluded from Git
- [x] Milestones pushed to GitHub

---

# Not Implemented Yet

## Authentication

- [x] User registration
- [x] Password hashing
- [x] User login
- [x] JWT access tokens
- [x] JWT verification middleware
- [x] Current-user endpoint
- [x] Google OAuth
- [x] Google account linking
- [x] Authentication API tests
- [ ] Logout/token invalidation
- [ ] Frontend authentication state
- [ ] Frontend login/register integration
- [ ] Full user-specific data isolation across all protected resources

## Notes

- [ ] Create note
- [ ] Read note details
- [ ] Update note
- [ ] Delete note
- [ ] Favorite note
- [ ] Archive note
- [ ] Restore archived note
- [ ] Trash/delete workflow
- [ ] Source URL support in UI
- [ ] Summary support in UI
- [ ] User ownership enforcement for every note operation
- [ ] Notes API tests

## Collections

- [ ] Create collection
- [ ] Rename collection
- [ ] Delete collection
- [ ] Assign notes to collections
- [ ] Filter notes by collection

## Tags

- [ ] Create tags
- [ ] Assign tags to notes
- [ ] Remove tags
- [ ] Filter by tags
- [ ] Tag management UI

## Search

- [ ] Keyword search
- [ ] Search API
- [ ] Search UI
- [ ] Collection filtering
- [ ] Tag filtering
- [ ] Favorite filtering
- [ ] Archived filtering

## Dashboard

- [ ] Total notes statistic
- [ ] Favorite count
- [ ] Collection count
- [ ] Recent notes
- [ ] Recent activity
- [ ] Dashboard data API
- [ ] Dashboard UI integration

## Browser Extension

- [ ] Chrome Manifest V3 setup
- [ ] Extension popup
- [ ] Save current webpage
- [ ] Capture page title
- [ ] Capture source URL
- [ ] Capture selected text/content
- [ ] Send captured data to backend
- [ ] Extension authentication

## AI

- [ ] OpenAI integration
- [ ] Automatic note summarization
- [ ] AI-generated tags
- [ ] AI-assisted organization
- [ ] AI error handling
- [ ] AI usage controls

## Testing

- [x] Authentication API tests
- [ ] Notes API tests
- [ ] Collections API tests
- [ ] Tags API tests
- [ ] Database tests
- [ ] Frontend tests
- [ ] End-to-end tests
- [ ] Automated Google OAuth tests

## Deployment

- [ ] Production environment configuration
- [ ] Production PostgreSQL
- [ ] Backend deployment
- [ ] Frontend deployment
- [ ] Extension packaging
- [ ] Production OpenAI configuration

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
8.  Authentication                       ✓
9.  Notes CRUD                            → Next
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

The repository is currently being developed on:

```text
main
```

with changes pushed to GitHub after each meaningful milestone.

To inspect the latest history:

```bash
git log --oneline -n 15
```

The original project milestones include:

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

Authentication and testing milestones were subsequently added after these commits.

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
JWT_SECRET="<at-least-32-character-secret>"
GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

The actual password and OAuth credentials must never be committed.

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

## Development server

```bash
pnpm --filter @memdev/backend dev
```

## Build

```bash
pnpm --filter @memdev/backend build
```

## Lint

```bash
pnpm --filter @memdev/backend lint
```

## Tests

```bash
pnpm --filter @memdev/backend test
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
feat: add authentication
feat: add google oauth
test: add authentication API tests
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
Create Note
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
List Notes
```

## 2. Test before committing

At minimum, backend changes should pass:

```bash
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
pnpm --filter @memdev/backend test
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
Google OAuth secrets
OpenAI API keys
```

## 4. Preserve working functionality

When adding a new feature, make sure existing endpoints and functionality continue working.

At minimum, keep checking:

```text
GET /api/health
GET /api/notes
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

## 5. Enforce user ownership

All authenticated user resources must be scoped to the authenticated user's ID.

For Notes this means:

```text
JWT
 ↓
Authenticated user ID
 ↓
Note query/create/update/delete
 ↓
Only that user's notes
```

Never allow a user to access another user's notes simply by knowing a note ID.

## 6. Keep the architecture understandable

The project is primarily intended to demonstrate strong software-development fundamentals.

Avoid unnecessary:

- Microservices
- Kubernetes
- Complex infrastructure
- Distributed systems
- Premature scalability work
- Enterprise-level abstractions

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

## Current Checkpoint

The project is currently at:

```text
Phase 8 — Authentication
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
   ↓
Registration
   ↓
Password Hashing
   ↓
Login
   ↓
JWT Authentication
   ↓
Authentication Middleware
   ↓
Current User
   ↓
Google OAuth
   ↓
Google Account Linking
   ↓
Authentication API Tests
```

The next implementation milestone is:

```text
Phase 9 — Notes CRUD API
```

Starting with:

```text
Authenticated User
       ↓
POST /api/notes
       ↓
Validate note data
       ↓
Create note with userId
       ↓
Persist with Prisma
       ↓
Return safe note data
```

The authentication milestone has been implemented, tested, committed, and pushed before Phase 9 begins.

---

# Phase 9 — Notes CRUD API

The next development phase is the Notes CRUD backend.

The Note model already exists in Prisma.

The implementation should build on the existing authentication middleware.

## Phase 9 Goals

```text
Create Note
     ↓
List User Notes
     ↓
Get Note
     ↓
Update Note
     ↓
Delete / Trash Note
     ↓
Restore Note
     ↓
Favorite Note
     ↓
Archive Note
```

The most important rule is user isolation:

```text
Authenticated User A
        ↓
Can access only User A's notes

Authenticated User B
        ↓
Can access only User B's notes
```

The first milestone should be:

```text
POST /api/notes
```

with validation for:

```text
title
content
sourceUrl
collectionId
```

where optional fields remain optional according to the Prisma schema.

The route should obtain the authenticated user's ID from the existing authentication middleware rather than accepting `userId` from the client.

The implementation should be followed by:

```text
Build
   ↓
Lint
   ↓
API test
   ↓
User-isolation test
   ↓
Git commit
   ↓
Git push
```

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