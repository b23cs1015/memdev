# GitHub Copilot Instructions

# Project

Project Name

MemDev

Tagline

A Personal Knowledge Management System for Developers.

---

# Purpose

MemDev is a browser extension and web application that allows developers to capture useful knowledge from webpages and retrieve it later.

The application should prioritize

- Simplicity
- Security
- Maintainability
- Scalability
- Readability

over unnecessary complexity.

---

# Before Writing Code

Always understand

1. What feature is being implemented.

2. Which module owns the feature.

3. Which existing documentation applies.

Never invent architecture.

Always follow the documentation.

---

# Required Reading Order

Before implementing any feature, use these documents as the source of truth.

1.

README.md

2.

docs/PROJECT.md

3.

docs/ARCHITECTURE.md

4.

docs/API.md

5.

docs/SECURITY.md

If any documentation conflicts with generated code,

documentation wins.

---

# Project Architecture

The project consists of four independent applications.

Browser Extension

↓

REST API

↓

Backend

↓

PostgreSQL

↓

Dashboard

The frontend never communicates directly with PostgreSQL.

The browser extension never communicates directly with PostgreSQL.

All communication occurs through REST APIs.

---

# Tech Stack

Frontend

Next.js

TypeScript

Tailwind CSS

Backend

Node.js

Express.js

Browser Extension

Plasmo

Database

PostgreSQL

Authentication

JWT

bcrypt

Validation

Zod

Deployment

Vercel

Render

Neon PostgreSQL

---

# Project Philosophy

Always optimize for

Readability

↓

Maintainability

↓

Correctness

↓

Performance

Never optimize prematurely.

---

# Version 1 Scope

Only implement

Authentication

Browser Extension

Save Notes

Dashboard

Search

Delete Notes

Do NOT implement

AI

Semantic Search

Embeddings

Redis

Notifications

Offline Support

Folders

Tags

Workspaces

Collaboration

If asked to implement these,

recommend Version 2.

---

# Coding Standards

Always

Use TypeScript.

Never use JavaScript.

Never use "any".

Prefer interfaces over type aliases when modelling API/domain objects.

Use async/await.

Never use nested callbacks.

Use meaningful variable names.

Keep functions short.

Keep components focused.

Keep files modular.

---

# Folder Rules

Frontend

```
components/

hooks/

services/

utils/

types/

lib/
```

Backend

```
routes/

controllers/

services/

repositories/

middleware/

validators/

database/

utils/
```

Extension

```
contents/

background/

popup/

messaging/

storage/
```

Never violate the folder structure.

---

# Backend Rules

Every endpoint must follow

Route

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

Database

Controllers

Thin.

Services

Business Logic.

Repositories

Database only.

Never mix responsibilities.

---

# Frontend Rules

React components should

Render UI.

Call hooks.

Call services.

Nothing else.

Business logic belongs inside hooks or services.

Never write fetch() directly inside components.

---

# Extension Rules

The extension

Can

Read selected text.

Read page title.

Read URL.

Send API requests.

Cannot

Read passwords.

Read cookies.

Read browsing history.

Track users.

Access PostgreSQL.

---

# Database Rules

Never duplicate data.

Always use foreign keys.

Always use parameterized queries.

Never build SQL using string concatenation.

Never store passwords.

Only store password hashes.

---

# Authentication Rules

Version 1 uses JWT.

Every protected endpoint requires

Authorization

Bearer Token

Passwords must always be hashed using bcrypt.

JWT verification belongs in middleware.

Never verify JWT inside controllers.

---

# API Rules

Every endpoint must

Validate request.

Authenticate user.

Authorize ownership.

Return standard response format.

Never expose stack traces.

Never expose SQL errors.

Never change response format.

Always return JSON.

---

# Validation Rules

Use Zod.

Validate

Body

Params

Query

Never trust frontend input.

---

# Security Rules

Always

Validate input.

Escape user-generated content.

Use HTTPS.

Use Helmet.

Use CORS.

Use Rate Limiting.

Use Environment Variables.

Never hardcode secrets.

Never expose passwords.

Never expose JWT.

Never expose SQL errors.

---

# Logging Rules

Log

Endpoint

Status Code

Execution Time

Do NOT log

Passwords

JWT

Secrets

Personal Data

---

# Error Handling

Use one global error handler.

Never duplicate try/catch unnecessarily.

Return consistent error responses.

---

# Code Style

Prefer

Early returns.

Readable code.

Composition.

Small functions.

Dependency injection where appropriate.

Avoid

Large files.

Deep nesting.

Magic numbers.

Duplicate code.

---

# Documentation Rules

Whenever a feature changes

Update

README

Architecture

API

Security

Documentation is part of the implementation.

---

# Git Commit Style

Use Conventional Commits.

Examples

feat(auth): implement login endpoint

feat(notes): create notes API

fix(api): validate empty text

refactor(search): simplify search logic

docs(api): update notes endpoints

---

# Development Workflow

Every feature follows

Understand Requirement

↓

Update Documentation

↓

Database

↓

Repository

↓

Service

↓

Controller

↓

Route

↓

Frontend

↓

Extension

↓

Testing

↓

Documentation

↓

Commit

Never skip documentation.

---

# Testing Philosophy

Every endpoint should have

Positive tests.

Negative tests.

Validation tests.

Authorization tests.

Ownership tests.

Never merge untested code.

---

# Engineering Principles

Prefer

Simple solutions.

Explicit code.

Modular design.

Reusable components.

Consistent naming.

Predictable APIs.

Never sacrifice maintainability for cleverness.

---

# Common Mistakes

Never

Put SQL in controllers.

Put business logic in React components.

Trust frontend validation.

Return inconsistent API responses.

Hardcode secrets.

Duplicate validation.

Bypass middleware.

Access the database from the frontend.

Access the database from the browser extension.

---

# Future Versions

Version 2

Tags

Favorites

Pagination

Version 3

Full Text Search

Offline Support

Version 4

Semantic Search

Embeddings

AI Summaries

Version 5

VS Code Extension

Mobile App

Desktop Application

---

# Final Rule

Whenever generating code, ask yourself

Does this code

Follow the architecture?

Follow the API specification?

Follow the folder structure?

Follow the security rules?

Follow Version 1 scope?

If the answer to any question is No,

rewrite the solution before returning it.

The objective is not to generate code quickly.

The objective is to generate code that a professional software engineer would be comfortable maintaining.