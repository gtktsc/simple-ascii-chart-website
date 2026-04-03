import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import plot from "simple-ascii-chart";
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
    throw new Error("Unable to locate Settings type definition in d.ts");
  }

  return [...settingsMatch[1].matchAll(/^\s{4}(\w+)\?:\s*([^;]+);/gm)].map((match) => ({
    key: match[1],
    typeSignature: match[2].trim(),
  }));
}

export function parseSettingsDescriptions(readmeContent) {
  const sectionMatch = readmeContent.match(
    /### Settings Reference\n\n\| Option \| Description \|\n\|[-| ]+\|\n([\s\S]*?)\n### /m
  );

  if (!sectionMatch) {
    throw new Error("Unable to locate Settings Reference table in README");
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
    title: { width: 60, title: "Sample Plot Title" },
    xLabel: { width: 60, xLabel: "X Axis" },
    yLabel: { width: 60, yLabel: "Y Axis" },
    thresholds: { width: 60, thresholds: [{ x: 3 }, { y: 15 }] },
    points: { width: 60, points: [{ x: 3, y: 15 }] },
    fillArea: { width: 60, fillArea: true },
    legend: {
      width: 60,
      legend: { position: "top", series: ["Series 1"] },
    },
    axisCenter: { width: 60, axisCenter: [2, 10] },
    formatter: {
      width: 60,
      formatter: (value, { axis }) => {
        if (axis === "x") {
          return ["A", "B", "C", "D", "E"][value - 1] ?? value;
        }

        return value;
      },
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
      `Missing README descriptions for Settings keys: ${missingDescriptions.join(", ")}`
    );
  }

  if (missingExamples.length > 0) {
    throw new Error(
      `Missing generated examples for Settings keys: ${missingExamples.join(", ")}`
    );
  }

  if (extraExamples.length > 0) {
    throw new Error(
      `Examples defined for unknown Settings keys: ${extraExamples.join(", ")}`
    );
  }
}

function sanitizePreview(preview) {
  return preview.replace(ANSI_COLOR_SEQUENCE, "");
}

export function generateSettingsDocs({
  readmeContent = readDefaultReadme(),
  dtsContent = readDefaultTypeDefinitions(),
  plotFn = plot,
} = {}) {
  const signatures = parseSettingsTypeSignatures(dtsContent);
  const descriptions = parseSettingsDescriptions(readmeContent);
  const examples = getSettingExamples();

  const keys = signatures.map(({ key }) => key);
  validateCoverage({ keys, descriptions, examples });

  return signatures.map(({ key, typeSignature }) => {
    const exampleSettings = examples[key];

    return {
      key,
      anchor: key.replace(/([A-Z])/g, "-$1").toLowerCase(),
      title: toTitle(key),
      description: descriptions[key],
      typeSignature,
      exampleSettings: toJavaScriptLiteral(exampleSettings),
      preview: sanitizePreview(plotFn(SETTINGS_PREVIEW_INPUT, exampleSettings)),
    };
  });
}
