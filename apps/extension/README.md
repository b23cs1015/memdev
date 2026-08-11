# MemDev Browser Extension

The MemDev browser extension is the quick-capture frontend of the MemDev knowledge-management application.

## Phase 24

Phase 24 establishes the Chrome Manifest V3 foundation.

### Included

- React + TypeScript popup
- Chrome Manifest V3
- Background service worker
- Content script
- Typed internal extension messaging
- Minimal extension permissions
- Local MemDev development-page integration

### Architecture

```text
Chrome
  │
  ├── Popup
  │     │
  │     └── chrome.runtime messaging
  │
  ├── Background Service Worker
  │     │
  │     └── Extension coordination
  │
  └── Content Script
        │
        └── Webpage integration