#!/usr/bin/env python3 -I
"""Builds outcomes.json and overall.ts from the course documents fetched by fetch.sh.

Usage: python3 -I build_outcomes.py <cache> <overall.ts out> > outcomes.json

Each entry is one big idea of one strand, for one grade, where the grade has at least one skill descriptor:
  { "idx": "Reading: Phonics", "strand": "Reading", "bigIdea": "Phonics", "skills": ["Apply letter-sound knowledge ..."] }
Units cite `idx`. Mathematics for Kindergarten to Grade 5 has no public machine-readable document (the department
publishes it as a PDF on a signed-in SharePoint), so those grades reuse the strands and big ideas of the Grades 6 to 9
mathematics course; the learning focus comes from the general outcomes of the department's earlier guides.
"""
import html
import json
import re
import sys
from pathlib import Path

CACHE = Path(sys.argv[1])
OVERALL_OUT = Path(sys.argv[2])

SMALL = {"and", "of", "the", "to", "in", "for", "on", "a"}


def clean(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = html.unescape(text).replace("\xa0", " ")
    return re.sub(r"\s+", " ", text).strip()


def title(text: str) -> str:
    text = clean(text)
    if text.isupper():
        words = text.lower().split(" ")
        return " ".join(w if (i and w in SMALL) else w.capitalize() for i, w in enumerate(words))
    return text


def load(name: str):
    return json.loads((CACHE / "json" / f"{name}.json").read_text())


def skills_by_grade(doc, grade_labels):
    """-> {grade label: [(idx, strand, big idea, [skills])]}"""
    out = {g: [] for g in grade_labels}
    for strand in doc["strands"]:
        st = title(strand["title"])
        for big in strand["bigideas"]:
            bi = title(big["title"])
            for gi, g in enumerate(doc["grades"]):
                found = []
                for row in big["items"]:
                    if isinstance(row, dict):
                        row = [row]
                    if gi < len(row) and isinstance(row[gi], dict):
                        s = clean(row[gi].get("skill", ""))
                        if s and not s.lower().startswith("no skill descriptor") and s not in found:
                            found.append(s)
                if found:
                    out[g].append((f"{st}: {bi}", st, bi, found))
    return out


GRADE_IDS = {"KINDERGARTEN": ["k"], "K-2": ["k", "1", "2"], "9-10": ["9"]}


def ids(label: str):
    return GRADE_IDS.get(label, [label])


# (file, subject(s)) -> every grade label in the file maps to grade ids
SOURCES = [
    ("ela_k2", ["language"]),
    ("ela_35", ["language"]),
    ("ela_68", ["language"]),
    ("ela_9", ["language"]),
    ("eyw_k2", ["science", "social"]),
    ("sci_35", ["science"]),
    ("sci_68", ["science"]),
    ("sci_9", ["science"]),
    ("soc_35", ["social"]),
    ("soc_68", ["social"]),
    ("soc_9", ["social"]),
    ("math_68", ["math"]),
    ("math_9", ["math"]),
    ("fila_12", ["immersion"]),
    ("fila_35", ["immersion"]),
    ("fila_68", ["immersion"]),
    ("fila_9", ["immersion"]),
    ("intensive_45", ["core-french"]),
    ("postint_68", ["core-french"]),
    ("fsl_9", ["core-french"]),
]

# General outcomes of the earlier Kindergarten to Grade 5 mathematics guides (the strands carry over to the current course).
MATH_GENERAL = {
    "Number: Number Sense": "Develop number sense.",
    "Number: Operations": "Develop number sense.",
    "Patterns and Relations: Algebra": "Use patterns to describe the world and solve problems.",
    "Shape and Space: Measurement": "Use direct and indirect measurement to solve problems.",
    "Shape and Space: 2-D Shapes and 3-D Objects": "Describe the characteristics of 3-D objects and 2-D shapes, and analyze the relationships among them.",
    "Statistics and Probability: Data Analysis": "Collect, display and analyze data to solve problems.",
    "Statistics and Probability: Chance and Uncertainty": "Use experimental or theoretical probabilities to represent and solve problems involving uncertainty.",
}

outcomes: dict[str, list[dict]] = {}
focus: dict[str, str] = {}  # "grade/subject" -> the grade's science topic

for name, subjects in SOURCES:
    doc = load(name)
    per = skills_by_grade(doc, doc["grades"])
    for label, entries in per.items():
        for g in ids(label):
            for subject in subjects:
                outcomes[f"{g}/{subject}"] = [{"idx": i, "strand": s, "bigIdea": b, "skills": sk} for i, s, b, sk in entries]
    if name.startswith("sci_"):
        for c in doc["contextAndConcept"]:
            for item in c["items"]:
                m = re.match(r"GRADE (\d): (.*)", clean(item["p"]), re.I)
                if m:
                    focus[f"{m.group(1)}/science"] = title(m.group(2))
    if name == "sci_9":
        focus["9/science"] = "Synthesis of the Grades 3 to 8 science topics: Earth and its place in the universe; ecosystems; molecules to organisms; biological evolution"
    # Grades 1 and 2 immersion also appear in the Grades 3 to 5 file as separate courses; nothing to merge.

# Kindergarten to Grade 5 mathematics: the Grade 6 strands, with the general outcome as the description.
for g in ["k", "1", "2", "3", "4", "5"]:
    outcomes[f"{g}/math"] = [
        {"idx": e["idx"], "strand": e["strand"], "bigIdea": e["bigIdea"], "skills": [MATH_GENERAL[e["idx"]]], "provisional": True}
        for e in outcomes["6/math"]
    ]

print(json.dumps(dict(sorted(outcomes.items())), indent=1, ensure_ascii=False))


def js(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


lines = [
    "// Generated by docs/research/new-brunswick/build_outcomes.py from the New Brunswick curriculum documents. Do not edit by hand.",
    "// Each list is what a course page shows parents as its learning focus: one line per big idea, with its first skill descriptor.",
    "",
    "export const OVERALL: Record<string, string[]> = {",
]
for key in sorted(outcomes, key=lambda k: (("k123456789".index(k.split("/")[0]) if k.split("/")[0] != "k" else -1), k)):
    rows = []
    if key in focus:
        rows.append(f"Grade focus: {focus[key]}.")
    for e in outcomes[key]:
        rows.append(f"{e['idx']}. {e['skills'][0]}")
    lines.append(f"  {js(key)}: [")
    for r in rows:
        lines.append(f"    {js(r)},")
    lines.append("  ],")
lines.append("};")
lines.append("")
lines.append("/** The learning focus for one course; throws when a course has none, so a missing one fails loudly. */")
lines.append("export function overall(grade: string, subject: string): string[] {")
lines.append("  const list = OVERALL[`${grade}/${subject}`];")
lines.append("  if (!list?.length) throw new Error(`No New Brunswick learning focus for ${grade}/${subject}`);")
lines.append("  return list;")
lines.append("}")
OVERALL_OUT.write_text("\n".join(lines) + "\n")
