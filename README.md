# Diffs, Please

A small pixel game that teaches you to run AI coding agents well, even if you have never studied software engineering.

You staff a checkpoint on the border of `main`. Agents bring their work. You pick the right skill, read what it finds, and stamp.

Play it: https://diffs-please.virtualbeck.com

It teaches the skills from [mattpocock/skills](https://github.com/mattpocock/skills), as their docs describe them. This is an unofficial fan project and is not affiliated with or endorsed by Matt Pocock.

## Install on a phone

Open the link, then use "Add to Home Screen" from the browser's share menu. It runs full screen and works offline.

## Develop

No build step. `index.html`, `style.css` and `app.js` are the whole game.

```
npm install
npx playwright install chromium
npm test
```

The test plays every case in a real browser at five screen sizes, once perfectly and once taking every wrong answer. It fails on script errors, on anything that overflows the screen, and on any request that leaves the site.

When you ship a change, bump `CACHE` in `sw.js` so installed copies pick it up.

## Built with the skills it teaches

This repo is set up for the same skills the game teaches:

- `docs/agents/` and the "Agent skills" block in `CLAUDE.md` come from `/setup-matt-pocock-skills`. Issues live in GitHub Issues with the default triage labels.
- `GLOSSARY.md` and `docs/adr/` are the output of `/grill-with-docs`: the game's own vocabulary, and the decisions that would surprise a newcomer.
- `CODING_STANDARDS.md` follows `/retro`: judgement calls go there for the reviewer, and mechanical rules become checks in the test.
- `.claude/` holds the `/git-guardrails-claude-code` hook, with plain pushes allowed because this site ships by pushing to `main`.

The game was built first and these were written afterwards, from the decisions made along the way. The decision records say so. New work goes through the flow in order: issue, spec, tickets, build, review.

## Credits

See [NOTICE.md](NOTICE.md).
