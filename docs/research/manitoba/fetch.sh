#!/usr/bin/env bash
# Downloads the official Manitoba curriculum pages used by build-outcomes.py into a cache folder.
# Usage: ./fetch.sh /path/to/cache   (needs curl and pdftotext)
set -euo pipefail
OUT="${1:?cache folder}"
mkdir -p "$OUT/html" "$OUT/ela" "$OUT/report-card"
B=https://www.edu.gov.mb.ca/k12
for g in k 1 2 3 4 5 6 7 8 9; do
  m="$B/framework/english/math/math_$g.html"; [ "$g" = 9 ] && m="$B/framework/english/math/grade_9/full.html"
  [ "$g" != k ] && [ "$g" != 9 ] && m="$B/framework/english/math/math_gr$g.html"
  curl -fsSL "$m" -o "$OUT/html/math_$g.html"
  s="$B/framework/english/science/science_gr$g.html"; [ "$g" = k ] && s="$B/framework/english/science/science_k.html"
  curl -fsSL "$s" -o "$OUT/html/science_$g.html"
  s="$B/framework/english/socstud/socstud_gr$g.html"; [ "$g" = k ] && s="$B/framework/english/socstud/socstud_k.html"
  curl -fsSL "$s" -o "$OUT/html/social_$g.html"
done
# English Language Arts: PDFs for Kindergarten to Grade 8, a web page for Grade 9.
for g in k 1 2 3 4 5 6 7 8; do
  curl -fsSL "$B/cur/ela/docs/framework/grade_$g.pdf" -o "$OUT/ela/grade_$g.pdf"
  pdftotext -layout "$OUT/ela/grade_$g.pdf" "$OUT/ela/grade_$g.txt"
done
curl -fsSL "$B/framework/english/ela/ela_gr_9.html" -o "$OUT/html/ela_9.html"
# French: Communication and Culture (Grades 4 to 12).
for g in 4 5 6 7 8 9; do
  curl -fsSL "$B/framework/english/french/french_gr$g.html" -o "$OUT/html/core-french_$g.html"
done
# Report card scale (2026-2027 templates and policy).
curl -fsSL "$B/assess/report_card/docs/provincial_report_card_policy.pdf" -o "$OUT/report-card/policy.pdf"
curl -fsSL "$B/assess/report_card/docs/faq_grades_1_to_8_policy.pdf" -o "$OUT/report-card/faq_1_to_8.pdf"
