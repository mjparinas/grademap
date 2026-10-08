import { formatMoney } from "@/content/money";
import { hashSeed, shuffle, withSeed } from "@/content/random";
import type { Question } from "@/content/types";
import { Blocks, Coin, QuestionVisual, Shape, WithBlanks } from "../visuals";

// A static, read-only preview of a question for the public curriculum pages,
// with the answer tucked into a <details>. The real, interactive version lives in /play/.

function answerText(q: Question): string {
  switch (q.kind) {
    case "choice": {
      const c = q.choices.find((x) => x.id === q.answer);
      return c ? [c.emoji, c.label].filter(Boolean).join(" ") : q.answer;
    }
    case "build":
      return `${q.target}`;
    case "coins":
      return formatMoney(q.target);
    case "order":
      return q.items.map((i) => i.label).join(" → ");
    case "sort":
      return q.bins.map((b) => `${b.emoji} ${b.label}: ${q.items.filter((i) => i.bin === b.id).map((i) => i.label).join(", ")}`).join(" · ");
    case "input":
      return `${q.answer}${q.suffix ? ` ${q.suffix}` : ""}`;
  }
}

const chip = "inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-line bg-white px-3 py-1.5 font-read text-lg";

function Body({ q, seed }: { q: Question; seed: number }) {
  switch (q.kind) {
    case "choice":
      return (
        <ul className="flex flex-wrap gap-2" aria-label="Choices">
          {q.choices.map((c) => (
            <li key={c.id} className={chip}>
              {c.emoji && <span className="text-2xl">{c.emoji}</span>}
              {c.shape && <Shape shape={c.shape} size={44} />}
              {c.coin && <Coin cents={c.coin} scale={0.6} />}
              {!c.coin && <span>{c.label}</span>}
            </li>
          ))}
        </ul>
      );
    case "build":
      return <p className="font-read text-ink-soft">Build it with tens rods{q.hundreds ? ", hundreds flats" : ""} and ones cubes.</p>;
    case "coins":
      return (
        <div className="flex flex-wrap items-center gap-2" aria-label="Coins to choose from">
          {q.coins.map((c, i) => (
            <Coin key={i} cents={c} scale={0.6} />
          ))}
        </div>
      );
    case "order":
      return (
        <ul className="flex flex-wrap gap-2">
          {withSeed(seed, () => shuffle(q.items)).map((i) => (
            <li key={i.id} className={chip}>
              {i.emoji && <span className="text-2xl">{i.emoji}</span>}
              {i.label}
            </li>
          ))}
        </ul>
      );
    case "sort":
      return (
        <div className="flex flex-col gap-2">
          <p className="font-read text-ink-soft">Sort into: {q.bins.map((b) => `${b.emoji} ${b.label}`).join(" · ")}</p>
          <ul className="flex flex-wrap gap-2">
            {q.items.map((i) => (
              <li key={i.id} className={chip}>
                <span className="text-2xl">{i.emoji}</span>
                {i.label}
              </li>
            ))}
          </ul>
        </div>
      );
    case "input":
      return (
        <p className="flex items-center gap-2 font-read text-lg text-ink-soft">
          <span className="inline-block h-11 w-24 rounded-xl border-2 border-dashed border-line bg-white" aria-label="answer box" />
          {q.suffix}
        </p>
      );
  }
}

export function SampleQuestion({ q, n, seedText }: { q: Question; n: number; seedText: string }) {
  return (
    <li className="card flex flex-col gap-3 p-4 sm:p-5">
      <p className="text-sm font-bold text-ink-soft">Question {n}</p>
      <p className="font-read text-xl font-bold">
        <WithBlanks text={q.prompt} />
      </p>
      {q.visual && (
        <div className="flex justify-center overflow-x-auto rounded-2xl bg-paper p-3">
          <QuestionVisual visual={q.visual} />
        </div>
      )}
      <Body q={q} seed={hashSeed(seedText)} />
      <details className="rounded-xl bg-good-soft px-3 py-2">
        <summary className="cursor-pointer font-semibold text-good-dark">Show answer</summary>
        <p className="mt-1 font-read text-lg font-bold">{answerText(q)}</p>
        {q.kind === "build" && (
          <div className="my-2">
            <Blocks hundreds={Math.floor(q.target / 100)} tens={Math.floor((q.target % 100) / 10)} ones={q.target % 10} size={10} />
          </div>
        )}
        <p className="font-read text-sm text-ink-soft">Hint: {q.hint}</p>
      </details>
    </li>
  );
}
