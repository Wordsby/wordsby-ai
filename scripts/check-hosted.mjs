// Checks a site Wordsby hosts but didn't build.
//
//   node scripts/check-hosted.mjs [dir]      # default: site/
//
// A delivered site is somebody else's work. The agency did not write this
// HTML and cannot be stopped from hosting it, so only the things that break
// hosting are errors: no home page, or a link to a file that isn't there.
// Everything else — missing alt text, headings, stray localhost URLs — is a
// warning, because it is the client's to fix and worth telling them about.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? 'site');
const errors = [];
const warnings = [];

function htmlFiles(at) {
  return readdirSync(at).flatMap((name) => {
    const path = join(at, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return /\.html?$/i.test(name) ? [path] : [];
  });
}

if (!existsSync(dir)) {
  console.error(`No ${relative(process.cwd(), dir)}/ folder. That is where the client's site goes.`);
  process.exit(1);
}
if (!existsSync(join(dir, 'index.html'))) {
  errors.push('there is no index.html, so the site has no home page');
}

/** Does a root-relative URL point at something that exists? */
function resolves(url) {
  const path = decodeURI(url.split(/[?#]/)[0]);
  const candidates = [path, join(path, 'index.html'), `${path}.html`];
  return candidates.some((c) => existsSync(join(dir, c)) && statSync(join(dir, c)).isFile());
}

const pages = htmlFiles(dir);
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(dir, file);

  // A link to a file that is not here is broken hosting, whoever wrote it.
  for (const [, url] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    if (!resolves(url)) errors.push(`${page}: broken link or missing file "${url}"`);
  }

  // These belong to whoever built the site. Say them, don't block on them.
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=/i.test(tag)) warnings.push(`${page}: image without alt text: ${tag.slice(0, 70)}`);
  }
  const h1s = (html.match(/<h1\b/gi) ?? []).length;
  if (h1s !== 1) warnings.push(`${page}: has ${h1s} <h1> elements (one is usual)`);

  // A site built on someone's laptop often still points at it.
  for (const [, url] of html.matchAll(/(?:href|src|action)="(https?:\/\/(?:localhost|127\.0\.0\.1)[^"]*)"/gi)) {
    warnings.push(`${page}: points at the machine it was built on: ${url}`);
  }
  if (/<form\b/i.test(html) && !/wordsby|site-forms/i.test(html)) {
    warnings.push(`${page}: has a form that does not post to Wordsby's form service — check where it goes`);
  }
}

for (const w of [...new Set(warnings)]) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);

if (errors.length > 0) {
  console.error(`\n✗ Check failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\n✓ Checked ${pages.length} page(s)${warnings.length ? `, ${new Set(warnings).size} warning(s)` : ''}.`);
