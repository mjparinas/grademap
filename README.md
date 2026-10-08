# GradeMap: Grade 2 (BC Curriculum)

A kid-friendly practice website for Grade 2, matched to the BC curriculum. It's built for the web and ready for tablets: big touch targets, read-aloud, saved progress, and it can be installed on a home screen. "GradeMap" is a working name; change it in `src/lib/brand.ts`.

## What's inside

- **22 units across 4 subjects**, each one mapped to a BC Grade 2 learning standard:
  - **Math (10):** tens & ones, comparing, facts to 20, adding to 100, patterns, Canadian coins, measuring, shapes, picture graphs, likelihood
  - **Reading & Writing (5):** rhymes and word families, sounds (sh/ch/ee/ai…), capitals and punctuation, story elements, compound words, opposites and plurals
  - **Science (4):** life cycles (including BC salmon), solids & liquids, push & pull, the water cycle
  - **Our World (3):** needs & wants, communities in Canada, rights & responsibilities
- **Five kinds of interaction:** multiple choice, build-a-number with tens rods and ones cubes, make-an-amount with coins, put-in-order, and sort-into-baskets.
- **Kind feedback:** a wrong answer gets a hint and another try. After a second miss, the app shows the answer with an explanation. Stars count first-try answers and never go down.
- **Juice** (in the spirit of "Juice it or lose it"):
  - Buttons squash and stretch.
  - Sounds are synthesized, and pitches vary so they don't repeat exactly.
  - Correct answers burst stars and show a floating "+1 ⭐".
  - Streaks show a 🔥 counter.
  - Ollie the Otter's eyes follow your finger, and he cheers or wiggles.
  - Coins clink and blocks clack.
  - On the finish screen, stars thump down one by one with a small screen bump, followed by confetti.
  - Everything respects the device's "reduce motion" setting.
- **Profiles** for up to 4 kids, a sticker book, and a "Try next" suggestion.
- **Grown-ups area** behind a times-table gate:
  - progress per lesson, with each lesson's BC learning standard
  - the Grade 2 Big Ideas
  - a plain-language guide to BC's proficiency scale
  - settings for sound and auto read-aloud
  - reset and remove options
- **Privacy:** progress is saved in the browser on this device (`localStorage`). There's no account, no ads and no server.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # checks every unit's generated questions (300 runs each)
npm run lint
npm run build    # static site in ./out
```

`npm run build` produces a fully static site in `out/` (`output: "export"`). You can host it on any static host (Netlify, Cloudflare Pages, S3, GitHub Pages, Vercel) or preview it locally with `npx http-server out`.

## How it's built

- **Next.js 16** (App Router, static export) + **React 19** + **TypeScript**
- **Tailwind CSS 4**: the theme, colours and animations live in `src/app/globals.css`
- **zustand**: saved progress (`src/lib/store.ts`)
- **canvas-confetti**: confetti and star bursts (`src/lib/juice.ts`)
- **Web Audio**: sounds with no audio files (`src/lib/sound.ts`)
- **Web Speech API**: read-aloud (`src/lib/speech.ts`)
- **Fonts:** Fredoka for headings and buttons; Andika (designed for beginning readers) for questions and stories
- **PWA:** `src/app/manifest.ts` + `public/sw.js` (works offline after the first visit)

```
src/
  app/                      routes: /, /learn/[subject]/, /learn/[subject]/[unit]/, /grown-ups/
  components/
    Home.tsx                welcome, profiles, subject map, sticker book
    UnitList.tsx            lessons in a subject
    Player.tsx              lesson flow, feedback bar, finish screen
    questions/              the 5 interaction types
    visuals.tsx             coins, blocks, ten frames, ruler, shapes, graphs, spinner
    Mascot.tsx              Ollie the Otter (SVG, moods, eye tracking)
    GrownUps.tsx            parent dashboard
  lib/
    content/                all curriculum content (math is generated; others are question banks)
    curriculum.ts           subject/unit registry
    store.ts                profiles, progress, settings
```

### Adding a unit

1. Write a `generate()` function that returns 6–10 `Question`s (see `src/lib/types.ts`). For hand-written questions, use the helpers in `src/lib/content/bank.ts`.
2. Add the unit to its subject's `units` array with a title, emoji, BC learning standard and parent note.
3. Run `npm test`. It checks every unit for fair questions: the answer is one of the options, no two buttons look the same, and the maths adds up.

Pages are generated automatically from the curriculum registry.

### Adding another province or grade

Content is keyed by subject and unit, and the grade and province labels live in `src/lib/curriculum.ts`. The natural next step is to make the curriculum registry selectable by grade and province, and to swap the report-card explainer for that province's grading scale (for example, Ontario's Levels 1–4).

## Next steps toward the app stores

The static export is ready for [Capacitor](https://capacitorjs.com/):

```bash
npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init GradeMap ca.grademap.app --web-dir=out
npm run build && npx cap add android && npx cap sync
```

Before submitting, add features that store reviewers expect from an app rather than a website in a box: offline lesson packs, native notifications, and Play Families / Apple Kids Category compliance.

## Content notes

- Questions were written to the BC Grade 2 curricular content and Big Ideas. Have a BC teacher review them before launch.
- Indigenous perspectives are referenced lightly and factually (salmon, First Peoples as the first peoples of this land). Deeper First Peoples content should be developed with partners such as FNESC.
- The proficiency scale descriptions come from BC's K–12 Student Reporting Policy. Check them against the current Ministry wording before launch.
