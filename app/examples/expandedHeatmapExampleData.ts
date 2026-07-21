import type { HeatmapExampleDefinition } from "./exampleTypes";
import messages from "../../messages/en.json";

const statusLevels = [
  { symbol: "●", value: "pass" },
  { symbol: "○", value: "pending" },
  { symbol: "×", value: "fail" },
] as const;

const statusData = [
  ["pass", "pending", "fail"],
  ["pending", "pass", "pass"],
] as const;

export const EXPANDED_HEATMAP_EXAMPLES = [
  {
    id: "heatmapTitleOnly",
    input: {
      data: statusData,
      levels: statusLevels,
      title: messages.examples.sampleData.ciStatus,
    },
    method: "heatmap",
  },
  {
    id: "heatmapColumnsOnly",
    input: {
      columns: ["Linux", "macOS", "Windows"],
      data: statusData,
      levels: statusLevels,
    },
    method: "heatmap",
  },
  {
    id: "heatmapRowsOnly",
    input: {
      data: statusData,
      levels: statusLevels,
      rows: ["stable", "canary"],
    },
    method: "heatmap",
  },
  {
    id: "heatmapCustomCell",
    input: {
      data: [
        [1, 2, 1],
        [2, 2, 1],
      ],
      levels: [{ value: 1 }, { value: 2 }],
      symbols: { cell: "◆" },
    },
    method: "heatmap",
  },
  {
    id: "heatmapCustomEmpty",
    input: {
      data: [
        ["on", null, "off"],
        [null, "on", "on"],
      ],
      levels: [
        { symbol: "+", value: "on" },
        { symbol: "-", value: "off" },
      ],
      symbols: { empty: "?" },
    },
    method: "heatmap",
  },
  {
    id: "heatmapTightGap",
    input: {
      data: statusData,
      levels: statusLevels,
      symbols: { gap: "" },
    },
    method: "heatmap",
  },
  {
    id: "heatmapWideGap",
    input: {
      data: statusData,
      levels: statusLevels,
      symbols: { gap: " | " },
    },
    method: "heatmap",
  },
  {
    id: "heatmapCategoricalColors",
    input: {
      data: statusData,
      levels: [
        { color: "ansiGreen", symbol: "●", value: "pass" },
        { color: "ansiYellow", symbol: "○", value: "pending" },
        { color: "ansiRed", symbol: "×", value: "fail" },
      ],
    },
    method: "heatmap",
  },
  {
    id: "heatmapCategoricalLabels",
    input: {
      data: statusData,
      legend: true,
      levels: [
        { label: "Passed", symbol: "●", value: "pass" },
        { label: "Pending", symbol: "○", value: "pending" },
        { label: "Failed", symbol: "×", value: "fail" },
      ],
    },
    method: "heatmap",
  },
  {
    id: "heatmapSingleRow",
    input: {
      columns: ["API", "Web", "Worker", "Queue"],
      data: [["up", "up", "down", "up"]],
      levels: [
        { symbol: "▲", value: "up" },
        { symbol: "▼", value: "down" },
      ],
      rows: ["prod"],
    },
    method: "heatmap",
  },
  {
    id: "heatmapSingleColumn",
    input: {
      columns: ["Status"],
      data: [["up"], ["down"], ["up"]],
      levels: [
        { symbol: "▲", value: "up" },
        { symbol: "▼", value: "down" },
      ],
      rows: ["API", "Web", "Worker"],
    },
    method: "heatmap",
  },
  {
    id: "heatmapBinaryLevels",
    input: {
      data: [
        [0, 1, 0, 1],
        [1, 1, 0, 0],
      ],
      levels: [
        { label: "Off", symbol: "·", value: 0 },
        { label: "On", symbol: "█", value: 1 },
      ],
      legend: true,
    },
    method: "heatmap",
  },
  {
    id: "heatmapColoredNumericLevels",
    input: {
      data: [
        [1, 2, 3, 4],
        [4, 3, 2, 1],
      ],
      levels: [
        { color: "ansiBlue", symbol: "░", value: 1 },
        { color: "ansiCyan", symbol: "▒", value: 2 },
        { color: "ansiYellow", symbol: "▓", value: 3 },
        { color: "ansiRed", symbol: "█", value: 4 },
      ],
    },
    method: "heatmap",
  },
  {
    id: "heatmapThresholdSymbols",
    input: {
      data: [
        [12, 55, 87],
        [91, 38, 64],
      ],
      threshold: {
        aboveColor: "ansiRed",
        aboveSymbol: "!",
        belowColor: "ansiGreen",
        belowSymbol: ".",
        value: 75,
      },
    },
    method: "heatmap",
  },
  {
    id: "heatmapThresholdLabels",
    input: {
      data: [[20, 49, 50, 80]],
      legend: true,
      threshold: {
        aboveColor: "ansiYellow",
        aboveLabel: "Warm",
        belowColor: "ansiBlue",
        belowLabel: "Cool",
        value: 50,
      },
    },
    method: "heatmap",
  },
  {
    id: "heatmapThresholdNulls",
    input: {
      data: [
        [10, null, 90],
        [null, 70, 30],
      ],
      symbols: { empty: "?" },
      threshold: {
        aboveColor: "ansiMagenta",
        belowColor: "ansiCyan",
        value: 60,
      },
    },
    method: "heatmap",
  },
  {
    id: "heatmapThresholdGridLabels",
    input: {
      columns: ["CPU", "RAM", "Disk"],
      data: [
        [42, 81, 65],
        [75, 52, 93],
      ],
      rows: ["web", "worker"],
      threshold: {
        aboveColor: "ansiRed",
        belowColor: "ansiGreen",
        value: 80,
      },
      title: "Capacity",
    },
    method: "heatmap",
  },
  {
    id: "heatmapThresholdBoundary",
    input: {
      data: [[49.9, 50, 50.1]],
      legend: true,
      threshold: {
        aboveColor: "ansiBrightRed",
        aboveLabel: messages.examples.sampleData.atOrAbove,
        belowColor: "ansiBrightGreen",
        belowLabel: "Below",
        value: 50,
      },
    },
    method: "heatmap",
  },
] satisfies readonly HeatmapExampleDefinition[];
