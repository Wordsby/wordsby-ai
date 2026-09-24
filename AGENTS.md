# A site Wordsby hosts

This repo holds a **finished site, delivered by the client or their designer**.
Wordsby hosts it, deploys it, and can put a form on it. Wordsby did not build
it, and that changes what you should do here.

## What this is not

It is not a Wordsby-built site. There are no patterns, no `content/` files, no
`brand.yaml`, no design tokens and no quotes file to check against. Nothing in
`site/` came from the pattern library, and nothing in it should be rewritten to
look as though it did.

## Rules

1. **Change the least you can.** Someone designed this and the client signed it
   off. A small, surgical edit to the HTML they delivered is right; a rewrite,
   a reformat, or a "while I was in there" improvement is not, even where the
   markup is poor.
2. **Never reformat a file you are not otherwise changing.** A whole-file diff
   hides the one line that mattered and makes the next edit harder to review.
3. **Keep their structure.** File names, folder layout and URLs are the site.
   Moving a page breaks links, bookmarks and search results.
4. **Say when a change wants the designer.** Layout, spacing, type and colour
   belong to whoever made this. Copy fixes, a new paragraph, a changed phone
   number: yours. A new section: ask.
5. **Some work belongs to the agency.** Publishing, where form emails go,
   domains, hosting and accounts. Use `ask_the_agency` and stop.

## Checks

```bash
node scripts/check-hosted.mjs site
```

Errors are only the things that break hosting — no `index.html`, or a link to
a file that is not in the repo. Missing alt text, heading structure and stray
`localhost` URLs are warnings: they are the client's to fix, and worth
telling them about rather than fixing silently.

## Forms

A delivered site can use Wordsby's form service. The form posts to
`https://site-forms.wordsby.workers.dev/v1/submit/<site-id>/<form-id>`, and the
agency sets up the record and the recipients. Ask before wiring one up: a form
that posts somewhere nobody reads is worse than no form.

## Git

Work on a `change/…` branch, never on `main`. A change reaches the live site
through a pull request whose checks passed, and merging is what publishes.
