---
status: accepted
---

# Pages never scroll

Every page must fit the screen, and the type scales down to make it fit. An earlier build scrolled, and playtesting on a phone showed the question drifting out of sight of the evidence needed to answer it. Rather than scroll, long content is split into pages the player taps through.

## Consequences

- Any new text can push a page past the screen. The test plays every page at several screen sizes and fails on overflow.
- On small phones a dense page shrinks its type. A page that shrinks too far should be split, not tolerated.

_Recorded on 2026-11-16, after the decision was made during the build._
