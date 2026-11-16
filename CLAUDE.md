# Diffs, Please

A static, no-build browser game. `index.html`, `style.css` and `app.js` are the whole thing.

- Game content (cases, skills, cheat sheet) is data at the top of `app.js`.
- Run `npm test` before every push. It plays the whole game in a real browser.
- `CODING_STANDARDS.md` holds the judgement calls. Read it when reviewing, not while building.
- Bump `CACHE` in `sw.js` whenever shipped files change.

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues on `virtualbeck/diffs-please`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels, unchanged. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
