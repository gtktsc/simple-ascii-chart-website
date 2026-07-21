import type {
  CandlestickExampleDefinition,
  HeatmapExampleDefinition,
  RenderChartExampleDefinition,
} from "./exampleTypes";
import messages from "../../messages/en.json";

const numericSeries = [
  [0, 2],
  [1, 5],
  [2, 3],
  [3, 8],
] as const;

const categoricalSeries = [
  ["Mon", 4],
  ["Tue", 7],
  ["Wed", 5],
  ["Thu", 9],
] as const;

export const RENDER_CHART_EXAMPLES = [
  {
    id: "structuredLine",
    input: {
      height: 9,
      series: [{ data: numericSeries, id: "requests", name: "Requests" }],
      title: messages.examples.sampleData.requestVolume,
      width: 34,
    },
    method: "renderChart",
  },
  {
    id: "structuredCategories",
    input: {
      height: 9,
      series: [{ data: categoricalSeries, id: "deployments" }],
      width: 36,
      xAxis: { label: "weekday", scale: "band" },
      yAxis: { label: "deployments" },
    },
    method: "renderChart",
  },
  {
    id: "structuredMixedSeries",
    input: {
      height: 10,
      legend: { position: "bottom", series: true },
      series: [
        { data: categoricalSeries, id: "actual", mode: "bar" },
        {
          data: [
            ["Mon", 5],
            ["Tue", 6],
            ["Wed", 7],
            ["Thu", 8],
          ],
          id: "target",
          interpolation: "linear",
        },
      ],
      width: 40,
      xAxis: { scale: "band" },
    },
    method: "renderChart",
  },
  {
    id: "structuredGroupedBars",
    input: {
      barLayout: "grouped",
      height: 10,
      series: [
        { data: categoricalSeries, id: "web", mode: "bar" },
        {
          data: [
            ["Mon", 3],
            ["Tue", 5],
            ["Wed", 6],
            ["Thu", 4],
          ],
          id: "mobile",
          mode: "bar",
        },
      ],
      valueLabels: true,
      width: 42,
      xAxis: { scale: "band" },
    },
    method: "renderChart",
  },
  {
    id: "structuredStackedBars",
    input: {
      barLayout: "stacked",
      height: 10,
      legend: { position: "bottom", series: true },
      series: [
        { data: categoricalSeries, id: "cached", mode: "bar" },
        {
          data: [
            ["Mon", 2],
            ["Tue", 3],
            ["Wed", 2],
            ["Thu", 4],
          ],
          id: "uncached",
          mode: "bar",
        },
      ],
      width: 42,
      xAxis: { scale: "band" },
    },
    method: "renderChart",
  },
  {
    id: "structuredSecondaryAxis",
    input: {
      height: 10,
      legend: { position: "bottom", series: true },
      secondaryYAxis: { domain: [0, 10], label: "errors" },
      series: [
        { data: numericSeries, id: "latency", name: "Latency" },
        {
          data: [
            [0, 1],
            [1, 4],
            [2, 2],
            [3, 6],
          ],
          id: "errors",
          name: "Errors",
          yAxis: "secondary",
        },
      ],
      width: 42,
      yAxis: { domain: [0, 10], label: "milliseconds" },
    },
    method: "renderChart",
  },
  {
    id: "structuredAnnotations",
    input: {
      annotations: [
        { axis: "y", from: 6, id: "warning-zone", to: 8, type: "span" },
        { id: "peak", text: "peak", type: "text", x: 3, y: 8 },
        { from: [0, 2], id: "trend", to: [3, 8], type: "arrow" },
        { id: "variance", type: "errorBar", x: 1, y: 5, yError: 1 },
      ],
      height: 11,
      series: [{ data: numericSeries, id: "requests" }],
      width: 42,
      yAxis: { domain: [0, 10] },
    },
    method: "renderChart",
  },
  {
    id: "structuredThresholdsPoints",
    input: {
      height: 10,
      legend: {
        points: true,
        position: "bottom",
        series: true,
        thresholds: true,
      },
      points: [{ id: "release", name: "Release", x: 2, y: 3 }],
      series: [{ data: numericSeries, id: "requests" }],
      thresholds: [{ id: "limit", name: "Limit", y: 6 }],
      width: 40,
    },
    method: "renderChart",
  },
  {
    id: "structuredBraille",
    input: {
      height: 8,
      renderer: "braille",
      series: [
        {
          data: numericSeries,
          id: "smooth",
          interpolation: "linear",
        },
      ],
      width: 32,
    },
    method: "renderChart",
  },
  {
    id: "structuredGradient",
    input: {
      height: 9,
      series: [
        {
          coloring: {
            by: "y",
            colors: ["ansiBlue", "ansiCyan", "ansiGreen"],
            domain: [0, 8],
            type: "gradient",
          },
          data: numericSeries,
          id: "gradient",
        },
      ],
      width: 34,
    },
    method: "renderChart",
  },
] satisfies readonly RenderChartExampleDefinition[];

const candleData = [
  [0, 100, 112, 96, 108],
  [1, 108, 114, 102, 105],
  [2, 105, 117, 101, 115],
  [3, 115, 118, 107, 110],
] as const;

export const CANDLESTICK_EXAMPLES = [
  {
    id: "candlestickBasic",
    input: { data: candleData },
    method: "candlestick",
  },
  {
    id: "candlestickTitle",
    input: {
      data: candleData,
      height: 10,
      title: messages.examples.sampleData.dailyOhlc,
      width: 34,
    },
    method: "candlestick",
  },
  {
    id: "candlestickColors",
    input: {
      data: candleData,
      height: 10,
      style: {
        falling: { color: "ansiRed" },
        rising: { color: "ansiGreen" },
      },
      width: 34,
    },
    method: "candlestick",
  },
  {
    id: "candlestickSymbols",
    input: {
      data: candleData,
      height: 10,
      style: {
        falling: { symbol: "▼" },
        rising: { symbol: "▲" },
        wick: "│",
      },
      width: 34,
    },
    method: "candlestick",
  },
  {
    id: "candlestickThresholds",
    input: {
      data: candleData,
      height: 10,
      thresholds: [
        { id: "target", name: "Target", y: 110 },
        { id: "midpoint", name: "Midpoint", x: 2 },
      ],
      width: 36,
    },
    method: "candlestick",
  },
  {
    id: "candlestickAxes",
    input: {
      data: candleData,
      height: 10,
      width: 38,
      xAxis: { label: "session", ticks: 4 },
      yAxis: { domain: [90, 120], label: "price", ticks: 4 },
    },
    method: "candlestick",
  },
  {
    id: "candlestickUnchanged",
    input: {
      data: [
        [0, 100, 108, 96, 100],
        [1, 100, 112, 98, 107],
        [2, 107, 109, 101, 103],
      ],
      height: 10,
      style: { unchanged: { symbol: "═" } },
      width: 32,
    },
    method: "candlestick",
  },
] satisfies readonly CandlestickExampleDefinition[];

export const HEATMAP_EXAMPLES = [
  {
    id: "heatmapStatus",
    input: {
      data: [
        ["pass", "pass", "fail"],
        ["pass", "pending", "pass"],
      ],
      levels: [
        { symbol: "●", value: "pass" },
        { symbol: "○", value: "pending" },
        { symbol: "×", value: "fail" },
      ],
    },
    method: "heatmap",
  },
  {
    id: "heatmapLabels",
    input: {
      columns: ["Linux", "macOS", "Windows"],
      data: [
        ["pass", "pass", "fail"],
        ["pass", "pending", "pass"],
      ],
      levels: [
        { symbol: "●", value: "pass" },
        { symbol: "○", value: "pending" },
        { symbol: "×", value: "fail" },
      ],
      rows: messages.generator.exampleData.nodeVersions,
      title: messages.examples.sampleData.buildMatrix,
    },
    method: "heatmap",
  },
  {
    id: "heatmapLegend",
    input: {
      data: [["ready", "busy", "offline"]],
      legend: true,
      levels: [
        { color: "ansiGreen", label: "Ready", value: "ready" },
        { color: "ansiYellow", label: "Busy", value: "busy" },
        { color: "ansiRed", label: "Offline", value: "offline" },
      ],
    },
    method: "heatmap",
  },
  {
    id: "heatmapMissingValues",
    input: {
      data: [
        [1, null, 2],
        [2, 1, null],
      ],
      levels: [
        { symbol: "·", value: 1 },
        { symbol: "#", value: 2 },
      ],
      symbols: { empty: "?", gap: " | " },
    },
    method: "heatmap",
  },
  {
    id: "heatmapNumericLevels",
    input: {
      columns: ["P50", "P95", "P99"],
      data: [
        [1, 2, 3],
        [2, 3, 3],
      ],
      levels: [
        { label: "Low", symbol: "░", value: 1 },
        { label: "Medium", symbol: "▒", value: 2 },
        { label: "High", symbol: "▓", value: 3 },
      ],
      rows: ["API", "Worker"],
    },
    method: "heatmap",
  },
  {
    id: "heatmapThreshold",
    input: {
      data: [
        [42, 68, 83],
        [35, 79, null],
      ],
      threshold: {
        aboveColor: "ansiBrightRed",
        belowColor: "ansiCyan",
        value: 80,
      },
    },
    method: "heatmap",
  },
  {
    id: "heatmapThresholdLegend",
    input: {
      columns: ["CPU", "RAM", "Disk"],
      data: [
        [45, 72, 91],
        [63, 88, 54],
      ],
      legend: true,
      rows: ["web", "worker"],
      threshold: {
        aboveColor: "ansiRed",
        aboveLabel: "Alert",
        aboveSymbol: "!",
        belowColor: "ansiGreen",
        belowLabel: "Healthy",
        belowSymbol: "·",
        value: 80,
      },
      title: messages.examples.sampleData.resourceHealth,
    },
    method: "heatmap",
  },
] satisfies readonly HeatmapExampleDefinition[];
