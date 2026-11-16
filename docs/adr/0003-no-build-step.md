---
status: accepted
---

# No build step, no framework, no outside requests

The game is three hand-written static files served from the repo root, with fonts and icons checked in. There is no bundler, no framework and no runtime dependency, and the page loads nothing from another host. This keeps the repo identical to the site, lets the content security policy be `default-src 'self'`, and makes offline use a matter of caching a short file list.

## Consequences

- Game content is data inside `app.js`, not separate content files.
- Inline scripts, inline styles and third-party embeds will be blocked by the policy. That is intended.

_Recorded on 2026-11-16, after the decision was made during the build._
