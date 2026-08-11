# MemDev Browser Extension

The MemDev browser extension is the quick-capture frontend of the MemDev knowledge-management application.

## Phase 25

Phase 25 adds selected-text capture from the active browser tab.

### Included

- React + TypeScript popup
- Chrome Manifest V3
- Background service worker
- Content script foundation
- Typed internal extension messaging
- Selected-text capture
- Page title capture
- Page URL capture
- Capture preview
- `activeTab` + `scripting` permissions
- Runtime page access without `<all_urls>`

### Capture workflow

```text
User highlights text
        ↓
Opens MemDev extension
        ↓
Popup requests active tab
        ↓
chrome.scripting.executeScript()
        ↓
window.getSelection()
        +
document.title
        +
window.location.href
        ↓
Capture preview