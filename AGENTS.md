<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gradelings: guide for agents

Gradelings is curriculum-matched practice, learning games and parent reports for Kindergarten to Grade 9. It launches with the BC Curriculum and is built to add other provinces and US states. This file records the product and design decisions already made, and why. Follow them. If a task seems to need one changed, raise it with the owner first; don't quietly work around it.

## Commands

```bash
npm run dev                 # http://localhost:3000
npm test                    # content checks for every unit + logic tests + province parity checks (~20 s)
npm run lint
npx tsc --noEmit            # run `npx next typegen` first in a fresh checkout (PageProps/LayoutProps)
npm run build && npm start  # offline/service worker only works in a production build
node scripts/e2e.mjs http://localhost:3000 e2e-shots --offline   # full playthrough + sync
node scripts/e2e-devices.mjs http://localhost:3000                # layout on 14 phones/tablets
node scripts/e2e-offline.mjs                                      # real offline (starts its own server)
node scripts/e2e-classroom.mjs http://localhost:3000              # teacher adds a student, who signs in with codes, opens a lesson and practises
node scripts/e2e-a11y.mjs http://localhost:3000                   # axe-core WCAG 2.2 A/AA, plus colour-blind checks (screenshots in e2e-shots/a11y)
```

Before you push, run tests, lint and typecheck. For UI or flow changes, also run the e2e scripts.

Whenever you add a new feature, write a test for it in the same change. When extending an existing feature, add or update tests for the behavior you changed.

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
- **`e2e.mjs`:** the full playthrough on an iPad-sized screen plus a phone. It covers every mode and game, the parent area, sign-up, two-device sync, and offline progress uploading on reconnect. CI runs it as three parts, `--part modes`, `--part parents` and `--part sync --offline`; with no `--part` it runs everything.
- **`e2e-classroom.mjs`:** a teacher (made through the API, email confirmed straight in the database file) adds a student; the student signs in with codes, sees the assignment, opens a lesson, practises and signs out; the teacher sees the results.
- **`e2e-offline.mjs`:** stops the server so only the service worker can answer. Playwright's `setOffline()` doesn't cut off service worker requests, so it can't prove the cache works.
- **WebKit:** iPhone and iPad profiles run in WebKit when it's installed, otherwise in Chromium at the same size, pixel ratio and touch settings.

## Product decisions

### Positioning
- **Audience:** parents of children in Kindergarten to Grade 9. Kids use the app; parents choose it, configure it and pay.
- **We differentiate on clarity, kindness and usability, not price.** IXL is expensive and hard to use, and Khan Academy is free. We win by:
  - speaking the language of the report card;
  - giving kind, encouraging feedback;
  - making it as compelling as a good video game.
  - Research is in `docs/research/`.
- **Name:** "Gradelings" is a working name. It is set once in `src/lib/brand.ts`; never hard-code it elsewhere. The name was chosen because it works across provinces and countries.
- **Platform:** a web-first installable app (PWA) built with Next.js. Android is a Trusted Web Activity that wraps `/play/` (`android/`, `docs/ANDROID.md`), not Capacitor. Don't add features that only work in a native shell.

### Money
- **No ads, ever. No tracking pixels. Never sell data.** Kids can never buy anything; coins are earned only by learning.
- **Family plan:** C$14.99/month or C$119.99/year, with "Save 33%" on the yearly plan, for up to 4 children.
  - The plan includes a 30-day free trial with everything on and no card needed.
  - After the trial, the first 2 units of every course stay free forever.
  - All of this lives in `src/lib/plan.ts`; read the numbers from there.
- **Payments:** Stripe Checkout and the Billing Portal, called over raw HTTPS with no SDK (`src/server/stripe.ts`).
  - Until Stripe keys are set, billing runs in a simulated dev mode (`ALLOW_DEV_BILLING=1` turns it on in production for staging).

### Not tied to BC: every framework, every grade
- **Everything that differs by province or state lives in a `Framework`** (`src/content/frameworks.ts`): grades, report-card scale, report-card guide and slug.
  - Each unit carries `standards[frameworkId]`. Each course carries `bigIdeas[frameworkId]`.
- **No BC-specific wording in UI code.** Read names from the framework, such as `curriculumName` and the level labels.
  - Public URLs are `/curriculum/{framework-slug}/{grade-slug}/{subject}/{unit}/`, `/guides/{framework-slug}/...` and `/report-cards/{framework-slug}/`.
- **Adding a province or state** means adding a `Framework` and its standards, not new screens (`docs/ADDING_A_PROVINCE.md`). BC content follows the BC curriculum; Ontario follows the Ontario curriculum; Alberta follows the Alberta curriculum; any other province or state follows its own official curriculum, with its own spelling rules (Canadian spelling in every Canadian province).
- **Frameworks now: British Columbia (`ca-bc`, slug `bc`), Ontario (`ca-on`, slug `ontario`), Alberta (`ca-ab`, slug `alberta`) and Saskatchewan (`ca-sk`, slug `saskatchewan`, no French).** BC, Ontario and Alberta cover Kindergarten to Grade 9 in math, language, science, social studies and the two French subjects. A parent picks the province per child (when adding the child, in Children and in Settings). Progress is shared between provinces for shared unit ids.
- **Whenever you create or change content, apply it to every framework.** If you add a unit, grade, subject, guide, trophy, quest or page for one province, add the matching one for every other province and state in the same change, or say plainly in the PR which framework is still missing and why. If you change how a grade works (its units, French, scoring, wording), check that grade in every framework, because grade changes apply across regions. `src/content/coverage.test.ts` fails when a framework is missing a grade, a core subject, Big Ideas or French in a grade its province teaches; extend its tables when you add a framework.
- **All sales, call-to-action and marketing copy says "Kindergarten to Grade 9"** and names both provinces. Prefer reading the grade range and province names from `FRAMEWORKS` over typing them. When the range changes, search the repo for the old range (`README.md`, pricing, help FAQs, metadata, manifest, share image, guides, compare pages, terms, plan features) and update every hit.

### Saskatchewan
- **Framework `ca-sk`, slug `saskatchewan`**, Kindergarten to Grade 9 in math, language, science and social studies. Standards are outcomes cited by code, checked by `content.test.ts` against `docs/research/saskatchewan/outcomes.json` (record: `docs/research/saskatchewan/README.md`).
- **Scoring:** no single provincial scale, so one four-level scheme (Beginning, Approaching, Meeting, Exemplary) with the usual kid labels. Same "practice, not a report-card mark" rule.
- **French is not built** for Saskatchewan (no French guide; the guides test only requires one where a framework has French).
- **Shared units:** BC units via `share(...)`, Ontario units via `reuse(...)`, plus Saskatchewan-only units in `src/content/saskatchewan/`. Known gaps (French, partly covered outcomes, review needs) are listed in the research README.
- **First Nations, Métis and treaty content** is light and needs partner review.

### Ontario
- **Standards** are the expectations in the Ontario Curriculum, cited by code (for example "History A1.1"; Grades 7 and 8 name the subject because Geography and History reuse strand letters). `content.test.ts` checks every code against `docs/research/ontario/expectations.json`. Source and checking record: `docs/research/ontario/`.
- **Subjects:** math, language, science and technology, social studies (Grades 1 to 6), geography and history (Grades 7 and 8), Grade 9 science (SNC1W) and geography (CGC1W), Kindergarten (the Kindergarten Program), plus French as a second language.
- **Report card:** Levels 1 to 4 (Growing Success). Grades 1 to 6 show letter grades, Grades 7 to 9 show percentage ranges, Kindergarten shows neither. The same kid labels (🌱 🌿 🌳 ⭐) and the same "practice, not a report-card mark" rule apply.
- **Shared units:** where a BC unit truly fits, an Ontario course reuses it with Ontario's standards text (`Course.shares`). Sample the questions before sharing.
- **First Nations, Métis and Inuit content** is deliberately light and needs partner review before launch. Don't add more without that.
- **French as a second language:** Core French from Grade 4 and French Immersion from Grade 1 (Kindergarten immersion varies by board, so there is none). Extended French is not built.
- **Parent guides:** the hub, a guide for each grade, subject help pages and printable sheets, a learning skills guide (`/guides/ontario/learning-skills/`) and an EQAO guide (`/guides/ontario/eqao/`). Check EQAO details against eqao.com before launch.

### Alberta
- **Standards** are the learning outcomes in the Alberta programs of study: the new K–6 curriculum (math, English language arts and literature, science, social studies, French immersion language arts and literature) and the existing Grades 7–9 programs (Mathematics 2007, English language arts 2000, Science 2003, Social Studies 2005). The Grades 7–9 math and social studies are being replaced from September 2027, and the draft is only in pilot, so Grades 7–9 follow the programs in force. Source and checking record: `docs/research/alberta/`.
- **How standards are cited** (`ab()` in `src/content/alberta/kit.ts`, checked by `src/content/alberta/alberta.test.ts` against `docs/research/alberta/outcomes.json`): K–6 math and science by outcome code (`4N1.1`, `3ES 1.2`); Grades 7–9 math by strand and number (`N5`, `PR2`); Grades 7–9 science by unit (`Unit A: Interactions and Ecosystems`); K–6 language, social studies and French immersion by the official grade snapshot line; Grades 7–9 social studies by issue code (`7.1`) and language arts by general outcome. The full K–6 language and social outcomes are only on the New LearnAlberta site, which could not be read automatically.
- **Report card:** Alberta has no provincial scale. The framework uses four plain practice steps (Beginning, Approaching, Meeting, Exceeding) with the usual 🌱 🌿 🌳 ⭐ kid labels, and every report still says this is practice, not a report-card mark. Provincial Achievement Tests (Grades 6 and 9) and early literacy and numeracy screening are the "provincial assessments"; the schedule is changing, so the guides tell parents to check alberta.ca.
- **Shared units:** an Alberta course reuses a BC or Ontario unit with Alberta standards text (`Course.shares`) only where it truly fits the Alberta grade. An Alberta child therefore downloads Ontario's file for the grade too (`EXTRA_DEPENDS` in `src/content/index.ts`). Alberta grade placement often differs (for example decimals and percent in Grade 4, integers in Grade 6, Colonial Canada and Confederation in Grade 4 social studies, ancient civilizations in Grade 5, democracy in Grade 6), so those grades have more Alberta-written units.
- **French:** Immersion from Kindergarten to Grade 9 and Core French (the French as a Second Language program) from Grade 4 to Grade 9, in `src/content/alberta/french.ts`. Immersion Grades 7–9 has no checked citation yet.
- **First Nations, Métis and Inuit content** is deliberately light and needs partner review before launch. Don't add more without that.
- **Parent guides:** the hub, a guide for each grade, competencies (`/guides/alberta/competencies/`), the Provincial Achievement Tests page (`/guides/alberta/pat/`) and a French guide.

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

### French
- **Two opt-in subjects, off by default** (a parent turns them on per child in Settings > Subjects): `immersion` (Français langue seconde – immersion) and `core-french`.
  - **BC:** Immersion from Kindergarten to Grade 9; Core French from Grade 5 to Grade 9 (BC requires a second language from Grade 5).
  - **Ontario:** Immersion from Grade 1 to Grade 9; Core French from Grade 4 to Grade 9 (Ontario requires Core French from Grade 4).
  - The grades each province offers are fixed in `FRENCH_GRADES` in `src/content/coverage.test.ts`. Adding a province means adding its French rule there.
- **They never count toward "every unit in your grade" goals or the Grade Champion trophy** (`isCoreSubject`), and reports only list French units once a child has started them.
- **Immersion prompts are in French and set `lang: "fr"`**, so read-aloud uses a French voice (`speak(text, uri, "fr")`). Hints stay in English for parents. Core French prompts are in English with French answers.
- **BC Big Ideas are copied word for word from the official BC PDFs** (Immersion: `en_fral_k-9_elab.pdf`; Core French: `en_languages_5-10_core-french.pdf`). Competencies and content are still to be reviewed by a French teacher. Ontario French units cite the Ontario FSL curriculum.
- **French read-aloud** (`src/lib/readaloud.ts`) speaks each part of a question in its own language: Immersion prompts are French; Core French prompts are English with French marked in « » (`tagCoreFrench`), and `choicesLang`/`visualLang` mark French choices and stories. Parents pick a separate French voice in Settings (`grademap.voice.fr`, per device). Hints are always read in the English voice.
- **French trophies** live in their own `FRENCH_TROPHIES` list in `src/lib/trophies.ts` (category "French"), plus a French mastery trophy per grade; French still doesn't count toward Grade Champion.
- **Parent guide:** each province has a French guide at `/guides/{framework-slug}/french/` that compares Core French and French Immersion for that province.
- **Verify French against the official sources:** curriculum.gov.bc.ca (`/curriculum/fral/{grade}/core` and `/curriculum/core-french/{grade}`) for BC, and the Ministry's FSL curriculum for Ontario. Have a French teacher review the wording before launch.

### Ages
- **Three age bands** (`ageBandFor`): little (K–1), middle (2–4) and big (5–9). The band changes copy, size and features:
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

### Lessons ("how it works")
- A unit can carry an optional `lesson` (2 to 4 short steps and one worked example; `Lesson` in `src/content/types.ts`). Lessons are written once per grade in `src/content/lessons/<grade>.ts`, keyed `subject/unit-id`, and attached by `withLessons` in each BC grade's `index.ts`, so a unit shared by BC, Ontario and Alberta has the lesson in all and each grade's lessons stay in that grade's download.
- Children open one from the unit dialog ("How it works") or, for little kids, automatically before their first practice of a unit. It never changes scoring. The public unit page shows it under "How we explain it".
- **Coverage today:** every math unit that BC and Ontario share (a test enforces this). Not yet: BC-only and Ontario-only math units, and other subjects. Add a lesson when you add a math unit; `lessons.test.ts` checks length and structure.

### Feedback
- **A wrong answer gets a hint and another try.** A second miss shows the answer with an explanation.
- **Only first-try answers count** toward accuracy, stars and proficiency. Stars never go down.
- **A hint opened before answering counts like a retry** (`hinted` on the answer event): no first-try credit, 4 XP instead of 10, and it isn't a "comeback". A parent can turn on "Hints count as first try" per child (`freeHints`) so asking for help never lowers accuracy. Reports show how many hints were opened. The hint button appears only in modes with retries (not Speed Run or Challenge).
- **The tone is soft:** a gentle "try again" sound, not a buzzer, and encouraging messages. Never shame a child.

### Timers and the learn-to-play loop
- **Daily goal timer:** 10 minutes for little kids, 15 for everyone else. A child can tap the minutes on the home screen to pick Easy (about two thirds), Regular (the parent's goal) or Stretch (a third more) for the day (`src/lib/goal.ts`, a `goal` event). Finishing a Stretch goal earns +15 coins once a day. Parents can turn the choice off in Settings. A session timer appears in timed modes, and the elapsed timer is optional (`showTimer`).
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
- **Trophies:** 186 in the list, about 115 visible to a child at any one grade (mastery trophies are per grade), including a French group kept in its own list (`src/lib/trophies.ts`), in Xbox/PlayStation-style tiers. Everything a child can do has a trophy: every subject (a practice ladder for each of math, language, science, social studies and both French subjects), every mode, every arcade game, streaks, levels, shop, and mastery for every grade and subject.

  | Tier | Points | Coins |
  | --- | --- | --- |
  | Bronze | 15 | 10 |
  | Silver | 30 | 25 |
  | Gold | 90 | 60 |
  | Platinum (one per grade: "Grade Champion"; plus 365 days practised, a 365-day streak, level 100) | 300 | 250 |

  - A few trophies are secret, including "Old School" (Konami code: arrow keys then B, A; on touch, eight swipes then two taps; `src/lib/konami.ts`).
  - Trophies pop up as **console-style toasts** that never take taps. A toast must never block the buttons underneath it.
- **Mastery trophies are per grade** (`grade-champion-4`, `master-math-4`, ...): only the child's current grade is shown and earned, so moving up gives new long goals. A trophy's optional `applies` hides it when the child's grade and curriculum have no such course (for example Core French before Grade 5 in BC), so nothing unearnable is shown. Trophies are not province-specific: they read the child's own `framework`, so a new framework needs no new trophies. When you add a subject, mode or game, add its trophy and quest in the same change. Old un-suffixed ids still count for points. Growth trophies (Emerging to Proficient, still Proficient after 30+ days away) and "days practised" (Journey) trophies are read from unit stats and day counts, never from loaded content.
- **Daily quests:** 3 per day from a pool of about 30, seeded and claimed automatically. Little kids never get Speed Run or Review quests.
- **Weekly quests:** 2 per week (Monday to Sunday), bigger rewards, also claimed automatically (stored as quest events keyed by the Monday's date, ids start `w-`).
- **Streaks:** a day counts if the child finishes a session or gives at least 5 answers. Every 7 practice days earns a rest-day shield (up to 2) that covers a missed day, so one slip doesn't erase a long streak. Shields are computed in `derive`, never stored.
- **Shop unlocks:** some items need a level or trophy as well as coins (`unlock` in `src/lib/shop.ts`).
- **Easter eggs** (`src/components/play/Secrets.tsx`, logged as `secret` events, shown as hidden trophies): Konami code (keys, or 8 swipes and 2 taps), tap your buddy 10 times, a polite moose that strolls past an idle home screen on about 1 day in 6, secret words typed on a keyboard, 11 right in a row, a lesson finished at 11:11. Never add anything that blocks taps or pushes late-night use.
- **"Almost there" card:** the home screen shows the started unit closest to its next level ("2 right answers to grow into 🌳 Tree", `questionsToNextLevel`, `src/lib/nextup.ts`). Units that need a Challenge for the next level are skipped.
- **Sticker Book** (`#/stickers`, `src/lib/stickers.ts`): a sticker for every lesson a child has grown in (Proficient or better; Star lessons are shiny) plus about 14 "moment" stickers (first lesson, a week's streak and so on). It is read from the derived stats, so stickers are never stored or lost. French pages appear only once French is started. When you add a mode or game, consider a moment sticker too.
- **My Room** (`#/room`, `src/lib/room.ts`): a coin sink that gives a child a place to come back to. About 35 items (walls, floors, wall art, lights, plants, a cosy corner and toys, 60 to 250 coins, a few needing a level) are bought like shop items (a `buy` event, ids start `room-`, so they also count toward Collector trophies) and placed per child in `Profile.room`. The scene scales with container-query units so it fits a 320 px phone. Coins only, never real money.
- **"Quick refresher" card:** a unit the child reached Proficient in and hasn't touched for 14 days gets a card from that subject's guide ("Hoot remembers you were great at Fractions", `refresherUnit`). It opens normal practice; scoring is unchanged and nothing says anything was lost.
- **Buddy growth:** the child's buddy is dressed for their level (`src/lib/buddy.ts`): Cub, then Explorer (bow tie) at level 5, Adventurer (cape) at 15, Hero (medal) at 30 and Legend (crown) at 50. It is read from the level, so nothing is stored. The Shop shows the next stage, and a level-up toast says when the buddy grew. Use `<Companion>` (not `<Critter id={profile.companion}>`) wherever the child's own buddy appears.
- **Parent milestone cards** (`src/lib/milestones.ts`) appear on the Overview and Reports; they describe practice, not a report-card mark.

### Arcade games
- **Number Munchers** (math), **Word Ninja** (a Fruit Ninja-style game with Dolch sight words by grade), **Critter Catch** (science), **Bubble Pop** (phonics) and **Memory Match**.
- **Game content adapts to the child's grade.** New games must teach something.

### Parent area (`/parents/`)
- **A PIN gate protects it.** The PIN is salted and hashed with SHA-256 on the device. "Forgot PIN" asks a multiplication question young kids can't answer.
  - The gate relocks on every full page load.
- **Sections:**
  - Overview.
  - Reports: 7/14/30/90 days, with charts, strengths, next steps, a table of every unit and a print view.
  - Report cards, with a printable conversation sheet for each child (`src/lib/conference.ts`): where practice stands per subject in the province's own scale, what to ask the teacher and a two-week plan. It says it is practice, not a report-card mark.
  - Children: up to 4; a birth year suggests a grade; a curriculum can be picked per child.
  - Settings per child.
  - Account & sync, Subscription, and Privacy (JSON export, erase device, delete account).
- **Calm and focus options** (per child, all off by default, in Settings): calm motion, quiet sounds, hide timers, hold trophy pop-ups until after the lesson, and shorter sessions (5 questions). They change presentation only; scoring is unchanged. They exist for children who find motion, noise or time pressure hard, including many with ADHD. Never make health claims about them.
- **Easier reading options** (per child, off by default): roomy text and high contrast, next to the calm options.
- **Account email:** parents confirm their email (needed before real Stripe checkout and weekly email), can reset a forgotten password, and can opt in to a weekly progress email. Email goes through Resend (`src/server/email.ts`); without keys it is skipped. Never put a child's information in an email beyond first name and practice totals.
- **Trial emails:** a confirmed parent gets one mid-trial recap 4 to 10 days before the trial ends (only if a child has practised), then the existing "trial ends soon" notice repeats the recap. First names and practice totals only, framed as practice, not a mark.
- **Weekly-report notification:** a parent can allow a browser notification on Sundays (Account & sync). Web Push goes over raw HTTPS with VAPID, no SDK (`src/server/push.ts`); messages have no payload and the service worker shows fixed text, so nothing about a child reaches a push service. Only the push address is stored, and only addresses on known push-service hosts are accepted. Off until `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are set. Never push to children.
- **Account email:** parents confirm their email (needed before real Stripe checkout and weekly email), can reset a forgotten password, and can opt in to a weekly progress email (on the first Sunday of the month it also carries a short month summary: practice days, minutes, questions, and a comparison with the month before only when it went up). Email goes through Resend (`src/server/email.ts`); without keys it is skipped. Never put a child's information in an email beyond first name and practice totals.
- **Share a report:** a parent can create a read-only link (30 days, revocable) to one child's report. It is served from `/shared/{token}/`, never indexed.
- **"Is it working?" panel** on Reports (`src/lib/progressSince.ts`): units started and Proficient-or-higher now against 30, 90 or 180 days ago, and which units moved up a level. Computed from events and unit keys only.
- **Weekly goal and notes:** a parent can set a weekly "days practised" goal per child and send one of four fixed kind notes (`src/lib/familyGoal.ts`). Both live in the child's synced settings; progress is computed from events. The note shows once on the child's home screen and expires after 3 days. No free text, no push to children.
- **Strengths need real mastery:** at least 8 attempts and 75% accuracy.

### Classroom mode (`/teachers/`)
- **A teacher is an ordinary account** that creates classes (`classes`, `class_members`, `class_assignments`). No billing change: classes are free for now.
- **Each class follows one province** (`classes.framework`, BC, Ontario or Alberta, chosen when the class is created). Assignments must be units of that province, and a child can only join a class of their own province.
- **Public teacher pages** live under `/for-teachers/` (hub, province, grade), generated from content; `TEACHER_FRAMEWORK_IDS` in `src/components/site/teachers.ts` lists the provinces the teacher area supports. `/teachers/` itself stays noindex.
- **Two ways students join, and the school or parent decides.**
  - **Linked by a parent:** a parent links a child under Children → "Join a class" and can leave at any time. Nothing about a child is shared before that.
  - **Added by the teacher:** the teacher types first names or nicknames (`src/server/students.ts`, `POST /api/classes/students/`). Each student gets a six-character login code and signs in at `/play/` with the class code plus their own code (`/api/students/login/`). There is no email, password or birth year. Each student has a hidden family record (`parents.role = 'student'`, a `students` row, plan `premium` so there is never a paywall).
  - **A student session is deliberately narrow:** `getSession(req)` returns `null` for student sessions unless a route passes `{ student: true }` (only `/api/sync/` and `/api/auth/me/` do). Sync keeps a student's name, grade and province fixed and refuses new or deleted profiles. `/parents/` shows a "class account" notice. Signing in clears the device first and sign-out clears it again, so devices can be shared.
  - **Deleting:** removing a student, closing a class and deleting a teacher account each delete the student accounts at once (`removeStudent`, `removeClassStudents`, `removeStudentsOfOwner`). Classes with no sign-in for 11 months get a warning email; at 12 months the class, assignments and class-account student data are deleted. Parent-linked children are unlinked, while their family data stays. Keep student deletion complete when adding tables that hold student data.
  - **The teacher sees** first name, avatar, grade, and level, accuracy and attempts on the units they assigned, plus "What to look at next" (`classInsights` in `src/lib/classroom.ts`: reteach units and students to check in with). Due dates are optional on assignments and reach children through sync as soft "Try to finish by" text, never as a warning. Teachers can print login cards and a class summary, and copy a "send home" note.
- Closing a class, leaving it, removing a child and deleting an account all remove the links.
- Teacher screens are labelled as practice, not a report-card mark. `/teachers/` is `noindex` and disallowed in `robots.ts`.
- **Assigned units reach the child through sync** (`classwork` in the sync response, with `due` dates, kept on the device so it works offline). `/play/` shows them as "From your teacher" on the home screen and marks them in the unit list; assigned units open even on the free plan.
- **School approval papers** live in `docs/school/` (PIA pack, data agreement, letter home, accessibility conformance). They are drafts for the owner; facts in them must stay true to the code, so update them when student data, providers or retention change. The public `/accessibility/` page and the "Schools and classes" section of `/privacy/` say the same things.
- **Not built yet:** a school or teacher plan, co-teachers on one class, and a lawyer's review of `/privacy/`, `/terms/` and the data agreement.

### Public pages and SEO
- **Every framework gets the full set of public pages**, generated from content so a new grade or unit appears automatically:
  - curriculum pages for the province, each grade, each subject and each unit, with sample questions;
  - parent guides: a hub, a guide for each grade (Kindergarten to Grade 9), a help page and printable worksheet for each grade and subject, the province's competencies/learning-skills page, its provincial assessment page (BC: FSA; Ontario: EQAO; Alberta: PAT) and its French guide;
  - a report-card page.
  - They are all in the sitemap (`allGuidePaths`, `allCurriculumPaths`).
- **The guide copy is per province** (`src/content/guides.ts`, `src/content/ontario/guides.ts`): grade notes for every grade, competencies, assessment and French. Don't hard-code BC names in the shared page components; read slugs and labels from the framework's guide copy.
- **Every public page that brings in visitors ends with a call to action** with a "Try it free" button to `/play/` (the shared `<SitePage cta>` block, or a page's own button where the wording needs to be specific, as on unit, guide and comparison pages). The header also carries a "Play free" button. `coverage.test.ts` fails when a public page has neither. Account, help, contact and legal pages are exempt.
- **Pricing in call-to-action copy comes from `src/lib/plan.ts`**, never typed.

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
- **Read-aloud uses the device's own voices by default** (Web Speech API, `src/lib/speech.ts`), so it's free and works offline.
  - Installed voices are ranked by quality, and locale only breaks ties between similar voices:
    - first, "Natural", "Neural" and "Premium" voices;
    - then "Enhanced" and Google voices;
    - then standard voices;
    - last, old Windows desktop voices and Apple's Eloquence voices.
  - Apple's novelty voices are never offered.
  - Cloud voices (Edge's Natural voices, Google voices) are skipped when offline, with a retry on an on-device voice if one fails.
  - Parents can pick a voice with a preview in Settings. The choice is saved per device in `localStorage`, not synced, because every device has different voices.
 - Pitch stays at 1; raising it makes good voices sound processed.
- **Optional Piper voice** (`src/lib/piper.ts`, `public/piper-worker.js`): a parent can download a neural voice in Settings (Kristin for English, Siwis for French, listed in `src/lib/piper-manifest.json` with file hashes). It runs on the device in a web worker (WebAssembly and ONNX Runtime), so it costs nothing to run and works offline once downloaded.
 - Off by default; the choice is per device in `localStorage`, and the files live in their own Cache Storage, so a parent can remove them.
 - When it's on, read-aloud uses it; if it fails, the device voice takes over. A device-voice preview in Settings always uses the device voice.
 - We host every file ourselves. The site serves them from `/piper/{version}/`. The engine is copied from `node_modules`; the voices come from our GitHub release `piper-voices-{version}` (copied unchanged from rhasspy/piper-voices). `scripts/fetch-piper.mjs` downloads them, checks the sha256 and puts them in `public/piper/` (gitignored) on `prebuild` and, optionally, on `dev`. Don't commit the voice files to git or Git LFS (about 127 MB).
 - Never replace or delete a release's assets. To change a voice, upload a new `piper-voices-{n}` release, update the manifest's hashes and bump `version`.
 - Show each voice's credit line; the French voice is CC BY 4.0.
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
- **Content Security Policy has no `'unsafe-inline'` in production, and pages stay static** (`src/lib/csp.mjs`). Nonces would need dynamic rendering for every page, and Next's experimental SRI doesn't cover inline scripts.
  - `npm run build` is `next build && node scripts/csp-postbuild.mjs`. The script hashes every inline script, `<style>` and `style=""` value in each prerendered page and writes that page's policy into a `<meta http-equiv>` tag right after the charset. Run `next build` alone and the pages have no script policy, so don't change the `build` script.
  - The header from `next.config.ts` carries only what a `<meta>` tag can't set (`frame-ancestors`, plus `base-uri`, `form-action` and `object-src`). It must **not** gain `default-src`, `script-src` or `style-src`: browsers combine the header and the tag, so those would block the hashed scripts.
  - `/shared/{token}/` is rendered on every request, so `src/proxy.ts` gives it a per-request nonce instead. `next dev` uses a permissive policy because hot reloading needs it.
  - Inline `style` props set from client code are fine (they go through the CSSOM). `setAttribute("style", …)` and `<style>` elements added at runtime are blocked.
  - Playwright's playthrough fails on any console error, which includes CSP violations, so a regression shows up in CI.
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
  - Grade 8–9 content (shared helpers in `src/content/grades/kit.ts`) uses the Big Ideas and content topics published on curriculum.gov.bc.ca, but the questions and unit detail still need teacher review. The Grade 9 Indigenous history unit should be reviewed with First Peoples partners.
- **iOS Safari quirks** (safe areas, `100dvh`, read-aloud voices): the device layout tests now pass in real WebKit (Playwright's WebKit build, not Safari). A check on a real iPhone or iPad is still needed, especially for read-aloud voices.
- **Deployment** is not done. Steps, env vars and the launch checklist are in `docs/DEPLOY.md`.
- **Legal and content:** `/privacy/` and `/terms/` are drafts needing legal review; `LEGAL_NAME` and `CONTACT_EMAIL` in `src/lib/brand.ts` are placeholders.
- **Accessibility:** automated checks pass, but nobody has yet tried the app with a screen reader (VoiceOver, TalkBack, NVDA) or a keyboard-only run-through, and the kids' UI has only had a simulated colour-blind pass (`scripts/colour-blind.mjs`, run by `e2e-a11y.mjs`), not testing with colour-blind children.
- **CSP on a real host:** production has no `'unsafe-inline'`, but the page-level policy lives in a `<meta>` tag that `scripts/csp-postbuild.mjs` writes into `.next/server/**/*.html` after the build. It is tested with `next start`, not yet on Vercel. After the first deploy, check that a prerendered page (e.g. `/play/`) still has the tag and loads with no console errors.
