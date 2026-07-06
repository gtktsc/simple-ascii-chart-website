import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import messages from "../messages/en.json" with { type: "json" };
import { createRequire } from "node:module";
import {
  generateSettingsDocs,
  generateSettingsMessages,
  parseExportedTypeDefinitions,
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

test("generateSettingsDocs keeps locale copy out of generated machine data", () => {
  const [doc] = generateSettingsDocs({ readmeContent, dtsContent });

  assert.equal("title" in doc, false);
  assert.equal("description" in doc, false);
});

test("parseExportedTypeDefinitions extracts custom type aliases", () => {
  const definitions = parseExportedTypeDefinitions(dtsContent);

  assert.equal(definitions.Colors, "Color | Color[] | ColorGetter");
  assert.match(definitions.Legend, /position\?: 'left' \| 'right'/);
  assert.match(definitions.Legend, /series\?: string \| string\[\]/);
  assert.match(definitions.Threshold, /y\?: number/);
});

test("generateSettingsDocs includes custom type definitions for settings", () => {
  const docs = generateSettingsDocs({ readmeContent, dtsContent });
  const docsByKey = new Map(docs.map((doc) => [doc.key, doc]));

  assert.deepEqual(docsByKey.get("width").typeDefinitions, []);
  assert.deepEqual(docsByKey.get("color").typeDefinitions, [
    {
      name: "Colors",
      signature: "Color | Color[] | ColorGetter",
    },
  ]);
  assert.deepEqual(
    docsByKey.get("lineFormatter").typeDefinitions.map(({ name }) => name),
    ["LineFormatterArgs", "CustomSymbol"],
  );
  assert.match(
    docsByKey.get("lineFormatter").typeDefinitions[0].signature,
    /plotX: number/,
  );
});

test("messages/en.json settings copy matches generated settings docs copy", () => {
  const settingsMessages = generateSettingsMessages({ readmeContent, dtsContent });

  assert.deepEqual(messages.settings, settingsMessages);
});

test("generateSettingsDocs examples use locale-backed visible labels", () => {
  const docs = generateSettingsDocs({ readmeContent, dtsContent });
  const docsByKey = new Map(docs.map((doc) => [doc.key, doc]));

  assert.ok(
    docsByKey
      .get("title")
      .exampleSettings.includes(messages.generator.settingExamples.title)
  );
  assert.ok(
    docsByKey
      .get("xLabel")
      .exampleSettings.includes(messages.generator.settingExamples.xLabel)
  );
  assert.ok(
    docsByKey
      .get("yLabel")
      .exampleSettings.includes(messages.generator.settingExamples.yLabel)
  );
  assert.ok(
    docsByKey
      .get("legend")
      .exampleSettings.includes(messages.generator.settingExamples.legendSeriesOne)
  );
  assert.ok(
    docsByKey
      .get("formatter")
      .exampleSettings.includes(
        JSON.stringify(messages.generator.settingExamples.formatterLabels)
      )
  );
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
