// Puts the Piper read-aloud files in public/piper/{version}/ so the site serves them itself:
// the speech engine is copied from node_modules, and the voices are downloaded from a pinned
// commit of rhasspy/piper-voices and checked by sha256. Files already in place are kept, so
// it only downloads once. Runs before `next dev` and `next build` (see package.json).
//
//   node scripts/fetch-piper.mjs             fails if a voice can't be downloaded
//   node scripts/fetch-piper.mjs --optional  warns instead (for `npm run dev` offline)
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/piper-manifest.json"), "utf8"));
const OUT = path.join(ROOT, "public/piper", manifest.version);
const optional = process.argv.includes("--optional");

const sha256 = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");

fs.mkdirSync(OUT, { recursive: true });
for (const old of fs.readdirSync(path.dirname(OUT))) {
  if (old !== manifest.version) fs.rmSync(path.join(path.dirname(OUT), old), { recursive: true, force: true });
}

const list = { version: manifest.version, engine: {}, voices: {} };

for (const [name, from] of Object.entries(manifest.engine)) {
  const dest = path.join(OUT, name);
  fs.copyFileSync(path.join(ROOT, "node_modules", from), dest);
  list.engine[name] = fs.statSync(dest).size;
}

let failed = false;
for (const [lang, voice] of Object.entries(manifest.voices)) {
  list.voices[lang] = {};
  for (const [name, hash] of Object.entries(voice.files)) {
    const dest = path.join(OUT, name);
    if (!(fs.existsSync(dest) && sha256(dest) === hash)) {
      try {
        const res = await fetch(manifest.voiceSource + voice.path + name);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bytes = Buffer.from(await res.arrayBuffer());
        const got = createHash("sha256").update(bytes).digest("hex");
        if (got !== hash) throw new Error(`sha256 ${got}, expected ${hash}`);
        fs.writeFileSync(dest, bytes);
        console.log(`fetch-piper: downloaded ${name} (${(bytes.length / 1e6).toFixed(1)} MB)`);
      } catch (e) {
        console.error(`fetch-piper: could not download ${name}: ${e instanceof Error ? e.message : e}`);
        failed = true;
        continue;
      }
    }
    list.voices[lang][name] = fs.statSync(dest).size;
  }
}

if (failed) {
  // Without a complete list the app reports the voice as unavailable instead of half-downloading it.
  fs.rmSync(path.join(OUT, "files.json"), { force: true });
  if (optional) {
    console.warn("fetch-piper: the natural voice won't be available until this succeeds");
    process.exit(0);
  }
  process.exit(1);
}
fs.writeFileSync(path.join(OUT, "files.json"), JSON.stringify(list));
console.log(`fetch-piper: public/piper/${manifest.version} is ready`);
