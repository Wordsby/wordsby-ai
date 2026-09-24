# A site Wordsby hosts

The client's finished site, served as delivered. Wordsby gives it deploys,
previews, a domain, forms and a record of every change — without rebuilding it.

```
site/        the site exactly as delivered; index.html is the home page
wrangler.jsonc   serves site/ as static assets
scripts/     the check that runs on every change
```

- **No build step.** What is in `site/` is what is served.
- **Checks are lenient on purpose.** Only a missing home page or a broken
  internal link fails; the rest is reported and left alone. See `AGENTS.md`.
- **Deploys are Wordsby's.** A push to `main` publishes; a pull request gets a
  preview URL. No credential lives in this repo.

To put the client's site in: replace everything inside `site/`, keeping their
folder structure, commit on a `change/…` branch, and open a pull request.
