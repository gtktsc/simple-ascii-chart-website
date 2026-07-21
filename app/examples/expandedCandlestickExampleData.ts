import type { CandlestickExampleDefinition } from "./exampleTypes";

const standardCandles = [
  [0, 100, 112, 96, 108],
  [1, 108, 114, 102, 105],
  [2, 105, 117, 101, 115],
  [3, 115, 118, 107, 110],
] as const;

export const EXPANDED_CANDLESTICK_EXAMPLES = [
  {
    id: "candlestickCompact",
    input: { data: standardCandles, height: 6, width: 24 },
    method: "candlestick",
  },
  {
    id: "candlestickWide",
    input: { data: standardCandles, height: 9, width: 52 },
    method: "candlestick",
  },
  {
    id: "candlestickTall",
    input: { data: standardCandles, height: 16, width: 32 },
    method: "candlestick",
  },
  {
    id: "candlestickRisingRun",
    input: {
      data: [
        [0, 10, 13, 9, 12],
        [1, 12, 16, 11, 15],
        [2, 15, 19, 14, 18],
        [3, 18, 22, 17, 21],
      ],
      height: 9,
      width: 32,
    },
    method: "candlestick",
  },
  {
    id: "candlestickFallingRun",
    input: {
      data: [
        [0, 21, 22, 17, 18],
        [1, 18, 19, 14, 15],
        [2, 15, 16, 11, 12],
        [3, 12, 13, 8, 9],
      ],
      height: 9,
      width: 32,
    },
    method: "candlestick",
  },
  {
    id: "candlestickMonochrome",
    input: {
      data: standardCandles,
      height: 9,
      style: {
        falling: { color: "ansiWhite", symbol: "█" },
        rising: { color: "ansiWhite", symbol: "░" },
        unchanged: { color: "ansiWhite", symbol: "─" },
      },
      width: 34,
    },
    method: "candlestick",
  },
  {
    id: "candlestickBrightColors",
    input: {
      data: standardCandles,
      height: 9,
      style: {
        falling: { color: "ansiBrightRed" },
        rising: { color: "ansiBrightGreen" },
        unchanged: { color: "ansiBrightYellow" },
      },
      width: 34,
    },
    method: "candlestick",
  },
  {
    id: "candlestickSharedSymbols",
    input: {
      data: standardCandles,
      height: 9,
      symbols: {
        candlestick: {
          falling: "F",
          rising: "R",
          unchanged: "U",
          wick: "|",
        },
      },
      width: 34,
    },
    method: "candlestick",
  },
  {
    id: "candlestickHiddenXAxis",
    input: {
      data: standardCandles,
      height: 9,
      width: 34,
      xAxis: { hidden: true },
    },
    method: "candlestick",
  },
  {
    id: "candlestickHiddenYAxis",
    input: {
      data: standardCandles,
      height: 9,
      width: 34,
      yAxis: { hidden: true },
    },
    method: "candlestick",
  },
  {
    id: "candlestickHiddenXTicks",
    input: {
      data: standardCandles,
      height: 9,
      width: 34,
      xAxis: { hideTicks: true, label: "session" },
    },
    method: "candlestick",
  },
  {
    id: "candlestickShownYLabels",
    input: {
      data: standardCandles,
      height: 9,
      width: 38,
      yAxis: { showTickLabel: true, ticks: 5 },
    },
    method: "candlestick",
  },
  {
    id: "candlestickExactXTicks",
    input: {
      data: standardCandles,
      height: 9,
      width: 34,
      xAxis: { ticks: [0, 2, 3] },
    },
    method: "candlestick",
  },
  {
    id: "candlestickExactYTicks",
    input: {
      data: standardCandles,
      height: 9,
      width: 36,
      yAxis: { domain: [90, 120], ticks: [90, 100, 110, 120] },
    },
    method: "candlestick",
  },
  {
    id: "candlestickColoredXAxis",
    input: {
      data: standardCandles,
      height: 9,
      width: 34,
      xAxis: { color: "ansiCyan", label: "session" },
    },
    method: "candlestick",
  },
  {
    id: "candlestickColoredYAxis",
    input: {
      data: standardCandles,
      height: 9,
      width: 36,
      yAxis: { color: "ansiMagenta", label: "price" },
    },
    method: "candlestick",
  },
  {
    id: "candlestickColoredThresholds",
    input: {
      data: standardCandles,
      height: 10,
      thresholds: [
        { color: "ansiGreen", id: "support", y: 100 },
        { color: "ansiRed", id: "resistance", y: 115 },
        { color: "ansiCyan", id: "event", x: 2 },
      ],
      width: 40,
    },
    method: "candlestick",
  },
  {
    id: "candlestickNarrowRange",
    input: {
      data: [
        [0, 10.2, 10.8, 10.1, 10.6],
        [1, 10.6, 11.1, 10.4, 10.9],
        [2, 10.9, 11.2, 10.5, 10.7],
        [3, 10.7, 11.4, 10.6, 11.3],
      ],
      height: 10,
      width: 38,
      yAxis: { domain: [10, 11.5], showTickLabel: true },
    },
    method: "candlestick",
  },
] satisfies readonly CandlestickExampleDefinition[];

