# Deploying Gradelings

Gradelings is a standard Next.js 16 app (Node runtime, no custom server). This guide covers a Vercel + Turso + Resend + Sentry + Stripe setup. Nothing here is done yet; each step needs an account or key only the owner can create.

**Can it all live in Vercel?** Nearly. Vercel hosts the app, preview deployments, environment variables and the daily cron job. Its **Marketplace** adds **Turso** (database), **Resend** (email) and **Sentry** (errors) from the dashboard, fills in their environment variables and puts them on one bill. Two things stay outside: **Stripe** (keys and webhook) and your **domain registrar** (you can buy the domain in Vercel or point DNS to it). Use a **Pro** plan: Hobby doesn't allow commercial use.

## 1. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public origin, no trailing slash (e.g. `https://gradelings.com`). Used for canonical URLs, the sitemap, Open Graph and JSON-LD, and for the links inside emails (so a forged `Host` header can't redirect a reset link). Read at **build time**, so set it before the first production build. Defaults to `https://gradelings.com`. |
| `DATABASE_URL` | Yes | Turso URL (`libsql://<db>-<org>.turso.io`). Without it the app falls back to a local SQLite file, which does not persist on serverless hosts. |
| `DATABASE_AUTH_TOKEN` | Yes | Turso token for that database. |
| `STRIPE_SECRET_KEY` | For billing | Live secret key (`sk_live_…`). |
| `STRIPE_PRICE_MONTHLY` | For billing | Recurring Price id for C$14.99/month. |
| `STRIPE_PRICE_YEARLY` | For billing | Recurring Price id for C$119.99/year. |
| `STRIPE_WEBHOOK_SECRET` | For billing | Signing secret of the webhook endpoint (`whsec_…`). |
| `RESEND_API_KEY` | For email | Resend API key. Without it no email is sent (password reset and confirmation links won't arrive), so treat it as required in production. |
| `EMAIL_FROM` | For email | Sender, e.g. `Gradelings <hello@gradelings.com>`. The domain must be verified in Resend (add its SPF and DKIM DNS records). |
| `CRON_SECRET` | For the daily job | Any long random string. Vercel sends it as `Authorization: Bearer …` to `/api/cron/weekly/`; the route refuses calls without it. The job sends inactive-class warnings and deletes eligible classes as well as handling email reminders. |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Optional | Turns on error reports (server / browser). Off when unset. Reports are scrubbed of emails, cookies and request bodies before they leave (`src/lib/sentry-scrub.ts`). |
| `ANDROID_CERT_SHA256` | For the Android app | Comma-separated SHA-256 fingerprints of the app's signing keys (Google's Play App Signing key first). Served at `/.well-known/assetlinks.json`. See `docs/ANDROID.md`. |
| `ALLOW_DEV_BILLING` | Staging only | `1` lets a deployment without Stripe keys use the simulated billing. **Never set in production.** |
| `TRUSTED_PROXY_HOPS` | Off Vercel | How many proxies in front of the app add an `X-Forwarded-For` entry (default 1). Rate limits use the entry that many places from the right, never the first one, which a client can forge. On Vercel the platform header is used and this is not needed. Simulated billing is also refused on the Vercel production environment, whatever `ALLOW_DEV_BILLING` says. |

Billing is live only when `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY` are all set (`src/server/stripe.ts`). In production without them, the simulated billing is off unless `ALLOW_DEV_BILLING=1`.

## 2. Database (Turso)

```bash
turso db locations                        # confirm the Canadian locations (Montréal `yul`, Toronto `yyz`) are still listed
turso db create grademap --location yul   # Montréal. `vercel.json` runs functions in yul1 (Montréal) to match
turso db show grademap --url              # -> DATABASE_URL
turso db tokens create grademap           # -> DATABASE_AUTH_TOKEN
```

Turso offers Canadian locations only on its Fly provider (its AWS list has none), and a database cannot move between providers, so create it with the CLI rather than from the Vercel Marketplace unless the Marketplace lets you pick a Canadian location. Canadian hosting makes BC district privacy reviews easier (no "Supplemental Review" for storage outside Canada). Tables are created on first use (`CREATE TABLE IF NOT EXISTS` in `src/server/db.ts`), so there is no migration step. Create a separate database for staging.

## 3. Hosting (Vercel)

1. Import `mjparinas/grademap`; the Next.js preset needs no changes (`npm run build`, `npm start`).
2. Add the variables above to the Production environment. Use a separate set (test Stripe keys, a staging Turso database, `ALLOW_DEV_BILLING=1` if you want fake billing) for Preview.
3. Add the domain, and set `NEXT_PUBLIC_SITE_URL` to match it. Redeploy so the build picks it up.
4. Region: `vercel.json` pins functions to `yul1` (Montréal), next to Turso's Montréal location. Change both together if your users are elsewhere. Sentry (US or EU only) and Resend are not Canadian-hosted; they are listed as service providers in `/privacy/`.
5. Preview deployments are off: `ignoreCommand` in `vercel.json` skips every build except the `main` branch, so pull requests don't use up the daily deployment limit. To preview a branch, temporarily remove that line.
6. The daily email job is declared in `vercel.json` (`/api/cron/weekly/`, 15:00 UTC). Cron only runs on production deployments, and only once `CRON_SECRET` is set.

`trailingSlash: true` is on, so every API URL ends in `/`. Don't add redirect or rewrite rules at the host that strip the slash.

## 4. Stripe

1. Create a product "Gradelings Family" with two recurring prices in CAD: **C$14.99 / month** and **C$119.99 / year**. Copy their ids to `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY`. (Plan numbers live in `src/lib/plan.ts`.)
2. Add a webhook endpoint: `https://<your-domain>/api/billing/webhook/`
   **The trailing slash is required.** Stripe does not follow redirects.
   Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
3. Copy the endpoint's signing secret to `STRIPE_WEBHOOK_SECRET`.
4. In Stripe's Billing Portal settings, enable cancel, update payment method and plan switching between the two prices.
5. Test the whole flow in Stripe test mode first (card `4242 4242 4242 4242`). The 30-day free trial is handled by the app, not by Stripe, so no card is needed to start.

## 5. Email (Resend) and error reports (Sentry)

1. **Resend:** add and verify your sending domain (SPF, DKIM and a DMARC record at your DNS host), create an API key, and set `RESEND_API_KEY` and `EMAIL_FROM`. Sign up, ask for a password reset, and check the message lands in the inbox, not spam.
2. **Sentry:** create a project (platform: Next.js), copy the DSN into both `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`. Source maps aren't uploaded, so stack traces show built file names; add `@sentry/nextjs`'s `withSentryConfig` and an auth token later if you want readable ones. A test error: temporarily throw in an API route on a preview deployment and check it appears with no email or request body.
3. **Email sending limits:** the app sends one confirmation at sign-up, resets and confirmations on request (rate limited), one trial notice, and the weekly report to parents who turned it on. Weekly mail goes out on Sundays (UTC) from the daily job.


## Uptime monitoring

`GET /api/health/` returns 200 when the app and database answer (one `SELECT 1`) and 503 otherwise. It is public, uncached and reveals nothing beyond pass/fail.

- **Built in:** `.github/workflows/uptime.yml` pings it every 15 minutes (with 3 tries), opens a single "Site is down" issue labelled `uptime` on failure and closes it when the site recovers. It does nothing until you set the repository variable `UPTIME_URL` (Settings > Secrets and variables > Actions > Variables) to the site origin, e.g. `https://grademap.example`. GitHub can delay scheduled runs, so it is a safety net, not a precise monitor.
- **Free external alternatives** (not set up): UptimeRobot (5-minute checks), Better Stack, or Vercel's own monitoring. Point any of them at `https://<your domain>/api/health/`; they can email or text you faster than GitHub issues do.

## 6. Launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` is the real domain; `/sitemap.xml` and `/robots.txt` show it.
- [ ] Sign up, confirm the email link works, add a child, play, and check the events sync to a second browser.
- [ ] Forgot password: the email arrives, the link works once, and other devices are signed out.
- [ ] Run the daily job by hand: `curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/weekly/` returns counts, not 401.
- [ ] Share a report link, open it in a private window, then stop sharing and check it no longer works.
- [ ] A test "Report a problem" reaches the contact address.
- [ ] CI is green on the pull request (`.github/workflows/ci.yml` runs tests, lint, types, build, device layouts, accessibility and offline checks).
- [ ] Turso backups: confirm point-in-time recovery is available on your plan and practise one restore.
- [ ] Stripe test-mode checkout, portal and webhook round trip updates the Subscription screen.
- [ ] Switch Stripe to live keys; run one real checkout and refund it.
- [ ] `/play/`, `/parents/` and `/api/` stay `noindex`; public pages are indexed.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Privacy: export and delete-account work against the production database.
- [ ] `/privacy/` and `/terms/` had an AI review on 2026-10-09 (not a lawyer's review; the pages say so). Set `LEGAL_NAME`, `CONTACT_EMAIL` and `MAILING_ADDRESS` in `src/lib/brand.ts` (the address is required in CASL email), bump `LEGAL_UPDATED`, and still have a lawyer review both (governing law is set to British Columbia) before taking payments. Account deletion cancels Stripe subscriptions before deleting the family; if Stripe refuses, deletion stops so the parent can retry.
- [ ] BC teacher content review, Big Ideas check and Grade 4–5 history dates (see `AGENTS.md`, Open items).
- [ ] Check the service worker after a deploy: it precaches by build, so a second visit should pick up the new version.
