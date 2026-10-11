# Gradelings

Curriculum-matched practice, learning games and parent reports for **Kindergarten to Grade 9**. It covers the BC, Ontario, Alberta, Saskatchewan, Manitoba, Yukon and Northwest Territories curricula, and other provinces and US states can be added. The app name is set in `src/lib/brand.ts`.

It's a web app first: it runs in any browser, installs to a tablet or phone home screen, and **works offline**. Progress, scores and trophies sync to the family account when the device is back online.

## What's inside

### For kids (`/play/`)

- **Age-adapted UI.** Kindergarten and Grade 1 get bigger buttons, shorter text, spoken prompts and simpler menus, and words like "Letters & Words" and "My World". Grades 2–4 and 5–9 get progressively more independence ("Language Arts", "Social Studies").
- **Modes:**
  - **Adventure:** one tap, endless and adaptive. It mixes subjects and favours units that are weak, untried or due for review.
  - **Practice:** pick a subject and unit.
  - **Review:** only the tricky spots.
  - **Speed Run:** as many as you can in 60 or 90 seconds.
  - **Daily Challenge:** the same 10 questions for everyone today.
  - **Challenge:** a timed mastery check with no retries, which unlocks the "Extending" level.
- **Built-in timers:** a daily-goal timer, session timers in the timed modes, and a **learn-to-play** timer. By default every 20 minutes of learning unlocks 5 minutes of arcade games; parents set the ratio, a daily cap, or free play.
- **Arcade:** Number Munchers (math), Word Ninja (a swipe-to-slice sight-word game), Critter Catch (science), Bubble Pop (phonics) and Memory Match. Content adapts to the child's grade.
- **Gamification:**
  - About 55 trophies (bronze, silver, gold and a platinum "Grade Champion") with console-style toast pop-ups.
  - XP and levels, coins, daily quests and streaks.
  - A shop of critter companions, titles and confetti styles.
- **Mascots:** Ollie the Otter guides, with a guide for each subject (Hoot the owl for math, Ruby the fox for reading, Bolt the beaver for science, Juniper the bear for social studies) plus seven critters to unlock. They're all drawn as SVG, change mood, and their eyes follow your finger.
- **Juice:** squash-and-stretch buttons, synthesized sounds, bursts, floating "+XP" text and confetti. All of it respects "reduce motion".
- **Question types:** multiple choice, build-a-number with base-ten blocks, make-an-amount with coins and bills, put in order, sort into baskets, and typed answers on an on-screen keypad (whole numbers, decimals, fractions, integers).

### For parents (`/parents/`, behind a PIN)

- **Overview:** each child's week at a glance.
- **Reports:**
  - Time, accuracy and trends over 7, 14, 30 or 90 days.
  - Subject breakdowns, strengths and next steps.
  - A unit-by-unit table and trophies.
  - Printable.
- **Report cards:** every unit on the report-card scale (BC: Emerging, Developing, Proficient, Extending) with a plain-language explainer.
- **Children:** add up to 4, edit names, birth year (a grade is suggested from age), grade, curriculum and avatar; reset or remove.
- **Settings per child:** daily goal, timer visibility, learn-to-play ratio and cap, games on/off, subjects, sound, read-aloud.
- **Calm and focus options:** per child, parents can turn off in-app motion and celebration sounds, hide timers, hold trophy pop-ups until after the lesson, and use five-question sessions.
- **Read-aloud voice (per device):** the most natural installed voice is picked automatically; parents can choose another with a preview and get tips for installing better voices.
- **Account & sync** (email confirmation, password reset, optional weekly progress email, share a read-only report link), **Subscription** (Stripe), **Privacy** (JSON export, erase device, delete account).

### For search engines (public pages)

- `/`: landing page with FAQ and structured data.
- `/curriculum/bc/grade-3/math/multiplication/`: a page for every curriculum, grade, subject and unit. Each has Big Ideas, the learning standard, sample questions with answers, and `LearningResource`/`AlignmentObject` JSON-LD.
- `/report-cards/bc/`: the report card guide with `FAQPage` JSON-LD.
- `sitemap.xml`, `robots.txt` (keeps `/play/`, `/parents/` and `/api/` out of search), canonical URLs and an Open Graph image.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # content checks for every unit + game-logic tests
npm run lint
npm run build && npm start
```

Browser tests (Playwright; instructions at the top of each file):

- `scripts/e2e.mjs`: a playthrough of the whole app. It covers every mode, the arcade, the parent area, sign-up, sync to a second device, and offline play with upload on reconnect.
- `scripts/e2e-devices.mjs`: layout checks on 14 common Android, iPhone, iPad and tablet screens, in portrait and landscape. The riskier flows run once per class of device.
- `scripts/e2e-offline.mjs`: real offline. It stops the server and checks the service worker serves the app and the lessons.

With no configuration it uses a local SQLite file (`./data/grademap.db`) and **simulated billing**, so you can try sign-up, sync and subscriptions end to end.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public address for canonical links and the sitemap (default `https://gradelings.com`). |
| `DATABASE_URL` | libsql URL. Default `file:./data/grademap.db`; use a [Turso](https://turso.tech) URL in production. |
| `DATABASE_AUTH_TOKEN` | Turso auth token. |
| `STRIPE_SECRET_KEY` | Stripe secret key. Billing is simulated until this and both price IDs are set. |
| `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_YEARLY` | Price IDs for the family plan (C$14.99/month, C$119.99/year). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/billing/webhook`. |
| `ALLOW_DEV_BILLING` | Set to `1` to allow simulated billing in a production build (staging only). |

### Stripe setup

1. Create a product "Family plan" with two recurring prices in CAD (monthly and yearly).
2. Add a webhook endpoint at `https://<your-site>/api/billing/webhook/` (with the trailing slash: Stripe doesn't follow redirects) for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` and `customer.subscription.deleted`.
3. Turn on the customer portal (Settings → Billing → Customer portal) so parents can manage or cancel.

### Deploying

It needs a Node server for the API routes (Vercel, Render, Fly.io or any Node host). With Turso as the database there's nothing to manage on the server. The public curriculum pages are statically generated at build time.

## How it works

### Offline-first data and sync

- Everything a child does is an **event** (an answer, a finished session, a game played, a purchase, a quest claimed or a trophy earned). Each event has a unique id, and events go into IndexedDB first (`src/lib/localdb.ts`).
- XP, levels, coins, trophies, mastery and streaks are **never stored**. They are recomputed from the events (`src/lib/derive.ts`). Merging events from several devices is therefore order-independent and duplicate-safe: nothing is lost if two tablets were used offline.
- Profiles, settings and the family plan sync with last-write-wins on `updatedAt`.
- `src/lib/sync.ts` pushes unsynced events and pulls new ones by cursor (`POST /api/sync/`). It runs when the device comes online, when the app becomes visible, every 2 minutes, and shortly after any change.
- `public/sw.js` precaches the kids' app and parent area, serves pages network-first and build files cache-first, and never caches `/api/`.
- **Each grade's lessons are a separate download** (`src/content/index.ts`).
  - The kids' app loads only the active child's grade (about 230 KB of JavaScript plus 17–100 KB for the grade, instead of 775 KB for everything).
  - It then prefetches siblings' grades and the grades either side for offline use.
  - Server pages and tests use `src/content/all.ts`.

### Scoring

- Each framework defines its own scale in `src/content/frameworks.ts`. For BC that's the Provincial Proficiency Scale, with official descriptions, a kid-friendly name (🌱 Seedling, 🌿 Sprout, 🌳 Tree, ⭐ Star) and plain-language "at home" notes.
- A unit's level comes from first-try accuracy and amount of practice (`src/lib/proficiency.ts`). **Extending** also requires passing a Challenge.

### Content

```
src/content/
  types.ts            question, visual, unit and course types
  frameworks.ts       curricula: grades, report-card scale and guide
  subjects.ts         subject names per age band, grades, slugs
  random.ts           seeded randomness (never Math.random in content)
  grades/k … g7/      math.ts, language.ts, science.ts, social.ts
  content.test.ts     generates every unit many times and checks it's fair
```

- Every unit has a `generate()` that returns 6–10 fresh questions at difficulty 1, 2 or 3, plus a parent note and a learning standard per framework. See `docs/CONTENT_GUIDE.md` for the authoring rules.
- `npm test` checks every unit:
  - the answer is among the choices and no two choices look the same
  - the math in equations is correct
  - the text length suits young readers
  - keypad answers can be typed
  - visuals stay within bounds

### Adding a province or state

1. Add a `Framework` to `src/content/frameworks.ts`: slug, grades, report-card scale and guide.
2. Add that framework's learning standard to each unit's `standards`, and its Big Ideas (or equivalent) to each course.
3. Units without a standard for a framework are hidden from that framework's public pages. The kids' app, reports and SEO pages pick everything else up automatically.

### Code map

```
src/
  app/
    page.tsx, curriculum/, report-cards/   public, statically generated pages
    play/, parents/                        the two offline single-page apps (hash routes)
    api/                                   auth, sync, billing, account
  components/
    play/        hub, modes, session runner, trophies, shop, arcade + games/
    parents/     PIN gate, overview, reports + charts, children, settings, account, subscription
    questions/   the 6 interaction types
    site/        public page chrome, curriculum helpers, sample questions
    Critter.tsx  the mascot cast
    visuals.tsx  blocks, coins, clocks, number lines, fractions, graphs, grids…
  lib/           event model, derive, proficiency, trophies, quests, shop, adaptive, plan, store, sync
  server/        libsql database, auth (scrypt + session cookies), Stripe
```

## Toward the app stores

The installable web app already works offline. For Google Play, wrap it as a Trusted Web Activity ([Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)) pointing at `/play/`, or use [Capacitor](https://capacitorjs.com/) for native features. Before submitting, check the Play Families policy and the Apple Kids Category requirements.

## Research

Deployment steps (Vercel, Turso, Stripe) are in [`docs/DEPLOY.md`](docs/DEPLOY.md).

The market research behind the product decisions (market size, competitors, monetization and what parents want) is in [`docs/research/`](docs/research/), starting with the [summary report](docs/research/market-report.md).

## Content notes

- The content was written to the BC curriculum's learning standards and Big Ideas for each grade. **Have BC teachers review it before launch.**
- Indigenous perspectives are written in the present tense, avoid treating all Nations as one, and leave out sacred or ceremonial details. Deeper First Peoples content should be developed with partners such as FNESC.
- The proficiency scale wording comes from BC's K–12 Student Reporting Policy. Check it against the current Ministry wording before launch.
