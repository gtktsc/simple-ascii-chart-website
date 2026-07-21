import type {
  HistogramExampleDefinition,
  SparklineExampleDefinition,
} from "./exampleTypes";

export const SPARKLINE_EXAMPLES = [
  {
    id: "sparklineBasic",
    input: [1, 3, 2, 5, 4, 8],
    method: "sparkline",
  },
  {
    id: "sparklineNegative",
    input: [-8, -3, -6, 0, 4, 2],
    method: "sparkline",
  },
  {
    id: "sparklineConstant",
    input: [7, 7, 7, 7, 7],
    method: "sparkline",
  },
  {
    id: "sparklineGaps",
    input: [1, null, 3, 5, null, 2],
    method: "sparkline",
    options: { symbols: { empty: "·" } },
  },
  {
    id: "sparklineColor",
    input: [2, 4, 6, 8, 5],
    method: "sparkline",
    options: { color: "ansiCyan" },
  },
  {
    id: "sparklinePalette",
    input: [1, 2, 3, 4, 5],
    method: "sparkline",
    options: {
      color: [
        "ansiBlue",
        "ansiCyan",
        "ansiGreen",
        "ansiYellow",
        "ansiRed",
      ],
    },
  },
  {
    id: "sparklineThreshold",
    input: [42, 61, 79, 83, 55],
    method: "sparkline",
    options: {
      threshold: {
        aboveColor: "ansiRed",
        belowColor: "ansiGreen",
        value: 80,
      },
    },
  },
  {
    id: "sparklineSymbols",
    input: [0, 2, 4, 6, 8, null],
    method: "sparkline",
    options: {
      symbols: {
        empty: "?",
        levels: [".", ":", "-", "=", "+", "*", "#", "@"],
      },
    },
  },
] satisfies readonly SparklineExampleDefinition[];

export const HISTOGRAM_EXAMPLES = [
  {
    id: "histogramAutomaticBins",
    input: [1, 1, 2, 2, 2, 4, 5, 8, 8, 9],
    inputKind: "samples",
    method: "histogram",
  },
  {
    id: "histogramThreeBins",
    input: [1, 1, 2, 2, 2, 4, 5, 8, 8, 9],
    inputKind: "samples",
    method: "histogram",
    options: { binCount: 3 },
  },
  {
    id: "histogramManyBins",
    input: [3, 4, 4, 5, 7, 8, 9, 9, 10, 12, 13, 15],
    inputKind: "samples",
    method: "histogram",
    options: { binCount: 6 },
  },
  {
    id: "histogramNegativeValues",
    input: [-9, -7, -4, -4, -1, 0, 2, 5],
    inputKind: "samples",
    method: "histogram",
    options: { binCount: 4 },
  },
  {
    id: "histogramConstantValues",
    input: [5, 5, 5, 5, 5],
    inputKind: "samples",
    method: "histogram",
    options: { binCount: 5 },
  },
  {
    id: "histogramPrecounted",
    input: [
      [1, 3],
      [2, 5],
      [1, 2],
      [4, 1],
    ],
    inputKind: "bins",
    method: "histogram",
  },
] satisfies readonly HistogramExampleDefinition[];

