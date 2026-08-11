# MemDev Browser Extension

The MemDev browser extension is the quick-capture frontend of the MemDev knowledge-management application.

## Phase 26

Phase 26 connects the browser extension to the existing MemDev account and note API.

### Included

- Selected-text capture
- Page title capture
- Page URL capture
- Existing MemDev session connection
- JWT storage using Chrome extension storage
- Authenticated note creation
- Save loading state
- Save success state
- Authentication failure handling
- Backend CORS support for the extension
- No duplicate authentication system

## Authentication flow

The extension does not ask the user for their MemDev password.

Instead:

```text
User signs in to MemDev web app
        ↓
Web app stores memdev_token
        ↓
User opens extension on MemDev
        ↓
Connect to MemDev
        ↓
Extension reads the existing token
        ↓
Token stored in chrome.storage.local
        ↓
Authenticated API requests