<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GradeMap: guide for agents

GradeMap is curriculum-matched practice, learning games and parent reports for Kindergarten to Grade 7. It launches with the BC Curriculum and is built to add other provinces and US states. This file records the product and design decisions already made, and why. Follow them. If a task seems to need one changed, raise it with the owner first; don't quietly work around it.

## Commands

```bash
npm run dev                 # http://localhost:3000
npm test                    # content checks for every unit + logic tests (~20 s)
npm run lint
npx tsc --noEmit            # run `npx next typegen` first in a fresh checkout (PageProps/LayoutProps)
npm run build && npm start  # offline/service worker only works in a production build
node scripts/e2e.mjs http://localhost:3000 e2e-shots --offline   # full playthrough + sync
node scripts/e2e-devices.mjs http://localhost:3000                # layout on 14 phones/tablets
node scripts/e2e-offline.mjs                                      # real offline (starts its own server)
node scripts/e2e-a11y.mjs http://localhost:3000                   # axe-core WCAG 2.2 A/AA, plus colour-blind checks (screenshots in e2e-shots/a11y)
```

Before you push, run tests, lint and typecheck. For UI or flow changes, also run the e2e scripts.

- **Playwright** is a dev dependency, pinned. Install the browsers once with `npx playwright install chromium webkit` (on Linux add `npx playwright install-deps`).
- **CI** (`.github/workflows/ci.yml`) runs types, lint, unit tests and the build in parallel, then the browser tests in parallel on separate machines (device layouts in three shards, accessibility, playthrough, offline). Require the "CI passed" job in branch protection.
- **Stale styles:** if a change to `globals.css` (`@theme`, `@custom-variant`) doesn't show up in a build, delete `.next` and rebuild.

### What the e2e scripts cover
Tests are duplicated across screen sizes only where layout can break:

- **`e2e-devices.mjs`, on every device:** the cheap layout checks.
  - The 14 devices:
    - Galaxy S9+, Galaxy S24 and Pixel 7;
    - iPhone SE, iPhone 15 and iPhone 15 Pro Max;
    - iPhone 15 and Pixel 7 in landscape;
    - iPad Mini and iPad Pro 11, portrait and landscape;
    - Galaxy Tab S4, portrait and landscape;
    - a 1366×768 Chromebook.
  - The checks:
    - no sideways scroll;
    - the main button above the fold;
    - touch targets at least 48 px for kids and 44 px elsewhere;
    - the feedback bar's button fully on screen;
    - parent reports not overflowing.
- **`e2e-devices.mjs`, one device per class** (smallest phone, phone landscape, tablet portrait, tablet landscape): the riskier flows.
  - Kindergarten sizing.
  - An arcade game's play area fitting the screen.
  - Toasts not blocking taps.
- **`e2e.mjs`:** the full playthrough on an iPad-sized screen plus a phone. It covers every mode and game, the parent area, sign-up, two-device sync, and offline progress uploading on reconnect.
- **`e2e-offline.mjs`:** stops the server so only the service worker can answer. Playwright's `setOffline()` doesn't cut off service worker requests, so it can't prove the cache works.
- **WebKit:** iPhone and iPad profiles run in WebKit when it's installed, otherwise in Chromium at the same size, pixel ratio and touch settings.

## Product decisions

### Positioning
- **Audience:** parents of children in Kindergarten to Grade 7. Kids use the app; parents choose it, configure it and pay.
- **We differentiate on clarity, kindness and usability, not price.** IXL is expensive and hard to use, and Khan Academy is free. We win by:
  - speaking the language of the report card;
  - giving kind, encouraging feedback;
  - making it as compelling as a good video game.
  - Research is in `docs/research/`.
- **Name:** "GradeMap" is a working name. It is set once in `src/lib/brand.ts`; never hard-code it elsewhere. The name was chosen because it works across provinces and countries.
- **Platform:** a web-first installable app (PWA) built with Next.js. Android comes later by wrapping `/play/`, as a Trusted Web Activity or with Capacitor. Don't add features that only work in a native shell.

### Money
- **No ads, ever. No tracking pixels. Never sell data.** Kids can never buy anything; coins are earned only by learning.
- **Family plan:** C$14.99/month or C$119.99/year, with "Save 33%" on the yearly plan, for up to 4 children.
  - The plan includes a 30-day free trial with everything on and no card needed.
  - After the trial, the first 2 units of every course stay free forever.
  - All of this lives in `src/lib/plan.ts`; read the numbers from there.
- **Payments:** Stripe Checkout and the Billing Portal, called over raw HTTPS with no SDK (`src/server/stripe.ts`).
  - Until Stripe keys are set, billing runs in a simulated dev mode (`ALLOW_DEV_BILLING=1` turns it on in production for staging).

### Not tied to BC
- **Everything that differs by province or state lives in a `Framework`** (`src/content/frameworks.ts`): grades, report-card scale, report-card guide and slug.
  - Each unit carries `standards[frameworkId]`. Each course carries `bigIdeas[frameworkId]`.
- **No BC-specific wording in UI code.** Read names from the framework, such as `curriculumName` and the level labels.
  - Public URLs are `/curriculum/{framework-slug}/{grade-slug}/{subject}/{unit}/` and `/report-cards/{framework-slug}/`.
- **Adding a province or state** means adding a `Framework` and its standards, not new screens.

### Scoring follows the report card
- **BC uses the four-level Provincial Proficiency Scale:** Emerging, Developing, Proficient, Extending.
  - Parents see the official wording plus a plain-language "at home" note.
  - Kids see 🌱 Seedling, 🌿 Sprout, 🌳 Tree and ⭐ Star.
- **Unit level** (`src/lib/proficiency.ts`) is based on recent first-try accuracy:

  | Level | Requirement |
  | --- | --- |
  | Not started | No attempts |
  | Fewer than 4 attempts | Developing at ≥75%, otherwise Emerging |
  | **Proficient** | ≥75% and ≥8 attempts |
  | **Extending** | ≥90%, ≥16 attempts **and a passed Challenge** |
  | Developing | ≥50% |
  | Emerging | Otherwise |

- **Reports must say this reflects practice, not a report-card mark.** The teacher decides proficiency.
- **The report card explainer appears in two places:** the parent area and the public `/report-cards/{slug}/` page. Both use `ReportCardGuide`.

### Ages
- **Three age bands** (`ageBandFor`): little (K–1), middle (2–4) and big (5–7). The band changes copy, size and features:
  - **Subject names:**
    - Language: "Letters & Words" (little), "Reading & Writing" (middle), "Language Arts" (big).
    - Social studies: "My World" (little), "Our World" (middle), "Social Studies" (big).
  - **Little kids:**
    - Bigger buttons and text, read-aloud on by default.
    - No Speed Run or Review tile; they go straight into lessons.
    - The adaptive mode is called "Let's Play!" and the arcade "Games".

### Modes
- **Adventure** is the headline mode and needs no topic picking.
  - It keeps mixing subjects and units, weighted by weakness, novelty, spacing and recency (`src/lib/adaptive.ts`).
  - Difficulty adapts per unit, with a checkpoint every 10 questions.
- **Practice:** choose a subject and unit.
- **Review:** 10 questions from tricky spots only.
- **Speed Run:** 60 seconds (90 for little kids), quick-answer question types, flash feedback.
- **Daily Challenge:** 10 questions, seeded so everyone gets the same set that day.
- **Challenge:** 10 questions at difficulty 3, a 300 s time limit (420 s for little kids) and no retries.
  - Passing takes 8 out of 10, and passing is the only way to reach Extending.

### Feedback
- **A wrong answer gets a hint and another try.** A second miss shows the answer with an explanation.
- **Only first-try answers count** toward accuracy, stars and proficiency. Stars never go down.
- **A hint opened before answering counts like a retry** (`hinted` on the answer event): no first-try credit, 4 XP instead of 10, and it isn't a "comeback". A parent can turn on "Hints count as first try" per child (`freeHints`) so asking for help never lowers accuracy. Reports show how many hints were opened. The hint button appears only in modes with retries (not Speed Run or Challenge).
- **The tone is soft:** a gentle "try again" sound, not a buzzer, and encouraging messages. Never shame a child.

### Timers and the learn-to-play loop
- **Daily goal timer:** 10 minutes for little kids, 15 for everyone else. A session timer appears in timed modes, and the elapsed timer is optional (`showTimer`).
- **Learning earns arcade time,** Pomodoro-style. The default is 20 minutes of learning for 5 minutes of games, with a cap of 20 game minutes a day.
  - Parents can change all of these, turn games off, or allow free play (`src/lib/gametime.ts`).
- **Learning time is counted per answer, capped at 60 seconds,** so leaving the app open doesn't earn time.

### Gamification
- **The aim is the pull of a AAA game, pointed at report-card skills.**
- **XP:**
  - A correct first try earns 10, plus 2 per streak step (up to +10).
  - A fix after a miss earns 4; a revealed answer earns 1.
  - Session bonuses: +15 per session, +25 when perfect, +40 for the Daily Challenge, +30 for passing a Challenge.
  - Level *n* needs `80 + 40(n−1)` XP.
- **Coins** come from correct answers, sessions, games, trophies and quests. They're spent in a pretend shop on critter companions, titles and confetti styles.
- **Trophies:** 57 of them (`src/lib/trophies.ts`) in Xbox/PlayStation-style tiers.

  | Tier | Points | Coins |
  | --- | --- | --- |
  | Bronze | 15 | 10 |
  | Silver | 30 | 25 |
  | Gold | 90 | 60 |
  | Platinum ("Grade Champion") | 300 | 250 |

  - A few trophies are secret.
  - Trophies pop up as **console-style toasts** that never take taps. A toast must never block the buttons underneath it.
- **Daily quests:** 3 per day, seeded and claimed automatically.
- **Streaks:** a day counts if the child finishes a session or gives at least 5 answers.

### Arcade games
- **Number Munchers** (math), **Word Ninja** (a Fruit Ninja-style game with Dolch sight words by grade), **Critter Catch** (science), **Bubble Pop** (phonics) and **Memory Match**.
- **Game content adapts to the child's grade.** New games must teach something.

### Parent area (`/parents/`)
- **A PIN gate protects it.** The PIN is salted and hashed with SHA-256 on the device. "Forgot PIN" asks a multiplication question young kids can't answer.
  - The gate relocks on every full page load.
- **Sections:**
  - Overview.
  - Reports: 7/14/30/90 days, with charts, strengths, next steps, a table of every unit and a print view.
  - Report cards.
  - Children: up to 4; a birth year suggests a grade; a curriculum can be picked per child.
  - Settings per child.
  - Account & sync, Subscription, and Privacy (JSON export, erase device, delete account).
- **Calm and focus options** (per child, all off by default, in Settings): calm motion, quiet sounds, hide timers, hold trophy pop-ups until after the lesson, and shorter sessions (5 questions). They change presentation only; scoring is unchanged. They exist for children who find motion, noise or time pressure hard, including many with ADHD. Never make health claims about them.
- **Easier reading options** (per child, off by default): roomy text and high contrast, next to the calm options.
- **Account email:** parents confirm their email (needed before real Stripe checkout and weekly email), can reset a forgotten password, and can opt in to a weekly progress email. Email goes through Resend (`src/server/email.ts`); without keys it is skipped. Never put a child's information in an email beyond first name and practice totals.
- **Share a report:** a parent can create a read-only link (30 days, revocable) to one child's report. It is served from `/shared/{token}/`, never indexed.
- **Strengths need real mastery:** at least 8 attempts and 75% accuracy.

### Privacy
- **We store very little about each child:**
  - a first name or nickname;
  - grade;
  - an optional birth year;
  - an avatar;
  - practice results.
- **No free text, photos or voice recordings from kids.**
- **Parents can export everything or delete everything** at any time.

## Design decisions

### Look and feel
- **Kid-friendly but not noisy:** lots of colour without distraction, large touch targets, and tablet-first layouts that also work on phones.
  - There must be no horizontal scroll from 320 px wide.
  - The main button on each screen (Let's go, Adventure / Let's Play) must be visible without scrolling.
- **Small screens:**
  - Two Tailwind variants in `globals.css` handle the tightest screens.
    - `short:` is for phones held sideways (height 500 px or less).
    - `narrow:` is for 320 px phones.
    - Use them to drop decoration (extra mascots, the greeting critter) before shrinking anything a child taps.
  - Game boards shrink to fit short screens; the games measure their board size.
  - Every screen change scrolls to the top (`src/lib/router.ts`).
- **Fonts:** Fredoka for headings and buttons; Andika, designed for beginning readers, for questions and stories.
  - Theme tokens and animations live in `src/app/globals.css`.
- **Subject colours:** math blue `#4f8ef7`, language pink `#e9559a`, science green `#25b47e`, social orange `#ff9636`.
  - Use them for subject identity in the kids' UI only, never in charts.
  - **Text on these bright fills is very dark navy (`#0f172a`), not white,** because white fails the WCAG AA contrast rules (see `src/lib/contrast.ts`, `onColour`). The arcade purple is `#7c4fe0` for the same reason. Don't put white text on a bright fill; `node scripts/e2e-a11y.mjs` will catch it.
- **Mascots:** an original cast drawn from one parametric SVG (`src/components/Critter.tsx`). Every critter shares the same moods, and their eyes follow the pointer.
  - Ollie the Otter is the guide.
  - Each subject has its own guide: Hoot the owl (math), Ruby the fox (reading), Bolt the beaver (science) and Juniper the bear (social studies).
  - Seven more critters can be unlocked in the shop.
- **Read-aloud uses the device's own voices** (Web Speech API, `src/lib/speech.ts`), so it's free and works offline.
  - Installed voices are ranked by quality, and locale only breaks ties between similar voices:
    - first, "Natural", "Neural" and "Premium" voices;
    - then "Enhanced" and Google voices;
    - then standard voices;
    - last, old Windows desktop voices and Apple's Eloquence voices.
  - Apple's novelty voices are never offered.
  - Cloud voices (Edge's Natural voices, Google voices) are skipped when offline, with a retry on an on-device voice if one fails.
  - Parents can pick a voice with a preview in Settings. The choice is saved per device in `localStorage`, not synced, because every device has different voices.
  - Pitch stays at 1; raising it makes good voices sound processed.
  - A cloud neural voice (Azure, Google or OpenAI, with a shared audio cache) is the option if device voices aren't good enough. It's not built; ask the owner before adding one, because it has a running cost.
- **"Juice it or lose it":**
  - Squash-and-stretch buttons and synthesized sounds with slight pitch variation (no audio files).
  - Bursts, floating "+XP" text, screen thumps and confetti.
  - **All motion must respect `prefers-reduced-motion`.**

### Charts in parent reports
- **The subject colours failed the colour-blind check, so charts don't use them.** Charts use a single blue (`#2a78d6`), and a sequential blue ramp for the proficiency levels:
  - Emerging `#b7d3f6`, Developing `#6da7ec`, Proficient `#2a78d6`, Extending `#104281`.
  - Not started is `#e3e2de`.
- **Every chart has tooltips and a table view.**

## Architecture decisions

- **Offline-first.**
  - Everything a child does is appended as an event with a unique id. Events go to IndexedDB first (`src/lib/localdb.ts`).
  - XP, levels, coins, trophies, mastery and streaks are **never stored**. They're recomputed from events (`src/lib/derive.ts`), so merging devices is order-independent and duplicate-safe.
  - Profiles, settings and the family record use last-write-wins on `updatedAt`.
- **Sync** (`src/lib/sync.ts` → `POST /api/sync/`):
  - pushes unsynced events and pulls new ones by cursor;
  - runs when the device comes online, when the app becomes visible, every 2 minutes, and a few seconds after any change.
- **Service worker** (`public/sw.js`):
  - precaches `/play/` and `/parents/` along with their build files;
  - keeps grade files loaded on demand: the app posts the files it has loaded (`cache-urls`), including those fetched before the worker took control on a first visit;
  - serves pages network-first and hashed build files cache-first;
  - never caches `/api/` or client-navigation data.
- **Each grade's lessons are a separate download.** The client registry `src/content/index.ts` loads a grade with `loadGrade` (a dynamic `import()`).
  - The kids' app waits for the active child's grade, and the parent area for its children's grades (`ContentGate`, `useGradeContent`).
  - After that, the other profiles' grades and the grades either side are prefetched when the browser is idle, so switching players or moving up a grade works offline.
  - If a grade was never downloaded and the device is offline, kids see a friendly "connect once" screen with Try again.
  - First load of `/play/` is about 230 KB of gzipped JS plus 17–100 KB for one grade. Before this split, it was 775 KB for everything.
  - **Never import `src/content/all.ts` (every grade) from client code.** It's for statically generated pages and tests, and ESLint blocks it elsewhere.
  - **Scoring must not depend on which grades have loaded.** Code that runs over events (`derive`, reports) reads the subject from the unit key (`parseUnitKey`) instead of looking up content.
  - Trophies that count "every unit in your grade" use a target of at least 1, so an unloaded grade can never award them.
- **The kids' app and parent area are single-page apps with hash routes** (`src/lib/router.ts`), so every screen works offline from one cached page.
- **Server:** libsql, a local SQLite file in dev and Turso in production.
  - Auth hashes passwords with scrypt. Sessions are random tokens stored hashed, in an HttpOnly cookie, with a same-origin check.
- **`trailingSlash: true` means every API URL ends in `/`.** Call `/api/sync/`, not `/api/sync`. Stripe's webhook endpoint must be `/api/billing/webhook/`, because Stripe doesn't follow redirects.
- **Public pages must stay light.** They must not import the store or the content bundle on the client.
  - For example, `sound.ts` gets the "sound on?" check injected by the store instead of importing it.
  - Check the size of the JavaScript a public page loads after changing shared client modules.
- **Public pages are statically generated** with `dynamicParams = false`.
  - Sample questions are seeded from the unit key, so pages are identical on every build.
  - `/play/`, `/parents/` and `/api/` are `noindex` and disallowed in `robots.ts`.

## Content rules

Full guide: `docs/CONTENT_GUIDE.md`. The essentials:

- **Generation:**
  - Every unit has `generate({ difficulty })` that returns 6–10 questions (8 by convention) at difficulty 1, 2 or 3.
  - **Never use `Math.random` in content.** Use the seeded helpers in `src/content/random.ts`.
- **Questions must be fair:**
  - the answer is among the choices;
  - no two choices look alike;
  - no wrong answer that is also defensibly right;
  - the maths checks out.
  - `src/content/content.test.ts` enforces this. Keep it passing and extend it rather than weaken it.
- **Little kids:**
  - Prompts are at most 80 characters, with at most 4 choices (5 for older kids).
  - No typed answers in Kindergarten.
  - Use `speak` when read-aloud should differ from the text, and `speak: ""` to stay silent.
- **Typed answers:**
  - Answers fit the 9-character keypad.
  - The decimal and fraction keypads have no minus key, so negative answers use the integer keypad.
- **Canada:**
  - Canadian spelling (colour, centre, practise as a verb).
  - Money in multiples of 5¢, since there are no pennies.
  - Big numbers with Canadian spacing (`345 678`), plus a `speak` version for read-aloud.
- **People and sources:**
  - Diverse, region-neutral names, and no brand names.
  - Original passages only.
- **Indigenous content:**
  - present tense, living communities;
  - never treat all Nations as one ("some", "many");
  - no sacred or ceremonial details and no stereotyped emoji;
  - deeper content should be developed with partners such as FNESC.

## Open items

- **Before launch, BC teachers need to review all content.**
  - Several Big Ideas statements were written from memory; check them against curriculum.gov.bc.ca.
  - Check history dates in the Grade 4–5 social studies units.
- **iOS Safari quirks** (safe areas, `100dvh`, read-aloud voices): the device layout tests now pass in real WebKit (Playwright's WebKit build, not Safari). A check on a real iPhone or iPad is still needed, especially for read-aloud voices.
- **Deployment** is not done. Steps, env vars and the launch checklist are in `docs/DEPLOY.md`.
- **Legal and content:** `/privacy/` and `/terms/` are drafts needing legal review; `LEGAL_NAME` and `CONTACT_EMAIL` in `src/lib/brand.ts` are placeholders.
- **Accessibility:** automated checks pass, but nobody has yet tried the app with a screen reader (VoiceOver, TalkBack, NVDA) or a keyboard-only run-through, and the kids' UI has only had a simulated colour-blind pass (`scripts/colour-blind.mjs`, run by `e2e-a11y.mjs`), not testing with colour-blind children.
- **Security headers:** the CSP allows inline scripts and styles (`'unsafe-inline'`) so pages stay static and cacheable offline. A nonce-based policy would need dynamic rendering for every page.
