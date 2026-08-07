# MemDev Database Design Document

Version: 1.0

---

# Table of Contents

1. Introduction
2. Database Philosophy
3. Database Selection
4. Design Principles
5. Entity Relationship Overview
6. Schema Overview
7. Tables
8. Relationships
9. Naming Conventions
10. Constraints
11. Engineering Notes

---

# 1. Introduction

This document defines the database architecture for MemDev.

It is the single source of truth for

- Database Schema
- Table Design
- Relationships
- Constraints
- Indexes
- Naming Conventions
- Future Schema Evolution

Every database change must update this document.

---

# Purpose

The database should provide

- Reliable persistence
- Fast retrieval
- Data integrity
- Easy extensibility

Version 1 intentionally keeps the schema small while allowing future expansion.

---

# 2. Database Philosophy

The database should be

Simple

↓

Normalized

↓

Consistent

↓

Scalable

Avoid premature optimization.

Design for correctness first.

---

# 3. Why PostgreSQL?

PostgreSQL was selected because it provides

✓ ACID compliance

✓ Strong relational integrity

✓ Excellent indexing

✓ Full Text Search

✓ JSON support

✓ Mature ecosystem

✓ Easy migration to semantic search

---

# Why NOT MongoDB?

MongoDB is excellent for many workloads.

However, MemDev requires

- relationships
- ownership
- indexing
- future full-text search
- future semantic search

These fit PostgreSQL better.

---

# 4. Database Design Principles

Every table should

Have one responsibility.

Use primary keys.

Use foreign keys.

Avoid duplicate data.

Store timestamps.

Support future scalability.

---

# Principle 1

Normalization First

Avoid storing duplicate information.

Example

Store

```
user_id
```

instead of

```
user_name

user_email
```

inside Notes.

---

# Principle 2

Use Foreign Keys

Relationships should always be enforced.

Example

```
notes.user_id

↓

users.id
```

---

# Principle 3

Immutable IDs

Primary keys never change.

---

# Principle 4

Audit Timestamps

Every major table should contain

created_at

updated_at

Version 1 may omit updated_at for Notes if editing is not supported.

---

# 5. Entity Relationship Overview

Current Database

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

Version 1 contains only

Users

Notes

Future versions will introduce

Tags

Folders

Favorites

Embeddings

Notifications

Activity

---

# ER Diagram

```
+--------------------+
| USERS              |
+--------------------+
| id (PK)            |
| name               |
| email              |
| password_hash      |
| created_at         |
+--------------------+
          │
          │ 1
          │
          ▼
+--------------------+
| NOTES              |
+--------------------+
| id (PK)            |
| user_id (FK)       |
| text               |
| url                |
| page_title         |
| created_at         |
+--------------------+
```

---

# 6. Schema Overview

Database Name

```
memdev
```

Schema

```
public
```

Tables

```
users

notes
```

---

# 7. Users Table

Purpose

Stores registered users.

---

Columns

id

Type

UUID

Primary Key

---

name

Type

VARCHAR(100)

Required

---

email

Type

VARCHAR(255)

Unique

Required

---

password_hash

Type

TEXT

Required

Never store plain passwords.

---

created_at

Type

TIMESTAMP

Default

NOW()

---

Table Definition

```
Users

id

name

email

password_hash

created_at
```

---

Business Rules

Email must be unique.

Passwords are always hashed.

User IDs are immutable.

Users own their notes.

---

# 8. Notes Table

Purpose

Stores developer knowledge.

---

Columns

id

UUID

Primary Key

---

user_id

UUID

Foreign Key

References Users

---

text

TEXT

Required

---

url

TEXT

Required

---

page_title

VARCHAR(300)

Required

---

created_at

TIMESTAMP

Default NOW()

---

Table Definition

```
Notes

id

user_id

text

url

page_title

created_at
```

---

Business Rules

Every note belongs to one user.

Text cannot be empty.

URL must be valid.

Page title required.

---

# 9. Relationships

One User

↓

Many Notes

A Note

↓

Belongs To

↓

One User

No note can exist without a user.

---

# Referential Integrity

Deleting a user

Future Decision

Either

Cascade Delete

OR

Soft Delete

Version 1

Recommend

Cascade Delete

---

# 10. Naming Conventions

Tables

Plural

```
users

notes
```

Columns

snake_case

```
created_at

updated_at

page_title
```

Primary Keys

```
id
```

Foreign Keys

```
user_id
```

Indexes

```
idx_notes_user

idx_notes_created

idx_users_email
```

---

# 11. Constraints

Users

email

UNIQUE

NOT NULL

---

Notes

user_id

NOT NULL

Foreign Key

---

text

NOT NULL

---

page_title

NOT NULL

---

created_at

DEFAULT NOW()

---

# Engineering Notes

Keep the schema intentionally small.

Adding unnecessary tables in Version 1 increases complexity without improving the product.

Future versions can extend the schema without redesigning the existing relationships.

---

# AI Notes

Whenever creating new tables

Always ask

Does this belong in Version 1?

Can it be represented using an existing table?

Does it violate normalization?

Can this relationship be enforced using a foreign key?

If unsure,

prefer a simpler schema.

---

# End of Part 1

Next Part

Indexes

↓

Query Optimization

↓

Migrations

↓

Performance

↓

Future Tables

↓

Embeddings

↓

Tags

↓

Favorites

↓

Schema Evolution

↓

Backup Strategy

↓

Database Security



---

# 12. Index Strategy

Indexes improve query performance.

However,

Indexes increase

- storage
- insert time
- update time

Therefore,

only index frequently queried columns.

---

## Version 1 Indexes

Users

```
PRIMARY KEY (id)

UNIQUE (email)
```

---

Notes

```
PRIMARY KEY (id)

INDEX(user_id)

INDEX(created_at)
```

---

Future

```
INDEX(page_title)

GIN(text)

GIN(page_title)
```

for Full Text Search.

---

## Why Index user_id?

Almost every query is

```
SELECT *

FROM notes

WHERE user_id = ?
```

Without an index,

PostgreSQL scans the entire table.

With an index,

lookup becomes extremely fast.

---

## Why Index created_at?

Dashboard

↓

Newest Notes

↓

ORDER BY created_at DESC

Indexing improves sorting performance.

---

# 13. Query Optimization

Always retrieve only the data you need.

Good

```sql
SELECT

id,

text,

url,

page_title,

created_at

FROM notes

WHERE user_id = $1;
```

Bad

```sql
SELECT *

FROM notes;
```

Never fetch unnecessary columns.

---

## Filtering

Always filter in SQL.

Correct

```sql
SELECT *

FROM notes

WHERE user_id=$1
```

Wrong

```
Fetch all notes

↓

Filter in JavaScript
```

---

## Searching

Version 1

```
ILIKE '%react%'
```

Version 2

```
PostgreSQL Full Text Search
```

Version 4

```
Semantic Search
```

---

# 14. Database Transactions

Version 1

Very few operations require transactions.

Example

User Registration

```
BEGIN

↓

Insert User

↓

COMMIT
```

If any step fails

↓

ROLLBACK

---

Future

Complex operations

Folders

Tags

Favorites

should use transactions.

---

# 15. Migrations

Never modify production tables manually.

Always use migrations.

Recommended Tool

Prisma Migrate

or

Drizzle Kit

Migration Example

```
001_initial_schema.sql

↓

002_add_indexes.sql

↓

003_add_tags.sql
```

Each migration should be

- atomic
- reversible
- documented

---

# 16. Seed Data

Development environments should include seed data.

Example

Users

```
demo@memdev.dev
```

Password

```
password123
```

Notes

- React Hooks
- SQL Joins
- Git Commands

Seed scripts should never run in production.

---

# 17. Backup Strategy

Version 1

Managed by Neon PostgreSQL.

Future

Daily Backups

↓

Weekly Snapshots

↓

Monthly Archives

Always verify that backups can be restored.

---

# 18. Database Security

Database credentials

Never commit to Git.

Always use

```
DATABASE_URL
```

from environment variables.

Restrict database access to backend only.

Frontend and extension must never connect directly.

---

## SQL Injection Prevention

Always use parameterized queries.

Correct

```sql
SELECT *

FROM users

WHERE email = $1;
```

Wrong

```javascript
"SELECT * FROM users WHERE email='" + email + "'"
```

Never concatenate SQL strings.

---

# 19. Future Tables

Version 2

Tags

```
id

name
```

---

Note Tags

```
note_id

tag_id
```

---

Favorites

```
user_id

note_id
```

---

Version 3

Folders

```
id

user_id

name
```

Folder Notes

```
folder_id

note_id
```

---

Version 4

Embeddings

```
id

note_id

embedding

model

created_at
```

---

AI Summaries

```
id

note_id

summary
```

---

Activity

```
id

user_id

action

timestamp
```

---

# 20. Future Entity Relationship

```
Users

│

├───────────────┐

│               │

▼               ▼

Notes        Folders

│               │

├──────┐        │

│      ▼        ▼

Tags  Favorites

│

▼

Embeddings

│

▼

AI Summaries
```

The Version 1 schema is intentionally designed so these tables can be added without changing the existing ones.

---

# 21. Data Retention Policy

Version 1

Deleted notes are permanently removed.

Future

Soft Delete

```
deleted_at
```

column may be introduced.

---

# 22. Naming Standards

Tables

Plural

```
users

notes

folders
```

Columns

snake_case

```
page_title

created_at

updated_at
```

Indexes

```
idx_notes_user

idx_notes_created

idx_users_email
```

Constraints

```
fk_notes_user
```

Keep naming consistent across all migrations.

---

# 23. Performance Guidelines

Avoid

```
SELECT *
```

Use pagination in future versions.

Index frequently queried columns.

Never perform filtering in application code.

Always use foreign keys.

Monitor slow queries as the application grows.

---

# 24. Engineering Notes

The Version 1 schema intentionally avoids unnecessary complexity.

A small, normalized schema is easier to maintain than a large schema with speculative features.

Future capabilities should be introduced through additive migrations rather than redesigning existing tables.

---

# 25. Database Implementation Checklist

Before creating a new table

□ Does it belong in Version 1?

□ Is normalization preserved?

□ Does it require a foreign key?

□ Are timestamps included?

□ Are indexes necessary?

□ Is the migration reversible?

□ Is the table documented?

□ Does it introduce duplicate data?

If any answer is uncertain,

reconsider the design before implementation.

---

# AI Notes

Whenever modifying the database

Always

1. Update DATABASE.md

2. Create a migration

3. Apply locally

4. Test rollback (where possible)

5. Update repositories if schema changes

6. Update API documentation if affected

Never modify the database schema without updating the documentation.

---

# End of Database Design Document

Version

1.0

Status

Approved for Implementation

