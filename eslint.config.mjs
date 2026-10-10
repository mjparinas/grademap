import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The apps load each grade's lessons on demand (src/content/index.ts). Importing
    // every grade at once is only for statically generated pages and tests.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/app/**", "src/components/site/**", "src/content/all.ts", "**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/content/all", "./all", "**/content/grades/*", "./grades/*"],
              message: "Client code must load grades on demand via @/content (loadGrade / useGradeContent), not import them statically.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    "**/.next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Piper's speech engine, copied from node_modules by scripts/fetch-piper.mjs.
    "public/piper/**",
  ]),
]);

export default eslintConfig;
