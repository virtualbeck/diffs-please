// Plays the whole game in a real browser, twice per screen size:
// once perfectly, once taking every wrong answer first.
// Fails on: script errors, text overflowing the screen, stray markup,
// any request leaving this origin, or a wrong final score.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json' };
const PERFECT_BURN = 173;
const SIZES = [[390, 844], [375, 667], [360, 640], [430, 932], [820, 1180], [1280, 800], [1920, 1080]];

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html');
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = 'http://127.0.0.1:' + server.address().port;
const problems = [];
const fail = msg => { problems.push(msg); console.log('FAIL ' + msg); };

async function play(browser, [w, h], perfect) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const tag = `${w}x${h} ${perfect ? 'perfect' : 'worst-case'}`;
  page.on('pageerror', e => fail(`${tag}: script error: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') fail(`${tag}: console error: ${m.text()}`); });
  page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) fail(`${tag}: outside request: ${r.url()}`); });
  await page.goto(origin + '/');
  await page.evaluate(() => document.fonts.ready);
  let minScale = 1;
  const check = async where => {
    const r = await page.evaluate(() => {
      const t = document.querySelector('#sheet').hidden ? document.querySelector('#page') : document.querySelector('#sheet');
      return { over: t.scrollHeight - t.clientHeight, doc: document.documentElement.scrollHeight - innerHeight, scale: window.__scale, stray: document.body.innerText.includes('**') };
    });
    if (r.over > 1 || r.doc > 1) fail(`${tag}: overflow at ${where}`);
    if (r.stray) fail(`${tag}: stray markup at ${where}`);
    minScale = Math.min(minScale, r.scale);
  };
  await check('title');
  await page.click('text=New game');
  for (let n = 0; n < 600; n++) {
    const mode = await page.evaluate(() => S.mode);
    if (mode === 'intro' || mode === 'ledger') {
      await check(mode);
      if (await page.locator('#page >> text=Play again').count()) break;
      await page.click('#page .foot .go'); continue;
    }
    const s = await page.evaluate(() => {
      const c = CASES[S.i], st = c.steps[S.step];
      return { i: S.i, step: S.step, t: S.step < 0 ? 'brief' : st ? st.t : 'end', ok: st ? st.ok : null, pick: st && st.pick, n: st && st.opts ? st.opts.length : 0,
        okIdx: st && st.opts ? st.opts.findIndex(o => o.ok) : -1, stage: V.stage || 0, done: !!V.done, lines: st && st.t === 'tap' ? [st.a[1].length, st.b[1].length] : null };
    });
    const where = `case ${s.i + 1} step ${s.step + 1}`;
    await check(where);
    if (s.done || s.t === 'brief' || s.t === 'end') {
      if (s.i === 0 && s.t === 'brief' && !perfect) {           // flip through the whole cheat sheet once
        await page.click('#help');
        for (let k = 0; k < 60; k++) { await check('cheat sheet page ' + (k + 1)); const nx = page.locator('#sheet .foot .go').nth(1); if (await nx.isDisabled()) break; await nx.click(); }
        await page.click('#sheet >> text=Close');
      }
      await page.click('#page .foot .go');
    } else if (s.t === 'skill') {
      if (!perfect) for (const id of s.pick.filter(x => x !== s.ok)) { await page.locator('#page .opt:not([disabled])', { hasText: new RegExp('^/' + id + '(?![a-z-])') }).first().click(); await check(where + ' wrong'); }
      await page.locator('#page .opt:not([disabled])', { hasText: new RegExp('^/' + s.ok + '(?![a-z-])') }).first().click();
    } else if (s.t === 'choice') {
      if (!perfect) for (let k = 0; k < s.n; k++) if (k !== s.okIdx) { await page.locator('#page .opt').nth(k).click(); await check(where + ' wrong'); }
      await page.locator('#page .opt').nth(s.okIdx).click();
    } else if (s.t === 'tap') {
      const lines = page.locator('#page .paper').nth(s.stage).locator('.line'), good = s.ok[s.stage];
      if (!perfect) for (let k = 0; k < s.lines[s.stage]; k++) if (k !== good) { await lines.nth(k).click(); await check(where + ' wrong'); }
      await lines.nth(good).click();
    } else if (s.t === 'stamp') {
      await page.click('#page .stampbtn.' + (perfect ? s.ok : 'merge'));
    }
  }
  const end = await page.evaluate(() => ({ total: S.total, avoid: S.allAvoid, cits: S.allCits, text: document.querySelector('#page').innerText }));
  if (perfect) {
    if (end.total !== PERFECT_BURN || end.avoid !== 0 || end.cits !== 0) fail(`${tag}: perfect run scored ${JSON.stringify({ total: end.total, avoid: end.avoid, cits: end.cits })}`);
    if (!/SENIOR INSPECTOR/i.test(end.text)) fail(`${tag}: perfect run did not earn the top rank`);
  } else if (end.avoid <= 0) fail(`${tag}: worst-case run recorded no avoidable burn`);
  console.log(`ok   ${tag}: smallest text scale ${minScale.toFixed(2)}, burned ${end.total}k`);
  await page.close();
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: process.env.CI || process.env.CHROME_PATH ? ['--no-sandbox'] : [] });
for (const size of SIZES) { await play(browser, size, true); await play(browser, size, false); }

// The installable pieces exist and are well formed.
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons) if (!fs.existsSync(path.join(ROOT, icon.src))) fail('manifest icon missing: ' + icon.src);
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
for (const m of sw.match(/'[^']+\.(?:html|css|js|ttf|png|webmanifest)'/g) || []) if (!fs.existsSync(path.join(ROOT, m.slice(1, -1)))) fail('service worker caches a missing file: ' + m);
// No third-party hosts in what ships, apart from the credit link.
for (const f of ['index.html', 'style.css', 'app.js', 'sw.js']) {
  const hosts = (fs.readFileSync(path.join(ROOT, f), 'utf8').match(/https?:\/\/[^\s'"<>)]+/g) || []).filter(u => !/^https:\/\/github\.com\/mattpocock\/skills$/.test(u) && !/^http:\/\/www\.w3\.org\//.test(u));
  if (hosts.length) fail(`${f} references outside hosts: ${hosts.join(', ')}`);
}

await browser.close(); server.close();
if (problems.length) { console.log(`\n${problems.length} problem(s).`); process.exit(1); }
console.log('\nAll checks passed.');
