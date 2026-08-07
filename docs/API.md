# MemDev API Specification

Version: 1.0

---

# Table of Contents

1. Introduction
2. API Design Principles
3. Base URL
4. Authentication
5. Response Standards
6. Error Standards
7. Status Codes
8. Authentication APIs
9. Notes APIs
10. Future APIs

---

# 1. Introduction

This document defines every REST API exposed by MemDev.

It acts as the contract between

- Frontend
- Browser Extension
- Backend

Every endpoint implemented must match this document.

---

# API Goals

The API should be

- Predictable
- RESTful
- Secure
- Versionable
- Consistent

---

# 2. API Design Principles

Every endpoint should

✓ Follow REST conventions

✓ Return JSON

✓ Use HTTP status codes correctly

✓ Be authenticated when required

✓ Validate every request

✓ Return consistent responses

✓ Never expose internal errors

---

# Base URL

Development

```

http://localhost:5000/api/v1

```

Production

```

https://api.memdev.app/api/v1

```

Every endpoint begins with

```

/api/v1

```

---

# Authentication

Version 1 uses JWT.

Protected requests require

```

Authorization: Bearer <token>

```

---

# Standard Response Format

Every success response

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

---

Every error response

```json
{
    "success": false,
    "message": "...",
    "error": {}
}
```

Never return different formats.

---

# Standard Error Object

```json
{
    "code": "VALIDATION_ERROR",
    "field": "email"
}
```

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

---

# Authentication APIs

Authentication endpoints are responsible for

- Register
- Login
- Current User

---

# POST /auth/register

Purpose

Create a new account.

Authentication

Not Required

---

Request

```json
{
    "name":"Devesh",
    "email":"devesh@gmail.com",
    "password":"mypassword"
}
```

---

Validation

Name

Required

Maximum 100 characters

---

Email

Required

Valid email

Unique

---

Password

Minimum 8 characters

Maximum 64 characters

---

Backend Flow

```

Request

↓

Validate

↓

Check Existing User

↓

Hash Password

↓

Insert User

↓

Return Success

```

---

Success Response

201 Created

```json
{
    "success":true,
    "message":"User registered successfully",
    "data":{
        "userId":"..."
    }
}
```

---

Possible Errors

400

Validation Failed

409

Email Already Exists

500

Internal Server Error

---

# POST /auth/login

Purpose

Authenticate user.

---

Authentication

Public

---

Request

```json
{
    "email":"devesh@gmail.com",
    "password":"mypassword"
}
```

---

Backend Flow

```

Find User

↓

Compare Password

↓

Generate JWT

↓

Return Token

```

---

Success Response

```json
{
    "success":true,
    "message":"Login successful",
    "data":{
        "token":"JWT",
        "user":{
            "id":"",
            "name":"",
            "email":""
        }
    }
}
```

---

Possible Errors

400

Validation Failed

401

Invalid Credentials

500

Server Error

---

# GET /auth/me

Purpose

Return currently logged in user.

Authentication

Required

---

Headers

```

Authorization

Bearer JWT

```

---

Success Response

```json
{
    "success":true,
    "data":{
        "id":"",
        "name":"",
        "email":""
    }
}
```

---

Possible Errors

401

Invalid Token

403

Expired Token

---

# Authentication Middleware

Every protected endpoint executes

```

Receive Request

↓

Read Authorization Header

↓

Verify JWT

↓

Extract User ID

↓

Attach User to Request

↓

Continue

```

If verification fails

Immediately return

401 Unauthorized

---

# Security Rules

Passwords are never returned.

Passwords are never logged.

JWT secret is stored only in environment variables.

Passwords are hashed using bcrypt.

JWT expiration

7 Days

Refresh Tokens

Not implemented in Version 1.

---

# API Naming Rules

Collections

Plural

```

/notes

/users

```

Resources

Singular ID

```

/notes/:id

```

Search

```

/notes/search

```

Authentication

```

/auth/login

/auth/register

```

---

# Validation Rules

Every request

↓

Validation

↓

Controller

Never

Request

↓

Controller

---

# Engineering Notes

Authentication is intentionally separated from business logic.

Every controller assumes

User identity has already been verified by middleware.

Controllers should never manually verify JWT.

---

# AI Notes

Whenever implementing authentication

Always create

Route

↓

Validator

↓

Controller

↓

Service

↓

Repository

Never skip layers.

---

# End of Part 1

Next Part

Notes APIs

↓

Save Note

↓

Fetch Notes

↓

Search Notes

↓

Delete Notes

↓

Pagination

↓

Filtering

↓

Error Handling

↓

API Versioning


---

# Notes APIs

The Notes module is the core feature of MemDev.

Every saved piece of knowledge is represented as a Note.

A note belongs to exactly one user.

One user can have many notes.

---

# Notes Resource

```
Note

id

userId

text

url

pageTitle

createdAt

updatedAt
```

---

# Ownership Rules

Every note belongs to exactly one user.

Users can

✓ Create their own notes

✓ Read their own notes

✓ Search their own notes

✓ Delete their own notes

Users CANNOT

✗ Read another user's notes

✗ Delete another user's notes

✗ Modify another user's notes

---

# POST /notes

Purpose

Create a new note.

Authentication

Required

Authorization

Bearer JWT

---

Headers

```
Authorization: Bearer <JWT>
```

---

Request Body

```json
{
    "text":"useEffect cleanup runs before component unmount.",
    "url":"https://react.dev/reference/react/useEffect",
    "pageTitle":"React useEffect Documentation"
}
```

---

Field Validation

text

Required

Minimum Length

1 character

Maximum Length

10000 characters

---

url

Required

Valid URL

Maximum 2048 characters

---

pageTitle

Required

Maximum 300 characters

---

Business Rules

A note

- must belong to the authenticated user
- cannot have empty text
- should store creation timestamp
- should never trust client supplied userId

The backend derives

userId

from JWT.

---

Backend Workflow

```
Receive Request

↓

JWT Middleware

↓

Validation

↓

Controller

↓

Note Service

↓

Repository

↓

INSERT INTO notes

↓

Return Created Note
```

---

Success Response

201 Created

```json
{
    "success":true,
    "message":"Note created successfully.",
    "data":{
        "id":"...",
        "text":"...",
        "url":"...",
        "pageTitle":"...",
        "createdAt":"..."
    }
}
```

---

Possible Errors

400

Validation Failed

401

Unauthorized

422

Invalid URL

500

Internal Server Error

---

Engineering Notes

Never trust

userId

coming from frontend.

Always derive

userId

from JWT.

---

# GET /notes

Purpose

Retrieve all notes belonging to the authenticated user.

Authentication

Required

---

Headers

```
Authorization: Bearer <JWT>
```

---

Backend Workflow

```
Request

↓

JWT Middleware

↓

Controller

↓

Note Service

↓

Repository

↓

SELECT Notes

↓

Return Notes
```

---

Default Sorting

Newest First

```
ORDER BY created_at DESC
```

---

Success Response

```json
{
  "success":true,
  "data":[
      {
        "id":"...",
        "text":"...",
        "url":"...",
        "pageTitle":"...",
        "createdAt":"..."
      }
  ]
}
```

---

Future Improvements

Pagination

Filtering

Sorting

Infinite Scroll

Not implemented in Version 1.

---

# GET /notes/:id

Purpose

Retrieve a single note.

Authentication

Required.

---

Backend Workflow

```
Verify JWT

↓

Find Note

↓

Verify Ownership

↓

Return Note
```

---

Success Response

```json
{
    "success":true,
    "data":{
        "id":"...",
        "text":"...",
        "url":"...",
        "pageTitle":"..."
    }
}
```

---

Possible Errors

404

Note Not Found

403

Forbidden

---

# GET /notes/search

Purpose

Search notes.

Authentication

Required

---

Example

```
GET /notes/search?q=react
```

---

Query Parameters

q

Required

Minimum Length

1

Maximum Length

100

---

Search Fields

Version 1 searches

✓ text

✓ pageTitle

Version 1 does NOT search

✗ URL

---

SQL Strategy

```
WHERE

text ILIKE '%query%'

OR

page_title ILIKE '%query%'
```

Only return notes

belonging to authenticated user.

---

Backend Workflow

```
Receive Request

↓

Validate Query

↓

Verify JWT

↓

Search Service

↓

Repository

↓

SQL Search

↓

Return Matching Notes
```

---

Success Response

```json
{
    "success":true,
    "data":[
        {
            "id":"...",
            "text":"React Hooks...",
            "pageTitle":"React Docs"
        }
    ]
}
```

---

Future Search Roadmap

Version 2

Full Text Search

Version 3

Fuzzy Search

Version 4

Semantic Search

Embeddings

---

Engineering Note

Searching should always occur inside the database.

Never fetch all notes and filter inside React.

---

# DELETE /notes/:id

Purpose

Delete a note.

Authentication

Required.

---

Example

```
DELETE /notes/123
```

---

Backend Workflow

```
Receive Request

↓

Verify JWT

↓

Find Note

↓

Verify Ownership

↓

Delete

↓

Return Success
```

---

Success Response

```json
{
    "success":true,
    "message":"Note deleted successfully."
}
```

---

Possible Errors

401

Unauthorized

403

Forbidden

404

Note Not Found

---

Security Rule

Deleting a note must always verify

note.userId == authenticatedUser.id

Never delete using

id

alone.

---

# Pagination

Version 1

No pagination.

Return all notes.

Reason

Simple MVP.

Future versions

```
GET /notes?page=2&limit=20
```

---

# Filtering

Version 1

No filters.

Future

Date

Tags

Favorites

Source

Folders

---

# Sorting

Version 1

Newest First

Future

Newest

Oldest

Alphabetical

Recently Viewed

---

# Notes Lifecycle

```
Create

↓

Store

↓

Retrieve

↓

Search

↓

Delete
```

A deleted note is permanently removed.

Soft delete

Not implemented in Version 1.

---

# Database Queries

Create

```
INSERT INTO notes
```

Read

```
SELECT * FROM notes
```

Search

```
SELECT WHERE ILIKE
```

Delete

```
DELETE FROM notes
```

---

# API Performance

Expected Operations

Create

O(1)

Read

O(n)

Search

O(n)

Delete

O(1)

Version 2

Indexes

Version 3

Full Text Search

---

# Future APIs

PATCH /notes/:id

Update Note

---

POST /notes/favorite

Favorites

---

GET /notes/tags

Tags

---

POST /notes/summarize

AI Summary

---

POST /notes/embedding

Embeddings

---

# Common Mistakes

❌ Trusting frontend userId

❌ Searching inside React

❌ Returning another user's notes

❌ Deleting without ownership verification

❌ Returning SQL errors

---

# AI Notes

Every Notes API must follow

Route

↓

Validation

↓

Authentication

↓

Controller

↓

Service

↓

Repository

↓

Database

No business logic should exist inside controllers.

---

# End of Part 2

Next Part

API Versioning

↓

Validation Strategy

↓

Error Codes

↓

Rate Limiting

↓

OpenAPI Specification

↓

Swagger Documentation

↓

API Security

↓

Testing Strategy

---

# API Versioning

Every API must be versioned.

Current Version

```
v1
```

Base URL

```
/api/v1
```

Example

```
POST /api/v1/auth/login

GET /api/v1/notes

DELETE /api/v1/notes/:id
```

---

## Why API Versioning?

API versioning allows new versions to be introduced without breaking existing clients.

Future

```
v1

↓

v2

↓

v3
```

The browser extension and dashboard can continue using older versions while newer clients migrate gradually.

---

# URL Naming Standards

Always use nouns.

Correct

```
/notes

/users

/auth/login
```

Wrong

```
/createNote

/getNotes

/deleteNote
```

REST endpoints describe resources, not actions.

---

# HTTP Methods

GET

Retrieve data.

Never modifies state.

---

POST

Create resources.

---

PUT

Replace an entire resource.

(Not used in Version 1.)

---

PATCH

Update partial resource.

(Future version.)

---

DELETE

Delete resource.

---

# Request Standards

Every request should contain

Headers

↓

Authentication

↓

Body

↓

Validation

↓

Business Logic

Never process invalid requests.

---

# Response Standards

Every successful response must follow

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Every error response

```json
{
    "success": false,
    "message": "...",
    "error": {
        "code": "...",
        "details": "..."
    }
}
```

Response format must never change between endpoints.

Consistency is more important than cleverness.

---

# Error Code Catalog

Authentication Errors

```
AUTH_INVALID_CREDENTIALS

AUTH_TOKEN_EXPIRED

AUTH_TOKEN_INVALID

AUTH_UNAUTHORIZED
```

Validation Errors

```
VALIDATION_FAILED

INVALID_EMAIL

INVALID_URL

INVALID_REQUEST_BODY

INVALID_QUERY
```

Resource Errors

```
NOTE_NOT_FOUND

USER_NOT_FOUND
```

Database Errors

```
DATABASE_ERROR
```

System Errors

```
INTERNAL_SERVER_ERROR
```

---

# Validation Strategy

Validation occurs before controllers.

Flow

```
Request

↓

Validation Middleware

↓

Controller

↓

Service
```

Validation library

Recommended

```
Zod
```

Every endpoint must validate

Required fields

↓

Field lengths

↓

Email format

↓

URL format

↓

Allowed values

---

# Example Validation

Login

```
email

required

valid email

----------------

password

required

minimum 8
```

---

Create Note

```
text

required

1–10000 chars

----------------

url

required

valid URL

----------------

pageTitle

required

1–300 chars
```

---

# Rate Limiting

Purpose

Prevent abuse.

Recommended Library

express-rate-limit

Version 1

General APIs

```
100 requests / 15 minutes
```

Authentication APIs

```
10 login attempts / 15 minutes
```

Reason

Prevent brute-force attacks.

---

# CORS Policy

Only trusted origins should access the backend.

Allowed Origins

Development

```
http://localhost:3000
```

Production

```
https://memdev.app
```

Browser Extension

```
chrome-extension://<extension-id>
```

Reject every other origin.

---

# Security Headers

Recommended Middleware

Helmet

Security headers include

Content Security Policy

X-Frame-Options

X-Content-Type-Options

Referrer Policy

These are automatically handled by Helmet.

---

# Authentication Rules

Public Endpoints

```
POST /auth/register

POST /auth/login
```

Everything else

↓

JWT Required

Never create exceptions.

---

# Authorization Rules

Authentication answers

```
Who are you?
```

Authorization answers

```
Can you access this resource?
```

Example

```
DELETE /notes/15
```

Authentication

↓

Valid JWT

↓

Authorization

↓

Does note belong to user?

↓

Yes

↓

Delete

Otherwise

↓

403 Forbidden

---

# Idempotency

GET

Always idempotent.

DELETE

Should be idempotent.

Deleting the same resource twice should not crash the application.

POST

Not idempotent.

Creates new resources.

---

# Pagination Strategy

Version 1

No pagination.

Future

```
GET /notes?page=1&limit=20
```

Response

```json
{
    "success": true,
    "data": {
        "notes": [],
        "page":1,
        "limit":20,
        "total":153
    }
}
```

---

# Sorting

Current

Newest First

Future

Oldest

Alphabetical

Recently Viewed

Most Accessed

---

# Filtering

Future

```
Tag

Date

Favorite

Folder

Source Website
```

---

# API Documentation

Every endpoint should eventually be documented using

OpenAPI

Swagger

Version 1

Markdown documentation is sufficient.

---

# Testing Strategy

Every endpoint should have

Positive Tests

Negative Tests

Authorization Tests

Validation Tests

Ownership Tests

---

Example

POST /notes

Test

✓ Valid JWT

✓ Invalid JWT

✓ Missing text

✓ Empty text

✓ Invalid URL

✓ Large payload

✓ SQL injection attempt

---

# API Performance Guidelines

Controllers

Fast

↓

Services

Business Logic

↓

Repositories

Database

Never perform expensive work inside controllers.

---

# API Logging

Log

Request Method

Endpoint

Status Code

Execution Time

Do NOT log

Passwords

JWT

Secrets

Database Credentials

---

# API Monitoring

Future

Track

Average Response Time

Requests Per Minute

Error Rate

Success Rate

Version 1

Basic server logging is sufficient.

---

# OpenAPI Future Structure

```
openapi/

auth.yaml

notes.yaml

components.yaml

schemas.yaml
```

Not required for MVP.

---

# Engineering Best Practices

Always

✓ Validate requests

✓ Authenticate users

✓ Authorize ownership

✓ Return consistent responses

✓ Use HTTP status codes correctly

✓ Keep endpoints RESTful

✓ Document changes

---

# Anti-Patterns

Never

✗ SQL inside controllers

✗ Validation inside React

✗ Returning HTML

✗ Returning stack traces

✗ Returning raw SQL errors

✗ Mixing response formats

✗ Hardcoding URLs

---

# AI Notes

When implementing an API

Always implement in this order

1. Route

2. Validation Schema

3. Controller

4. Service

5. Repository

6. Tests

7. Documentation

Never skip documentation.

---

# API Implementation Checklist

Before marking an endpoint complete

□ Route created

□ Validation implemented

□ Controller added

□ Service added

□ Repository added

□ Authentication added

□ Authorization verified

□ Tested

□ Documented

□ Error responses verified

□ Status codes correct

---

# End of Part 3

Next Part

• OpenAPI Examples

• Complete Swagger Specification

• Example Requests

• Example Responses

• Postman Collection

• API Lifecycle Diagrams

• Sequence Diagrams

• Version 2 API Design

This will complete the API Specification document.


---

# OpenAPI Readiness

Although Version 1 uses Markdown documentation, every endpoint should be designed so it can later be converted into an OpenAPI (Swagger) specification.

Future folder structure

```
backend/

docs/

openapi/

auth.yaml

notes.yaml

schemas.yaml

responses.yaml
```

---

# Complete Endpoint List

## Authentication

```
POST    /api/v1/auth/register

POST    /api/v1/auth/login

GET     /api/v1/auth/me
```

---

## Notes

```
POST    /api/v1/notes

GET     /api/v1/notes

GET     /api/v1/notes/:id

GET     /api/v1/notes/search

DELETE  /api/v1/notes/:id
```

---

# API Dependency Diagram

```
Browser Extension

        │

        ▼

REST API

        │

        ▼

Authentication Middleware

        │

        ▼

Validation

        │

        ▼

Controller

        │

        ▼

Service

        │

        ▼

Repository

        │

        ▼

PostgreSQL
```

---

# End-to-End Save Note Example

## Request

POST /api/v1/notes

Headers

```
Authorization: Bearer eyJhb...
```

Body

```json
{
    "text":"React useEffect cleanup runs before unmount.",
    "url":"https://react.dev/reference/react/useEffect",
    "pageTitle":"React Documentation"
}
```

---

## Response

```json
{
    "success":true,
    "message":"Note created successfully.",
    "data":{
        "id":"note_001",
        "createdAt":"2026-08-08T12:00:00Z"
    }
}
```

---

# Complete Login Example

Request

```json
{
    "email":"devesh@gmail.com",
    "password":"password123"
}
```

Response

```json
{
    "success":true,
    "message":"Login successful",
    "data":{
        "token":"JWT",
        "user":{
            "id":"usr_001",
            "name":"Devesh",
            "email":"devesh@gmail.com"
        }
    }
}
```

---

# Unauthorized Example

```json
{
    "success":false,
    "message":"Unauthorized",
    "error":{
        "code":"AUTH_UNAUTHORIZED"
    }
}
```

---

# Validation Error Example

```json
{
    "success":false,
    "message":"Validation failed",
    "error":{
        "code":"VALIDATION_FAILED",
        "field":"email"
    }
}
```

---

# Not Found Example

```json
{
    "success":false,
    "message":"Note not found",
    "error":{
        "code":"NOTE_NOT_FOUND"
    }
}
```

---

# Forbidden Example

```json
{
    "success":false,
    "message":"Access denied",
    "error":{
        "code":"FORBIDDEN"
    }
}
```

---

# API Sequence Diagram

Save Note

```
Developer

↓

Browser

↓

Extension

↓

POST /notes

↓

JWT Middleware

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

↓

Repository

↓

Service

↓

Controller

↓

Response

↓

Extension

↓

Toast
```

---

# Search Sequence

```
Dashboard

↓

Search Bar

↓

GET /notes/search

↓

JWT Middleware

↓

Search Service

↓

Repository

↓

Database

↓

Results

↓

Dashboard
```

---

# Delete Sequence

```
Dashboard

↓

Delete Button

↓

DELETE /notes/:id

↓

JWT Middleware

↓

Ownership Check

↓

Repository

↓

DELETE Query

↓

Response

↓

Dashboard Refresh
```

---

# API State Diagram

```
Request

↓

Received

↓

Authenticated

↓

Validated

↓

Processed

↓

Database

↓

Response

↓

Completed
```

Any failure immediately returns an error response.

---

# Backend Service Responsibilities

## AuthService

Responsible for

- Register User
- Login User
- Generate JWT
- Verify Password

---

## NoteService

Responsible for

- Create Note
- Retrieve Notes
- Search Notes
- Delete Notes

---

## Repository Responsibilities

Repository classes should ONLY perform database operations.

Examples

```
createNote()

deleteNote()

findUserByEmail()

findNotes()

searchNotes()
```

No business logic.

---

# Testing Matrix

## Authentication

| Test | Expected |
|------|----------|
| Valid Register | 201 |
| Duplicate Email | 409 |
| Invalid Email | 400 |
| Weak Password | 400 |

---

## Login

| Test | Expected |
|------|----------|
| Correct Credentials | 200 |
| Wrong Password | 401 |
| Unknown Email | 401 |

---

## Notes

| Test | Expected |
|------|----------|
| Create Note | 201 |
| Empty Text | 400 |
| Invalid JWT | 401 |
| Search Existing | 200 |
| Search Missing | 200 (Empty Array) |
| Delete Own Note | 200 |
| Delete Other User Note | 403 |

---

# Future APIs

Version 2

```
PATCH /notes/:id

Update Note
```

---

```
POST /notes/favorite
```

---

```
GET /notes/favorites
```

---

Version 3

```
POST /notes/tags
```

---

```
GET /notes/filter
```

---

Version 4

```
POST /notes/summarize
```

---

```
POST /notes/embed
```

---

```
GET /notes/recommendations
```

---

# API Evolution Strategy

Version 1

CRUD APIs

↓

Version 2

Filtering

↓

Version 3

Advanced Search

↓

Version 4

AI Services

The frontend should not require architectural changes when these APIs are added.

---

# API Change Rules

Whenever a new endpoint is added

Update

✓ API.md

✓ README

✓ PROJECT.md (if feature changes scope)

✓ Tests

Never implement undocumented APIs.

---

# Postman Collection Structure

```
MemDev

Authentication

Register

Login

Current User

--------------------

Notes

Create

Get All

Get One

Search

Delete
```

---

# API Documentation Checklist

Before releasing an endpoint

□ Route implemented

□ Validation complete

□ Authentication added

□ Authorization checked

□ Service implemented

□ Repository implemented

□ Tests passing

□ Documentation updated

□ Error responses verified

□ Status codes correct

---

# API Design Philosophy

Every endpoint should answer these questions clearly

What does it do?

Who can call it?

What input does it require?

What output does it return?

What errors can occur?

If those questions cannot be answered, the endpoint is not ready.

---

# Engineering Notes

The API is intentionally small in Version 1.

A small, consistent API is preferable to a large, inconsistent one.

Future versions should extend the API without breaking existing clients.

---

# AI Notes

When generating backend code

Always consult this document first.

Never invent new endpoints.

Never change request formats.

Never change response formats.

Maintain backward compatibility whenever possible.

---

# End of API Specification

Version

1.0

Status

Approved for Development



