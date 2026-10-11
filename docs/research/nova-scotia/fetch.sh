#!/usr/bin/env bash
# Downloads the official Nova Scotia outcomes documents (curriculum.novascotia.ca) used by build_outcomes.py.
# Usage: ./fetch.sh /path/to/cache   (needs curl and pdftotext)
set -euo pipefail
OUT="${1:?cache folder}"
mkdir -p "$OUT/pdf" "$OUT/txt"
B=https://curriculum.novascotia.ca/sites/default/files/documents/outcomes-indicators-files
get() { # name, file
  curl -fsSL "$B/$2" -o "$OUT/pdf/$1.pdf"
  pdftotext -layout "$OUT/pdf/$1.pdf" "$OUT/txt/$1.txt"
}
get math_k "Mathematics%20P%20Outcomes%20%282022%29.pdf"
for g in 1 2 3 4 5 6 7 8 9; do get math_$g "Mathematics%20$g%20Outcomes%20%282022%29.pdf"; done
get ela_k "English%20Language%20Arts%20Primary%20At%20A%20Glance%20%282024%29.pdf"
get ela_1 "English%20Language%20Arts%20Grade%201%20At%20A%20Glance%20%282024%29.pdf"
get ela_2 "English%20Language%20Arts%20Grade%202%20At%20A%20Glance%20%282024%29.pdf"
for g in 3 4 5 6; do get ela_$g "English_Language_Arts_Grade_${g}_AAG_%282025%29.pdf"; done
get ela_4to6_indicators "ELA_4to6_Outcomes_and_%20Indicators_%20%282025%29.pdf"
get ela_7 "English%20Language%20Arts%207%20At%20A%20Glance%20%282022%29.pdf"
get ela_8 "English%20Language%20Arts%208%20At%20A%20Glance%20%282022%29.pdf"
get ela_9 "English%20Language%20Arts%209%20Outcomes%20%282022%29.pdf"
get science_k-6 "Science%20P-6%20at%20a%20glance%20%282019%29.pdf"
get science_7 "Science%207%20At%20A%20Glance%20%282022%29.pdf"
get science_8 "Science%208%20At%20A%20Glance%20%282022%29.pdf"
get science_9 "Science%209%20Outcomes%20%282014%29.pdf"
get social_k-6 "Social%20Studies%20P-6%20at%20a%20glance%20%282019%29.pdf"
get social_7 "Social%20Studies%207%20At%20A%20Glance%20%282022%29.pdf"
get social_8 "Social%20Studies%208%20At%20A%20Glance%20%282022%29.pdf"
get social_9 "Citizenship%209%20Outcomes%20%282017%29.pdf"
get core-french_4-6 "Francais%20de%20base%204-6%20at%20a%20glance%20%282019%29.pdf"
get core-french_7-8 "Core%20French%207-8%20Outcomes%20%282022%29.pdf"
get core-french_9 "Core%20French%209%20Outcomes%20%282022%29.pdf"
