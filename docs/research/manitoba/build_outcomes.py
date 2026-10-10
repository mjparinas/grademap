#!/usr/bin/env python3
"""Builds outcomes.json and ../../../src/content/manitoba/overall.ts from the cache made by fetch.sh.

Usage: python3 build_outcomes.py /path/to/cache
outcomes.json: {"<grade>/<subject>": [{"idx", "kind", "content"}]} where subject is
math, language, science, social or core-french, and idx is the official outcome code
(for example 5.N.1, ELA.5.B2.3, SCI.5.E.3, 5-KH-040). Core French has no codes, so its
entries are the four strands.
"""
import html, json, re, sys
from pathlib import Path

cache = Path(sys.argv[1])
here = Path(__file__).resolve().parent
GRADES = ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"]


def page_text(path):
    t = Path(path).read_text(encoding="utf8", errors="replace")
    s = re.sub(r"<script.*?</script>|<style.*?</style>", "", t, flags=re.S)
    s = re.sub(r"<[^>]+>", "\n", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t\xa0]+", " ", s)
    return re.sub(r"\n\s*\n+", "\n", s)


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


GLO_TITLES = {
    "A1": "Oral Language Communication",
    "A2": "Language as the Foundation for Reading and Writing",
    "B1": "Acquire New Information",
    "B2": "Construct Meaning",
    "B3": "Think Critically about Multimodal Text and Respond",
    "C1": "Generate Ideas, Create Plan and Draft/Prototype",
    "C2": "Enhance the Clarity and Artistry of Multimodal Texts",
    "C3": "Edit and Publish",
    "D1": "Share Ideas and Information",
    "D2": "Assess and Set Goals",
}
out, heads = {}, {}


def add(key, idx, text, kind="specific"):
    out.setdefault(key, []).append({"idx": idx, "kind": kind, "content": clean(text)})


def head(key, text):
    if text not in heads.setdefault(key, []):
        heads[key].append(clean(text))


# Mathematics (Western and Northern Canadian Protocol outcomes).
for g in GRADES:
    s = page_text(cache / f"html/math_{g}.html")
    s = s[s.find("Collapse All"):]
    strand = ""
    lines = s.split("\n")
    for n, line in enumerate(lines):
        if re.fullmatch(r" ?(Number|Patterns and Relations[^\n]*|Shape and Space[^\n]*|Statistics and Probability[^\n]*) ?", line):
            strand = re.sub(r"\s*\(.*\)", "", line).strip()
        if line.startswith("General Learning Outcome") and n + 1 < len(lines):
            glo = lines[n + 1].strip() if line.strip().endswith(":") else line.split(":", 1)[1].strip()
            head(f"{g}/math", f"{strand}: {glo}")
    parts = re.split(r"\n(%s\.[A-Z]+\.\d+)\.\n" % re.escape("K" if g == "k" else g), s)
    for i in range(1, len(parts), 2):
        body = re.split(r"\n (?:Number|Patterns|Shape|Statistics)", parts[i + 1].split("\n General Learning Outcome")[0])[0]
        add(f"{g}/math", parts[i], re.sub(r"\[[A-Z, ]+\]", "", body))

# Science (strands A to E; the Scientific Knowledge strand, E, holds the content outcomes).
for g in GRADES:
    s = page_text(cache / f"html/science_{g}.html")
    m = re.search(r"Inquiry questions[^\n]*\n(.*?)\nPlease see documents", s, flags=re.S)
    for q in re.findall(r"[^\n]+\?", m.group(1)) if m else []:
        head(f"{g}/science", q)
    for idx, body in re.findall(r"\n(SCI\.%s\.[A-Z]\.\d+[a-z]?)\s*\n(.*?)(?=\nSCI\.|\n Strand|\nCurriculum Implementation)" % re.escape("K" if g == "k" else g), s, flags=re.S):
        add(f"{g}/science", idx, body)

# Social studies: clusters are the headings; outcomes carry their own codes (Kindergarten is grade 0).
for g in GRADES:
    s = page_text(cache / f"html/social_{g}.html")
    t = re.search(r"\n(Grade \d+ Social Studies[^\n]*|Kindergarten Social Studies[^\n]*)", s)
    if t:
        head(f"{g}/social", t.group(1))
    for c in re.findall(r"\n (Cluster \d[^\n]*)", s):
        head(f"{g}/social", c)
    for m in re.finditer(r"\n(%s-[A-Z]{1,3}-\d{3}[AF]?)\s+([^\n]+)" % ("0" if g == "k" else g), s):
        add(f"{g}/social", m.group(1), m.group(2))

# English Language Arts: Kindergarten to Grade 8 from the curriculum PDFs, Grade 9 from the web page.
for g in GRADES[:-1]:
    t = re.sub(r"DRAFT[^\n]*\n", "", (cache / f"ela/grade_{g}.txt").read_text(encoding="utf8"))
    pat = re.compile(r"^\s*(ELA\.%s\.[A-Z]\d+(?:\.\d+)?)\s+(.*(?:\n(?!\s*ELA\.)(?!\s*$).*)*)" % ("K" if g == "k" else g), re.M)
    for m in pat.finditer(t):
        idx, body = m.group(1), m.group(2)
        if re.fullmatch(r"ELA\.[K\d]\.[A-D]\d", idx):
            title, _, rest = body.partition("\n")
            head(f"{g}/language", f"{idx.split('.')[-1]} {clean(title)}: {clean(rest)}")
        else:
            add(f"{g}/language", idx, body)
s = page_text(cache / "html/ela_9.html")
parts = re.split(r"\n(ELA\.9\.[A-Z]\d+(?:\.\d+)?)\n", s)
for i in range(1, len(parts), 2):
    idx, body = parts[i], parts[i + 1].split("\n Strand")[0].split("\nListen and")[0].split("\nInteracting")[0]
    if re.fullmatch(r"ELA\.9\.[A-D]\d", idx):
        code = idx.split(".")[-1]
        head("9/language", f"{code} {clean(body.split(chr(10))[0])}")
    else:
        add("9/language", idx, body)

# Core French (French: Communication and Culture, Grades 4 to 12): four strands, no outcome codes.
for g in GRADES[4:]:
    s = page_text(cache / f"html/core-french_{g}.html")
    for name in ["Oral Communication", "Reading", "Writing", "Culture"]:
        m = re.search(r"\n%s / \n(.*?)(?=\nLes résultats d'apprentissage généraux)" % name, s, flags=re.S)
        text = clean(m.group(1).replace("General Learning Outcomes", "")) if m else ""
        add(f"{g}/core-french", name, text, "strand")
        head(f"{g}/core-french", f"{name}: {text}")

(here / "outcomes.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf8")
(here / "headings.json").write_text(json.dumps(heads, indent=1, ensure_ascii=False) + "\n", encoding="utf8")
print({k: len(v) for k, v in sorted(out.items())})

# The strand headings the course pages show parents ("learning focus"), as a TypeScript module.
ts = Path(here, "../../../src/content/manitoba/overall.ts")
ts.parent.mkdir(parents=True, exist_ok=True)
lines = [
    "// Generated by docs/research/manitoba/build_outcomes.py from the Manitoba curriculum pages. Do not edit by hand.",
    "// Each list is what a course page shows parents as its learning focus: general learning outcomes for math",
    "// and English language arts, inquiry questions for science, clusters for social studies and strands for Core French.",
    "",
    "export const OVERALL: Record<string, string[]> = {",
]
for key in sorted(heads, key=lambda k: (GRADES.index(k.split("/")[0]), k.split("/")[1])):
    lines.append(f"  {json.dumps(key)}: [")
    lines += [f"    {json.dumps(h, ensure_ascii=False)}," for h in heads[key]]
    lines.append("  ],")
lines += ["};", "", "/** The learning focus for one course; throws when a course has none, so a missing one fails loudly. */", "export function overall(grade: string, subject: string): string[] {", "  const list = OVERALL[`${grade}/${subject}`];", "  if (!list?.length) throw new Error(`No Manitoba learning focus for ${grade}/${subject}`);", "  return list;", "}", ""]
ts.write_text("\n".join(lines), encoding="utf8")
