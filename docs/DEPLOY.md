# Deploying GradeMap

GradeMap is a standard Next.js 16 app (Node runtime, no custom server). This guide covers a Vercel + Turso + Stripe setup. Nothing here is done yet; each step needs an account or key only the owner can create.

## 1. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public origin, no trailing slash (e.g. `https://grademap.ca`). Used for canonical URLs, the sitemap, Open Graph and JSON-LD. Read at **build time**, so set it before the first production build. Defaults to the placeholder `https://grademap.ca`. |
| `DATABASE_URL` | Yes | Turso URL (`libsql://<db>-<org>.turso.io`). Without it the app falls back to a local SQLite file, which does not persist on serverless hosts. |
| `DATABASE_AUTH_TOKEN` | Yes | Turso token for that database. |
| `STRIPE_SECRET_KEY` | For billing | Live secret key (`sk_live_…`). |
| `STRIPE_PRICE_MONTHLY` | For billing | Recurring Price id for C$14.99/month. |
| `STRIPE_PRICE_YEARLY` | For billing | Recurring Price id for C$119.99/year. |
| `STRIPE_WEBHOOK_SECRET` | For billing | Signing secret of the webhook endpoint (`whsec_…`). |
| `ALLOW_DEV_BILLING` | Staging only | `1` lets a deployment without Stripe keys use the simulated billing. **Never set in production.** |

Billing is live only when `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY` are all set (`src/server/stripe.ts`). In production without them, the simulated billing is off unless `ALLOW_DEV_BILLING=1`.

## 2. Database (Turso)

```bash
turso db create grademap --location yyz   # pick a region near your users (Toronto, or sea for Seattle)
turso db show grademap --url              # -> DATABASE_URL
turso db tokens create grademap           # -> DATABASE_AUTH_TOKEN
```

Tables are created on first use (`CREATE TABLE IF NOT EXISTS` in `src/server/db.ts`), so there is no migration step. Create a separate database for staging.

## 3. Hosting (Vercel)

1. Import `mjparinas/grademap`; the Next.js preset needs no changes (`npm run build`, `npm start`).
2. Add the variables above to the Production environment. Use a separate set (test Stripe keys, a staging Turso database, `ALLOW_DEV_BILLING=1` if you want fake billing) for Preview.
3. Add the domain, and set `NEXT_PUBLIC_SITE_URL` to match it. Redeploy so the build picks it up.
4. Region: put functions near the Turso region.

`trailingSlash: true` is on, so every API URL ends in `/`. Don't add redirect or rewrite rules at the host that strip the slash.

## 4. Stripe

1. Create a product "GradeMap Family" with two recurring prices in CAD: **C$14.99 / month** and **C$119.99 / year**. Copy their ids to `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY`. (Plan numbers live in `src/lib/plan.ts`.)
2. Add a webhook endpoint: `https://<your-domain>/api/billing/webhook/`
   **The trailing slash is required.** Stripe does not follow redirects.
   Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
3. Copy the endpoint's signing secret to `STRIPE_WEBHOOK_SECRET`.
4. In Stripe's Billing Portal settings, enable cancel, update payment method and plan switching between the two prices.
5. Test the whole flow in Stripe test mode first (card `4242 4242 4242 4242`). The 30-day free trial is handled by the app, not by Stripe, so no card is needed to start.

## 5. Launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` is the real domain; `/sitemap.xml` and `/robots.txt` show it.
- [ ] Sign up, add a child, play, and check the events sync to a second browser.
- [ ] Stripe test-mode checkout, portal and webhook round trip updates the Subscription screen.
- [ ] Switch Stripe to live keys; run one real checkout and refund it.
- [ ] `/play/`, `/parents/` and `/api/` stay `noindex`; public pages are indexed.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Privacy: export and delete-account work against the production database.
- [ ] `/privacy/` and `/terms/` are drafts. Set `LEGAL_NAME`, `CONTACT_EMAIL` and `LEGAL_UPDATED` in `src/lib/brand.ts`, then have a lawyer review both (governing law is set to British Columbia) before taking payments.
- [ ] BC teacher content review, Big Ideas check and Grade 4–5 history dates (see `AGENTS.md`, Open items).
- [ ] Check the service worker after a deploy: it precaches by build, so a second visit should pick up the new version.
