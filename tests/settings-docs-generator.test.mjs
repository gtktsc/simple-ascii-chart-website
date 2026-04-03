import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  generateSettingsDocs,
  parseSettingsDescriptions,
  parseSettingsTypeSignatures,
} from "../lib/settingsDocsGenerator.mjs";

const require = createRequire(import.meta.url);
const packageEntry = require.resolve("simple-ascii-chart");
const packageRoot = path.resolve(path.dirname(packageEntry), "..");

const readmeContent = fs.readFileSync(
  path.join(packageRoot, "README.md"),
  "utf8"
);
const dtsContent = fs.readFileSync(
  path.join(packageRoot, "dist/types/index.d.ts"),
  "utf8"
);

test("generateSettingsDocs includes every key from Settings type", () => {
  const signatures = parseSettingsTypeSignatures(dtsContent);
  const docs = generateSettingsDocs({ readmeContent, dtsContent });

  const signatureKeys = signatures.map(({ key }) => key).sort();
  const docKeys = docs.map(({ key }) => key).sort();

  assert.deepEqual(docKeys, signatureKeys);
});

test("generateSettingsDocs fails when README descriptions are missing", () => {
  const incompleteReadme = readmeContent
    .split("\n")
    .filter((line) => !line.includes("`debugMode`"))
    .join("\n");

  assert.throws(
    () => generateSettingsDocs({ readmeContent: incompleteReadme, dtsContent }),
    /Missing README descriptions/
  );
});

test("parseSettingsDescriptions extracts known setting docs", () => {
  const descriptions = parseSettingsDescriptions(readmeContent);

  assert.equal(
    descriptions.hideXAxisTicks,
    "Hide X-axis tick markers and labels."
  );
  assert.equal(
    descriptions.customYAxisTicks,
    "Explicit Y tick values."
  );
});
