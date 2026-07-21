import type { SparklineExampleDefinition } from "./exampleTypes";

export const EXPANDED_SPARKLINE_EXAMPLES = [
  {
    id: "sparklineAscending",
    input: [1, 2, 3, 4, 5, 6, 7, 8],
    method: "sparkline",
  },
  {
    id: "sparklineDescending",
    input: [8, 7, 6, 5, 4, 3, 2, 1],
    method: "sparkline",
  },
  {
    id: "sparklineWave",
    input: [0, 4, 8, 4, 0, -4, -8, -4, 0],
    method: "sparkline",
  },
  {
    id: "sparklineSpikes",
    input: [1, 1, 9, 1, 1, 7, 1, 1, 10],
    method: "sparkline",
  },
  {
    id: "sparklineFractions",
    input: [0.1, 0.25, 0.2, 0.75, 0.5, 1],
    method: "sparkline",
  },
  {
    id: "sparklineLargeValues",
    input: [1_000, 25_000, 8_000, 90_000, 50_000],
    method: "sparkline",
  },
  {
    id: "sparklineTinyValues",
    input: [0.0001, 0.0003, 0.0002, 0.0008, 0.0005],
    method: "sparkline",
  },
  {
    id: "sparklineSingleValue",
    input: [5],
    method: "sparkline",
  },
  {
    id: "sparklineTwoValues",
    input: [10, 20],
    method: "sparkline",
  },
  {
    id: "sparklineAlternatingGaps",
    input: [1, null, 2, null, 3, null, 4],
    method: "sparkline",
  },
  {
    id: "sparklineDashGaps",
    input: [3, null, 6, null, 9],
    method: "sparkline",
    options: { symbols: { empty: "-" } },
  },
  {
    id: "sparklineAsciiLevels",
    input: [0, 1, 2, 3, 4, 5, 6, 7],
    method: "sparkline",
    options: {
      symbols: { levels: [".", ":", "-", "=", "+", "*", "#", "@"] },
    },
  },
  {
    id: "sparklineRed",
    input: [2, 5, 3, 8, 6],
    method: "sparkline",
    options: { color: "ansiRed" },
  },
  {
    id: "sparklineAlternatingPalette",
    input: [1, 3, 2, 5, 4, 7],
    method: "sparkline",
    options: {
      color: [
        "ansiBlue",
        "ansiYellow",
        "ansiBlue",
        "ansiYellow",
        "ansiBlue",
        "ansiYellow",
      ],
    },
  },
  {
    id: "sparklinePartialPalette",
    input: [1, 2, 3, 4, 5],
    method: "sparkline",
    options: {
      color: ["ansiGreen", undefined, "ansiYellow", undefined, "ansiRed"],
    },
  },
  {
    id: "sparklineZeroThreshold",
    input: [-5, -1, 0, 1, 5],
    method: "sparkline",
    options: {
      threshold: {
        aboveColor: "ansiGreen",
        belowColor: "ansiRed",
        value: 0,
      },
    },
  },
  {
    id: "sparklineNegativeThreshold",
    input: [-10, -7, -5, -3, 0],
    method: "sparkline",
    options: {
      threshold: {
        aboveColor: "ansiCyan",
        belowColor: "ansiMagenta",
        value: -5,
      },
    },
  },
  {
    id: "sparklineExactThreshold",
    input: [49, 50, 51, 50, 49],
    method: "sparkline",
    options: {
      threshold: {
        aboveColor: "ansiBrightRed",
        belowColor: "ansiBrightGreen",
        value: 50,
      },
    },
  },
] satisfies readonly SparklineExampleDefinition[];

