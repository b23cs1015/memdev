# MemDev Software Architecture Document

Version: 1.0

---

# Table of Contents

1. Introduction
2. Architecture Philosophy
3. Engineering Principles
4. High-Level Architecture
5. System Components
6. Technology Stack
7. High-Level Request Flow
8. Data Flow
9. Responsibilities
10. Design Decisions
11. Architectural Constraints

---

# 1. Introduction

## Purpose

This document describes the complete software architecture of MemDev.

It acts as the engineering blueprint for the project.

Every feature implemented in the project should conform to the architecture described in this document.

The objective of this document is to ensure that:

- Every component has a single responsibility.
- Future contributors understand the system quickly.
- GitHub Copilot has sufficient project context.
- Future versions can be built without major redesign.

---

## Scope

This document covers

- System Architecture
- Component Architecture
- Backend Architecture
- Frontend Architecture
- Browser Extension Architecture
- Database Architecture
- Communication Flow
- Authentication Flow
- Engineering Decisions
- Future Scalability

---

## Intended Audience

- Developers
- Contributors
- GitHub Copilot
- AI Coding Assistants
- Future Maintainers

---

# 2. Architecture Philosophy

MemDev follows one simple philosophy.

> Build a small system correctly before making it large.

Version 1 is intentionally simple.

The objective is not to create a feature-rich application.

The objective is to create a reliable workflow.

Capture

↓

Store

↓

Retrieve

If this workflow is fast and reliable, the product has already achieved its primary objective.

---

# 3. Engineering Principles

Every architectural decision follows these principles.

---

## Principle 1

### Single Responsibility Principle

Every module should have exactly one responsibility.

Examples

Browser Extension

Responsible for

- Detecting selected text
- Capturing webpage metadata

Not responsible for

- Authentication
- Business Logic
- Database

---

Backend

Responsible for

- Business Logic
- Validation
- Authentication
- Database Communication

Not responsible for

- UI

---

Frontend

Responsible for

- User Interface
- Rendering
- API Calls

Not responsible for

- Business Logic
- Database

---

Database

Responsible only for

Persistent Storage

---

## Principle 2

### API First Design

Every communication occurs through REST APIs.

```
Extension

↓

Backend

↓

Database

↓

Backend

↓

Frontend
```

No module bypasses another.

---

## Principle 3

### Stateless Backend

Backend should not maintain sessions.

Authentication uses JWT.

Advantages

- Easy deployment
- Horizontal scaling
- Simpler architecture

---

## Principle 4

### Privacy First

MemDev never captures unnecessary information.

Allowed

✓ Selected Text

✓ URL

✓ Page Title

✓ Timestamp

Never Capture

✗ Passwords

✗ Cookies

✗ Browsing History

✗ Form Inputs

✗ Personal Data

---

## Principle 5

### Modular Design

Every layer should be replaceable.

Example

Today

Express

Tomorrow

NestJS

No frontend changes required.

---

## Principle 6

### Simplicity Over Cleverness

Readable code is preferred over complex code.

Future contributors should understand the project easily.

---

# 4. High-Level Architecture

```
                    Developer

                        │

                        ▼

             Browser (Chrome/Edge)

                        │

                        ▼

              MemDev Browser Extension

                        │

                 HTTPS REST APIs

                        │

                        ▼

              Express.js Backend Server

                        │

                 SQL Queries

                        │

                        ▼

                 PostgreSQL Database

                        ▲

                        │

                 Next.js Dashboard
```

---

# 5. System Components

The project contains four independent systems.

---

## Component 1

Browser Extension

Purpose

Capture knowledge from webpages.

Responsibilities

- Detect text selection
- Display floating save button
- Capture metadata
- Send note to backend

Inputs

Selected text

Outputs

POST /notes

---

## Component 2

Backend API

Purpose

Process requests.

Responsibilities

- Authentication
- Validation
- Authorization
- Business Logic
- Database Communication

Inputs

HTTP Requests

Outputs

JSON Responses

---

## Component 3

Database

Purpose

Persistent Storage.

Stores

Users

Notes

Relationships

Indexes

---

## Component 4

Dashboard

Purpose

Retrieve saved knowledge.

Responsibilities

Display Notes

Search Notes

Delete Notes

Manage Account

---

# 6. Technology Stack

## Frontend

Framework

Next.js

Language

TypeScript

Styling

Tailwind CSS

---

## Backend

Runtime

Node.js

Framework

Express.js

---

## Browser Extension

Framework

Plasmo

---

## Database

PostgreSQL

---

## Authentication

JWT

bcrypt

---

## Deployment

Frontend

Vercel

Backend

Render

Database

Neon PostgreSQL

---

# Why This Stack?

## Why Next.js?

- Mature ecosystem
- Excellent React support
- Routing built in
- Great deployment experience

---

## Why Express?

- Simple
- Huge community
- Perfect for MVP
- Easy debugging

---

## Why PostgreSQL?

- ACID compliant
- Excellent indexing
- Relational
- Future Full-Text Search
- Future Semantic Search

---

## Why Plasmo?

Without Plasmo

- Manifest management
- Webpack configuration
- Build configuration

With Plasmo

- React
- TypeScript
- Hot Reload
- Modern tooling

---

# 7. High-Level Request Flow

The complete workflow looks like this.

```
User

↓

Highlight Text

↓

Extension

↓

REST API

↓

Authentication

↓

Validation

↓

Business Logic

↓

Database

↓

Success Response

↓

Dashboard
```

---

# 8. Complete Data Flow

Saving a Note

```
Developer

↓

Select Text

↓

Extension detects selection

↓

Floating Button

↓

User clicks Save

↓

Metadata Collected

↓

POST /notes

↓

Authentication Middleware

↓

Validation

↓

Database Insert

↓

Success Response

↓

Dashboard displays note
```

---

# 9. Responsibilities Matrix

| Component | Responsibility |
|------------|----------------|
| Extension | Capture webpage data |
| Backend | Business Logic |
| PostgreSQL | Store data |
| Dashboard | Display data |

---

# 10. Design Decisions

---

## Decision 1

REST over GraphQL

Reason

The project is CRUD-heavy.

REST keeps the architecture simple.

---

## Decision 2

PostgreSQL over MongoDB

Reason

- Relational
- Better search
- Better indexing
- Easier future semantic search

---

## Decision 3

JWT over Sessions

Reason

Stateless backend.

Simpler deployment.

Better scalability.

---

## Decision 4

Plasmo over Raw Extensions

Reason

Better developer experience.

React support.

TypeScript support.

Less boilerplate.

---

# 11. Architectural Constraints

The following rules must NEVER be violated.

Rule 1

Frontend never accesses database directly.

---

Rule 2

Extension never accesses database directly.

---

Rule 3

Every request requiring authentication must pass through JWT middleware.

---

Rule 4

Business logic belongs only inside backend services.

---

Rule 5

Controllers should remain thin.

---

Rule 6

Database queries should never exist inside frontend.

---

Rule 7

Every API must be documented before implementation.

---

Rule 8

Every feature should be independently testable.

---

# Engineering Notes

This architecture intentionally optimizes for

- Maintainability
- Simplicity
- Scalability
- Future AI integration

rather than implementing advanced features immediately.

Version 1 proves the workflow.

Future versions expand the intelligence.

---

# End of Part 1

Next Section

Part 2 will cover

- Frontend Architecture
- Backend Architecture
- Browser Extension Architecture
- Database Architecture
- Folder Structure
- Dependency Rules
- Internal Module Communication

---

# 12. Internal Architecture

The MemDev system is divided into four independent applications.

```
MemDev

├── Frontend (Next.js)

├── Backend (Express)

├── Browser Extension (Plasmo)

└── PostgreSQL
```

Each application has a clearly defined responsibility.

No application should contain logic that belongs to another application.

---

# 13. Frontend Architecture

## Purpose

The frontend is responsible for presenting information to users.

It should never contain business logic.

Its responsibilities are limited to:

- Rendering UI
- Calling APIs
- Managing authentication state
- Managing local UI state

---

## Frontend Folder Structure

```
frontend/

src/

├── app/

├── components/

│   ├── common/

│   ├── notes/

│   ├── auth/

│   └── layout/

├── services/

├── hooks/

├── types/

├── utils/

├── lib/

├── styles/

└── middleware.ts
```

---

## Folder Responsibilities

### app/

Contains all routes.

Examples

```
/

/login

/register

/dashboard

/profile
```

---

### components/

Reusable UI components.

Example

```
Button

Input

Navbar

Sidebar

SearchBar

NoteCard

DeleteModal
```

---

### services/

Contains API calls.

Example

```
auth.service.ts

note.service.ts
```

Never write fetch() directly inside components.

---

### hooks/

Reusable React hooks.

Examples

```
useAuth()

useNotes()

useSearch()
```

---

### types/

Global TypeScript interfaces.

Example

```
User

Note

ApiResponse

LoginRequest
```

---

### utils/

Helper functions.

Examples

```
formatDate()

truncateText()

copyToClipboard()
```

---

### lib/

Third-party configurations.

Example

```
axios.ts

jwt.ts
```

---

# Frontend Component Hierarchy

```
App

│

├── Layout

│

├── Navbar

│

├── Sidebar

│

└── Pages

      │

      ├── Login

      ├── Register

      ├── Dashboard

      │

      └── Components

              │

              ├── SearchBar

              ├── NoteList

              ├── NoteCard

              └── DeleteModal
```

---

# Frontend Rules

The frontend

CAN

✓ Display data

✓ Call APIs

✓ Manage UI state

✓ Store JWT

The frontend

CANNOT

✗ Access database

✗ Contain SQL

✗ Verify JWT

✗ Implement business logic

---

# 14. Backend Architecture

## Purpose

Backend is the brain of MemDev.

It is responsible for

Authentication

Authorization

Validation

Business Logic

Database Communication

Error Handling

---

## Backend Folder Structure

```
backend/

src/

├── config/

├── controllers/

├── routes/

├── middleware/

├── services/

├── repositories/

├── models/

├── database/

├── validators/

├── types/

├── utils/

├── app.ts

└── server.ts
```

---

# Folder Responsibilities

---

## controllers/

Receive HTTP request.

Call service.

Return response.

Nothing else.

Example

```
loginController

createNoteController

searchController
```

---

## services/

Business logic.

Examples

```
AuthService

NoteService

SearchService
```

All business rules live here.

---

## repositories/

Responsible for database queries.

Example

```
createNote()

findUser()

searchNotes()
```

No SQL outside repositories.

---

## middleware/

Examples

```
JWT Verification

Logging

Rate Limiting

Error Handler
```

---

## validators/

Request validation.

Example

```
Register Schema

Login Schema

Create Note Schema
```

---

## utils/

Reusable helper functions.

---

# Backend Request Flow

```
Request

↓

Route

↓

Middleware

↓

Validator

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

Response
```

This order should NEVER change.

---

# Backend Rules

Controllers

- Thin

Services

- Smart

Repositories

- SQL only

Middleware

- Cross-cutting concerns

---

# 15. Browser Extension Architecture

The extension is the entry point of MemDev.

It captures knowledge from webpages.

Nothing more.

---

## Folder Structure

```
extension/

src/

├── contents/

├── background/

├── popup/

├── messaging/

├── storage/

├── hooks/

├── utils/

└── assets/
```

---

## Responsibilities

### contents/

Runs inside webpages.

Responsible for

- Detect selected text

- Floating Save button

- Read page metadata

---

### background/

Handles

- API calls

- Authentication

- Browser events

---

### popup/

Extension popup.

Contains

Settings

Login Status

User Info

---

### messaging/

Communication between

Content Script

↓

Background

↓

Popup

---

### storage/

Local browser storage.

Stores

JWT

Preferences

---

# Extension Flow

```
User selects text

↓

Content Script

↓

Floating Button

↓

Background Script

↓

Backend API

↓

Success

↓

Toast Notification
```

---

# Extension Rules

The extension

CAN

✓ Read selected text

✓ Read page title

✓ Read URL

✓ Call backend APIs

The extension

CANNOT

✗ Read passwords

✗ Read cookies

✗ Access database

✗ Track browsing history

---

# 16. Database Architecture

Version 1 uses PostgreSQL.

---

## Entity Relationship

```
User

│

│ One

│

▼

Many

│

Note
```

---

## Tables

Users

Notes

---

Users

```
id

name

email

password

created_at
```

---

Notes

```
id

user_id

text

url

page_title

created_at
```

---

# Relationships

One User

↓

Many Notes

---

# Future Tables

Do NOT implement yet.

```
Tags

Folders

Favorites

Embeddings

Notifications

Activity

SearchHistory
```

---

# Database Rules

Never duplicate data.

Always use foreign keys.

Always index searchable columns.

Never store passwords directly.

---

# 17. Dependency Rules

```
Frontend

↓

Backend

↓

Repository

↓

Database
```

Allowed.

---

```
Frontend

↓

Database
```

Forbidden.

---

```
Extension

↓

Database
```

Forbidden.

---

```
Extension

↓

Backend

↓

Database
```

Correct.

---

# 18. Internal Module Communication

Every module communicates through clearly defined interfaces.

```
Frontend

↓

REST API

↓

Backend

↓

Repository

↓

Database
```

No shortcuts.

---

# 19. Dependency Graph

```
Dashboard

↓

Auth Service

↓

Note Service

↓

Search Service

↓

Repository

↓

PostgreSQL
```

---

# Engineering Notes

The architecture intentionally separates

Presentation

↓

Business Logic

↓

Persistence

This separation makes future migration easier.

Example

Today

Express

Tomorrow

NestJS

No frontend changes.

---

# AI Notes

When generating new code

Always ask

Which layer should this belong to?

Never mix responsibilities.

Controllers should remain small.

Services should contain business logic.

Repositories should contain SQL.

---

# Common Mistakes

❌ API calls inside React components everywhere

❌ SQL inside controllers

❌ Validation inside frontend only

❌ Extension talking directly to database

❌ Business logic duplicated

---

# End of Part 2

Next Part

Authentication Architecture

↓

JWT Flow

↓

Save Note Sequence

↓

Search Sequence

↓

Delete Sequence

↓

Complete Mermaid Sequence Diagrams

↓

Authentication State Machine

↓

API Lifecycle

↓

Request Lifecycle


---

# 20. Authentication Architecture

Authentication ensures that every user only accesses their own data.

Version 1 uses JSON Web Tokens (JWT).

The backend remains stateless.

---

## Authentication Workflow

```
┌────────────┐
│ User Login │
└─────┬──────┘
      │
      ▼
Validate Credentials
      │
      ▼
Generate JWT
      │
      ▼
Return JWT
      │
      ▼
Store JWT
(Local Storage for Dashboard)
(Browser Storage for Extension)
      │
      ▼
Attach JWT to every request
```

---

## Authentication Components

```
Frontend
    │
    ▼
JWT Token
    │
    ▼
Express Middleware
    │
    ▼
Verify Token
    │
    ▼
Attach User
    │
    ▼
Controller
```

---

## JWT Payload

```
{
    userId,
    email
}
```

Never store

- Password
- Permissions
- Notes

inside the JWT.

---

## Authentication Rules

Every protected endpoint requires

Authorization Header

```
Authorization: Bearer <JWT>
```

Public Routes

```
POST /auth/register

POST /auth/login
```

Protected Routes

```
GET /auth/me

POST /notes

GET /notes

GET /notes/search

DELETE /notes/:id
```

---

# 21. Complete Request Lifecycle

Every HTTP request follows exactly the same lifecycle.

```
Incoming Request

↓

Express Route

↓

Authentication Middleware

↓

Validation Middleware

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

JSON Response
```

Never bypass any layer.

---

# 22. User Registration Flow

```
User

↓

Register Page

↓

POST /auth/register

↓

Validate Input

↓

Check Email Exists

↓

Hash Password

↓

Insert User

↓

Return Success
```

---

## Detailed Registration Sequence

```
User

↓

Frontend

↓

Backend

↓

Validation

↓

bcrypt

↓

PostgreSQL

↓

Success Response

↓

Frontend
```

---

# 23. Login Flow

```
User

↓

Login Form

↓

POST /auth/login

↓

Find User

↓

Compare Password

↓

Generate JWT

↓

Return JWT

↓

Store JWT

↓

Redirect Dashboard
```

---

## Login Sequence

```
Frontend

↓

POST /auth/login

↓

Controller

↓

Auth Service

↓

Repository

↓

Database

↓

Repository

↓

Generate JWT

↓

Controller

↓

Frontend
```

---

# 24. Save Note Flow

This is the core workflow of MemDev.

Everything revolves around this feature.

---

## User Flow

```
Developer

↓

Highlight Text

↓

Floating Button Appears

↓

Click Save

↓

Extension Collects

• Selected Text

• URL

• Title

• Timestamp

↓

POST /notes

↓

Backend

↓

Database

↓

Success

↓

Toast Notification
```

---

## Internal Flow

```
Content Script

↓

Background Script

↓

POST /notes

↓

JWT Middleware

↓

Validation

↓

Note Service

↓

Repository

↓

INSERT Note

↓

Success
```

---

## Save Request

```
POST /notes
```

Request

```
text

url

pageTitle
```

Response

```
noteId

createdAt

message
```

---

# 25. Dashboard Loading Flow

```
Dashboard Opens

↓

Check JWT

↓

GET /notes

↓

Backend

↓

Repository

↓

SELECT Notes

↓

Return Notes

↓

Render Cards
```

---

# 26. Search Flow

```
User Types

↓

Debounce

↓

GET /notes/search?q=...

↓

Backend

↓

Search Service

↓

Repository

↓

PostgreSQL

↓

Matching Notes

↓

Dashboard
```

---

## Search Strategy (Version 1)

Version 1 uses SQL LIKE search.

Example

```
ILIKE '%react%'
```

Version 2 may introduce

- Full Text Search

Version 4 may introduce

- Vector Search

---

# 27. Delete Flow

```
Delete Button

↓

DELETE /notes/:id

↓

Verify JWT

↓

Verify Ownership

↓

DELETE Query

↓

Success Response

↓

Remove Card
```

---

# 28. Browser Extension Flow

The extension contains three logical layers.

```
User

↓

Content Script

↓

Background Worker

↓

Backend API
```

---

## Content Script

Responsible for

Detect Selection

Show Floating Button

Read Metadata

---

## Background Worker

Responsible for

Authentication

Sending Requests

Receiving Responses

---

## Popup

Responsible for

User Settings

Account Status

Login State

---

# 29. API Lifecycle

Every API should follow the same lifecycle.

```
Receive Request

↓

Authentication

↓

Validation

↓

Business Logic

↓

Repository

↓

Database

↓

Business Logic

↓

JSON Response
```

Never skip validation.

---

# 30. Error Handling Flow

```
Request

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Database Error

↓

Catch

↓

Global Error Handler

↓

JSON Error Response
```

Never expose SQL errors.

---

# 31. Validation Flow

Every incoming request must be validated.

```
Incoming Request

↓

Zod Validation

↓

Success?

↓

Yes

↓

Continue

↓

No

↓

400 Bad Request
```

---

# 32. Authorization Flow

Authentication

asks

"Who are you?"

Authorization

asks

"Can you do this?"

Example

```
DELETE /notes/15

↓

JWT Verified

↓

Owner?

↓

Yes

↓

Delete

↓

No

↓

403 Forbidden
```

---

# 33. Response Standards

Success

```
{
    success: true,
    data: {}
}
```

Error

```
{
    success: false,
    message: "...",
    errorCode: "..."
}
```

Always keep responses consistent.

---

# 34. Engineering Notes

Every request should

✓ Authenticate

✓ Validate

✓ Authorize

✓ Execute

✓ Respond

Exactly in this order.

---

## Common Mistakes

❌ Validation inside React

❌ JWT verification inside controller

❌ SQL inside controller

❌ Multiple response formats

❌ Returning raw database errors

---

## AI Notes

Whenever implementing an endpoint

Always create

Route

↓

Controller

↓

Service

↓

Repository

↓

Validation

↓

Tests

Never skip a layer.

---

# End of Part 3

Next Part

Part 4 will cover

• Scalability Architecture

• Logging Architecture

• Environment Architecture

• Deployment Architecture

• Security Layers

• Future AI Architecture

• Semantic Search Design

• Event System

• Caching Strategy

• Monitoring

• Final Engineering Checklist

This will complete the Software Architecture Document.

---

# 35. Scalability Architecture

Although Version 1 is a simple MVP, every architectural decision should support future growth.

The goal is to avoid major rewrites while keeping the implementation simple.

---

## Current Architecture

```
Browser Extension

        │

        ▼

REST API (Express)

        │

        ▼

PostgreSQL
```

Suitable for

- Single Server
- Hundreds of users
- Thousands of notes

---

## Future Scalable Architecture

```
                 Load Balancer

          ┌─────────┴─────────┐

          ▼                   ▼

    Backend Instance 1    Backend Instance 2

          │                   │

          └─────────┬─────────┘

                    ▼

                PostgreSQL

                    │

                    ▼

                 Redis Cache

                    │

                    ▼

             Background Workers

                    │

                    ▼

               AI Processing
```

Version 1 should be written so that migrating to this architecture requires minimal code changes.

---

# 36. Logging Architecture

Logging is essential for debugging and monitoring.

Version 1 should log meaningful events.

---

## Log Categories

Authentication

```
User Logged In

User Registered

Invalid Login
```

---

API

```
POST /notes

GET /notes

DELETE /notes
```

---

Database

```
Query Failed

Connection Error
```

---

System

```
Server Started

Database Connected

Environment Loaded
```

---

## Never Log

Passwords

JWT Tokens

Personal Information

Database Credentials

API Secrets

---

# 37. Environment Architecture

Every environment should have independent configuration.

```
Development

↓

Testing

↓

Production
```

Never hardcode configuration values.

Use environment variables.

Example

```
DATABASE_URL=

JWT_SECRET=

PORT=

NODE_ENV=
```

---

# 38. Deployment Architecture

Version 1 deployment

```
Frontend

↓

Vercel

-------------------------

Backend

↓

Render

-------------------------

Database

↓

Neon PostgreSQL
```

Communication

```
Frontend

↓

HTTPS

↓

Backend

↓

PostgreSQL
```

---

## Deployment Principles

Every deployment should be

Repeatable

Secure

Independent

Rollback-friendly

---

# 39. Security Layers

The architecture consists of multiple security layers.

```
Request

↓

HTTPS

↓

CORS

↓

Rate Limiter

↓

JWT Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Database
```

Every request must pass every layer.

---

# 40. Error Handling Architecture

Errors should propagate in one direction.

```
Repository

↓

Service

↓

Controller

↓

Global Error Handler

↓

Client
```

Never expose stack traces.

Never expose SQL errors.

Always return structured responses.

---

# 41. Future AI Architecture

Version 1 intentionally excludes AI.

However, the architecture should allow AI integration later.

Future architecture

```
Browser Extension

↓

REST API

↓

PostgreSQL

↓

Embedding Service

↓

Vector Database

↓

LLM

↓

Recommendations
```

Possible future capabilities

- Semantic Search

- Related Notes

- AI Summary

- Daily Review

- Smart Suggestions

---

# 42. Future Search Architecture

Current

```
ILIKE '%query%'
```

↓

Version 2

```
PostgreSQL Full Text Search
```

↓

Version 3

```
Hybrid Search
```

↓

Version 4

```
Vector Search

Embeddings

Semantic Ranking
```

The current repository structure should support these upgrades without changing the frontend.

---

# 43. Caching Strategy

Version 1

No cache.

Simple architecture.

---

Future

Redis

Used for

JWT Blacklist

Popular Searches

User Sessions

Frequently Accessed Notes

AI Results

---

# 44. Background Jobs

Version 1

No background workers.

Everything is synchronous.

---

Future

```
Queue

↓

Worker

↓

Notifications

↓

AI Summary

↓

Daily Digest
```

---

# 45. Monitoring

Future monitoring stack

Application

↓

Metrics

↓

Logs

↓

Alerts

Potential tools

Prometheus

Grafana

OpenTelemetry

Sentry

Version 1 only requires meaningful server logs.

---

# 46. Architectural Anti-Patterns

The following should NEVER happen.

---

❌ SQL inside React

---

❌ SQL inside controllers

---

❌ Business logic inside components

---

❌ Browser extension talking directly to PostgreSQL

---

❌ Hardcoded secrets

---

❌ Large controllers

---

❌ Duplicate validation

---

❌ Shared mutable state

---

❌ Copy-pasted business logic

---

# 47. Architectural Best Practices

Always

✓ Keep modules independent

✓ Use TypeScript

✓ Validate every request

✓ Keep controllers thin

✓ Use services for business logic

✓ Use repositories for data access

✓ Keep frontend presentation-only

✓ Document APIs before implementation

✓ Prefer composition over duplication

✓ Write code for readability

---

# 48. Future Expansion Plan

Version 2

- Tags
- Favorites
- Syntax Highlighting
- Pagination
- Better Search

---

Version 3

- Full Text Search
- Offline Support
- Better Dashboard

---

Version 4

- AI Summaries
- Semantic Search
- Embeddings
- Related Notes

---

Version 5

- Mobile App

- VS Code Extension

- Desktop Application

- Public API

---

# 49. Engineering Checklist

Before implementing any feature

Ask yourself

□ Does it belong in Version 1?

□ Is there an API?

□ Is it documented?

□ Does it require authentication?

□ Is validation implemented?

□ Is authorization required?

□ Does it follow folder structure?

□ Is the code modular?

□ Are responses standardized?

□ Are errors handled?

□ Is it tested?

□ Is documentation updated?

---

# 50. Final Architecture Summary

MemDev consists of four independent systems.

```
Browser Extension

↓

REST API

↓

Backend

↓

PostgreSQL

↓

Dashboard
```

Every layer has a single responsibility.

Communication occurs exclusively through REST APIs.

Business logic resides only in the backend.

The frontend focuses on presentation.

The browser extension focuses on knowledge capture.

The database focuses on persistence.

This separation ensures that the system remains

- Maintainable
- Testable
- Secure
- Extensible
- Scalable

Version 1 intentionally optimizes for simplicity.

Future versions will build on this architecture without requiring major redesign.

---

# Engineering Philosophy

Build a system that is easy to understand.

Not one that is difficult to impress people with.

A simple architecture that is consistently followed is more valuable than a complex architecture that no one understands.

The objective of MemDev is not only to become a useful application but also to serve as an example of clean software engineering.

---

# End of Document

Software Architecture Document

Version 1.0

Status

Approved for Implementation

Next Document

docs/API.md







