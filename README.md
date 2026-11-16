# Diffs, Please

A small pixel game that teaches you to run AI coding agents well, even if you have never studied software engineering.

You staff a checkpoint on the border of `main`. Agents bring their work. You pick the right skill, read what it finds, and stamp.

Play it: https://skills.virtualbeck.com

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

## Credits

See [NOTICE.md](NOTICE.md).
