# MemDev

MemDev is a personal knowledge management application designed to help users **capture, organize, search, and revisit useful information from the web**.

The core idea behind MemDev is simple:

```text
Find something useful on the Internet
                ↓
Capture it
                ↓
Preserve its source context
                ↓
Organize it
                ↓
Search it later
                ↓
Retrieve and use it when needed
```

MemDev combines a web application, backend API, database, browser extension, and AI-assisted functionality into a single full-stack project.

The project is being developed as a **resume and placement-focused software engineering project**. The objective is not to build a startup-scale or enterprise-scale system. Instead, the goal is to demonstrate the ability to independently design and implement a complete software product involving:

```text
Frontend
    +
Backend
    +
Database
    +
Authentication
    +
REST APIs
    +
Browser Extension
    +
AI Integration
    +
Testing
    +
Deployment
```

The implementation prioritizes:

* Clean architecture
* Strong TypeScript usage
* Secure authentication
* User data isolation
* Relational database design
* REST API development
* Practical frontend engineering
* Automated backend testing
* Browser extension development
* AI integration
* Good UI/UX
* Maintainable code
* Resume and interview value

The project is intentionally developed incrementally through small, meaningful phases.

Each phase is expected to follow:

```text
Understand
    ↓
Implement
    ↓
Test
    ↓
Build
    ↓
Lint
    ↓
Manual verification when required
    ↓
Commit
    ↓
Push
    ↓
Next Phase
```

The **SRS document defines the intended functionality and architecture of MemDev**, while this README documents the actual implementation progress and the remaining roadmap.

---

# Table of Contents

1. [Project Overview](#project-overview)
2. [Project Goal](#project-goal)
3. [Core Concept](#core-concept)
4. [Complete MemDev User Flow](#complete-memdev-user-flow)
5. [Project Status](#project-status)
6. [Current Development Checkpoint](#current-development-checkpoint)
7. [Implemented Features](#implemented-features)
8. [Planned Features](#planned-features)
9. [Technology Stack](#technology-stack)
10. [System Architecture](#system-architecture)
11. [Repository Structure](#repository-structure)
12. [Database Architecture](#database-architecture)
13. [Authentication Architecture](#authentication-architecture)
14. [User Data Isolation](#user-data-isolation)
15. [Backend Architecture](#backend-architecture)
16. [Frontend Architecture](#frontend-architecture)
17. [Browser Extension Architecture](#browser-extension-architecture)
18. [AI Architecture](#ai-architecture)
19. [Development Phases](#development-phases)
20. [Search and Filtering](#search-and-filtering)
21. [Notes](#notes)
22. [Collections](#collections)
23. [Tags](#tags)
24. [Favorites](#favorites)
25. [Archive](#archive)
26. [Trash](#trash)
27. [Dashboard](#dashboard)
28. [Testing](#testing)
29. [Security](#security)
30. [Environment Configuration](#environment-configuration)
31. [Local Development](#local-development)
32. [Prisma Commands](#prisma-commands)
33. [Git Workflow](#git-workflow)
34. [Browser Extension Roadmap](#browser-extension-roadmap)
35. [AI Roadmap](#ai-roadmap)
36. [Deployment](#deployment)
37. [Future Improvements](#future-improvements)
38. [What Is Intentionally Out of Scope](#what-is-intentionally-out-of-scope)
39. [Project Philosophy](#project-philosophy)
40. [Final Project Goal](#final-project-goal)

---

# Project Overview

MemDev is a **personal knowledge management system** focused on information captured from the web.

Traditional bookmarking systems preserve links, while traditional note-taking applications require users to manually copy and organize information.

MemDev combines both ideas.

A user can find useful information on a webpage, capture the relevant content, preserve its source URL and webpage context, and store it as an organized note.

The long-term workflow is:

```text
Internet
   ↓
Useful information
   ↓
Browser Extension
   ↓
Selected text + URL + Page Title
   ↓
MemDev Note
   ↓
Optional AI Summary
   ↓
Tags + Collection + Favorite
   ↓
Search / Sort / Filter
   ↓
Retrieve later
```

The browser extension is intended to become the primary **quick-capture mechanism** of MemDev.

The web application is responsible for managing the user's knowledge library.

The backend is responsible for:

* Authentication
* Authorization
* Business logic
* Data validation
* Database access
* Search/filtering
* AI integration
* User data isolation

PostgreSQL provides persistent storage.

---

# Project Goal

The primary goal of MemDev is to build a complete, polished full-stack application that demonstrates practical software engineering ability.

The project should demonstrate experience with:

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
Node.js
Express
REST APIs
Zod
JWT
Google OAuth
PostgreSQL
Prisma
Vitest
Supertest
Chrome Manifest V3
OpenAI API
Git
GitHub
Deployment
```

The project is specifically designed to be achievable within a realistic development period with AI assistance.

The architecture therefore intentionally avoids unnecessary infrastructure such as:

```text
Microservices
Kubernetes
Kafka
Redis
Elasticsearch
Vector databases
Complex distributed systems
Multi-region infrastructure
Enterprise RBAC
Real-time collaboration
Billing systems
```

The intended progression is:

```text
Simple
   ↓
Functional
   ↓
Secure
   ↓
Well-tested
   ↓
Polished
   ↓
Deployable
   ↓
Resume-ready
```

---

# Core Concept

MemDev is built around five fundamental ideas:

## 1. Capture

Users should be able to capture useful information while browsing the web.

The browser extension captures:

```text
Selected Text
Current URL
Webpage Title
```

The user should not have to manually copy the webpage URL or title.

---

## 2. Preserve Context

A note should retain information about where it came from.

A web-captured note can contain:

```text
Title
Content
Source URL
Source Webpage Title
Creation Date
Last Updated Date
```

The source URL allows the user to return to the original webpage later.

---

## 3. Organize

Saved information should not become one large unstructured list.

MemDev provides multiple organization mechanisms:

```text
Collections
Tags
Favorites
Archive
Trash
```

For example:

```text
Collection:
    System Design

Tags:
    Backend
    Architecture
    Distributed Systems

Note:
    CAP Theorem Explained
```

---

## 4. Search

As the knowledge base grows, users should be able to quickly find previously saved information.

Search can consider:

```text
Note Title
Note Content
Tags
Source Webpage Title
```

Version 1 uses standard text-based search.

Semantic/vector search is intentionally not required for the initial project scope.

---

## 5. Revisit

MemDev is not simply a storage system.

The purpose of saving information is to retrieve and use it later.

Users should be able to:

```text
Search
Sort
Filter
Open
Edit
Favorite
Archive
Restore
Delete
```

This turns captured information into a personal knowledge library.

---

# Complete MemDev User Flow

The intended complete workflow is:

```text
User logs into MemDev
        ↓
User browses the Internet
        ↓
User finds useful information
        ↓
User highlights useful text
        ↓
Opens MemDev Browser Extension
        ↓
Extension captures:
    • Selected Text
    • URL
    • Page Title
        ↓
User reviews captured information
        ↓
User optionally edits:
    • Title
    • Content
    • Tags
    • Collection
    • Favorite
        ↓
Optional AI Summary
        ↓
User saves note
        ↓
Note is stored in PostgreSQL
        ↓
Note appears in MemDev
        ↓
User can:
    • Search
    • Sort
    • Filter
    • Edit
    • Favorite
    • Archive
    • Delete
        ↓
Deleted notes → Trash
        ↓
User can restore
        ↓
Or permanently delete
```

The quick-save workflow is intended to be even shorter:

```text
Highlight Text
      ↓
Quick Save
      ↓
Selected Text + URL + Page Title
      ↓
Note Saved
```

The extension should minimize the amount of manual interaction required to save useful information.

---

# Project Status

## Current Phase

**Phase 23 — Search + Filtering — Complete**

The project has progressed beyond the original SRS phase numbering.

The original SRS development plan was created before implementation and contained a broader phase breakdown. During actual development, the phases were reorganized into smaller and more meaningful milestones.

The current implementation checkpoint is:

```text
Phase 23 — Search + Filtering
                    ✓ COMPLETE
                    ↓
Phase 24 — Browser Extension Foundation
                    → NEXT
```

---

# Completed Development Progress

The major completed milestones are:

```text
Phase 1
Project / Monorepo Setup
        ✓

Phase 2
Frontend Foundation
        ✓

Phase 3
Backend Foundation
        ✓

Phase 4
Backend Architecture
        ✓

Phase 5
PostgreSQL + Prisma
        ✓

Phase 5I
Prisma Backend Integration
        ✓

Phase 8
Authentication
        ✓

Phase 9
Notes CRUD
        ✓

Phase 10
Collections
        ✓

Phase 11
Tags
        ✓

Phase 22
Note ↔ Tag Assignment
        ✓

Phase 23
Search + Filtering
        ✓

Phase 24
Browser Extension Foundation
        → NEXT
```

---

# Current Development Checkpoint

At the current checkpoint, the project has a functional foundation consisting of:

```text
React Frontend
       ↓
Express REST API
       ↓
JWT Authentication
       ↓
PostgreSQL
       ↓
Prisma ORM
```

The application currently supports the core knowledge-management functionality:

```text
Authentication
    ✓

Notes
    ✓

Collections
    ✓

Tags
    ✓

Note ↔ Tag Relationships
    ✓

Favorites
    ✓

Archive
    ✓

Search
    ✓

Filtering
    ✓

AI Summarization
    ✓
```

The project is now moving toward the browser-extension portion of the product.

---

# Implemented Features

## Authentication

Implemented:

* Email/password registration
* Email/password login
* Password hashing
* JWT authentication
* JWT verification
* Authentication middleware
* Current-user endpoint
* Google OAuth
* Google account linking
* Google-only accounts
* Protected API routes
* User-specific resource authorization

---

## Notes

Implemented:

* Create note
* List notes
* Get individual note
* Update note
* Delete note
* Favorite note
* Archive note
* Collection assignment
* Tag assignment
* Search
* Filtering
* AI summarization
* User ownership

---

## Collections

Implemented:

* Create collection
* List collections
* Get collection
* Rename collection
* Delete collection
* Associate notes with collections
* Collection note counts
* User ownership

---

## Tags

Implemented:

* Create tag
* List tags
* Rename tag
* Delete tag
* Attach tag to note
* Remove tag from note
* Tag note counts
* User ownership
* Duplicate relationship protection

---

## Search and Filtering

Implemented:

* Text search
* Collection filtering
* Tag filtering
* Favorite filtering
* Archive filtering
* Sorting
* Clear filters
* Combined filtering workflow

---

## AI

AI-assisted note summarization is part of the current application direction.

The intended flow is:

```text
Note
 ↓
Backend
 ↓
OpenAI API
 ↓
Generated Summary
 ↓
Store Summary
 ↓
Display Summary
```

AI functionality is intentionally treated as an enhancement rather than a dependency of the core note-saving workflow.

A failure of the AI service should not prevent a note from being saved.

---

# Planned Features

The following functionality remains part of the intended product roadmap:

```text
Browser Extension
        ↓
Webpage Text Capture
        ↓
URL + Page Title Capture
        ↓
Quick Save
        ↓
Extension Authentication
        ↓
Dashboard Refinement
        ↓
AI Experience Refinement
        ↓
Responsive / UX Polish
        ↓
Security Review
        ↓
Final QA
        ↓
Deployment
        ↓
Documentation / Portfolio Polish
```

Some SRS functionality is still planned or requires additional refinement, including:

```text
Forgot Password
Logout/session UX refinement
Trash workflow
Restore deleted notes
Permanent deletion
Restore archived notes
Dark mode
Complete responsive refinement
Dashboard statistics refinement
Extension authentication
Extension quick save
Production deployment
Final end-to-end testing
```

These should be implemented according to priority rather than blindly following the original SRS order.

---

# Technology Stack

## Frontend

MemDev uses:

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
Lucide React
```

### React

React is used to build the interactive web application.

It is responsible for:

* Dashboard
* Notes
* Collections
* Tags
* Forms
* Navigation
* Search
* Filtering
* User interactions

---

### TypeScript

TypeScript is used throughout the project.

The intended architecture uses TypeScript across:

```text
Web
Backend
Browser Extension
```

This provides:

* Static typing
* Better IDE support
* Safer refactoring
* Better API contracts
* Consistency across the monorepo

---

### Vite

Vite is used as the frontend development server and build tool.

It provides:

* Fast development startup
* Fast hot-module replacement
* Fast production builds
* Simple React + TypeScript integration

---

### Tailwind CSS

Tailwind CSS is used for styling.

It is responsible for building:

```text
Layouts
Navigation
Cards
Forms
Buttons
Filters
Modals
Responsive interfaces
Dashboard components
```

The project uses Tailwind to keep the UI implementation fast and maintainable.

---

### React Router

React Router manages frontend navigation.

Current and planned application routes include:

```text
/
├── /login
├── /register
├── /dashboard
├── /notes
├── /notes/:id
├── /collections
├── /collections/:id
└── /tags
```

Additional planned routes/views include:

```text
/favorites
/archive
/trash
```

---

### TanStack Query

TanStack Query is used for server-state management.

It is intended to handle:

```text
Fetching notes
Creating notes
Updating notes
Deleting notes
Collections
Tags
Search
Filtering
Dashboard statistics
Loading states
API errors
Refetching
Caching
```

This avoids introducing unnecessary global state-management complexity.

---

### Lucide React

Lucide React is used for interface icons.

The project uses icons for actions such as:

```text
Search
Edit
Delete
Archive
Favorite
Tags
Collections
Navigation
Settings
```

---

# Backend

The backend uses:

```text
Node.js
Express
TypeScript
REST API
Zod
JWT
Google OAuth
bcryptjs
dotenv
ESLint
```

The backend is a **modular monolith**.

The current project does not require microservices.

---

# Database

The database stack is:

```text
PostgreSQL 18
Prisma ORM
Prisma Client
@prisma/adapter-pg
pg
```

PostgreSQL is responsible for persistent storage.

Prisma provides:

* Type-safe database access
* Schema management
* Migrations
* Relationships
* TypeScript integration

---

# Testing

The backend uses:

```text
Vitest
Supertest
```

Automated tests focus on important behavior such as:

```text
Authentication
Authorization
Notes
Collections
Tags
Ownership
Validation
Search
Filtering
```

Manual testing is reserved for functionality where automated tests cannot reproduce the actual environment effectively.

Examples:

```text
Google OAuth
Browser UI
Browser Extension
External AI API
Complete end-to-end workflows
```

---

# Package Management

The repository uses:

```text
pnpm
pnpm workspaces
```

The monorepo contains multiple applications that need to share configuration and dependencies.

---

# System Architecture

The high-level architecture is:

```text
                         MEMDEV
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Web Frontend     Backend API      Browser Extension
          │                │                │
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                     PostgreSQL
                           │
                    ┌──────┴──────┐
                    ▼             ▼
               Google OAuth    OpenAI API
```

The backend acts as the central application layer.

The web application and browser extension should communicate with the backend through REST APIs.

The backend communicates with:

```text
PostgreSQL
Google OAuth
OpenAI API
```

---

# Application Architecture

MemDev consists of three primary applications:

```text
apps/
│
├── web/
│
├── backend/
│
└── extension/
```

Each application has a clear responsibility.

---

## Web Application

The web application is responsible for:

```text
User Interface
Authentication UI
Dashboard
Notes
Collections
Tags
Search
Filtering
Favorites
Archive
Trash
Statistics
Note Editor
Responsive UI
Theme
```

---

## Backend API

The backend is responsible for:

```text
Authentication
Authorization
Business Logic
Validation
Database Access
Notes
Collections
Tags
Search
Filtering
Statistics
AI Integration
```

---

## Browser Extension

The extension is responsible for:

```text
Reading selected webpage text
Capturing URL
Capturing page title
Quick Save
Reviewing captured information
Communicating with backend
```

Important business logic should remain in the backend rather than being trusted to the browser extension.

---

# Backend Request Flow

The standard backend request flow is:

```text
HTTP Request
      ↓
Express
      ↓
Middleware
      ↓
Authentication
      ↓
Validation
      ↓
Route
      ↓
Business Logic
      ↓
Prisma
      ↓
PostgreSQL
      ↓
Response
```

For protected endpoints:

```text
Request
   ↓
Authorization Header
   ↓
JWT Extraction
   ↓
JWT Verification
   ↓
Authenticated User ID
   ↓
User-Scoped Query
   ↓
Database
```

This is one of the most important security boundaries in the application.

---

# Repository Structure

The current repository follows a monorepo architecture.

```text
memdev/
│
├── apps/
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── lib/
│   │   │   └── pages/
│   │   │       ├── Landing/
│   │   │       ├── Login/
│   │   │       ├── Register/
│   │   │       ├── Dashboard/
│   │   │       ├── Notes/
│   │   │       ├── Collections/
│   │   │       ├── Tags/
│   │   │       └── Placeholder/
│   │   │
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
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── generated/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── tests/
│   │   ├── prisma.config.ts
│   │   ├── vitest.config.ts
│   │   └── package.json
│   │
│   └── extension/
│       └── [Phase 24–26]
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
├── pnpm-workspace.yaml
└── README.md
```

The extension directory will be expanded during the browser-extension phases.

---

# Why a Monorepo?

The web application, backend, and browser extension are all components of the same product.

A monorepo makes it easier to:

```text
Develop applications together
Share types
Share configuration
Manage dependencies
Maintain consistent tooling
Run workspace commands
Track the complete product in one repository
```

The architecture also leaves room for shared types and validation in:

```text
packages/shared/
```

---

# Database Architecture

The current primary database entities are:

```text
User
Note
Collection
Tag
NoteTag
```

The conceptual relationship is:

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

The User entity contains important authentication information.

Conceptually:

```text
User
├── id
├── email
├── passwordHash
├── googleId
├── createdAt
└── updatedAt
```

Important rules:

* Email is unique.
* `passwordHash` can be nullable.
* `googleId` can be nullable.
* Google-only accounts can exist without a password.
* Password hashes must never be returned through public API responses.

---

# Note Model

The Note is the core entity of MemDev.

Important fields include:

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

The intended SRS model also includes concepts such as:

```text
Source webpage title
Trash/deletion state
Deleted timestamp
```

These will be incorporated/refined as the corresponding features are completed.

A note belongs to exactly one authenticated user.

A note may belong to a collection.

A note may have multiple tags.

---

# Collection Model

Collections are user-specific organizational containers.

Conceptually:

```text
Collection
├── id
├── userId
├── name
├── createdAt
└── updatedAt
```

Examples:

```text
DSA
Web Development
Machine Learning
Cybersecurity
College
Projects
Placement
System Design
```

---

# Tag Model

Tags provide a flexible organization mechanism.

Conceptually:

```text
Tag
├── id
├── userId
├── name
├── createdAt
└── updatedAt
```

Examples:

```text
React
JavaScript
Backend
Authentication
JWT
System Design
Machine Learning
```

Tags are user-specific.

---

# NoteTag Model

Notes and tags form a many-to-many relationship.

```text
Note
  ↕
NoteTag
  ↕
Tag
```

A note can have multiple tags.

A tag can belong to multiple notes.

The `NoteTag` relationship prevents the same tag from being attached to the same note more than once.

---

# Database Flow

The application uses:

```text
Express
   ↓
Prisma Client
   ↓
PrismaPg Adapter
   ↓
PostgreSQL
```

The backend does not directly expose the database to the frontend.

Instead:

```text
Frontend
    ↓
REST API
    ↓
Backend
    ↓
Prisma
    ↓
PostgreSQL
```

This ensures that authentication, validation, authorization, and business rules remain under backend control.

---

# Authentication Architecture

MemDev supports:

```text
Email + Password
Google OAuth
```

The authentication architecture is:

```text
                  Authentication
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
       Email + Password        Google OAuth
              │                     │
              └──────────┬──────────┘
                         ▼
                    MemDev User
                         │
                         ▼
                        JWT
                         │
                         ▼
                Protected API Routes
```

---

# Registration

Endpoint:

```http
POST /api/auth/register
```

Flow:

```text
Registration Request
        ↓
Validate Input
        ↓
Normalize Email
        ↓
Check Existing User
        ↓
Hash Password
        ↓
Create User
        ↓
Return Safe User Information
```

Password requirements are validated before the user is created.

Passwords are hashed using:

```text
bcryptjs
```

with the current configured cost factor.

Plain-text passwords are never stored.

---

# Login

Endpoint:

```http
POST /api/auth/login
```

Flow:

```text
Login Request
      ↓
Validate Input
      ↓
Find User
      ↓
Verify Password
      ↓
Generate JWT
      ↓
Return Authentication Information
```

The JWT is subsequently used to authenticate protected API requests.

---

# JWT Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT>
```

Authentication middleware performs:

```text
Authorization Header
        ↓
Extract Bearer Token
        ↓
Verify JWT
        ↓
Extract User ID
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

The endpoint returns safe information about the authenticated user.

Sensitive information such as:

```text
passwordHash
```

must never be returned.

---

# Google OAuth

Google authentication is implemented using Google's OAuth flow.

Endpoints:

```http
GET /api/auth/google
GET /api/auth/google/callback
```

The authentication flow is:

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
Find Existing Account
   ↓
Link / Create Account
   ↓
MemDev Authentication
```

Google-only accounts can exist with:

```text
passwordHash = null
googleId = <Google identity>
```

---

# User Data Isolation

User data isolation is a fundamental security requirement of MemDev.

The application must guarantee:

```text
User A
├── Note 1
├── Note 2
└── Note 3

User B
├── Note 4
└── Note 5
```

User A must never be able to:

```text
Read User B's notes
Modify User B's notes
Delete User B's notes
Use User B's tags
Use User B's collections
```

The backend enforces this through authenticated user ownership.

The core pattern is:

```text
JWT
 ↓
Authenticated User ID
 ↓
User-scoped Prisma Query
 ↓
Resource
```

The client is never trusted to determine ownership.

For example, a request such as:

```http
GET /api/notes/<some-id>
```

must verify that the requested note belongs to the authenticated user.

Knowing a resource ID must never be sufficient to access another user's resource.

---

# Backend API

The backend provides REST APIs for the web application and browser extension.

Current API groups include:

```text
/api/health

/api/auth

/api/notes

/api/collections

/api/tags
```

Future/expanded API groups include:

```text
/api/statistics
/api/ai
```

---

# Current API Summary

## System

```http
GET /api/health
```

---

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/auth/google
GET  /api/auth/google/callback
```

---

## Notes

```http
POST   /api/notes
GET    /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id
```

---

## Collections

```http
POST   /api/collections
GET    /api/collections
GET    /api/collections/:id
PATCH  /api/collections/:id
DELETE /api/collections/:id
```

---

## Tags

```http
POST   /api/tags
GET    /api/tags
PATCH  /api/tags/:id
DELETE /api/tags/:id

POST   /api/tags/notes/:noteId/:tagId
DELETE /api/tags/notes/:noteId/:tagId
```

---

## Search and Filtering

Search and filtering are currently integrated into the Notes experience.

The exact API and frontend responsibilities are intentionally kept simple for the current resume-focused scope.

---

# Phase 1 — Project / Monorepo Setup

## Goal

Establish the basic development environment and repository structure.

## Completed

* Initialized Git repository
* Configured pnpm workspace
* Created monorepo
* Created `apps/`
* Created `packages/`
* Added shared package
* Added configuration package
* Added `.gitignore`
* Added `.env.example`
* Added root `package.json`
* Added `pnpm-workspace.yaml`
* Connected GitHub repository
* Established project documentation
* Removed unnecessary generated/dependency files from Git tracking

Initial structure:

```text
memdev/
├── apps/
│   ├── web/
│   ├── backend/
│   └── extension/
│
├── packages/
│   ├── shared/
│   └── config/
│
├── docs/
│
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

# Phase 2 — Frontend Foundation

## Goal

Create the initial React application and frontend development environment.

Technology:

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
Lucide React
```

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
* Registration page foundation
* Dashboard foundation

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

## Goal

Create the Express backend and establish the basic API infrastructure.

Technology:

```text
Node.js
Express
TypeScript
Zod
CORS
dotenv
ESLint
```

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

Example:

```json
{
  "status": "ok",
  "service": "memdev-backend"
}
```

---

# Phase 4 — Backend Architecture

The backend was organized around a modular structure.

The general request flow is:

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
Service / Business Logic
   ↓
Prisma
   ↓
PostgreSQL
```

Implemented:

* Central route registration
* Authentication middleware
* 404 middleware
* Error middleware
* Environment configuration
* API routing
* Health check
* CORS configuration

Current API modules:

```text
Authentication
Notes
Collections
Tags
```

---

# Phase 5 — PostgreSQL + Prisma

## Goal

Introduce persistent relational storage.

Database:

```text
PostgreSQL 18
```

Development database:

```text
Database: memdev
Host: 127.0.0.1
Port: 5432
```

ORM:

```text
Prisma
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

# Phase 5I — Prisma Backend Integration

Prisma was integrated directly into the Express backend.

Database flow:

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

The backend now performs actual persistent database operations instead of using temporary in-memory data.

---

# Phase 8 — Authentication

Authentication became the first major protected backend subsystem.

Implemented:

```text
Registration
Login
Password hashing
JWT generation
JWT verification
Authentication middleware
Current user
Protected resources
Google OAuth
Google account linking
Google-only accounts
```

The authentication layer provides the foundation for all user-scoped MemDev resources.

---

# Phase 9 — Notes CRUD

Notes are the core entity of MemDev.

Implemented:

```text
Create
Read
Update
Delete
Favorite
Archive
```

The basic Notes API:

```http
POST   /api/notes
GET    /api/notes
GET    /api/notes/:id
PATCH  /api/notes/:id
DELETE /api/notes/:id
```

Every note is associated with the authenticated user.

---

# Phase 10 — Collections

Collections provide higher-level organization.

Implemented:

```text
Create collection
List collections
Get collection
Rename collection
Delete collection
Assign notes
Count notes
Ownership checks
```

Example collections:

```text
DSA
System Design
Web Development
Machine Learning
Cybersecurity
College
Projects
Placement
```

---

# Phase 11 — Tags

Tags provide flexible note-level organization.

Implemented:

```text
Create tag
List tags
Rename tag
Delete tag
Attach tag to note
Remove tag from note
Tag counts
Ownership checks
Duplicate relationship protection
```

Many-to-many relationship:

```text
Note
 ↕
NoteTag
 ↕
Tag
```

---

# Phase 22 — Note ↔ Tag Assignment

This phase connected the backend tag relationship to the note experience.

Users can:

```text
View tags attached to a note
Attach a tag
Remove a tag
Refresh the note
See persisted tag relationships
```

The application also prevents already-attached tags from being presented as available duplicate assignments.

The relationship is persisted in PostgreSQL through Prisma.

---

# Phase 23 — Search + Filtering

Phase 23 completed the Notes search and filtering experience.

The Notes experience supports:

```text
Search
Collection filtering
Tag filtering
Favorite filtering
Archive filtering
Sorting
Clear filters
```

---

## Search

Search is intended to help users locate notes quickly.

Relevant searchable information includes:

```text
Title
Content
Summary
Collection
Tags
```

The exact implementation remains user-scoped.

Conceptually:

```text
Authenticated User
        ↓
User's Notes
        ↓
Search Query
        ↓
Matching Notes
```

---

## Collection Filtering

Users can filter notes by collection.

Example:

```text
All Collections
System Design
DSA
Machine Learning
Web Development
```

---

## Tag Filtering

Users can filter notes using their tags.

Example:

```text
All Tags
React
Backend
Authentication
System Design
```

---

## Favorite Filtering

Users can restrict the Notes library to favorite notes.

```text
All Notes
      ↓
Favorites
```

---

## Archive Filtering

Users can distinguish between active and archived notes.

Conceptually:

```text
Active
Archived
All
```

---

## Sorting

The Notes experience supports sorting concepts including:

```text
Newest First
Oldest First
Recently Updated
Title A–Z
Title Z–A
```

---

## Clear Filters

Users can reset active filters and return to the default Notes view.

---

# Search Architecture

The current project intentionally uses standard text-based search.

The SRS explicitly avoids requiring semantic/vector search for Version 1.

Current approach:

```text
Notes
  ↓
Text Search
  ↓
Filters
  ↓
Sorting
  ↓
Results
```

Future semantic search could theoretically use:

```text
Note
 ↓
Embedding
 ↓
Vector Database
 ↓
Semantic Search
```

but this is intentionally outside the current project scope.

---

# End of Part 1

**Part 2 will continue directly from here** and contain the detailed sections for:

```text
Notes
Collections
Tags
Favorites
Archive
Trash
Dashboard
AI Summarization
Frontend architecture
Backend architecture
Browser extension architecture
Testing
Security
Environment configuration
Local development
Prisma
Git workflow
```

Then **Part 3** will contain the detailed:

```text
Phase 24 Browser Extension
Phase 25 Text Capture
Phase 26 Save to MemDev
Phase 27 Dashboard Polish
Phase 28 AI Polish
Phase 29 UX / Responsive Polish
Phase 30 QA + Security
Phase 31 Documentation / Portfolio
Deployment
Future roadmap
Out-of-scope decisions
Project philosophy
Final checkpoint
```


# Notes

Notes are the central entity of MemDev.

A note represents a piece of information that the user wants to preserve and revisit later.

A note can originate from:

```text
Manual creation
       OR
Browser Extension
       ↓
MemDev Note
```

The intended note model contains:

```text
Note
├── id
├── userId
├── collectionId
├── title
├── content
├── sourceUrl
├── sourceTitle
├── summary
├── isFavorite
├── isArchived
├── deletedAt
├── createdAt
└── updatedAt
```

Not every field is necessarily populated for every note.

For example, a manually created note may not have a `sourceUrl`, while a browser-captured note should preserve its original webpage context.

---

# Create Note

Users can create notes manually through the web application.

The current API is:

```http
POST /api/notes
```

Supported note information includes:

```text
Title
Content
Source URL
Collection
```

Tags can subsequently be assigned through the tag relationship.

The authenticated user's ID is obtained from the JWT rather than being trusted from the request body.

This prevents a client from creating a note under another user's account.

---

# List Notes

Endpoint:

```http
GET /api/notes
```

The API returns notes belonging to the authenticated user.

The Notes interface then applies search, filtering, and sorting to help users navigate their knowledge library.

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
Sorting
        ↓
Notes UI
```

---

# Get Individual Note

Endpoint:

```http
GET /api/notes/:id
```

The backend verifies ownership before returning the note.

This ensures that knowing a note ID is not sufficient to access another user's information.

---

# Update Note

Endpoint:

```http
PATCH /api/notes/:id
```

Users can update supported note fields.

The update operation remains protected by authentication and ownership checks.

The intended editable fields include:

```text
Title
Content
Source URL
Collection
Tags
```

The updated timestamp is maintained by the database model.

---

# Delete Note

Endpoint:

```http
DELETE /api/notes/:id
```

The current note-management implementation supports deletion.

The broader SRS requirement is to eventually implement a proper Trash workflow where deletion initially moves the note into Trash rather than immediately destroying it. 

The remaining Trash/restore functionality is therefore part of the future roadmap.

---

# Favorite Notes

Notes contain:

```text
isFavorite
```

A user can mark important notes as favorites.

The intended workflow is:

```text
Normal Note
    ↓
Favorite
    ↓
Important Knowledge
```

Favorites are also available as a filtering mechanism in the Notes experience.

The SRS specifies that Favorites should provide a dedicated way of accessing important notes. 

---

# Archive

Notes contain:

```text
isArchived
```

Archiving allows users to remove notes from the primary active-note workflow without treating them as deleted.

Conceptually:

```text
Active Note
     ↓
Archive
     ↓
Archived Note
     ↓
Restore
     ↓
Active Note
```

Archive filtering is already part of the Notes search/filtering experience.

The remaining work is primarily around completing the polished archive/restore UX.

---

# Trash

Trash is part of the intended final MemDev product.

The SRS specifies that deleted notes should initially move into Trash rather than immediately being permanently removed. Users should be able to:

```text
View deleted notes
Restore note
Permanently delete note
```



The planned Trash workflow is:

```text
Active Note
     ↓
Delete
     ↓
Trash
     ├── Restore
     │     ↓
     │   Active Note
     │
     └── Permanently Delete
```

This feature remains to be completed.

---

# Note Source Access

A major purpose of MemDev is preserving the context of captured information.

For a webpage-derived note:

```text
Note
├── Captured Content
├── Source URL
└── Source Page Title
```

The source URL should remain accessible from the note.

The intended behavior is:

```text
Saved Note
     ↓
Source URL
     ↓
Original Webpage
```

This allows the user to revisit the original source instead of treating the captured text as isolated information.

---

# Collections

Collections provide a higher-level organizational structure for notes.

Examples include:

```text
DSA
System Design
Web Development
Machine Learning
Cybersecurity
College
Projects
Placement
```

A collection belongs to a specific user.

The relationship is:

```text
User
 └── Collections
       └── Notes
```

---

# Collection API

Current endpoints:

```http
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

The backend associates the collection with the authenticated user.

---

# List Collections

Endpoint:

```http
GET /api/collections
```

The API returns only collections belonging to the authenticated user.

Collection information includes note counts where applicable.

Example conceptual response:

```json
{
  "collections": [
    {
      "id": "collection-id",
      "name": "System Design",
      "_count": {
        "notes": 5
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

A collection can be opened to view its associated notes.

Ownership is checked before returning the collection.

---

# Update Collection

Endpoint:

```http
PATCH /api/collections/:id
```

The authenticated owner can rename a collection.

---

# Delete Collection

Endpoint:

```http
DELETE /api/collections/:id
```

The authenticated owner can delete a collection.

The behavior of notes associated with deleted collections is governed by the database relationship and the current implementation.

---

# Collection Ownership

Collection ownership follows the same security principle as notes.

A user cannot:

```text
Read another user's collection
Rename another user's collection
Delete another user's collection
Assign notes to another user's collection
```

The backend determines ownership from the authenticated user.

---

# Tags

Tags provide flexible, note-level organization.

Unlike collections, which represent a broader grouping, tags allow a note to belong to several conceptual categories simultaneously.

Example:

```text
Note:
React Hooks Explained

Tags:
React
JavaScript
Frontend
Web Development
```

The SRS specifically defines tags as a mechanism for assigning one or more tags to a note and using them for filtering and organization. 

---

# Tag API

Current endpoints:

```http
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

Tags are automatically associated with the authenticated user.

Duplicate tag names for the same user are prevented.

---

# List Tags

Endpoint:

```http
GET /api/tags
```

Only the authenticated user's tags are returned.

The API can also provide note counts for tags.

Example conceptual representation:

```text
system-design     8 notes
react             5 notes
authentication    4 notes
backend           11 notes
```

---

# Rename Tag

Endpoint:

```http
PATCH /api/tags/:id
```

The authenticated owner can rename a tag.

Duplicate tag names are prevented for the same user.

---

# Delete Tag

Endpoint:

```http
DELETE /api/tags/:id
```

Deleting a tag also removes its associated note-tag relationships according to the database relationship configuration.

The notes themselves are not deleted merely because a tag is removed.

---

# Attach Tag to Note

Endpoint:

```http
POST /api/tags/notes/:noteId/:tagId
```

Before creating the relationship, the backend verifies:

```text
Note belongs to authenticated user
        AND
Tag belongs to authenticated user
```

Only then can the relationship be created.

This is important because simply verifying the note or tag individually would not be sufficient.

---

# Remove Tag from Note

Endpoint:

```http
DELETE /api/tags/notes/:noteId/:tagId
```

The backend removes the relationship after verifying ownership.

The note remains intact.

The tag also remains available for other notes.

---

# Many-to-Many Tag Relationship

The database relationship is:

```text
                 ┌─────────────┐
                 │    Note     │
                 └──────┬──────┘
                        │
                        │
                 ┌──────▼──────┐
                 │   NoteTag   │
                 └──────┬──────┘
                        │
                        │
                 ┌──────▼──────┐
                 │     Tag     │
                 └─────────────┘
```

This design allows:

```text
One Note
   ↓
Multiple Tags

One Tag
   ↓
Multiple Notes
```

---

# Search and Filtering

Search and filtering became a major milestone in Phase 23.

The goal is to make the knowledge base useful even after the number of saved notes becomes large.

The SRS specifies that search should initially consider note title, content, tags, and source webpage title, while standard text-based search is sufficient for Version 1. 

---

# Search

The search workflow is:

```text
User enters query
        ↓
Notes collection
        ↓
Search matching information
        ↓
Matching notes
```

Conceptually:

```text
Search:
"authentication"

Results:
├── JWT Authentication
├── OAuth Guide
├── Node.js Authentication
└── React Authentication
```

Search remains user-scoped.

A search query must never expose resources belonging to another account.

---

# Filtering

Search can be combined with organizational filters.

Current filtering concepts include:

```text
Collection
Tag
Favorite
Archive
```

The intended SRS also identifies date-based filtering as part of the complete filtering experience. 

The implementation can be expanded where necessary during later UX refinement.

---

# Combined Search + Filtering

The major benefit is that search and filtering are not isolated features.

A user can conceptually perform:

```text
Search:
"authentication"

        +

Tag:
Backend

        +

Collection:
Web Development

        +

Sort:
Newest First
```

The resulting workflow becomes:

```text
All User Notes
      ↓
Search
      ↓
Collection Filter
      ↓
Tag Filter
      ↓
Favorite / Archive Filter
      ↓
Sort
      ↓
Final Results
```

This makes the knowledge library considerably easier to navigate.

---

# Sorting

Sorting allows users to change how notes are displayed.

Supported sorting concepts include:

```text
Newest First
Oldest First
Recently Updated
Alphabetical
```

The SRS explicitly identifies these sorting modes as part of the intended product. 

---

# Dashboard

The Dashboard is intended to become the central overview of the user's MemDev knowledge base.

The SRS specifies statistics such as:

```text
Total Notes
Favorite Notes
Collections
Archived Notes
Recently Added Notes
```



The intended dashboard structure is:

```text
                    Dashboard
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Statistics        Recent Notes     Quick Actions
        │
        ├── Total Notes
        ├── Favorites
        ├── Collections
        └── Archived
```

Dashboard functionality is being treated as a separate refinement area after the core Notes functionality.

---

# Dashboard Statistics

The backend is intended to expose user-scoped statistics such as:

```text
totalNotes
favoriteNotes
archivedNotes
totalCollections
totalTags
recentNotes
```

The important architectural requirement is that all statistics must be calculated for the authenticated user only.

For example:

```text
User A → 20 notes
User B → 50 notes
```

User A's dashboard must never show User B's statistics.

---

# AI Summarization

AI summarization is the primary AI feature planned for MemDev.

The SRS intentionally keeps the AI scope focused on summarization rather than introducing a complex AI agent or assistant. 

The basic workflow is:

```text
Note Content
     ↓
Backend
     ↓
OpenAI API
     ↓
Generated Summary
     ↓
Store Summary
     ↓
Display in Note
```

---

# AI Summary Example

Original content:

```text
[Long article or captured text]
```

Generated summary:

```text
Docker containers provide a consistent environment
for running applications across different systems.
```

The summary is stored with the note.

---

# AI Requirements

The AI implementation should:

* Generate a concise summary
* Store the generated summary
* Display the summary in note details
* Allow summarization of manually created notes
* Allow summarization of browser-captured notes
* Handle API failures gracefully
* Never make saving a note dependent on AI availability

This last requirement is particularly important.

The core product is a knowledge-storage application.

AI is an enhancement.

Therefore:

```text
AI Available
    ↓
Save Note
    ↓
Generate Summary
    ↓
Store Summary

AI Unavailable
    ↓
Save Note
    ↓
Continue Normally
```

The note itself must remain usable even when the AI service fails.

---

# Why OpenAI Is Not the Core Storage Layer

MemDev does not depend on AI for its basic functionality.

The application should continue working when:

```text
OpenAI API is unavailable
API key is missing
Network request fails
AI response fails
AI request times out
```

This makes the architecture more robust and prevents an external service from becoming a single point of failure for the primary product.

---

# Browser Extension

The browser extension is one of the most important remaining components of MemDev.

The SRS explicitly describes the extension as the **primary quick-capture mechanism** of the application. 

The extension will allow users to capture information without manually copying it into the web application.

The intended extension stack is:

```text
TypeScript
Chrome Manifest V3
Content Scripts
Chrome Extension APIs
```

---

# Extension Responsibilities

The extension will eventually be responsible for:

```text
Detect selected text
Capture selected text
Capture current URL
Capture webpage title
Display captured information
Allow review
Allow optional editing
Send data to backend
Save note
Quick Save
```

The browser extension should remain lightweight.

Important business rules should remain on the backend.

---

# Extension Capture Flow

The intended standard flow is:

```text
Webpage
   ↓
User highlights text
   ↓
Extension detects selection
   ↓
Extension captures:
   • Selected Text
   • Current URL
   • Page Title
   ↓
Extension popup opens
   ↓
User reviews captured information
   ↓
Optional:
   • Edit title
   • Add tags
   • Choose collection
   • Favorite
   ↓
Save
   ↓
Backend
   ↓
PostgreSQL
```

---

# Quick Save Flow

The quick-save feature is designed for minimal interaction.

```text
Highlight useful text
        ↓
Quick Save
        ↓
Selected text captured
        ↓
URL automatically captured
        ↓
Page title automatically captured
        ↓
Backend
        ↓
Note saved
```

The user should not need to manually enter:

```text
URL
Webpage title
```

The SRS explicitly identifies this as an important requirement. 

---

# Browser Extension Authentication

The extension must eventually be able to associate a captured note with the correct MemDev account.

Conceptually:

```text
Extension
    ↓
Authentication
    ↓
MemDev User
    ↓
JWT / Session
    ↓
Backend
```

The extension should never be trusted to determine which user owns the note.

The backend must authenticate the request and derive ownership from the authenticated identity.

---

# Extension ↔ Backend Communication

The extension will communicate with the same backend API used by the web application.

Conceptually:

```text
                 ┌──────────────┐
                 │ MemDev API   │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
        Web Application       Browser Extension
```

This avoids maintaining a second backend or separate data-access system for the extension.

---

# Browser Extension Architecture

The planned extension structure is:

```text
apps/extension/
│
├── public/
│
└── src/
    │
    ├── background/
    │   └── service-worker.ts
    │
    ├── content/
    │   └── content-script.ts
    │
    ├── popup/
    │   ├── components/
    │   ├── pages/
    │   ├── App.tsx
    │   └── main.tsx
    │
    ├── options/
    │
    ├── services/
    │   └── api.ts
    │
    ├── utils/
    │
    └── types/
```

This follows the architecture proposed by the SRS while keeping the implementation practical for the current project scope. 

---

# Content Script

The content script will interact with the webpage.

Its primary responsibilities will include:

```text
Detect selected text
Read selected text
Read current webpage URL
Read document title
Communicate captured information
```

Conceptually:

```text
Webpage
   ↓
Content Script
   ↓
Selected Text
   +
URL
   +
Page Title
```

---

# Background Service Worker

The Manifest V3 service worker can handle extension-level background operations.

Potential responsibilities include:

```text
Extension events
Message passing
Authentication state
API communication
```

The implementation should remain minimal and should only contain logic that genuinely belongs in the background context.

---

# Extension Popup

The popup will provide the user interface for captured information.

A conceptual popup:

```text
┌───────────────────────────────┐
│          MemDev               │
├───────────────────────────────┤
│ Title                         │
│ [Captured Page Title       ]  │
│                               │
│ Selected Text                 │
│ ┌───────────────────────────┐ │
│ │ Captured webpage text...   │ │
│ └───────────────────────────┘ │
│                               │
│ Collection                    │
│ [ Select Collection        ▼] │
│                               │
│ Tags                          │
│ [ Add Tags                 ]  │
│                               │
│ [ Quick Save ]   [ Save ]     │
└───────────────────────────────┘
```

The final visual design will be implemented during the extension phases.

---

# Testing Strategy

Testing is an important part of MemDev because the backend contains security-sensitive user ownership logic.

The current backend test framework is:

```text
Vitest
+
Supertest
```

---

# Current Test Suites

The backend currently contains tests covering:

```text
apps/backend/tests/
│
├── auth.routes.test.ts
├── notes.routes.test.ts
├── collections.routes.test.ts
└── tags.routes.test.ts
```

The Notes test suite has also been updated as note/tag functionality has evolved.

---

# Authentication Tests

Authentication tests cover important behavior such as:

```text
Registration
Validation
Duplicate accounts
Login
Invalid credentials
JWT authentication
Protected resources
Current user
Google-related authentication behavior where testable
```

---

# Notes Tests

The Notes API tests cover:

```text
Create note
List notes
Get note
Update note
Delete note
Authentication
Ownership
Cross-user isolation
Collection ownership
Favorite/archive behavior
AI summarization
AI failure handling
```

---

# Collections Tests

Collection tests cover:

```text
Create
List
Get
Update
Delete
Authentication
Ownership
Cross-user isolation
Note relationships
Validation
```

---

# Tags Tests

Tag tests cover:

```text
Create
List
Rename
Delete
Attach to note
Remove from note
Authentication
Ownership
Duplicate tags
Duplicate relationships
Cross-user isolation
```

---

# Search and Filtering Tests

Search/filtering functionality should be tested to ensure that:

```text
Search results are user-scoped
Filters work independently
Filters can be combined
Sorting works
Archived/favorite states are respected
```

The purpose is not to maximize test-count metrics.

The goal is to verify important application behavior.

---

# Validation Workflow

For backend changes:

```bash id="9x0q1g"
pnpm --filter @memdev/backend test
pnpm --filter @memdev/backend build
pnpm --filter @memdev/backend lint
```

For frontend changes:

```bash id="6s7r2f"
pnpm --filter web build
pnpm --filter web lint
```

For Prisma/database changes:

```bash id="8w6skj"
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
```

---

# Manual Testing Philosophy

Manual testing is not repeated unnecessarily when automated tests already provide strong coverage.

For example, if a Notes API ownership rule is covered by automated tests, repeatedly testing the same API manually provides limited additional value.

Manual testing is reserved for areas where the real environment matters.

Examples:

```text
Google OAuth
Browser UI
Browser Extension
Browser permissions
Webpage selection
External OpenAI API
Complete end-to-end workflows
```

This approach keeps development efficient while maintaining confidence in the implementation.

---

# Security Principles

Security is particularly important because MemDev stores private user knowledge.

The application follows several security principles.

---

## Password Security

Passwords are hashed using bcrypt.

Plain-text passwords must never be stored.

```text
Password
   ↓
bcrypt
   ↓
Password Hash
   ↓
Database
```

---

## JWT Authentication

Protected endpoints require valid authentication.

```text
Authorization Header
        ↓
JWT
        ↓
Verification
        ↓
User ID
```

---

## User Ownership

Every user-owned resource must be scoped to the authenticated user.

This includes:

```text
Notes
Collections
Tags
NoteTag relationships
Search
Filtering
Dashboard statistics
```

---

## Input Validation

Backend input is validated using Zod.

The backend must never blindly trust data received from:

```text
Web frontend
Browser extension
External clients
```

Conceptually:

```text
Incoming Data
      ↓
Zod Validation
      ↓
Business Logic
      ↓
Database
```

---

# Environment Configuration

Sensitive configuration belongs in environment variables.

Example:

```env id="k3cqg7"
PORT=5000

FRONTEND_URL=http://localhost:5173

DATABASE_URL="postgresql://postgres:<password>@localhost:5432/memdev?schema=public"

JWT_SECRET="<strong-secret>"

GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

OPENAI_API_KEY="<openai-api-key>"
```

Future extension configuration may also require:

```env id="6a9u7b"
EXTENSION_ID="<extension-id>"
```

The actual `.env` file must never be committed.

Never commit:

```text
.env
Database passwords
JWT secrets
Google OAuth secrets
OpenAI API keys
Production credentials
```

---

# Local Development

## Install Dependencies

From the repository root:

```bash id="8t4x9k"
pnpm install
```

---

# Start PostgreSQL

Ensure PostgreSQL is running locally.

Development database:

```text id="oz14jo"
Database: memdev
Host: 127.0.0.1
Port: 5432
```

---

# Start Backend

```bash id="j1z9f3"
pnpm --filter @memdev/backend dev
```

Backend:

```text id="k6zq78"
http://localhost:5000
```

API:

```text id="8y6y3n"
http://localhost:5000/api
```

Health check:

```text id="u9l7o6"
http://localhost:5000/api/health
```

---

# Start Frontend

```bash id="v1u2l9"
pnpm --filter web dev
```

Frontend:

```text id="w8e6ef"
http://localhost:5173
```

---

# Backend Commands

## Development

```bash id="f3y9t1"
pnpm --filter @memdev/backend dev
```

## Test

```bash id="s3m7xn"
pnpm --filter @memdev/backend test
```

## Build

```bash id="c6f8qm"
pnpm --filter @memdev/backend build
```

## Lint

```bash id="1x1iib"
pnpm --filter @memdev/backend lint
```

---

# Frontend Commands

## Development

```bash id="e1j3g5"
pnpm --filter web dev
```

## Build

```bash id="a5g0p8"
pnpm --filter web build
```

## Lint

```bash id="q3y0p7"
pnpm --filter web lint
```

---

# Prisma Commands

## Validate Schema

```bash id="2f7d4x"
pnpm --filter @memdev/backend exec prisma validate
```

## Generate Prisma Client

```bash id="f8j1u4"
pnpm --filter @memdev/backend exec prisma generate
```

## Check Migration Status

```bash id="h2l4w9"
pnpm --filter @memdev/backend exec prisma migrate status
```

## Create Development Migration

```bash id="v5x0a2"
pnpm --filter @memdev/backend exec prisma migrate dev --name <migration-name>
```

## Prisma Studio

```bash id="c8j4q2"
pnpm --filter @memdev/backend exec prisma studio
```

---

# Git Workflow

MemDev is intentionally developed using small, meaningful Git commits.

Preferred commit prefixes:

```text
feat:
fix:
test:
refactor:
docs:
chore:
polish:
```

Examples:

```text
feat: add notes CRUD API
feat: add collections API
feat: add tags API
feat: add note tag assignment
feat: add search and filtering
fix: resolve note ownership query
test: update notes API tests
polish: improve notes filtering UI
```

---

# Git Development Cycle

Before making a commit:

```bash id="0wq8q3"
git status
```

After implementation:

```bash id="0o8j7v"
git add <relevant-files>
git commit -m "<commit-message>"
git push
```

The project avoids creating meaningless commits purely to inflate the Git history.

A commit should represent a meaningful development milestone.

---

# Current Git Philosophy

The project intentionally follows:

```text
Meaningful Change
       ↓
Validation
       ↓
Meaningful Commit
```

rather than:

```text
Tiny Change
    ↓
Artificial Commit
    ↓
Artificial Commit Count
```

The SRS similarly recommends a realistic number of meaningful commits rather than manufacturing dozens of commits. 

---

# UI Design Direction

The web application follows the project's established UI direction:

```text
Editorial
+
Productivity
+
Personal Knowledge Library
```

The intended visual character is:

```text
Premium
Calm
Minimal
Content-first
Human-designed
```

The design avoids looking like a generic AI SaaS dashboard.

The detailed visual system is maintained separately in:

```text
UI.md
```

That document contains the project's UI design decisions including:

```text
Typography
Colors
Spacing
Icons
Component styling
Visual hierarchy
```

The README documents product functionality and architecture, while `UI.md` acts as the visual design reference.

---

# Frontend Route Protection

The frontend uses protected and public-only route behavior.

Conceptually:

```text
                    Route
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        Public Route      Protected Route
             │                 │
             ▼                 ▼
       Login/Register      Authentication
                               │
                        ┌──────┴──────┐
                        │             │
                       Yes            No
                        │             │
                        ▼             ▼
                    Application     Login
```

Authenticated users should not need to access login/register pages unnecessarily.

Unauthenticated users should not be allowed to access protected application routes.

---

# API Client

The frontend communicates with the backend through the API client.

The client is responsible for:

```text
Building requests
Adding authentication headers
Parsing responses
Handling API errors
Providing typed API functions
```

The current frontend API layer includes functions for:

```text
Authentication
Notes
Collections
Tags
Note-tag relationships
Dashboard
AI summarization
```

The architecture keeps API communication separate from page components.

---

# API Error Handling

The frontend API layer uses a structured API error representation.

Conceptually:

```text
Backend
   ↓
HTTP Error
   ↓
API Error
   ↓
Frontend
   ↓
User-friendly message
```

This prevents raw server errors from being directly exposed to users.

The SRS specifically requires understandable error handling for situations such as:

```text
Invalid registration
Invalid login
Unauthorized requests
Invalid note data
Missing notes
Invalid URLs
Database errors
Network errors
AI failures
Extension failures
```



---

# Data Persistence

MemDev uses PostgreSQL for persistent storage.

Saved information should remain available after:

```text
Browser refresh
Application restart
Backend restart
Logout
Logging in again later
```

This is a fundamental requirement of the product. 

The persistence flow is:

```text
User Action
    ↓
REST API
    ↓
Prisma
    ↓
PostgreSQL
    ↓
Persistent Data
```

---

# Architecture Principles

The project follows several architectural principles defined by the SRS.

## 1. Keep the architecture simple

The project does not need distributed infrastructure.

## 2. Use a modular monolith

Backend functionality is separated logically without introducing multiple services.

## 3. Separate applications clearly

```text
Web
Backend
Extension
```

each have distinct responsibilities.

## 4. Use TypeScript

TypeScript is used consistently throughout the stack.

## 5. Protect user data

Authorization is enforced by the backend.

## 6. Validate external input

Zod is used for runtime validation.

## 7. Avoid premature scalability

Infrastructure should only be added when the actual project requires it.

## 8. Prioritize functionality and polish

A complete working application is more valuable for this project than unnecessary architectural complexity.

These principles are consistent with the SRS architecture guidance. 

---

# Current Architecture Checkpoint

The current working architecture can be represented as:

```text
                         MEMDEV
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      React Web       Express API       Extension
          │                │                │
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                      PostgreSQL
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
             Google OAuth        OpenAI API
```

Current implemented path:

```text
React
  ↓
REST API
  ↓
JWT
  ↓
Express
  ↓
Prisma
  ↓
PostgreSQL
```

The next major architectural addition is:

```text
Chrome Extension
       ↓
REST API
       ↓
Existing Backend
```

This means the extension does not require a separate backend.

---

# Phase-Based Development Philosophy

MemDev is intentionally being developed incrementally.

Each phase should be:

```text
Small
Meaningful
Testable
Reviewable
Commit-ready
```

The project avoids attempting to implement the entire SRS in one massive change.

This makes it easier to:

* Identify bugs
* Review Git history
* Validate architecture
* Understand regressions
* Demonstrate development progress
* Maintain a clean project history

---

# Remaining Major Work

The remaining project roadmap is now:

```text
Phase 24
Browser Extension — Foundation
        ↓
Phase 25
Capture Selected Text
        ↓
Phase 26
Save to MemDev
        ↓
Phase 27
Dashboard Polish
        ↓
Phase 28
AI Experience Polish
        ↓
Phase 29
Global UX + Responsive Polish
        ↓
Phase 30
Full QA + Security Review
        ↓
Phase 31
README + Screenshots + Portfolio Polish
```

This is the **current development roadmap**, replacing the older phase numbering from the original README.

---

# Phase 24 — Browser Extension Foundation

Phase 24 is the next implementation phase.

The objective is **not yet to build the complete capture-and-save workflow**.

Instead, Phase 24 should establish the extension itself.

Planned work:

```text
Create apps/extension
        ↓
Configure TypeScript
        ↓
Configure Manifest V3
        ↓
Create extension entry points
        ↓
Create popup
        ↓
Create background service worker
        ↓
Create content script
        ↓
Verify extension loads in Chrome
```

Expected initial structure:

```text
apps/extension/
├── public/
│
├── src/
│   ├── background/
│   │   └── service-worker.ts
│   │
│   ├── content/
│   │   └── content-script.ts
│   │
│   ├── popup/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── components/
│   │
│   ├── services/
│   ├── utils/
│   └── types/
│
├── manifest.json
└── package.json
```

Phase 24 success criteria:

```text
Extension builds
        ✓
Manifest is valid
        ✓
Chrome can load extension
        ✓
Popup opens
        ✓
Content script loads
        ✓
Background service worker loads
        ✓
No unnecessary permissions
```

---

# Phase 25 — Capture Selected Text

After the extension foundation is working, Phase 25 will implement the actual webpage capture mechanism.

The extension should capture:

```text
Selected Text
Current URL
Page Title
```

The intended flow:

```text
User highlights text
        ↓
Content Script
        ↓
Read window selection
        ↓
Capture URL
        ↓
Capture document title
        ↓
Send captured data to popup
```

The captured data should be represented as structured information rather than an unstructured string.

Conceptually:

```typescript
{
  text: "...",
  url: "...",
  title: "..."
}
```

---

# Phase 26 — Save to MemDev

Phase 26 will connect the extension to the existing backend.

The workflow will become:

```text
Webpage
   ↓
Highlight Text
   ↓
Extension
   ↓
Capture Text + URL + Title
   ↓
Review
   ↓
Save
   ↓
MemDev REST API
   ↓
PostgreSQL
```

This is the phase where MemDev's browser capture loop becomes genuinely functional.

Optional metadata should eventually include:

```text
Collection
Tags
Favorite
```

---

# Extension Authentication

Authentication must be handled carefully.

The extension needs a way to determine the authenticated MemDev account.

The final architecture should ensure:

```text
Extension
   ↓
Authenticated Request
   ↓
Backend
   ↓
JWT Verification
   ↓
Authenticated User
   ↓
Create Note
```

The extension must not send an arbitrary `userId` and expect the backend to trust it.

---

# Phase 27 — Dashboard Polish

Once the browser capture flow is functional, the Dashboard will be refined.

Potential improvements:

```text
Better statistics
Recent notes
Recent activity
Quick actions
Empty states
Loading states
Better navigation
```

The goal is to make the application feel like a finished knowledge-management product rather than a collection of CRUD screens.

---

# Phase 28 — AI Experience Polish

The core AI summarization functionality exists, but the user experience around it can be improved.

Potential work:

```text
Better loading state
Summary regeneration
AI error messages
Summary presentation
Optional summarization controls
Improved AI interaction
```

The AI should remain optional.

---

# Phase 29 — Global UX + Responsive Polish

The SRS requires MemDev to work across:

```text
Desktop
Laptop
Tablet
Mobile
```



Phase 29 will focus on:

```text
Responsive layouts
Mobile navigation
Spacing
Typography
Forms
Buttons
Modals
Loading states
Empty states
Error states
Accessibility
Dark mode
```

The goal is not to create a separate mobile application.

The web application itself should adapt to smaller screens.

---

# Phase 30 — Full QA + Security Review

The final functional phase will perform a complete review.

Testing areas:

```text
Authentication
Notes
Collections
Tags
Search
Filtering
Favorites
Archive
Trash
AI
Extension
Authorization
User isolation
Error handling
Responsive UI
```

Security review areas:

```text
JWT handling
Ownership checks
Input validation
CORS
Extension permissions
Environment secrets
API authorization
Production configuration
```

---

# Phase 31 — README + Screenshots + Portfolio Polish

The final phase will prepare the project for presentation.

Planned deliverables:

```text
Complete README
Architecture documentation
Screenshots
Feature overview
Setup instructions
Deployment instructions
Browser extension documentation
AI documentation
Project demo flow
Resume-ready project description
```

The goal is to make it immediately understandable to:

```text
Recruiter
Interviewer
Developer
Professor
Project Reviewer
```

---

# Part 2 Complete

# Part 3 — Future Development, Deployment, QA & Portfolio Completion

## Phase 24–31 Detailed Execution Plan

The remaining phases focus on completing the browser-extension workflow, polishing the existing application, performing a complete QA/security pass, and preparing MemDev as a polished portfolio project.

The development sequence is intentionally:

```text
Core Web Application
        ↓
Search + Organization
        ↓
Browser Capture
        ↓
Capture → Save Workflow
        ↓
Dashboard + AI Polish
        ↓
Global UX Polish
        ↓
Security + QA
        ↓
Documentation + Portfolio
```

This ensures that the most important product capability — quickly capturing knowledge from the web — is implemented before final polish.

---

# Phase 24 — Browser Extension Foundation

**Priority: Critical**

Phase 24 introduces the Chrome extension as a new application inside the monorepo.

The objective is to establish a working Manifest V3 extension without implementing the complete capture workflow yet.

---

## Phase 24 Goals

The extension should:

* Build successfully
* Load successfully in Chrome
* Have a valid Manifest V3 configuration
* Display a popup
* Have a background service worker
* Have a content script
* Have a clean TypeScript structure
* Communicate internally through extension messaging
* Use only the permissions it actually needs

The extension should initially be treated as a separate frontend application that consumes the existing MemDev backend.

---

## Planned Structure

```text
apps/
├── backend/
├── web/
└── extension/
    │
    ├── public/
    │
    ├── src/
    │   ├── background/
    │   │   └── service-worker.ts
    │   │
    │   ├── content/
    │   │   └── content-script.ts
    │   │
    │   ├── popup/
    │   │   ├── App.tsx
    │   │   ├── main.tsx
    │   │   └── components/
    │   │
    │   ├── services/
    │   │   └── api.ts
    │   │
    │   ├── types/
    │   │
    │   └── utils/
    │
    ├── manifest.json
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

The exact structure may be simplified if a smaller implementation is more appropriate.

The objective is not to introduce unnecessary complexity.

---

# Manifest V3

The extension will use Chrome Manifest V3.

Conceptually:

```text
Manifest
├── name
├── version
├── manifest_version: 3
├── action
│   └── popup
├── background
│   └── service_worker
├── content_scripts
├── permissions
└── host_permissions
```

Permissions should remain minimal.

The extension should not request broad browser permissions unless required by an implemented feature.

---

# Extension Popup

The initial popup can be simple.

For example:

```text
┌─────────────────────────────┐
│          MemDev             │
│                             │
│ Save useful knowledge        │
│ directly from the web.      │
│                             │
│       [ Capture ]           │
│                             │
└─────────────────────────────┘
```

The final popup will become more functional in Phase 25 and Phase 26.

---

# Phase 24 Success Criteria

Phase 24 is complete when:

```text
✓ Extension project exists
✓ Manifest V3 is valid
✓ Extension builds
✓ Extension can be loaded unpacked
✓ Popup opens
✓ Background service worker loads
✓ Content script loads
✓ Internal messaging can be demonstrated
✓ No unnecessary permissions are requested
✓ Existing web/backend applications remain unaffected
```

---

# Phase 25 — Browser Extension: Capture Selected Text

**Priority: Critical**

Phase 25 implements the primary browser-capture interaction.

The user should be able to highlight text on a webpage and make MemDev aware of that selection.

---

# Selection Capture

The content script will inspect the current page selection.

Conceptually:

```text
User highlights text
        ↓
window.getSelection()
        ↓
Selected text
```

The extension will also collect:

```text
Current URL
Document title
```

Therefore the captured object can conceptually look like:

```typescript
{
  text: string;
  url: string;
  title: string;
}
```

---

# Capture Flow

```text
┌──────────────────────────────┐
│          Webpage             │
│                              │
│  User highlights useful text │
└──────────────┬───────────────┘
               │
               ▼
       Content Script
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
     Text     URL     Title
       │       │        │
       └───────┼────────┘
               ▼
        Extension Popup
```

---

# Popup Preview

After selecting text, the extension should allow the user to inspect what is about to be saved.

Example:

```text
┌──────────────────────────────────┐
│ MemDev                            │
├──────────────────────────────────┤
│ Title                             │
│ React Documentation               │
│                                   │
│ Selected text                     │
│ ┌──────────────────────────────┐  │
│ │ useEffect lets you synchronize│  │
│ │ a component with an external │  │
│ │ system...                    │  │
│ └──────────────────────────────┘  │
│                                   │
│ Source                            │
│ developer.example.com             │
│                                   │
│            [ Save ]                │
└──────────────────────────────────┘
```

The user should be able to see what was captured before saving.

---

# Captured Metadata

The extension should automatically obtain:

```text
Selected Text
Page Title
Page URL
```

This is important because manually entering source information defeats much of the purpose of the extension.

The SRS identifies automatic capture of the selected text, page URL, and page title as a core extension requirement. 

---

# Phase 25 Success Criteria

```text
✓ User can select webpage text
✓ Extension detects selection
✓ Selected text is captured
✓ Current URL is captured
✓ Page title is captured
✓ Captured information reaches popup
✓ User can preview captured content
✓ Existing web application remains functional
```

---

# Phase 26 — Browser Extension: Save to MemDev

**Priority: Critical**

Phase 26 connects the extension to the existing MemDev backend.

This phase completes the core browser-capture workflow.

---

# Extension API Integration

The extension will use the existing backend API rather than introducing another backend.

Conceptually:

```text
Chrome Extension
       │
       │ HTTP
       ▼
MemDev REST API
       │
       ▼
Express
       │
       ▼
Prisma
       │
       ▼
PostgreSQL
```

This keeps the architecture simple.

---

# Saving Captured Text

The extension will convert captured webpage information into a note.

Conceptually:

```typescript
{
  title: "...",
  content: "...",
  sourceUrl: "https://...",
}
```

The existing Notes API can then process the request.

---

# Collection Selection

Where practical, the popup should allow users to choose a collection before saving.

Example:

```text
Collection

[ System Design             ▼ ]
```

The extension can retrieve available collections from:

```http
GET /api/collections
```

and display them to the user.

---

# Tag Selection

The extension can similarly retrieve tags.

Example:

```text
Tags

[ React ] [ Frontend ] [ + Add ]
```

Selected tags can then be attached to the newly created note using the existing tag APIs.

---

# Favorite

The extension can optionally provide:

```text
☐ Save as favorite
```

If enabled, the note can be created and subsequently updated with:

```json
{
  "isFavorite": true
}
```

This is optional if keeping the first extension version minimal.

---

# Quick Save

The final extension should support a low-friction save workflow.

Conceptually:

```text
Highlight
   ↓
Quick Save
   ↓
Automatically capture:
   • Text
   • URL
   • Title
   ↓
Save
```

The user should not be forced through unnecessary configuration when they simply want to save something quickly.

The SRS describes quick-save as a core extension capability. 

---

# Save Success

After a successful save, the extension should communicate clearly.

Example:

```text
┌─────────────────────────────┐
│ ✓ Saved to MemDev            │
│                              │
│ React Documentation          │
│                              │
│ [ Open Note ]                │
└─────────────────────────────┘
```

The exact UI can be refined later.

---

# Save Failure

If the backend cannot be reached:

```text
┌─────────────────────────────┐
│ Unable to save               │
│                              │
│ MemDev could not be reached. │
│ Please try again.            │
│                              │
│ [ Retry ]                    │
└─────────────────────────────┘
```

The extension should not silently fail.

---

# Extension Authentication

Authentication is an important implementation detail.

The extension must save notes on behalf of the currently authenticated MemDev user.

The backend remains responsible for determining ownership.

The conceptual flow is:

```text
Extension
    ↓
Authentication Token
    ↓
Authorization: Bearer <token>
    ↓
Backend
    ↓
JWT Verification
    ↓
Authenticated User
    ↓
Create Note
```

The backend must never trust:

```json
{
  "userId": "some-user-id"
}
```

provided by the extension.

Instead:

```text
JWT
 ↓
Authenticated User ID
 ↓
Note.userId
```

---

# Phase 26 Success Criteria

```text
✓ Extension can authenticate
✓ Extension can call MemDev API
✓ Captured text can become a note
✓ Source URL is preserved
✓ Page title can be preserved
✓ User can select collection
✓ User can optionally select tags
✓ Save success is shown
✓ Save errors are handled
✓ Saved note appears in web application
✓ Existing backend ownership checks remain intact
```

---

# End-to-End Capture Workflow

After Phase 26, the main differentiating feature of MemDev should work like this:

```text
             INTERNET
                │
                ▼
        ┌───────────────┐
        │    Webpage    │
        └───────┬───────┘
                │
          Highlight Text
                │
                ▼
       ┌────────────────┐
       │ Chrome         │
       │ Extension      │
       └───────┬────────┘
               │
       Text + URL + Title
               │
               ▼
       ┌────────────────┐
       │ MemDev API     │
       └───────┬────────┘
               │
               ▼
          PostgreSQL
               │
               ▼
          Saved Note
               │
               ▼
       ┌────────────────┐
       │ MemDev Web App │
       └────────────────┘
```

This is the core end-to-end product story.

---

# Phase 27 — Dashboard Polish

**Priority: Medium**

Once the core capture workflow is complete, the dashboard can be refined.

The goal is to answer one simple question:

> "What is happening in my knowledge library?"

---

# Dashboard Components

Potential final dashboard:

```text
┌────────────────────────────────────────────────┐
│ Dashboard                                      │
│                                                │
│ Good evening                                   │
│ Here's what's happening in your library.       │
│                                                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │ Notes    │ │ Favorites│ │ Archived │         │
│ │   42     │ │    8     │ │    3     │         │
│ └──────────┘ └──────────┘ └──────────┘         │
│                                                │
│ Recent Notes                                   │
│ ────────────────────────────────────────────── │
│ React Hooks...                                 │
│ System Design...                               │
│ JWT Authentication...                          │
│                                                │
│ Collections                                    │
│ ────────────────────────────────────────────── │
│ DSA          12 notes                          │
│ Web Dev       8 notes                          │
└────────────────────────────────────────────────┘
```

---

# Dashboard Empty State

A new account should not feel broken.

Instead of displaying empty statistics with no explanation:

```text
No notes yet.
```

the application should guide the user:

```text
Your knowledge library is empty.

Start by creating your first note
or capture something from the web.

[ Create Note ]   [ Capture from Web ]
```

---

# Dashboard Quick Actions

Potential actions:

```text
Create Note
Browse Notes
Create Collection
Open Favorites
```

After the extension is implemented:

```text
Capture from Web
```

can also become part of the onboarding experience.

---

# Phase 28 — AI Experience Polish

**Priority: Medium**

The AI summarization backend already exists.

Phase 28 focuses on making it feel integrated rather than simply adding an "AI" button.

---

# Summary Presentation

The summary should have clear visual hierarchy.

Example:

```text
Summary

React Hooks provide a way to use state and other React
features inside functional components...
```

The summary should not visually compete with the original content.

---

# AI Loading State

Instead of freezing the page:

```text
Generating...
```

the UI should clearly communicate that an operation is in progress.

Example:

```text
Generating summary...

████████████████░░░░
```

or a suitable skeleton/loading state.

---

# AI Failure State

If the AI provider is unavailable:

```text
Unable to generate a summary right now.

Your note has been saved successfully.
Please try again later.
```

This reinforces the architectural principle that AI is optional.

---

# Summary Regeneration

A future enhancement can allow:

```text
Generate Summary
        ↓
Summary
        ↓
Regenerate
```

This is useful if the generated summary is poor or the note content has changed.

---

# Phase 29 — Global UX + Responsive Polish

**Priority: High**

Phase 29 is where the application receives a final cross-screen design pass.

---

# Responsive Requirements

The application should remain usable on:

```text
Desktop
Laptop
Tablet
Mobile
```

The SRS explicitly requires responsive behavior across these form factors. 

---

# Responsive Layout Strategy

Desktop:

```text
┌──────────┬────────────────────────────┐
│ Sidebar  │ Main Content               │
│          │                            │
│          │                            │
└──────────┴────────────────────────────┘
```

Mobile:

```text
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│                             │
│ Main Content                │
│                             │
│                             │
├─────────────────────────────┤
│ Navigation                  │
└─────────────────────────────┘
```

---

# Loading States

Every major async screen should have an intentional loading state.

Examples:

```text
Dashboard → Dashboard skeleton
Notes → Notes skeleton
Collections → Collection skeleton
Note Details → Content skeleton
Tags → Tag loading state
```

Avoid displaying a blank screen during API requests.

---

# Empty States

Important empty states include:

```text
No notes
No search results
No collections
No tags
No favorites
No archived notes
No trash items
```

Each should explain what the user can do next.

---

# Error States

Errors should be:

```text
Understandable
Actionable
Non-technical
```

Avoid displaying raw messages such as:

```text
PrismaClientKnownRequestError
```

to users.

Instead:

```text
Something went wrong while loading your notes.

[ Try Again ]
```

---

# Accessibility

The final pass should verify:

```text
Keyboard navigation
Visible focus states
Button labels
Form labels
Semantic HTML
Sufficient contrast
Accessible dialogs
Accessible dropdowns
Screen-reader-friendly controls
```

The SRS specifically identifies accessibility as part of the quality requirements. 

---

# Dark Mode

Dark mode should be treated as a global design system rather than a collection of individually darkened components.

All major surfaces should have corresponding dark-mode values:

```text
Background
Surface
Text
Muted text
Borders
Inputs
Cards
Modals
Navigation
```

The visual system remains consistent with the established UI direction documented in `UI.md`.

---

# Phase 30 — Full QA + Security Review

**Priority: High**

Phase 30 is the final technical verification phase.

The objective is to verify that the project works as a complete system rather than as isolated features.

---

# Full Feature Test Matrix

```text
Authentication
├── Register
├── Login
├── Logout
├── Protected routes
└── Invalid authentication

Notes
├── Create
├── Read
├── Update
├── Delete
├── Favorite
├── Archive
├── Search
└── Filter

Collections
├── Create
├── Read
├── Update
└── Delete

Tags
├── Create
├── Read
├── Update
├── Delete
├── Attach
└── Remove

AI
├── Generate summary
├── AI unavailable
└── AI provider failure

Extension
├── Load
├── Capture
├── Preview
├── Authenticate
└── Save
```

---

# Cross-User Security Testing

One of the most important tests is:

```text
User A
   ↓
Attempts to access
   ↓
User B's resource
```

Expected result:

```text
404 / 403
```

depending on the endpoint's intended behavior.

This should be tested for:

```text
Notes
Collections
Tags
Note-tag relationships
```

The existing backend test suite already places strong emphasis on ownership isolation.

---

# Authentication Security Review

Review:

```text
JWT generation
JWT verification
Password hashing
Protected routes
Token handling
Expired/invalid tokens
Unauthorized requests
```

---

# Input Validation Review

Review all externally supplied values:

```text
Email
Password
Note title
Note content
Source URL
Collection name
Tag name
IDs
Search parameters
Extension payloads
```

Every API endpoint should reject malformed input instead of passing it directly to business logic.

---

# CORS Review

Verify that backend CORS configuration permits only the intended clients.

Development:

```text
http://localhost:5173
```

Production should use the actual deployed frontend origin.

The extension's origin/communication model should also be reviewed before release.

---

# Environment Secret Review

Before publishing the repository, verify:

```text
✓ .env is ignored
✓ No API keys in source code
✓ No database passwords
✓ No JWT secrets
✓ No OAuth secrets
✓ No personal tokens
✓ No extension private credentials
```

A Git history scan should also be performed if there is any possibility that secrets were previously committed.

---

# Dependency Review

Review dependencies for:

```text
Unused packages
Outdated packages
Unnecessary packages
Known vulnerabilities
```

The objective is not to update everything blindly.

Dependencies should be updated carefully and validated afterward.

---

# Production Build Validation

The final web build:

```bash
pnpm --filter web build
```

must succeed.

The backend build:

```bash
pnpm --filter @memdev/backend build
```

must succeed.

Linting:

```bash
pnpm --filter web lint
pnpm --filter @memdev/backend lint
```

must succeed.

Backend tests:

```bash
pnpm --filter @memdev/backend test
```

must pass.

---

# Final Validation Checklist

```text
[ ] Backend tests pass
[ ] Backend lint passes
[ ] Backend build passes
[ ] Frontend lint passes
[ ] Frontend build passes
[ ] Prisma schema validates
[ ] Database migrations are valid
[ ] Authentication works
[ ] Notes work
[ ] Collections work
[ ] Tags work
[ ] Search works
[ ] Filters work
[ ] AI summarization works
[ ] Extension builds
[ ] Extension loads
[ ] Text capture works
[ ] Note saving works
[ ] Cross-user isolation verified
[ ] Responsive UI verified
[ ] Error states verified
[ ] Loading states verified
[ ] Environment secrets verified
```

---

# Phase 31 — README + Screenshots + Portfolio Polish

**Priority: Final**

Phase 31 is the final presentation phase.

The objective is to transform the completed codebase into a project that can be confidently shown to recruiters and interviewers.

---

# README Requirements

The final README should clearly communicate:

```text
What MemDev is
Why it exists
What problem it solves
Main features
Architecture
Tech stack
Project structure
API overview
Database design
Authentication
AI integration
Browser extension
Setup instructions
Environment variables
Development commands
Testing
Deployment
Screenshots
Future improvements
```

This README is being built progressively throughout development rather than written entirely at the end.

---

# Screenshots

The final repository should contain screenshots demonstrating the most important parts of the application.

Recommended screenshots:

```text
01-landing.png
02-login.png
03-dashboard.png
04-notes.png
05-note-details.png
06-collections.png
07-tags.png
08-search.png
09-ai-summary.png
10-extension.png
11-extension-capture.png
```

Screenshots should focus on meaningful product functionality rather than showing every screen.

---

# Recommended Demo Flow

For interviews and portfolio demonstrations, the strongest flow is:

```text
1. Open MemDev
       ↓
2. Login
       ↓
3. Show Dashboard
       ↓
4. Open Notes
       ↓
5. Search/filter notes
       ↓
6. Open a note
       ↓
7. Show collection + tags
       ↓
8. Generate AI summary
       ↓
9. Open a webpage
       ↓
10. Highlight useful text
       ↓
11. Open MemDev extension
       ↓
12. Capture text
       ↓
13. Save to MemDev
       ↓
14. Return to Notes
       ↓
15. Show captured note
```

This demonstrates the complete product loop.

---

# Portfolio Positioning

MemDev should be presented as more than a CRUD application.

The strongest project description emphasizes:

```text
Full-stack development
+
Authentication
+
Authorization
+
PostgreSQL
+
Prisma
+
REST APIs
+
React
+
TypeScript
+
AI integration
+
Browser extension
+
Search/filtering
+
Knowledge management
```

The browser extension is particularly valuable because it demonstrates integration between a web application and a browser environment.

---

# Resume Project Description

A concise resume version can eventually be:

> **MemDev — Personal Knowledge Management Platform**
> Built a full-stack knowledge management platform using React, TypeScript, Node.js, Express, PostgreSQL, and Prisma, with JWT authentication, collections, tags, search/filtering, AI-powered note summarization, and a Chrome extension for capturing selected web content with source metadata.

A stronger final version can be created after Phase 30 once the extension and final feature set are complete.

---

# Interview Discussion Areas

MemDev provides several useful technical discussion topics.

An interviewer can ask about:

### Authentication

```text
How does JWT authentication work?
Why hash passwords?
How are protected routes implemented?
```

### Authorization

```text
How do you prevent users from accessing another user's notes?
Where is ownership checked?
Why should authorization be enforced on the backend?
```

### Database

```text
Why PostgreSQL?
Why Prisma?
How are notes and tags related?
Why is NoteTag a many-to-many relationship?
```

### REST API

```text
Why REST?
How are errors handled?
How is validation performed?
```

### React

```text
How is routing implemented?
How are protected routes handled?
How does the frontend communicate with the API?
```

### Browser Extension

```text
How does a content script work?
What is Manifest V3?
How do you capture selected text?
How does the extension communicate with the backend?
```

### AI

```text
How does summarization work?
What happens if OpenAI is unavailable?
Why shouldn't AI be required for note creation?
```

### System Design

```text
How would you scale the application?
How would you handle millions of notes?
How would you introduce full-text search?
How would you add background AI processing?
How would you support multiple browser extensions?
```

---

# Potential Future Improvements

The following features are intentionally **not required for the current project completion**, but could be added later if there is a strong reason.

---

## Full-Text Search

The current search approach is intentionally simple.

A future implementation could use PostgreSQL full-text search.

Conceptually:

```text
Notes
 ↓
PostgreSQL Full-Text Index
 ↓
Ranked Search
```

This would become useful if the number of notes grows significantly.

---

# Semantic Search

A future version could represent notes as embeddings:

```text
Note
 ↓
Embedding Model
 ↓
Vector
 ↓
Vector Database
 ↓
Semantic Search
```

Example:

```text
Search:
"How does login security work?"

Could return:

"JWT Authentication"
"OAuth"
"Password Hashing"
```

even when the exact words do not appear.

This is intentionally outside the current MVP scope.

---

# AI Question Answering

A future version could allow users to ask questions about their own notes.

Example:

```text
User:
"What did I save about distributed systems?"

MemDev:
"Based on your notes, you saved information about
CAP theorem, consistent hashing, replication..."
```

This would require significantly more AI/data infrastructure and is therefore not part of the current implementation scope.

---

# Automatic Tagging

AI could eventually suggest tags automatically:

```text
Captured Note
      ↓
AI
      ↓
Suggested Tags
├── React
├── Frontend
└── JavaScript
```

The user could accept or reject the suggestions.

---

# Automatic Collection Suggestions

Similarly:

```text
Captured Content
      ↓
Classification
      ↓
Suggested Collection
```

For example:

```text
Article about system design
        ↓
Suggested:
System Design
```

---

# Browser Context Menu

A future extension version could provide:

```text
Right Click
   ↓
Save to MemDev
```

This could provide an even faster capture mechanism.

---

# Screenshot Capture

The extension could eventually capture:

```text
Selected text
+
Screenshot
+
URL
+
Page title
```

This would be useful for:

```text
Diagrams
Charts
Code snippets
Visual references
```

---

# PDF Capture

A future version could support capturing content from PDFs.

Potential workflow:

```text
PDF
 ↓
Select content
 ↓
Capture
 ↓
MemDev
```

This is particularly useful for research and academic workflows.

---

# Import / Export

Potential future functionality:

```text
Export
├── Markdown
├── JSON
└── CSV

Import
├── Markdown
└── JSON
```

This would improve portability and reduce vendor lock-in.

---

# Sharing

Future versions could support controlled sharing.

For example:

```text
Private Note
     ↓
Share
     ↓
Read-only Link
```

This should only be introduced with carefully designed access controls.

---

# Multi-Device Sync

Because the data is stored in PostgreSQL through the backend, the architecture already provides the foundation for accessing the same account from multiple devices.

A future production version could add:

```text
Desktop
Mobile
Browser Extension
Tablet
```

all synchronized through the same API.

---

# Production Deployment

The exact hosting provider is intentionally not part of the core architecture.

The application can conceptually be deployed as:

```text
                  Internet
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
     Web Frontend          Browser Extension
          │                     │
          └──────────┬──────────┘
                     ▼
                Backend API
                     │
                     ▼
                PostgreSQL
                     │
                     ▼
                 OpenAI
```

---

# Production Components

A simple deployment can consist of:

```text
Frontend
   ↓
Static React application

Backend
   ↓
Node.js / Express server

Database
   ↓
Managed PostgreSQL

AI
   ↓
OpenAI API
```

No Kubernetes, microservices, service mesh, or complex infrastructure is necessary for this project.

The SRS explicitly favors a simple architecture suitable for the project's scale. 

---

# Production Environment Variables

Production configuration should use environment variables.

Example:

```env
NODE_ENV=production

PORT=5000

DATABASE_URL="..."

JWT_SECRET="..."

FRONTEND_URL="https://your-frontend-domain"

GOOGLE_CLIENT_ID="..."

GOOGLE_CLIENT_SECRET="..."

GOOGLE_CALLBACK_URL="..."

OPENAI_API_KEY="..."
```

The actual values must never appear in the repository.

---

# Deployment Checklist

```text
[ ] Production PostgreSQL created
[ ] Database migrations applied
[ ] Backend deployed
[ ] Frontend deployed
[ ] Environment variables configured
[ ] CORS configured
[ ] OAuth callback configured
[ ] JWT secret configured
[ ] OpenAI key configured
[ ] HTTPS enabled
[ ] Extension production URL configured
[ ] Production API tested
[ ] Authentication tested
[ ] Note creation tested
[ ] Extension capture tested
```

---

# What MemDev Intentionally Does Not Try to Be

MemDev is intentionally scoped as a strong portfolio project.

It is **not** intended to become:

```text
A social network
A collaborative Notion replacement
A distributed enterprise platform
A large-scale SaaS infrastructure project
A generalized AI agent
A full enterprise document management system
```

The project prioritizes:

```text
Functional completeness
+
Good engineering
+
Security
+
Good UI
+
Interesting integrations
+
Clear architecture
```

rather than unnecessary infrastructure.

---

# Final Feature Checklist

At project completion, the following should be available:

## Authentication

```text
✓ Email registration
✓ Email login
✓ Password hashing
✓ JWT authentication
✓ Protected routes
✓ Logout
✓ Google OAuth if retained in final implementation
```

## Notes

```text
✓ Create
✓ View
✓ Update
✓ Delete
✓ Favorite
✓ Archive
✓ Search
✓ Filter
✓ Sort
✓ Source URL
✓ AI summary
✓ Tags
✓ Collections
```

## Collections

```text
✓ Create
✓ View
✓ Rename
✓ Delete
✓ Note count
✓ View collection notes
```

## Tags

```text
✓ Create
✓ Rename
✓ Delete
✓ Assign to notes
✓ Remove from notes
✓ Filter notes
✓ Note counts
```

## Browser Extension

```text
✓ Manifest V3
✓ Popup
✓ Content script
✓ Background service worker
✓ Selected text capture
✓ URL capture
✓ Page title capture
✓ Authentication
✓ Save to MemDev
✓ Collection selection
✓ Tag selection
✓ Quick Save
```

## AI

```text
✓ Note summarization
✓ Summary persistence
✓ Loading state
✓ Failure handling
✓ Optional AI dependency
```

## UX

```text
✓ Responsive layout
✓ Loading states
✓ Empty states
✓ Error states
✓ Accessible controls
✓ Dark mode
✓ Consistent design system
```

## Engineering

```text
✓ TypeScript
✓ REST API
✓ PostgreSQL
✓ Prisma
✓ Zod
✓ JWT
✓ Automated backend tests
✓ ESLint
✓ Production builds
✓ Environment configuration
```

---

# Project Completion Definition

MemDev should be considered complete when a user can perform the following journey without developer intervention:

```text
1. Register
        ↓
2. Login
        ↓
3. Create a collection
        ↓
4. Create a tag
        ↓
5. Save a note
        ↓
6. Organize the note
        ↓
7. Search for the note
        ↓
8. Filter notes
        ↓
9. Generate an AI summary
        ↓
10. Open a webpage
        ↓
11. Highlight useful information
        ↓
12. Capture it using the extension
        ↓
13. Save it to MemDev
        ↓
14. Return to the application
        ↓
15. Find the captured note
        ↓
16. Revisit its original source
```

That workflow demonstrates the complete value proposition of MemDev.

---

# Final Project Architecture

The final system can be summarized as:

```text
                              MEMDEV
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        React Web App       Chrome Extension     External Web
              │                  │                  │
              │                  │            Selected Content
              │                  │                  │
              │                  └──────────┐       │
              │                             │       │
              └──────────────┬──────────────┘       │
                             ▼                      │
                       Express REST API ◄───────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          Auth Logic    Application Logic   AI Service
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                          Prisma
                             │
                             ▼
                        PostgreSQL
```

---

# Final Development Roadmap

```text
PHASE 1–21
Core MemDev Application
        │
        ▼
Authentication
Notes
Collections
Tags
Dashboard
AI
Core UI
        │
        ▼
PHASE 22
Note ↔ Tag Assignment
        │
        ▼
PHASE 23
Search + Filtering
        │
        ▼
PHASE 24
Browser Extension Foundation
        │
        ▼
PHASE 25
Selected Text Capture
        │
        ▼
PHASE 26
Save to MemDev
        │
        ▼
PHASE 27
Dashboard Polish
        │
        ▼
PHASE 28
AI Experience Polish
        │
        ▼
PHASE 29
Global UX + Responsive Polish
        │
        ▼
PHASE 30
Full QA + Security Review
        │
        ▼
PHASE 31
Documentation + Screenshots
        │
        ▼
                 MEMDEV v1
```

---

# Current Status

At the current development checkpoint:

```text
Core Web Application       ████████████████████  Complete
Authentication             ████████████████████  Complete
Notes                       ████████████████████  Complete
Collections                 ████████████████████  Complete
Tags                        ████████████████████  Complete
Note ↔ Tag Assignment       ████████████████████  Complete
Search + Filtering          ████████████████████  Complete
AI Summarization            ███████████████░░░░░  Implemented
Dashboard                   ███████████████░░░░░  Implemented
Browser Extension           ░░░░░░░░░░░░░░░░░░░░  Pending
Extension Capture           ░░░░░░░░░░░░░░░░░░░░  Pending
Extension Save              ░░░░░░░░░░░░░░░░░░░░  Pending
Final UX Polish             ░░░░░░░░░░░░░░░░░░░░  Pending
Final QA                    ░░░░░░░░░░░░░░░░░░░░  Pending
Portfolio Documentation     ██████████░░░░░░░░░░  In Progress
```

The exact percentage is intentionally approximate; the important distinction is between **implemented core functionality** and **remaining finalization work**.

---

# Final Deliverable

The completed MemDev repository should contain:

```text
memdev/
│
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── prisma/
│   │   └── package.json
│   │
│   ├── web/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── extension/
│       ├── src/
│       ├── manifest.json
│       └── package.json
│
├── packages/
│   └── shared/
│
├── UI.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
└── ...
```

The exact package structure may evolve as implementation progresses.

---

# Final Philosophy

MemDev is being built around one simple idea:

> **Useful information should be easy to capture, organize, understand, and retrieve later.**

The web application provides the knowledge library.

The browser extension provides fast capture.

Collections and tags provide organization.

Search and filtering provide retrieval.

AI summarization provides compression and understanding.

PostgreSQL provides persistence.

Authentication and authorization provide privacy.

The result is a coherent full-stack system rather than a collection of disconnected features.

```text
                    CAPTURE
                       │
                       ▼
                 ┌───────────┐
                 │   MemDev  │
                 └─────┬─────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          ORGANIZE  UNDERSTAND  SEARCH
             │         │         │
             │         │         │
        Collections   AI       Filters
        Tags          Summary   Sorting
             │         │         │
             └─────────┼─────────┘
                       ▼
                    REVISIT
                       │
                       ▼
                 Personal Knowledge
                     Library
```

---

# Final README Note

The original SRS describes the complete intended product scope, while this README tracks the **actual implementation progression**. Where the SRS contains features that have not yet been implemented — such as the complete Trash workflow or the browser extension — they are explicitly identified as future phases rather than being presented as completed functionality.

This distinction should be maintained throughout development so that the README remains an accurate technical record of the project rather than simply a specification of what the project is supposed to become.

---

## MemDev — Development Status

**Current milestone:** Phase 23 completed
**Next milestone:** Phase 24 — Browser Extension Foundation
**Final planned milestone:** Phase 31 — Documentation & Portfolio Polish

The next implementation priority is therefore **the browser extension**, beginning with its foundation and Manifest V3 setup rather than adding more web-application features.

