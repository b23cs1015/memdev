# MemDev

> **A Personal Knowledge Management System for Developers**

MemDev is a browser extension and web application that helps developers capture, organize, search, and revisit useful knowledge encountered while browsing technical resources.

Instead of bookmarking entire webpages, MemDev allows developers to save only the important parts of a webpage—code snippets, explanations, documentation, Stack Overflow answers, GitHub discussions, tutorials, or anything worth remembering—and retrieve them later through a powerful dashboard.

---

# Problem Statement

Every developer spends countless hours reading documentation, GitHub issues, Stack Overflow answers, blogs, and tutorials.

During this process they discover valuable information:

- A useful React pattern
- A tricky SQL query
- A Linux command
- A CSS trick
- A GitHub discussion
- A debugging solution
- A useful library

Most developers simply bookmark the webpage.

After months they end up with hundreds of bookmarks that are almost impossible to search.

Eventually they search Google again for information they already discovered.

MemDev solves this problem.

Instead of saving webpages, developers save knowledge.

---

# Vision

Our vision is to build a personal memory layer for developers.

MemDev should eventually become the place where every useful thing a developer learns while browsing is captured, organized, searchable, and intelligently resurfaced at the right time.

Version 1 focuses only on validating the core workflow.

Later versions may introduce:

- Semantic Search
- AI-powered summaries
- Smart resurfacing
- Spaced repetition
- Context-aware recommendations
- Mobile application
- IDE integrations

---

# Version 1 Goal

The objective of Version 1 is extremely simple.

```
Select useful text
↓

Save it

↓

Store it

↓

Find it later
```

Nothing else.

If this workflow is fast and reliable, then the core idea is validated.

---

# Core Features (Version 1)

## Authentication

- Register
- Login
- Logout
- JWT Authentication

---

## Browser Extension

- Detect selected text
- Floating Save button
- Capture:
  - Selected text
  - URL
  - Page title
  - Timestamp
- Send to backend

---

## Dashboard

- View saved notes
- Search notes
- Delete notes

---

## Backend

REST API for

- Authentication
- Saving notes
- Fetching notes
- Searching notes
- Deleting notes

---

## Database

Store

- Users
- Notes

---

# What Version 1 DOES NOT Include

To keep the MVP focused, Version 1 intentionally excludes:

- AI
- Semantic Search
- Embeddings
- Vector Database
- Offline Sync
- Mobile Application
- Notifications
- Email Digests
- Workspaces
- Collaboration
- Folder Organization
- Recommendation System

These are planned for future versions.

---

# Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS

---

## Backend

- Node.js
- Express.js

---

## Browser Extension

- Plasmo

---

## Database

- PostgreSQL

---

## Authentication

- JWT
- bcrypt

---

## Deployment

Frontend

- Vercel

Backend

- Render / Railway

Database

- Neon PostgreSQL

---

# High-Level Architecture

```
                        Browser

                           │

               Select Text on Webpage

                           │

                    Plasmo Extension

                           │

                     REST API (HTTPS)

                           │

                  Express.js Backend

                           │

                     PostgreSQL DB

                           │

                 Next.js Dashboard
```

---

# Folder Structure

```
memdev/

│
├── README.md
│
├── docs/
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEVELOPMENT.md
│   └── SECURITY.md
│
├── frontend/
│
├── backend/
│
├── extension/
│
└── .github/
    └── copilot-instructions.md
```

---

# Project Documentation

| File | Purpose |
|-------|----------|
| PROJECT.md | Product requirements and vision |
| ARCHITECTURE.md | Complete system architecture |
| API.md | API documentation |
| DEVELOPMENT.md | Coding standards and workflow |
| SECURITY.md | Security, privacy and scalability |
| copilot-instructions.md | Instructions for GitHub Copilot |

---

# Development Philosophy

MemDev follows a few simple engineering principles.

- Build small.
- Ship early.
- Keep architecture modular.
- Prefer readability over cleverness.
- Security by default.
- Privacy by design.
- Everything behind documented APIs.
- Every feature should be independently testable.
- Documentation is treated as code.

---

# Project Status

Current Version

```
Version 1 (MVP)
```

Status

```
In Development
```

Current Objective

```
Complete the entire MVP before adding advanced features.
```

---

# Success Criteria for Version 1

Version 1 will be considered complete when:

- User can register.
- User can login.
- User can select text on any webpage.
- Extension captures selection.
- Extension sends data to backend.
- Backend stores note.
- Dashboard displays saved notes.
- User can search notes.
- User can delete notes.
- Entire system is deployed.

---

# Future Roadmap

Version 2

- Tags
- Favorites
- Syntax Highlighting
- Better Search

Version 3

- Full Text Search
- Fuzzy Search
- Offline Sync

Version 4

- Semantic Search
- AI Layer
- Daily Digest

Version 5

- Mobile App
- Push Notifications
- IDE Integration

---

# Contributing

Before implementing any feature:

1. Read PROJECT.md
2. Read ARCHITECTURE.md
3. Read API.md
4. Follow DEVELOPMENT.md
5. Follow SECURITY.md

All new features should conform to the documented architecture.

---

# License

This project is currently under active development.

License will be added before the first public release.

---

# Author

Developed by **Devesh Labana**

IIT Jodhpur

```
Learning by building.

Build first.

Optimize later.
```