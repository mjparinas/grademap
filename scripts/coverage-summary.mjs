// Turns coverage/coverage-summary.json into a short Markdown table: overall, without lesson
// content (which the content tests cover almost completely), and by area.
// In CI it is appended to the run's summary page; locally it prints to the terminal.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { relative, sep } from "node:path";

const summary = JSON.parse(readFileSync("coverage/coverage-summary.json", "utf8"));
const src = `${process.cwd()}${sep}src${sep}`;

const areas = new Map();
const add = (name, lines) => {
  const a = areas.get(name) ?? { covered: 0, total: 0 };
  a.covered += lines.covered;
  a.total += lines.total;
  areas.set(name, a);
};

for (const [file, data] of Object.entries(summary)) {
  if (file === "total") continue;
  const parts = relative(src, file).split(sep);
  // Components get one row per folder; everything else one row per top-level folder.
  add(parts[0] === "components" && parts.length > 2 ? `components/${parts[1]}` : parts[0] === "components" ? "components (shared)" : parts.length === 1 ? "root files" : parts[0], data.lines);
}

const pct = (c, t) => (t ? `${((100 * c) / t).toFixed(1)}%` : "n/a");
const all = summary.total;
const content = areas.get("content") ?? { covered: 0, total: 0 };
const rows = [...areas].sort(([a], [b]) => a.localeCompare(b));

const out = [
  "## Test coverage (unit and component tests)",
  "",
  `Lines **${all.lines.pct}%**, statements ${all.statements.pct}%, branches ${all.branches.pct}%, functions ${all.functions.pct}%.`,
  `Lines without lesson content: **${pct(all.lines.covered - content.covered, all.lines.total - content.total)}**.`,
  "",
  "| Area | Lines covered | |",
  "| --- | ---: | ---: |",
  ...rows.map(([name, a]) => `| ${name} | ${pct(a.covered, a.total)} | ${a.covered}/${a.total} |`),
  "",
  "End-to-end browser scripts are not counted.",
  "",
].join("\n");

writeFileSync("coverage/summary.md", out);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, out);
else console.log(out);
