import fs from "node:fs";
import path from "node:path";
import { test } from "vitest";
import assert from "node:assert/strict";
import messages from "../messages/en.json" with { type: "json" };
import { createRequire } from "node:module";
import {
  generateSettingsDocs,
  generateSettingsMessages,
  mergeGeneratedSettingsMessages,
  parseExportedTypeDefinitions,
  parseSettingsDescriptions,
  parseSettingsTypeSignatures,
  serializeMessages,
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

function readmeWithRows(rows) {
  return `# Test

### Settings Reference

| Option | Description |
| --- | --- |
${rows}
### Next
`;
}

function dtsWithSettings(settings, extra = "") {
  return `export type Settings = {
${settings}
};
${extra}`;
}

test("generateSettingsDocs includes every key from Settings type", () => {
  const signatures = parseSettingsTypeSignatures(dtsContent);
  const docs = generateSettingsDocs({ readmeContent, dtsContent });

  const signatureKeys = signatures.map(({ key }) => key).sort();
  const docKeys = docs.map(({ key }) => key).sort();

  assert.deepEqual(docKeys, signatureKeys);
});

test("generateSettingsDocs reads package defaults when no sources are provided", () => {
  const docs = generateSettingsDocs();

  assert.ok(docs.length > 0);
  assert.equal(docs.some((doc) => doc.key === "width"), true);
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

test("parseExportedTypeDefinitions handles incomplete and quoted aliases", () => {
  const incompleteDefinitions = parseExportedTypeDefinitions(`export type Broken = {
  value: "}";
`);
  const definitions = parseExportedTypeDefinitions(`export type Complete = {
    tuple: [number, string];
    label: "semi;colon";
};
`);

  assert.match(incompleteDefinitions.Broken, /value/);
  assert.match(definitions.Complete, /tuple: \[number, string\]/);
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

test("generateSettingsDocs fails when Settings type is missing", () => {
  assert.throws(
    () => parseSettingsTypeSignatures("export type Other = {};"),
    /Settings type definition/,
  );
});

test("generateSettingsDocs fails when README settings reference is missing", () => {
  assert.throws(
    () => parseSettingsDescriptions("# Missing"),
    /Settings Reference table/,
  );
});

test("generateSettingsDocs fails when examples are missing", () => {
  const customDts = dtsWithSettings("    imaginary?: number;\n");
  const customReadme = readmeWithRows("| `imaginary` | Test option. |");

  assert.throws(
    () => generateSettingsDocs({ dtsContent: customDts, readmeContent: customReadme }),
    /Missing generated examples/,
  );
});

test("generateSettingsDocs fails when examples are extra", () => {
  const customDts = dtsWithSettings("    color?: Colors;\n", "export type Colors = string;\n");
  const customReadme = readmeWithRows("| `color` | Test color. |");

  assert.throws(
    () => generateSettingsDocs({ dtsContent: customDts, readmeContent: customReadme }),
    /unknown Settings keys/,
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

test("parseSettingsDescriptions skips malformed rows", () => {
  const descriptions = parseSettingsDescriptions(
    readmeWithRows("| `width` | Chart width. |\n| malformed |"),
  );

  assert.deepEqual(descriptions, { width: "Chart width." });
});

test("message serialization helpers preserve generated settings", () => {
  const sourceMessages = { common: { copy: "Copy" } };
  const settingsMessages = { width: { description: "Width.", title: "Width" } };

  assert.deepEqual(
    mergeGeneratedSettingsMessages(sourceMessages, settingsMessages),
    {
      common: { copy: "Copy" },
      settings: settingsMessages,
    },
  );
  assert.equal(
    serializeMessages({ settings: settingsMessages }),
    `${JSON.stringify({ settings: settingsMessages }, null, 2)}\n`,
  );
});
