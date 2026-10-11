#!/usr/bin/env python3
"""Builds outcomes.json from the Nova Scotia documents downloaded by fetch.sh.

Usage: python3 -I build_outcomes.py /path/to/cache > outcomes.json

Output: {"<grade>/<subject>": [{"idx": <citation label>, "kind": ..., "content": <official wording>}]}
`idx` is what a unit's standard cites (src/content/nova-scotia/kit.ts, checked by content.test.ts).

- Mathematics: the outcome codes (N01, PR02, SS01 ...) with the official wording.
- English language arts K to 6: the nine strand outcomes (A1 to C3, and D1 from Grade 3).
- Science and social studies K to 8: the headline outcome of each learning bundle. Science is cited by its bundle
  title (for example "Physical Science: Light"), social studies by the headline stem.
- English language arts 7 and 8: six headline outcomes with a short label.
- English language arts 9: the numbered specific curriculum outcomes.
- Science 9 (the outcomes PDF is a scan) and Citizenship 9: units and section headings.
- Core French: the three headline outcomes (oral communication, comprehension, writing).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

CACHE = Path(sys.argv[1])
TXT = CACHE / "txt"
GRADES = ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
out: dict[str, list[dict]] = {}


def add(grade, subject, idx, kind, content):
    lst = out.setdefault(f"{grade}/{subject}", [])
    idx = idx.replace("\u200b", "")
    content = content.replace("\u200b", "")
    if any(r["idx"] == idx and r["content"] == re.sub(r"\s+", " ", content).strip() for r in lst):
        return
    lst.append({"idx": idx, "kind": kind, "content": re.sub(r"\s+", " ", content.replace("\u200b", "")).strip()})


def raw_pages(name):
    path = TXT / f"{name}.raw.txt"
    if not path.exists():
        subprocess.run(["pdftotext", str(CACHE / "pdf" / f"{name}.pdf"), str(path)], check=True)
    return path.read_text().split("\f")


# Mathematics ---------------------------------------------------------------------------------------------------
for g in GRADES:
    text = (TXT / f"math_{g}.txt").read_text()
    for m in re.finditer(r"^\s*((?:N|PR|M|G|SS|SP)\d{2}):?\s+Students will be expected to\s+(.*?)(?=\n\s*\n|\n\s*Performance Indicators)", text, re.S | re.M):
        add(g, "math", m.group(1), "specific", m.group(2))

# English language arts K to 6 ----------------------------------------------------------------------------------
for g in ["k", "1", "2", "3", "4", "5", "6"]:
    for page in raw_pages(f"ela_{g}"):
        m = re.search(r"(Learners will[\s\S]{0,400}?)\n\s*([A-D]\d): ([^\n]+)", page)
        if not m:
            continue
        statement = re.split(r"\.\s", re.sub(r"\s+", " ", m.group(1)))[0].rstrip(".") + "."
        add(g, "language", m.group(2), "strand", f"{m.group(3)}: {statement}")

# English language arts 7 and 8 (six headline outcomes) ---------------------------------------------------------
ELA78 = [
    ("Cultural expressions", r"Learners will reflect on how the cultures"),
    ("Responses", r"Learners will plan oral, written, and visual personal and critical responses"),
    ("Creating", r"Learners will create oral, written, and visual communication forms"),
    ("Speaking and writing strategies", r"Learners will implement speaking and writing strategies"),
    ("Comprehending", r"Learners will comprehend a range of communication forms"),
    ("Accuracy and bias", r"Learners will analyse the accuracy, reliability, validity"),
]
for g in ["7", "8"]:
    pages = re.sub(r"\s+", " ", " ".join(raw_pages(f"ela_{g}")))
    for label, pat in ELA78:
        m = re.search(f"({pat}[^.]*\\.)", pages)
        if m:
            add(g, "language", label, "headline", m.group(1))

# English language arts 9: numbered specific outcomes -----------------------------------------------------------
text = (TXT / "ela_9.txt").read_text()
text = text[text.index("Specific Curriculum Outcomes"):]
starts = list(re.finditer(r"^\s+(\d{1,2}\.\d)\s{2,}", text, re.M))
for n, m in enumerate(starts):
    body = text[m.end() : starts[n + 1].start() if n + 1 < len(starts) else len(text)]
    body = re.split(r"\n\s*\n|\n\s+-", body)[0]
    add("9", "language", m.group(1), "specific", body)

# Science and social studies ------------------------------------------------------------------------------------
def stem(headline):
    s = re.sub(r"^Learners will\s+", "", headline).rstrip(".")
    s = re.sub(r",?\s+(?:including|inclusive of|with a focus on)\s+.*?(?=,?\s+(?:have|through)\s|$)", "", s)
    s = re.sub(r",\s+(have|through)\b", r" \1", s)
    return s[0].upper() + s[1:]


def headlines(name, label_re=None):
    """(page index, headline, label) for each page that opens a learning bundle."""
    found = []
    for i, page in enumerate(raw_pages(name)):
        m = re.search(r"Learners will [^\n]*(?:\n(?!\n)[^\n]*)*", page)
        if not m:
            continue
        block = re.sub(r"\s+", " ", m.group(0))
        label = None
        if label_re:
            lm = re.search(label_re, block)
            if lm:
                label = lm.group(1).strip()
                block = block[: lm.start()].strip()
        sentence = re.split(r"(?<=[a-z\)])\.\s", block)[0].rstrip(".") + "."
        found.append((i, sentence, label, page))
    return found


SCI_LABEL = r"\.\s((?:Physical|Life|Earth and Space) Science: .*?|Environmental Action|Engineering Structures|Geological Evolution|[A-Z][A-Za-z ]+)(?:\s+Rationale)?$"
for subject, name, label_re in [("science", "science_k-6", SCI_LABEL), ("social", "social_k-6", None)]:
    for i, sentence, label, page in headlines(name, None):
        if "Learners will see the context" in sentence:
            continue
        g_m = re.search(r"(?:Science|Social Studies) (Primary|Grade (\d))", page)
        if not g_m:
            continue
        grade = "k" if g_m.group(1) == "Primary" else g_m.group(2)
        full = re.search(r"(Learners will [^\n]*(?:\n(?!\n)[^\n]*)*)", page).group(1)
        full = re.sub(r"\s+", " ", full)
        if subject == "science":
            lm = re.search(r"\.\s+((?:Physical|Life|Earth and Space) Science: .*?)\s*$", full)
            # The bundle title can wrap onto a second line (for example "Materials and the world around us").
            title = lm.group(1) if lm else None
            headline = full[: lm.start() + 1] if lm else sentence
            add(grade, subject, title or stem(headline), "bundle", headline)
        else:
            headline = re.split(r"(?<=[a-z\)])\.\s", full)[0].rstrip(".") + "."
            add(grade, subject, stem(headline), "bundle", headline)

for subject, g in [("science", "7"), ("science", "8"), ("social", "7"), ("social", "8")]:
    for i, sentence, label, page in headlines(f"{subject}_{g}", None):
        if "see the context" in sentence or "engage with the history" in sentence or "Social Studies helps" in sentence or "mechanical advantage provided by these systems" in sentence:
            continue
        full = re.sub(r"\s+", " ", re.search(r"(Learners will [^\n]*(?:\n(?!\n)[^\n]*)*)", page).group(1))
        lm = re.search(r"\.\s+(Environmental Action|Engineering Structures|Geological Evolution|[A-Z][A-Za-z ,&]+)\s*$", full) if subject == "science" else None
        headline = re.split(r"(?<=[a-z\)])\.\s|\sRationale", full)[0].rstrip(".") + "."
        title = lm.group(1) if lm and len(lm.group(1)) < 50 else None
        add(g, subject, title or stem(headline), "bundle", headline)

# Grade 9 science and Citizenship 9 -----------------------------------------------------------------------------
for unit, text in [
    ("Reproduction", "Students examine the fundamental processes of reproduction, heredity, and the transmission of traits from one generation to the next. Implications of reproductive technologies are also explored."),
    ("Atoms and Elements", "Students use the Periodic Table to explore atoms and molecules, chemical symbols, and common elements and compounds."),
    ("Characteristics of Electricity", "Students explore electrostatics and electric circuits, power consumption, efficiency of appliances, and informed decisions about electricity and energy."),
    ("Space Exploration", "Students explain the origin, evolution, and components of the solar system and the universe, and examine what is needed to live in, develop in and explore space."),
]:
    add("9", "science", unit, "unit", text)

cit = (TXT / "social_9.txt").read_text()
section = None
for block in re.split(r"\n\s*\n", cit):
    lines = [l.strip() for l in block.strip().split("\n") if l.strip()]
    if not lines:
        continue
    SECTIONS = ("Engaged Citizenship", "Who Am I as a Citizen?", "Financial Citizenship", "Digital Citizenship", "Governance", "Global Citizenship")
    if lines[-1] in SECTIONS and not lines[-1].startswith("Learners"):
        section = lines[-1]
        continue
    if len(lines) > 1 and lines[0] in SECTIONS:
        section = lines[0]
        lines = lines[1:]
    if lines[0].startswith("Learners will") and section:
        sentence = []
        for l in lines:
            if l.startswith("Indicators"):
                break
            sentence.append(l)
        add("9", "social", section, "outcome", " ".join(sentence))

# Core French ---------------------------------------------------------------------------------------------------
CORE = [
    ("Oral communication", "Learners will communicate orally in French in a variety of authentic situations."),
    ("Reading", "Learners will determine the meaning of a range of French texts representing a variety of cultures and diverse abilities, in authentic situations."),
    ("Writing", "Learners will create texts in French (including in electronic format) in a variety of authentic situations."),
]
for g in ["4", "5", "6", "7", "8", "9"]:
    for idx, content in CORE:
        add(g, "core-french", idx, "headline", content)

json.dump(out, sys.stdout, ensure_ascii=False, indent=1)

# The learning focus shown as each course's overview (src/content/nova-scotia/overall.ts) --------------------------
if len(sys.argv) > 2:
    STRANDS = {
        "N": "Number: Develop number sense.",
        "PR": "Patterns and Relations: Use patterns to describe the world and solve problems.",
        "M": "Measurement: Use direct and indirect measurement to solve problems.",
        "G": "Geometry: Describe the characteristics of 3-D objects and 2-D shapes, and analyse the relationships among them.",
        "SP": "Statistics and Probability: Collect, display and analyse data to solve problems, and use probability to represent and solve problems involving uncertainty.",
    }
    GCO9 = [
        "Speak and listen to explore, extend, clarify, and reflect on thoughts, ideas, feelings, and experiences.",
        "Communicate information and ideas effectively and clearly, and respond personally and critically.",
        "Interact with sensitivity and respect, considering the situation, audience, and purpose.",
        "Select, read, and view with understanding a range of literature, information, media, and visual texts.",
        "Interpret, select, and combine information using a variety of strategies, resources, and technologies.",
        "Respond personally to a range of texts.",
        "Respond critically to a range of texts, applying understanding of language, form, and genre.",
        "Use writing and other ways of representing to explore, clarify, and reflect on thoughts, feelings, experiences, and learnings, and to use imagination.",
        "Create texts collaboratively and independently, using a variety of forms for a range of audiences and purposes.",
        "Use a range of strategies to develop effective writing and other ways of representing and to enhance clarity, precision, and effectiveness.",
    ]
    overall = {}
    for key, rows in out.items():
        grade, subject = key.split("/")
        if subject == "math":
            seen = []
            for r in rows:
                s = re.match(r"[A-Z]+", r["idx"]).group(0)
                if s not in seen:
                    seen.append(s)
            overall[key] = [STRANDS[s] for s in seen]
        elif key == "9/language":
            overall[key] = GCO9
        elif subject == "language" and grade in ("k", "1", "2", "3", "4", "5", "6"):
            overall[key] = [f"{r['idx']} {r['content']}" for r in rows]
        else:
            overall[key] = [f"{r['idx']}. {r['content']}" if r["idx"] != r["content"] else r["content"] for r in rows]
    lines = [
        "// Generated by docs/research/nova-scotia/build_outcomes.py from the Nova Scotia curriculum documents. Do not edit by hand.",
        "// Each list is what a course page shows parents as its learning focus: strands for math, the strand outcomes for",
        "// English language arts, the learning bundles for science and social studies and the headline outcomes for Core French.",
        "",
        "export const OVERALL: Record<string, string[]> = {",
    ]
    for key in sorted(overall, key=lambda k: (GRADES.index(k.split("/")[0]), k.split("/")[1])):
        lines.append(f"  {json.dumps(key)}: [")
        lines += [f"    {json.dumps(s, ensure_ascii=False)}," for s in overall[key]]
        lines.append("  ],")
    lines.append("};")
    lines += [
        "",
        "/** The learning focus for one course; throws when a course has none, so a missing one fails loudly. */",
        "export function overall(grade: string, subject: string): string[] {",
        "  const list = OVERALL[`${grade}/${subject}`];",
        '  if (!list?.length) throw new Error(`No Nova Scotia learning focus for ${grade}/${subject}`);',
        "  return list;",
        "}",
    ]
    Path(sys.argv[2]).write_text("\n".join(lines) + "\n")
