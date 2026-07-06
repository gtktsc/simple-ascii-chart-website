import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import plot from "simple-ascii-chart";
import messages from "../messages/en.json" with { type: "json" };
import { formatMessage } from "./messages.mjs";
import { toJavaScriptLiteral } from "./optionsSerialization.mjs";

const require = createRequire(import.meta.url);
const packageEntryPath = require.resolve("simple-ascii-chart");
const packageRoot = path.resolve(path.dirname(packageEntryPath), "..");
const ANSI_COLOR_SEQUENCE = /\u001b\[[0-9;]*m/g;

export const SETTINGS_PREVIEW_INPUT = [
  [1, 1],
  [2, 4],
  [3, 9],
  [4, 16],
  [5, 25],
];

function toTitle(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/\bX\b/g, "X")
    .replace(/\bY\b/g, "Y")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function readDefaultReadme() {
  return fs.readFileSync(path.join(packageRoot, "README.md"), "utf8");
}

function readDefaultTypeDefinitions() {
  return fs.readFileSync(path.join(packageRoot, "dist/types/index.d.ts"), "utf8");
}

export function parseSettingsTypeSignatures(dtsContent) {
  const settingsMatch = dtsContent.match(/export type Settings = \{([\s\S]*?)\n\};/);

  if (!settingsMatch) {
    throw new Error(messages.generator.errors.missingSettingsType);
  }

  return [...settingsMatch[1].matchAll(/^\s{4}(\w+)\?:\s*([^;]+);/gm)].map((match) => ({
    key: match[1],
    typeSignature: match[2].trim(),
  }));
}

function normalizeTypeDefinition(signature) {
  return signature
    .split("\n")
    .map((line) => line.replace(/^ {4}/, "  "))
    .join("\n");
}

function isTypeAliasComplete(signatureLines) {
  const signature = signatureLines.join("\n");
  let bracketDepth = 0;
  let quote = "";
  let escaped = false;

  for (const char of signature) {
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = "";
      }

      continue;
    }

    if (char === "'" || char === "\"" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{" || char === "(" || char === "[") {
      bracketDepth += 1;
      continue;
    }

    if (char === "}" || char === ")" || char === "]") {
      bracketDepth = Math.max(0, bracketDepth - 1);
      continue;
    }

    if (char === ";" && bracketDepth === 0) {
      return true;
    }
  }

  return false;
}

export function parseExportedTypeDefinitions(dtsContent) {
  const lines = dtsContent.split("\n");
  const definitions = {};

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^export type (\w+) = (.*)$/);

    if (!match) {
      continue;
    }

    const [, name, firstSignatureLine] = match;
    const signatureLines = [firstSignatureLine];

    while (
      index + 1 < lines.length &&
      !isTypeAliasComplete(signatureLines)
    ) {
      index += 1;
      signatureLines.push(lines[index]);
    }

    definitions[name] = normalizeTypeDefinition(
      signatureLines.join("\n").replace(/;$/, "").trim(),
    );
  }

  return definitions;
}

function getTypeDefinitionReferences(typeSignature, definitions) {
  const seen = new Set();

  return [...typeSignature.matchAll(/\b[A-Z]\w*\b/g)]
    .map((match) => match[0])
    .filter((name) => {
      if (seen.has(name) || !(name in definitions) || name === "Settings") {
        return false;
      }

      seen.add(name);
      return true;
    })
    .map((name) => ({
      name,
      signature: definitions[name],
    }));
}

export function parseSettingsDescriptions(readmeContent) {
  const sectionMatch = readmeContent.match(
    /### Settings Reference\n\n\| Option \| Description \|\n\|[-| ]+\|\n([\s\S]*?)\n### /m
  );

  if (!sectionMatch) {
    throw new Error(messages.generator.errors.missingSettingsReference);
  }

  return sectionMatch[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((accumulator, line) => {
      const rowMatch = line.match(/^\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|$/);

      if (!rowMatch) {
        return accumulator;
      }

      accumulator[rowMatch[1]] = rowMatch[2];
      return accumulator;
    }, {});
}

function getSettingExamples() {
  const settingExamples = messages.generator.settingExamples;
  const formatterLabelsLiteral = JSON.stringify(settingExamples.formatterLabels);
  const formatter = (value, { axis }) => {
    if (axis === "x") {
      return settingExamples.formatterLabels[value - 1] ?? value;
    }

    return value;
  };
  formatter.toString = () => `(value, { axis }) => {
  if (axis === "x") {
    return ${formatterLabelsLiteral}[value - 1] ?? value;
  }

  return value;
}`;

  return {
    color: { width: 60, color: ["ansiRed", "ansiBlue"] },
    width: { width: 30, height: 8 },
    height: { width: 60, height: 6 },
    yRange: { width: 60, yRange: [0, 30] },
    showTickLabel: { width: 60, showTickLabel: true },
    hideXAxis: { width: 60, hideXAxis: true },
    hideXAxisTicks: { width: 60, hideXAxisTicks: true },
    hideYAxis: { width: 60, hideYAxis: true },
    hideYAxisTicks: { width: 60, hideYAxisTicks: true },
    customXAxisTicks: { width: 60, customXAxisTicks: [1, 3, 5] },
    customYAxisTicks: { width: 60, customYAxisTicks: [1, 8, 16, 25] },
    title: { width: 60, title: settingExamples.title },
    xLabel: { width: 60, xLabel: settingExamples.xLabel },
    yLabel: { width: 60, yLabel: settingExamples.yLabel },
    thresholds: { width: 60, thresholds: [{ x: 3 }, { y: 15 }] },
    points: { width: 60, points: [{ x: 3, y: 15 }] },
    fillArea: { width: 60, fillArea: true },
    legend: {
      width: 60,
      legend: { position: "top", series: [settingExamples.legendSeriesOne] },
    },
    axisCenter: { width: 60, axisCenter: [2, 10] },
    formatter: {
      width: 60,
      formatter,
    },
    lineFormatter: {
      width: 60,
      lineFormatter: ({ plotX, plotY }) => [
        { x: plotX, y: plotY, symbol: plotX % 2 === 0 ? "▲" : "▼" },
      ],
    },
    symbols: {
      width: 60,
      symbols: {
        axis: { ns: "|", we: "-" },
        chart: { ns: "*", we: "*" },
      },
    },
    mode: { mode: "bar", width: 60 },
    debugMode: { width: 60, debugMode: true },
  };
}

function validateCoverage({ keys, descriptions, examples }) {
  const missingDescriptions = keys.filter((key) => !(key in descriptions));
  const missingExamples = keys.filter((key) => !(key in examples));
  const extraExamples = Object.keys(examples).filter((key) => !keys.includes(key));

  if (missingDescriptions.length > 0) {
    throw new Error(
      formatMessage(messages.generator.errors.missingDescriptions, {
        keys: missingDescriptions.join(", "),
      })
    );
  }

  if (missingExamples.length > 0) {
    throw new Error(
      formatMessage(messages.generator.errors.missingExamples, {
        keys: missingExamples.join(", "),
      })
    );
  }

  if (extraExamples.length > 0) {
    throw new Error(
      formatMessage(messages.generator.errors.extraExamples, {
        keys: extraExamples.join(", "),
      })
    );
  }
}

function sanitizePreview(preview) {
  return preview.replace(ANSI_COLOR_SEQUENCE, "");
}

function getSettingsArtifacts({
  readmeContent = readDefaultReadme(),
  dtsContent = readDefaultTypeDefinitions(),
} = {}) {
  const signatures = parseSettingsTypeSignatures(dtsContent);
  const typeDefinitions = parseExportedTypeDefinitions(dtsContent);
  const descriptions = parseSettingsDescriptions(readmeContent);
  const examples = getSettingExamples();

  const keys = signatures.map(({ key }) => key);
  validateCoverage({ keys, descriptions, examples });

  return { descriptions, examples, signatures, typeDefinitions };
}

export function generateSettingsMessages(options = {}) {
  const { descriptions, signatures } = getSettingsArtifacts(options);

  return signatures.reduce((accumulator, { key }) => {
    accumulator[key] = {
      title: toTitle(key),
      description: descriptions[key],
    };

    return accumulator;
  }, {});
}

export function mergeGeneratedSettingsMessages(sourceMessages, settingsMessages) {
  return {
    ...sourceMessages,
    settings: settingsMessages,
  };
}

export function serializeMessages(sourceMessages) {
  return `${JSON.stringify(sourceMessages, null, 2)}\n`;
}

export function generateSettingsDocs(options = {}) {
  const { plotFn = plot } = options;
  const { examples, signatures, typeDefinitions } = getSettingsArtifacts(options);

  return signatures.map(({ key, typeSignature }) => {
    const exampleSettings = examples[key];

    return {
      key,
      anchor: key.replace(/([A-Z])/g, "-$1").toLowerCase(),
      typeSignature,
      typeDefinitions: getTypeDefinitionReferences(typeSignature, typeDefinitions),
      exampleSettings: toJavaScriptLiteral(exampleSettings),
      preview: sanitizePreview(plotFn(SETTINGS_PREVIEW_INPUT, exampleSettings)),
    };
  });
}
