#!/usr/bin/env bash
# Downloads the official New Brunswick anglophone curriculum (curriculum.nbed.ca, Department of Education and Early
# Childhood Development) used by build_outcomes.py. Each learning-area page has a "Course Comparison" button; the data behind it
# is a JSON document that the site serves from admin-ajax.php with a per-page security token.
# Usage: ./fetch.sh /path/to/cache   (needs curl and python3)
set -euo pipefail
OUT="${1:?cache folder}"
mkdir -p "$OUT/json"
B=https://curriculum.nbed.ca
TOKEN=$(curl -fsSL "$B/course-comparison/?cid=8238&ctitle=English+Language+Arts&clang=en" | grep -o '"security":"[^"]*"' | head -1 | cut -d'"' -f4)
get() { # name, page path under /learning-areas/
  local cid
  cid=$(curl -fsSL "$B/learning-areas/$2" | grep -o 'course-comparison/?cid=[0-9]*' | head -1 | grep -o '[0-9]*$')
  curl -fsSL -X POST "$B/wp-admin/admin-ajax.php" -d "action=course_comparison_builder&security=$TOKEN&cid=$cid&strip_tags=1&expand_shortcodes=1" -o "$OUT/json/$1.json"
  echo "$1 cid=$cid"
}
get ela_k2 primary-block/english-language-arts/
get eyw_k2 primary-block/explore-your-world/
get ela_35 elementary-block/english-language-arts/
get sci_35 elementary-block/science/
get soc_35 elementary-block/social-studies/
get ela_68 middle-block/english-language-arts/
get math_68 middle-block/mathematics/
get sci_68 middle-block/science/
get soc_68 middle-block/social-studies/
get ela_9 high-school-block/language-arts-and-languages/english-language-arts-9/
get math_9 high-school-block/mathematics/mathematics-9/
get sci_9 high-school-block/science/science-9/
get soc_9 high-school-block/humanities/social-studies-9/
get fila_12 primary-block/french-second-language/french-immersion-language-arts/
get fila_35 elementary-block/french-second-language/french-immersion-language-arts/
get fila_68 middle-block/french-second-language/french-immersion-language-arts/
get fila_9 high-school-block/language-arts-and-languages/french-second-language/french-immersion-language-arts-9-12/
get intensive_45 elementary-block/french-second-language/intensive-french/
get postint_68 middle-block/french-second-language/post-intensive-french/
get fsl_9 high-school-block/language-arts-and-languages/french-second-language/french-second-language-9/
