# Content authoring guide

All learning content lives in `src/content/grades/<grade>/<subject>.ts`. Each file exports one `course: Course` (see `src/content/types.ts`).

```ts
export const course: Course = {
  grade: "1",                 // "k" | "1" … "7"
  subject: "math",            // "math" | "language" | "science" | "social" | "immersion" | "core-french"
  bigIdeas: { "ca-bc": [ /* the official Big Ideas for this grade + subject */ ] },
  units: [ /* 4–10 units */ ],
};
```

Each unit:

```ts
{
  id: "make-ten",                       // kebab-case, unique within the course
  title: "Make 10",                     // short, kid-facing
  emoji: "🔟",
  blurb: "Two numbers that make 10",    // ≤ 6 words, kid-facing
  parentNote: "Finding pairs that make 10 (like 6 + 4), a key strategy for adding.",
  standards: { "ca-bc": "Ways to make 10" },  // the curricular content it practises
  generate: makeTen,                    // returns 6–10 questions (aim for 8)
}
```

Look at `src/content/grades/g2/*.ts` for complete working examples (generated maths in `math.ts`; question banks in `science.ts` and `social.ts`).

## Rules

1. **Randomness:** only use the helpers in `src/content/random.ts` (`rand`, `randInt`, `chance`, `pick`, `shuffle`, `sample`, `numberChoice`, `textChoice`). **Never use `Math.random`.** The site renders repeatable sample questions with a seed.
2. **Difficulty:** `generate({ difficulty })` gets 1 (easier), 2 (on grade level) or 3 (stretch). Use it, for example with smaller or larger number ranges, or easier or harder bank items. It's optional, but the adaptive mode works better when units use it.
3. **Fair questions:** the answer must be one of the choices, no two choices may look the same, and the maths must be right. Distractors should be plausible, never silly-wrong in a way that teaches something false.
4. **Hints** explain *how* to get the answer, kindly. They're shown after a miss and again with the answer.
5. **Accuracy:** content must be factually correct and match the grade's curriculum.
6. **Region-neutral by default.** Write "your community", "Canada" or "a city" rather than naming BC places, unless the content is genuinely about the region (e.g. a BC salmon life cycle). Content is shared across provinces later; the `standards` and `bigIdeas` maps carry the region-specific part.
7. **Canadian spelling:** colour, centre, neighbour, metre, favourite.
8. **Indigenous content:** respectful, factual and general. Don't describe sacred or ceremonial practices, and don't generalize one Nation's practice to all First Peoples. Prefer "Indigenous peoples", "First Nations, Métis and Inuit", "local First Peoples".
9. **Inclusive and kind:** diverse names (Maya, Jay, Sam, Amir, Lena, Kenji, Zoe, Ravi, Ana, Noah, Priya, Leo), no scary or violent scenarios, no brand names.
10. **Emoji:** use widely supported emoji (Unicode 13 or older). No flags, which don't render on Windows.

## Question kinds

| kind | use for | notes |
|---|---|---|
| `choice` | most questions | 2–4 choices for K–1, up to 5 for older grades. Use `emoji` on choices for pictures, `shape` for shapes, `coin` for money. |
| `build` | place value with blocks | tens/ones up to 99; set `hundreds: true` for up to 999 |
| `coins` | make an amount with coins | `coins: [5, 10, 25]` etc. (cents) |
| `order` | sequencing (3–6 items) | list `items` in the correct order |
| `sort` | sort into 2–3 baskets | ≤ 8 items; `sortQuestion()` from `bank.ts` helps |
| `input` | type a number on a keypad | Not for Kindergarten. `keypad`: `number`, `integer`, `decimal` or `fraction`. Put equivalent answers in `accept`. |

## Visuals (`visual` on any question)

`equation` (☐ draws a blank box), `emoji` (+ caption), `emojiRow` (patterns, optional "?"), `dots` (objects to count, ≤ 30), `blocks` (base ten, optional hundreds), `coins` (cents: 5, 10, 25, 100, 200, 500, 1000, 2000, 5000), `ruler`, `pictograph`, `bars` (bar graph), `table`, `shape`, `spinner`, `towers`, `story` (one line per sentence), `passage` (title + paragraphs), `tenFrame`, `clock` (hour 1–12, minute), `numberLine` (min, max, step, optional `blankAt`, `jumps`), `fraction` (bar or circle), `array` (rows × cols), `letter` (big letter or word card), `grid` (coordinate points), `angle` (degrees).

## Writing for Kindergarten and Grade 1

Young children hear prompts read aloud and many can't read yet.

- **Prompts ≤ 80 characters** (enforced by the test suite) and very simple: "How many 🍎?", "Which one starts with b?", "Tap the circle".
- **Picture first:** give choices an `emoji` and a short `label`. For K prefer 3 choices.
- Use `speak` when the spoken version should differ from the text, e.g. letter sounds: `prompt: "Which one starts with b?"`, `speak: "Which picture starts with the sound buh?"`. Choices can also have `speak`.
- **Hints:** one short, warm sentence ("Count each apple. Touch them as you go!").
- No `input` questions in Kindergarten. In Grade 1, use them sparingly (keypad `number`).
- Keep numbers within the grade (K: to 10; Grade 1: to 20).

## Writing for Grades 5–7

Older students like being treated as capable: a clear, direct tone, real-world contexts, multi-step problems, `input` questions, passages and data tables. Avoid babyish wording.

## Testing

```bash
npx vitest run src/content -t "1/math"      # one course
npx vitest run src/content                  # everything
```

The tests generate every unit 120 times at each difficulty and check structure, fairness and maths. They must pass.

## French (Immersion and Core French)

`immersion` and `core-french` use the helpers in `src/content/french.ts`: write a bank of `FrItem` tuples `[prompt, right, wrong[], hint, visual?]` and call `frQuestions(bank, opts, 8, { lang: "fr" })`. Easier levels show fewer wrong answers.

- **Immersion** prompts are in French and must set `lang: "fr"` (the helpers do it) so read-aloud uses a French voice. Hints are in English.
- **Core French** prompts are in English, with French answers. Don't set `lang`.
- Keep wrong answers clearly wrong: for rhymes, group words in families (`familyQuestions`), and check that no distractor shares the sound or pattern being tested.
- Use Canadian French where it differs (e.g. “tuque”, “soccer”) and Canadian English in hints.
- Check Big Ideas and content against curriculum.gov.bc.ca before adding a grade.

## Every province and state

Content is never written for one place only. Before you finish a content change, check each framework in `src/content/frameworks.ts`:

- A new unit, subject or grade has its Ontario (and any other framework's) counterpart, or the PR says which is missing and why. Where a unit truly fits more than one province, share it with `Course.shares` rather than copying it.
- A change to a grade (units, French, wording, scoring) is checked in that grade for every framework.
- Parent guide copy, the French guide and the grade notes exist for every framework and every grade from Kindergarten to Grade 9.
- Each place follows its own official curriculum and uses Canadian spelling.
- New public pages end with a call to action (`<SitePage cta>`).

`npm test` runs `src/content/coverage.test.ts`, which fails when a framework is missing a grade, a core subject, Big Ideas, French in a grade its province teaches, or a public page's call to action.
