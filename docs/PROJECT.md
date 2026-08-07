# MemDev Product Requirements Document (PRD)

---

# 1. Introduction

## Project Name

**MemDev**

**Tagline**

> A Personal Memory Layer for Developers.

---

## Purpose

MemDev is a browser extension and web application that enables developers to capture, organize, search, and retrieve valuable technical knowledge encountered while browsing the web.

Instead of bookmarking entire webpages, users save only the important information they want to remember.

The system is designed around one principle:

> Developers should never have to search twice for something they already learned.

---

# 2. Problem Statement

Developers consume enormous amounts of information every day.

Examples include:

- Official Documentation
- Stack Overflow
- GitHub Issues
- Reddit Discussions
- Technical Blogs
- YouTube transcripts
- API References

Most of this knowledge is forgotten because current tools are inadequate.

### Current Solutions

Bookmarks

Problems:

- Saves the whole webpage
- Impossible to search effectively
- Become cluttered

---

Notes Applications

Examples:

- Notion
- Obsidian
- OneNote

Problems:

- Require context switching
- Too much friction
- Slow to capture information

---

Browser Reading Lists

Problems:

- Designed for articles
- Not individual knowledge
- No intelligent retrieval

---

# 3. Proposed Solution

MemDev captures knowledge directly from webpages.

Instead of saving pages, users save:

- explanations
- code snippets
- debugging solutions
- commands
- documentation
- discussions
- useful paragraphs

Every saved note contains context automatically.

Example:

```
Selected Text

↓

Page URL

↓

Page Title

↓

Timestamp

↓

Stored permanently
```

Later, the information becomes searchable.

---

# 4. Product Vision

The long-term vision is to become a personal knowledge operating system for developers.

Eventually MemDev should:

- remember what developers learned
- organize knowledge automatically
- surface forgotten information
- connect related ideas
- integrate with development workflow

Version 1 focuses only on validating the capture-and-retrieve workflow.

---

# 5. Product Goals

## Primary Goal

Build the fastest possible workflow for saving useful knowledge from webpages.

---

## Secondary Goals

- Eliminate bookmark clutter
- Build searchable developer memory
- Encourage knowledge retention
- Reduce repeated searching

---

# 6. Non Goals

Version 1 intentionally does NOT include:

- AI
- Semantic Search
- Embeddings
- Mobile Application
- Offline Sync
- Smart Notifications
- Email Digests
- Collaboration
- Teams
- Folders
- Workspaces
- Recommendation Engine

Keeping the MVP focused is a priority.

---

# 7. Target Users

## Primary Users

Software Developers

Examples:

- Students
- Backend Developers
- Frontend Developers
- Full Stack Developers
- Open Source Contributors

---

## Secondary Users

Technical Learners

Examples:

- DevOps Engineers
- ML Engineers
- Security Researchers

---

# 8. User Personas

## Persona 1

Student Developer

Pain Points

- Learns every day
- Forgets useful explanations
- Repeats searches

Goal

Build a personal technical memory.

---

## Persona 2

Working Software Engineer

Pain Points

- Reads documentation constantly
- Cannot remember every solution

Goal

Quick retrieval of previous knowledge.

---

# 9. User Stories

## Authentication

As a user,

I want to create an account

so that my notes are private.

---

As a user,

I want to login

so I can access my saved notes.

---

## Browser Extension

As a user,

I want to highlight text

so I can save useful information.

---

As a user,

I want a floating save button

so that saving is effortless.

---

## Dashboard

As a user,

I want to see all saved notes

so I can review previous knowledge.

---

As a user,

I want search

so I can quickly retrieve information.

---

As a user,

I want to delete notes

so I can keep my knowledge organized.

---

# 10. Functional Requirements

## Authentication

Must support

- Register
- Login
- Logout

---

## Browser Extension

Must

- detect text selection
- display floating button
- capture selected text
- capture URL
- capture page title
- capture timestamp
- send data to backend

---

## Backend

Must

- authenticate users
- save notes
- fetch notes
- delete notes
- search notes

---

## Dashboard

Must

- display notes
- search notes
- delete notes

---

## Database

Must store

Users

Notes

Relationships

---

# 11. Non Functional Requirements

Performance

- Fast search
- Fast saving

---

Security

- JWT Authentication
- bcrypt password hashing
- HTTPS
- Input validation

---

Scalability

Architecture should allow future additions without major redesign.

---

Maintainability

Code should be modular.

---

Reliability

Notes should never be lost once successfully saved.

---

# 12. Version 1 Scope

The MVP consists of only this workflow:

```
User Logs In

↓

User Selects Text

↓

Extension Shows Save Button

↓

User Clicks Save

↓

Backend Receives Request

↓

Database Stores Note

↓

Dashboard Displays Note

↓

User Searches Note
```

If this workflow works reliably,

Version 1 is complete.

---

# 13. Success Metrics

Version 1 succeeds if users can

- Save notes in under 2 seconds
- Search saved notes
- Retrieve previous knowledge
- Delete notes
- Use the extension without confusion

---

# 14. Product Principles

MemDev follows these principles.

## Principle 1

Capture should be frictionless.

---

## Principle 2

Retrieval should be faster than Google.

---

## Principle 3

Developers own their data.

---

## Principle 4

Privacy comes first.

---

## Principle 5

Every feature should simplify the workflow.

---

## Principle 6

Avoid feature creep.

---

# 15. Product Decisions

## Why Browser Extension?

Developers spend most learning time inside browsers.

Capture should happen there.

---

## Why PostgreSQL?

Strong search capabilities

Reliable

Relational

Scalable

---

## Why Plasmo?

Modern browser extension framework

React support

TypeScript support

Excellent developer experience

---

## Why Next.js?

Modern React framework

Good architecture

Easy deployment

---

## Why Express?

Simple

Flexible

Perfect for MVP

---

# 16. Future Versions

## Version 2

Tags

Favorites

Syntax Highlighting

Filtering

---

## Version 3

Full Text Search

Fuzzy Search

Offline Support

---

## Version 4

Semantic Search

AI Summaries

Related Notes

---

## Version 5

Daily Digest

Push Notifications

IDE Plugins

---

# 17. Product Acceptance Criteria

Version 1 is considered complete when all of the following are true.

Authentication

- Register works
- Login works

Extension

- Detects selected text
- Displays save button
- Saves note

Backend

- Stores notes
- Retrieves notes
- Deletes notes

Dashboard

- Displays notes
- Searches notes

Deployment

- Frontend deployed
- Backend deployed
- Database deployed

No Version 2 feature should delay completion of Version 1.

---

# 18. Guiding Rule

When in doubt, ask one question:

> Does this feature help the Version 1 capture → retrieve workflow?

If the answer is **No**,

it belongs in a future version.

This principle should guide every engineering decision made during the development of MemDev.