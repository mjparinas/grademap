// Runs after `next build`: gives every prerendered page a Content-Security-Policy <meta> tag
// that allows exactly its own inline scripts and styles by hash. See src/lib/csp.mjs.
import fs from "node:fs";
import path from "node:path";
import { addPolicyMeta } from "../src/lib/csp.mjs";

const roots = [".next/server/app", ".next/server/pages"].filter((d) => fs.existsSync(d));

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

let count = 0;
for (const root of roots) {
  for (const file of htmlFiles(root)) {
    fs.writeFileSync(file, addPolicyMeta(fs.readFileSync(file, "utf8")));
    count++;
  }
}
if (!count) throw new Error("csp-postbuild: found no prerendered pages. Did `next build` run?");
console.log(`csp-postbuild: wrote a Content-Security-Policy tag into ${count} pages`);
