````markdown
# MemDev

MemDev is a personal knowledge management application designed to help users capture, organize, search, and revisit useful information from the web.

The project is being developed as a **resume/placement project**, with the primary goal of demonstrating practical full-stack software development skills through a clean, functional, well-tested application.

The project focuses on:

- Full-stack development
- REST API design
- Authentication and authorization
- PostgreSQL database design
- Prisma ORM
- User-level data isolation
- Notes and knowledge management
- Collections and tags
- Search and filtering
- Dashboard analytics
- Browser-based knowledge capture
- AI-assisted knowledge organization

The project is being developed incrementally in phases. Each meaningful backend milestone is implemented, automatically tested, built, linted, committed, and pushed before moving forward.

The **SRS document is the source of truth for the intended product**, while this README represents the current implementation status.

---

# Project Status

## Current Phase

**Phase 12 — Search & Filtering**

Completed phases:

```text
Phase 1   — Project / Monorepo Setup        ✓
Phase 2   — Frontend Foundation             ✓
Phase 3   — Backend Foundation              ✓
Phase 4   — Backend Architecture            ✓
Phase 5   — PostgreSQL + Prisma             ✓
Phase 5I  — Prisma Backend Integration      ✓
Phase 8   — Authentication                  ✓
Phase 9   — Notes CRUD API                  ✓
Phase 10  — Collections API                 ✓
Phase 11  — Tags API                        ✓
Phase 12  — Search & Filtering              ✓
````

Next:

```text
Phase 13  — Dashboard Statistics            → Next
```

The backend currently has working APIs for:

```text
Authentication
Notes
Collections
Tags
Search
Filtering
```

Automated backend tests are passing.

---

# Project Goal

The final MemDev workflow is intended to look like:

```text
Capture information
        ↓
Save as a note
        ↓
Organize with collections
        ↓
Add tags
        ↓
Search and filter
        ↓
Favorite / archive
        ↓
View dashboard insights
        ↓
Use AI for summaries and organization
        ↓
Capture information directly from browser
```

The application is intentionally kept at a practical scope rather than introducing unnecessary enterprise infrastructure.

The goal is a polished project that demonstrates strong engineering fundamentals and is suitable for a software-development resume and placement portfolio.

---

# Tech Stack

## Frontend

* React
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
* bcryptjs
* jsonwebtoken
* googleapis
* dotenv
* ESLint

## Database

* PostgreSQL 18
* Prisma ORM 7.9.1
* Prisma Client
* `@prisma/adapter-pg`
* `pg`

## Testing

* Vitest
* Supertest

## Package Management

* pnpm
* pnpm workspaces

## Planned Technologies

* Chrome Manifest V3
* OpenAI API

---

# Repository Structure

```text
memdev/
│
├── apps/
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Landing/
│   │   │   │   ├── Login/
│   │   │   │   ├── Register/
│   │   │   │   └── Dashboard/
│   │   │   └── ...
│   │   └── package.json
│   │
│   ├── backend/
│   │   │
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   │
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── env.ts
│   │   │   │   ├── google.ts
│   │   │   │   └── prisma.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── not-found.middleware.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── notes.routes.ts
│   │   │   │   ├── collections.routes.ts
│   │   │   │   └── tags.routes.ts
│   │   │   │
│   │   │   ├── generated/
│   │   │   │   └── prisma/
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── tests/
│   │   │   ├── auth.routes.test.ts
│   │   │   ├── notes.routes.test.ts
│   │   │   ├── collections.routes.test.ts
│   │   │   └── tags.routes.test.ts
│   │   │
│   │   ├── prisma.config.ts
│   │   ├── vitest.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── extension/
│
├── packages/
│   ├── shared/
│   └── config/
│
├── docs/
│
├── UI.md
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

---

# Phase 1 — Project / Monorepo Setup

## Completed

* Initialized Git repository
* Configured pnpm workspaces
* Created monorepo structure
* Created `apps/`
* Created `packages/`
* Added shared package
* Added configuration package
* Added `.gitignore`
* Added `.env.example`
* Added root `package.json`
* Added `pnpm-workspace.yaml`
* Added initial project documentation
* Configured GitHub remote
* Removed `node_modules` from Git tracking

---

# Phase 2 — Frontend Foundation

The frontend application was created using:

* React
* TypeScript
* Vite
* Tailwind CSS

Location:

```text
apps/web/
```

Implemented:

* React application
* TypeScript
* Vite
* Tailwind CSS
* ESLint
* React Router
* TanStack Query
* Lucide React
* Landing page
* Login page foundation
* Register page foundation
* Dashboard page foundation

Current frontend routes:

```text
/
├── /login
├── /register
└── /dashboard
```

Frontend development server:

```text
http://localhost:5173
```

Validation:

```bash
pnpm --filter web build
pnpm --filter web lint
```

---

# Phase 3 — Backend Foundation

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

Backend development server:

```text
http://localhost:5000
```

Health endpoint:

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "memdev-backend"
}
```

---

# Phase 4 — Backend Architecture

The backend was organized into clear layers:

```text
Request
   ↓
Express
   ↓
Middleware
   ↓
Route
   ↓
Validation
   ↓
Prisma
   ↓
PostgreSQL
```

Implemented:

* Central route registration
* Authentication middleware
* 404 middleware
* Error-handling middleware
* Environment validation
* API routing structure
* Health endpoint

Current API groups:

```text
/api/auth
/api/notes
/api/collections
/api/tags
```

---

# Phase 5 — PostgreSQL + Prisma

PostgreSQL is the primary database.

Development database:

```text
PostgreSQL 18
Database: memdev
Host: localhost
Port: 5432
```

Prisma:

```text
Prisma 7.9.1
```

The project uses:

```text
@prisma/adapter-pg
pg
```

Prisma schema:

```text
apps/backend/prisma/schema.prisma
```

Prisma configuration:

```text
apps/backend/prisma.config.ts
```

Generated Prisma Client:

```text
apps/backend/src/generated/prisma/
```

---

# Database Schema

Current entities:

```text
User
Note
Collection
Tag
NoteTag
```

Relationships:

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
 ├── Note
 └── Tag
```

---

# User Model

Important fields:

```text
id
email
passwordHash
googleId
createdAt
updatedAt
```

Notes:

* Email is unique.
* `passwordHash` is nullable to support Google-only accounts.
* `googleId` is unique and nullable.

---

# Note Model

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

---

# Collection Model

Important fields:

```text
id
userId
name
createdAt
updatedAt
```

---

# Tag Model

Important fields:

```text
id
userId
name
createdAt
```

Tags are user-specific.

---

# NoteTag Model

`NoteTag` implements the many-to-many relationship between notes and tags.

```text
noteId
tagId
```

The note/tag combination is unique.

---

# Phase 5I — Prisma Backend Integration

Prisma is fully integrated into the Express backend.

Prisma configuration:

```text
apps/backend/src/config/prisma.ts
```

Current database flow:

```text
HTTP Request
      ↓
Express
      ↓
Route
      ↓
Prisma Client
      ↓
PrismaPg Adapter
      ↓
PostgreSQL
```

The API now performs real database operations through Prisma.

---

# Phase 8 — Authentication

Authentication is fully implemented.

Supported authentication methods:

```text
Email + Password
Google OAuth
```

Implemented:

* Registration
* Password hashing
* Login
* JWT generation
* JWT verification
* Authentication middleware
* Current-user endpoint
* Google OAuth
* Google account linking
* Google-only accounts
* Authentication API tests

---

# Registration

Endpoint:

```http
POST /api/auth/register
```

Flow:

```text
Request
   ↓
Validate input
   ↓
Normalize email
   ↓
Check existing user
   ↓
Hash password
   ↓
Create user
   ↓
Return safe user information
```

Validation:

```text
Valid email
Password >= 8 characters
```

Passwords are hashed using:

```text
bcryptjs
```

with a cost factor of:

```text
12
```

Plain-text passwords are never stored.

---

# Login

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
Return token + user
```

JWT library:

```text
jsonwebtoken
```

Current token lifetime:

```text
1 hour
```

---

# JWT Authentication

Protected routes require:

```http
Authorization: Bearer <JWT>
```

Authentication middleware:

```text
apps/backend/src/middleware/auth.middleware.ts
```

Flow:

```text
Authorization Header
        ↓
Extract Bearer Token
        ↓
Verify JWT
        ↓
Read User ID
        ↓
Attach Authenticated User
        ↓
Continue Request
```

Invalid or expired tokens are rejected.

---

# Current User

Endpoint:

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <JWT>
```

Returns safe information about the authenticated user.

Password hashes are never returned.

---

# Google OAuth

Google OAuth is implemented using:

```text
googleapis
```

Endpoints:

```http
GET /api/auth/google
GET /api/auth/google/callback
```

Scopes:

```text
openid
email
profile
```

Flow:

```text
MemDev
   ↓
Google Authorization
   ↓
Google Callback
   ↓
Exchange Authorization Code
   ↓
Verify Google Identity
   ↓
Find Existing User
   ↓
Link or Create Account
   ↓
Generate MemDev Authentication
```

Google-only accounts can have:

```text
passwordHash = null
googleId = <Google subject>
```

Google OAuth was manually verified during development.

---

# Phase 9 — Notes CRUD API

The Notes API is implemented as a protected, user-owned resource.

Endpoints:

```text
POST   /api/notes
GET    /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id
```

Additional note actions:

```text
Favorite
Archive
```

---

# Create Note

Endpoint:

```http
POST /api/notes
```

Supported fields:

```text
title
content
sourceUrl
collectionId
```

The authenticated user's ID is taken from the JWT.

The client cannot provide another user's ID to create a note under another account.

---

# List Notes

Endpoint:

```http
GET /api/notes
```

Only notes belonging to the authenticated user are returned.

The database query is scoped using:

```text
authenticatedUser.id
```

---

# Get Note

Endpoint:

```http
GET /api/notes/:id
```

A user can retrieve only their own note.

A note belonging to another user is not exposed.

---

# Update Note

Endpoint:

```http
PATCH /api/notes/:id
```

Users can update their own notes.

Ownership is checked before updating.

---

# Delete Note

Endpoint:

```http
DELETE /api/notes/:id
```

Users can delete only their own notes.

---

# Favorite and Archive

Notes support:

```text
isFavorite
isArchived
```

These operations are protected by authentication and ownership checks.

---

# Phase 10 — Collections API

Collections are implemented as protected, user-owned resources.

Endpoints:

```text
POST   /api/collections
GET    /api/collections
GET    /api/collections/:id
PATCH  /api/collections/:id
DELETE /api/collections/:id
```

---

# Create Collection

Endpoint:

```http
POST /api/collections
```

Example:

```json
{
  "name": "System Design"
}
```

The collection is automatically associated with the authenticated user.

---

# List Collections

Endpoint:

```http
GET /api/collections
```

Returns only collections belonging to the authenticated user.

Collection results include note counts.

Example structure:

```json
{
  "collections": [
    {
      "id": "...",
      "name": "System Design",
      "_count": {
        "notes": 1
      }
    }
  ]
}
```

---

# Get Collection

Endpoint:

```http
GET /api/collections/:id
```

Returns a collection and its associated notes when the collection belongs to the authenticated user.

---

# Update Collection

Endpoint:

```http
PATCH /api/collections/:id
```

Allows the authenticated owner to rename a collection.

---

# Delete Collection

Endpoint:

```http
DELETE /api/collections/:id
```

Allows the authenticated owner to delete a collection.

---

# Collection Ownership

Users cannot:

* Access another user's collection
* Rename another user's collection
* Delete another user's collection
* Assign notes to another user's collection

Ownership is always derived from the authenticated JWT.

---

# Phase 11 — Tags API

The Tags API is fully implemented.

Tags are user-specific resources.

Endpoints:

```text
POST   /api/tags
GET    /api/tags
PATCH  /api/tags/:id
DELETE /api/tags/:id

POST   /api/tags/notes/:noteId/:tagId
DELETE /api/tags/notes/:noteId/:tagId
```

---

# Create Tag

Endpoint:

```http
POST /api/tags
```

Example:

```json
{
  "name": "system-design"
}
```

Duplicate tag names for the same user are rejected.

---

# List Tags

Endpoint:

```http
GET /api/tags
```

Returns only tags belonging to the authenticated user.

The response includes note counts for each tag.

---

# Rename Tag

Endpoint:

```http
PATCH /api/tags/:id
```

Allows the authenticated owner to rename a tag.

Duplicate tag names for the same user are prevented.

---

# Delete Tag

Endpoint:

```http
DELETE /api/tags/:id
```

Deletes a tag owned by the authenticated user.

Associated `NoteTag` records are automatically removed through the Prisma cascade relationship.

---

# Attach Tag to Note

Endpoint:

```http
POST /api/tags/notes/:noteId/:tagId
```

Before creating the relationship, the API verifies:

```text
Note belongs to authenticated user
        +
Tag belongs to authenticated user
```

Duplicate relationships are rejected.

---

# Remove Tag from Note

Endpoint:

```http
DELETE /api/tags/notes/:noteId/:tagId
```

Removes an existing tag relationship.

The API verifies ownership of both the note and tag.

---

# Tag Ownership

A user cannot use another user's tags.

All tag operations are scoped to the authenticated user.

---

# Phase 12 — Search & Filtering

Search and filtering have been implemented for the Notes API.

The purpose of this phase is to allow users to find and organize notes efficiently.

The search/filtering functionality remains fully user-scoped.

---

# Note Search

The Notes listing API supports keyword-based searching.

Search is applied to relevant note content such as:

```text
Title
Content
```

The search is performed only against notes belonging to the authenticated user.

Conceptually:

```text
Authenticated User
        ↓
GET /api/notes
        ↓
Search Parameters
        ↓
User-Scoped Prisma Query
        ↓
Matching Notes
```

---

# Note Filtering

The Notes API supports filtering using note metadata.

Available filtering concepts include:

```text
Collection
Tags
Favorite status
Archived status
```

Filtering is always applied after maintaining user ownership.

Conceptually:

```text
Authenticated User
        ↓
User's Notes
        ↓
Search
        ↓
Filters
        ↓
Matching Notes
```

---

# User Data Isolation

One of the most important architectural requirements of MemDev is strict user isolation.

The application follows:

```text
JWT
 ↓
Authenticated User ID
 ↓
User-scoped database query
 ↓
Only user's resources
```

This applies to:

```text
Notes
Collections
Tags
Search
Filtering
Note-tag relationships
Collection relationships
```

A user cannot access another user's data simply by knowing a resource ID.

---

# Backend API Summary

Current backend API:

```text
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/google
GET    /api/auth/google/callback

POST   /api/notes
GET    /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id

POST   /api/collections
GET    /api/collections
GET    /api/collections/:id
PATCH  /api/collections/:id
DELETE /api/collections/:id

POST   /api/tags
GET    /api/tags
PATCH  /api/tags/:id
DELETE /api/tags/:id

POST   /api/tags/notes/:noteId/:tagId
DELETE /api/tags/notes/:noteId/:tagId
```

The Notes API additionally supports search and filtering.

---

# Backend Testing

Backend tests use:

```text
Vitest
Supertest
```

Current test files:

```text
apps/backend/tests/
├── auth.routes.test.ts
├── notes.routes.test.ts
├── collections.routes.test.ts
└── tags.routes.test.ts
```

Tests cover:

```text
Authentication
Registration
Login
JWT authentication
Notes
Collections
Tags
Validation
Unauthorized access
User ownership
Cross-user isolation
Collection relationships
Tag relationships
Search
Filtering
Favorite/archive behavior
```

The current automated backend test suite passes.

The validation workflow is:

```bash
pnpm --filter @memdev/backend test
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

Manual API testing is intentionally skipped when automated tests already provide sufficient coverage.

Manual testing is reserved for areas where automated tests cannot reasonably reproduce the real environment, such as:

```text
Google OAuth
Browser UI
Chrome extension
End-to-end user workflows
```

---

# Current Backend Test Status

The backend currently contains four route test suites:

```text
auth.routes.test.ts
notes.routes.test.ts
collections.routes.test.ts
tags.routes.test.ts
```

All currently implemented backend tests pass.

The project has reached a stable backend checkpoint after Phase 12.

---

# Current System Architecture

```text
                         MEMDEV
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       React Web                  Express Backend
       localhost:5173             localhost:5000
                                         │
                                         ▼
                                   API Routes
                                         │
              ┌──────────────────────────┼──────────────────────┐
              │                          │                      │
              ▼                          ▼                      ▼
       Authentication                 Notes              Collections
              │                          │                      │
              │                          ├── Search             │
              │                          ├── Filtering          │
              │                          ├── Favorite           │
              │                          └── Archive            │
              │
              └──────────────────────────┐
                                         │
                                         ▼
                                       Tags
                                         │
                                         ▼
                                  NoteTag Relations
                                         │
                                         ▼
                                  Prisma Client
                                         │
                                         ▼
                                  PrismaPg Adapter
                                         │
                                         ▼
                                  PostgreSQL 18
```

Future architecture:

```text
Chrome Extension
       ↓
Capture webpage
       ↓
MemDev Backend
       ↓
Store Note
       ↓
OpenAI API
       ↓
Summarization / AI Tags
```

---

# Current Features

## Frontend

* [x] React
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

* [x] Express
* [x] TypeScript
* [x] CORS
* [x] Zod environment validation
* [x] API routing
* [x] Health endpoint
* [x] 404 handling
* [x] Centralized error handling
* [x] ESLint
* [x] Backend build
* [x] Backend lint

## Authentication

* [x] Registration
* [x] Email validation
* [x] Password validation
* [x] bcrypt password hashing
* [x] Login
* [x] JWT generation
* [x] JWT verification
* [x] Authentication middleware
* [x] Current-user endpoint
* [x] Google OAuth
* [x] Google account linking
* [x] Google-only accounts
* [x] Authentication tests

## Notes

* [x] Create note
* [x] List notes
* [x] Get note
* [x] Update note
* [x] Delete note
* [x] Favorite note
* [x] Archive note
* [x] Collection assignment
* [x] User ownership
* [x] Search
* [x] Filtering
* [x] Automated tests

## Collections

* [x] Create collection
* [x] List collections
* [x] Get collection
* [x] Rename collection
* [x] Delete collection
* [x] Note assignment
* [x] Note count
* [x] User ownership
* [x] Automated tests

## Tags

* [x] Create tag
* [x] List tags
* [x] Rename tag
* [x] Delete tag
* [x] Attach tag to note
* [x] Remove tag from note
* [x] Note counts
* [x] User ownership
* [x] Automated tests

## Database

* [x] PostgreSQL
* [x] Prisma
* [x] Prisma Client
* [x] PrismaPg adapter
* [x] Database schema
* [x] Migrations
* [x] Database integration
* [x] Generated Prisma Client

---

# Not Implemented Yet

The following functionality remains planned.

## Dashboard

* [ ] Dashboard statistics API
* [ ] Total notes
* [ ] Favorite notes count
* [ ] Archived notes count
* [ ] Collections count
* [ ] Tags count
* [ ] Recent notes
* [ ] Recent activity
* [ ] Dashboard frontend integration

## Frontend Integration

* [ ] Frontend authentication state
* [ ] API client
* [ ] Login API integration
* [ ] Registration API integration
* [ ] Protected frontend routes
* [ ] Notes UI
* [ ] Note editor
* [ ] Collections UI
* [ ] Tags UI
* [ ] Search UI
* [ ] Filtering UI
* [ ] Dashboard API integration
* [ ] Dashboard UI integration

## Browser Extension

* [ ] Chrome Manifest V3 setup
* [ ] Extension popup
* [ ] Save current webpage
* [ ] Capture webpage title
* [ ] Capture source URL
* [ ] Capture selected text
* [ ] Send captured data to backend
* [ ] Extension authentication

## AI

* [ ] OpenAI integration
* [ ] AI summarization
* [ ] AI-generated tags
* [ ] AI-assisted organization
* [ ] AI error handling
* [ ] AI usage controls

## Testing

* [x] Backend route tests
* [x] Authentication tests
* [x] Notes tests
* [x] Collections tests
* [x] Tags tests
* [x] Search/filtering tests
* [ ] Frontend tests
* [ ] Database integration tests
* [ ] End-to-end tests
* [ ] Automated Google OAuth tests

## Deployment

* [ ] Production environment configuration
* [ ] Production PostgreSQL
* [ ] Backend deployment
* [ ] Frontend deployment
* [ ] Chrome extension packaging
* [ ] Production OpenAI configuration

---

# Phase 13 — Dashboard Statistics

The next planned phase is Dashboard Statistics.

The dashboard backend should provide useful aggregate information about the authenticated user's knowledge base.

Planned statistics:

```text
Total Notes
Favorite Notes
Archived Notes
Collections
Tags
Recent Notes
```

The dashboard must remain user-scoped.

Expected architecture:

```text
Authenticated User
        ↓
Dashboard API
        ↓
User-scoped Prisma queries
        ↓
Statistics
        ↓
Frontend Dashboard
```

The implementation should follow:

```text
Implement
    ↓
Automated Tests
    ↓
Build
    ↓
Lint
    ↓
Commit
    ↓
Push
```

Manual testing should be skipped when automated tests adequately cover the backend behavior.

---

# Future Roadmap

```text
Phase 1   — Project / Monorepo Setup        ✓
Phase 2   — Frontend Foundation             ✓
Phase 3   — Backend Foundation              ✓
Phase 4   — Backend Architecture            ✓
Phase 5   — PostgreSQL + Prisma             ✓
Phase 5I  — Prisma Backend Integration      ✓
Phase 8   — Authentication                  ✓
Phase 9   — Notes CRUD API                  ✓
Phase 10  — Collections API                 ✓
Phase 11  — Tags API                        ✓
Phase 12  — Search & Filtering              ✓

Phase 13  — Dashboard Statistics            → Next
Phase 14  — Frontend Authentication
Phase 15  — Dashboard & Notes UI
Phase 16  — Collections & Tags UI
Phase 17  — Browser Extension
Phase 18  — Web Clipping
Phase 19  — OpenAI Integration
Phase 20  — AI Summarization
Phase 21  — AI-generated Tags
Phase 22  — UI Polish
Phase 23  — End-to-End Testing
Phase 24  — Deployment
Phase 25  — Documentation & Resume Polish
```

The exact implementation order may be adjusted when necessary, but the project should continue to favor small, meaningful milestones.

---

# Environment Configuration

The backend requires environment variables.

Example:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DATABASE_URL="postgresql://postgres:<password>@localhost:5432/memdev?schema=public"

JWT_SECRET="<at-least-32-character-secret>"

GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

The actual `.env` file must never be committed.

Never commit:

```text
.env
DATABASE passwords
JWT secrets
Google OAuth secrets
OpenAI API keys
```

---

# Local Development

## Install Dependencies

From the repository root:

```bash
pnpm install
```

---

# Start Frontend

```bash
pnpm --filter web dev
```

Frontend:

```text
http://localhost:5173
```

---

# Start Backend

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

## Development

```bash
pnpm --filter @memdev/backend dev
```

## Test

```bash
pnpm --filter @memdev/backend test
```

## Build

```bash
pnpm --filter @memdev/backend build
```

## Lint

```bash
pnpm --filter @memdev/backend lint
```

---

# Frontend Commands

## Development

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

## Validate Schema

```bash
pnpm --filter @memdev/backend exec prisma validate
```

## Generate Prisma Client

```bash
pnpm --filter @memdev/backend exec prisma generate
```

## Check Migration Status

```bash
pnpm --filter @memdev/backend exec prisma migrate status
```

## Create Development Migration

```bash
pnpm --filter @memdev/backend exec prisma migrate dev --name <migration-name>
```

## Prisma Studio

```bash
pnpm --filter @memdev/backend exec prisma studio
```

---

# PostgreSQL

Development database:

```text
PostgreSQL 18
Database: memdev
Host: 127.0.0.1
Port: 5432
```

On Windows, PostgreSQL is installed under:

```text
C:\Program Files\PostgreSQL\18\
```

Example:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h 127.0.0.1 -d memdev
```

---

# Git Workflow

The project uses small, meaningful Git commits.

Preferred commit prefixes:

```text
feat:
fix:
test:
refactor:
docs:
chore:
```

Examples:

```text
feat: setup backend foundation
feat: add backend architecture
feat: add initial database schema
feat: integrate prisma with backend
feat: add authentication
test: add authentication API tests
feat: add notes CRUD API
feat: add collections API
feat: add tags API
feat: add search and filtering
```

Before committing:

```bash
git status
```

After successful implementation and validation:

```bash
git add <relevant-files>
git commit -m "<commit-message>"
git push
```

---

# Development Validation Workflow

For backend changes:

```bash
pnpm --filter @memdev/backend test
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

For frontend changes:

```bash
pnpm --filter web build
pnpm --filter web lint
```

For database changes:

```bash
pnpm --filter @memdev/backend exec prisma validate
pnpm --filter @memdev/backend exec prisma migrate status
```

The preferred development cycle is:

```text
Implement
   ↓
Test
   ↓
Fix
   ↓
Build
   ↓
Lint
   ↓
Commit
   ↓
Push
   ↓
Next Phase
```

---

# Testing Philosophy

Automated tests are the primary validation mechanism for backend functionality.

Manual API testing is not repeated for every endpoint when the same behavior is already covered by automated tests.

Manual testing is reserved for cases where it provides additional value, such as:

```text
Google OAuth
Browser UI
Chrome extension
Complete end-to-end workflows
External service integrations
```

This keeps development efficient while maintaining confidence in the backend.

---

# Security Principles

MemDev follows several important security principles.

## Password Security

Passwords are hashed using bcrypt.

Plain-text passwords are never stored.

## JWT Authentication

Protected endpoints require valid JWT authentication.

## User Isolation

Every user-owned resource is scoped to the authenticated user.

```text
JWT
 ↓
Authenticated User ID
 ↓
User-scoped Prisma query
 ↓
Resource
```

## Ownership Checks

Ownership is enforced for:

```text
Notes
Collections
Tags
Note-tag relationships
Search
Filtering
```

## Environment Secrets

Secrets remain in local environment variables.

They are never committed to Git.

---

# Current Checkpoint

The project has completed:

```text
Monorepo
    ↓
Frontend Foundation
    ↓
Backend Foundation
    ↓
Backend Architecture
    ↓
PostgreSQL
    ↓
Prisma
    ↓
Database Schema
    ↓
Prisma Integration
    ↓
Authentication
    ↓
Google OAuth
    ↓
Notes CRUD
    ↓
Collections
    ↓
Tags
    ↓
Search & Filtering
```

Current status:

```text
Backend APIs:          Working
Database:              Working
Authentication:        Working
Notes:                 Working
Collections:           Working
Tags:                  Working
Search/Filtering:      Working
Automated tests:       Passing
Backend build:         Passing
Backend lint:          Passing
```

Next:

```text
Phase 13 — Dashboard Statistics
```

---

# Project Philosophy

MemDev is intentionally designed as a focused full-stack project rather than a production-scale distributed system.

The implementation prioritizes:

* Clean architecture
* Strong TypeScript usage
* Meaningful database relationships
* Secure authentication
* User data isolation
* REST API design
* Automated testing
* Maintainable code
* Good UI/UX
* Practical AI integration
* Resume and placement value

The project should avoid unnecessary complexity such as:

* Microservices
* Kubernetes
* Complex distributed infrastructure
* Premature scalability
* Over-engineered abstractions
* Unnecessary cloud infrastructure

The goal is to build a **complete, polished, technically credible application** within a realistic development scope.

---

# Continuing Development

When continuing development, the following should be treated as the current source of project context:

```text
README.md
SRS / project requirements
Current source code
Current Git history
Current test suite
UI.md
```

Before beginning a new phase:

```text
1. Check current implementation
2. Check Git status
3. Confirm previous tests pass
4. Implement the new phase
5. Add/update automated tests
6. Run tests
7. Run build
8. Run lint
9. Commit the phase
10. Push to GitHub
```

Current checkpoint:

```text
Phase 12 complete
↓
Phase 13 Dashboard Statistics
```

```
```
