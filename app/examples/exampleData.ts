import {
  candlestick,
  heatmap,
  histogram,
  plot,
  renderChart,
  sparkline,
  type FormatterHelpers,
  type Settings,
} from "simple-ascii-chart";
import { toJavaScriptLiteral } from "../../lib/optionsSerialization.mjs";
import messages from "../../messages/en.json";
import {
  CANDLESTICK_EXAMPLES,
  HEATMAP_EXAMPLES,
  RENDER_CHART_EXAMPLES,
} from "./chartMethodExampleData";
import {
  HISTOGRAM_EXAMPLES,
  SPARKLINE_EXAMPLES,
} from "./helperExampleData";
import { EXPANDED_CANDLESTICK_EXAMPLES } from "./expandedCandlestickExampleData";
import { EXPANDED_HEATMAP_EXAMPLES } from "./expandedHeatmapExampleData";
import { EXPANDED_SPARKLINE_EXAMPLES } from "./expandedSparklineExampleData";
import type {
  ExampleDefinition,
  PlotExampleDefinition,
} from "./exampleTypes";

export type { ExampleDefinition, ExampleId, ExampleMethod } from "./exampleTypes";

type PlotExampleSeed = Omit<PlotExampleDefinition, "method">;

const PLOT_EXAMPLE_DEFINITIONS = [
  {
    id: "basicWidthHeight",
    input: [
      [1, 2],
      [2, 4],
      [3, 6],
      [4, 8],
    ],
    options: { width: 30, height: 15 },
  },
  {
    id: "logarithmicScale",
    input: Array.from({ length: 15 }, (_, i) => [i, Math.log(i + 1)]),
    options: { width: 35, height: 15 },
  },
  {
    id: "exponentialGrowth",
    input: Array.from({ length: 15 }, (_, i) => [i, Math.pow(2, i / 2)]),
    options: { width: 35, height: 15 },
  },
  {
    id: "areaFill",
    input: [
      [0, 1],
      [1, 1.5],
      [2, 2],
      [3, 2.5],
      [4, 3],
      [5, 3.5],
    ],
    options: { width: 20, height: 10, fillArea: true },
  },
  {
    id: "customThresholds",
    input: [
      [1, 2],
      [2, 5],
      [3, 8],
      [4, 3],
      [5, 7],
      [6, 1],
    ],
    options: {
      width: 30,
      height: 10,
      thresholds: [{ y: 5 }, { x: 3 }],
    },
  },
  {
    id: "withPoints",
    input: [
      [1, 2],
      [2, 5],
      [3, 8],
      [4, 3],
      [5, 7],
      [6, 1],
    ],
    options: {
      width: 30,
      height: 10,
      points: [
        { y: 5, x: 2 },
        { x: 3, y: 2 },
      ],
    },
  },
  {
    id: "customAxisCenter",
    input: [
      [-3, -1],
      [-2, 0],
      [-1, 1],
      [0, 2],
      [1, 3],
      [2, 5],
      [3, 7],
    ],
    options: { width: 30, height: 10, axisCenter: [0, 0] },
  },
  {
    id: "barChart",
    input: [
      [-3, -1],
      [-2, 0],
      [-1, 1],
      [0, 2],
      [1, 3],
      [2, 5],
      [3, -7],
    ],
    options: { mode: "bar", width: 30, height: 20, axisCenter: [0, 0] },
  },
  {
    id: "horizontalBarChart",
    input: [
      [-3, -1],
      [-2, 0],
      [-1, 1],
      [0, 2],
      [1, 3],
      [2, 5],
    ],
    options: {
      mode: "horizontalBar",
      width: 30,
      height: 20,
      axisCenter: [0, 0],
    },
  },
  {
    id: "titleAndLabels",
    input: [
      [0, 1],
      [1, 2],
      [2, 4],
      [3, 9],
      [4, 16],
      [5, 25],
    ],
    options: {
      width: 30,
      height: 10,
      title: messages.examples.sampleData.samplePlot,
      xLabel: messages.examples.sampleData.xAxis,
      yLabel: messages.examples.sampleData.yAxis,
    },
  },
  {
    id: "legend",
    input: [
      [
        [0, 1],
        [1, 2],
        [2, 4],
      ],
      [
        [0, 1],
        [1, 3],
        [2, 6],
      ],
    ],
    options: {
      width: 30,
      height: 10,
      legend: {
        position: "bottom",
        series: [
          messages.examples.sampleData.seriesOne,
          messages.examples.sampleData.seriesTwo,
        ],
      },
    },
  },
  {
    id: "complexLegend",
    input: [
      [
        [0, 1],
        [1, 2],
        [2, 4],
      ],
      [
        [0, 1],
        [1, 3],
        [2, 6],
      ],
    ],
    options: {
      title: messages.examples.sampleData.legendTitle,
      width: 30,
      points: [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ],
      thresholds: [{ x: 1, y: 2 }],
      height: 10,
      legend: {
        position: "right",
        series: [
          messages.examples.sampleData.shortSeriesOne,
          messages.examples.sampleData.shortSeriesTwo,
        ],
        thresholds: [messages.examples.sampleData.thresholdOne],
        points: [
          messages.examples.sampleData.pointOne,
          messages.examples.sampleData.pointTwo,
        ],
      },
    },
  },
  {
    id: "singleSeriesBarChart",
    input: [
      [
        [0, 1],
        [1, 2],
        [2, 4],
      ],
    ],
    options: {
      width: 30,
      mode: "bar",
      height: 10,
    },
  },
  {
    id: "negativeBarChart",
    input: [
      [
        [0, 1],
        [1, 2],
        [2, 4],
        [3, -4],
        [4, -2],
      ],
    ],
    options: {
      width: 30,
      mode: "bar",
      height: 10,
      axisCenter: [0, 0],
    },
  },
  {
    id: "singleSeriesHorizontalBarChart",
    input: [
      [
        [0, 1],
        [1, 2],
        [2, 4],
      ],
    ],
    options: {
      width: 30,
      mode: "horizontalBar",
      height: 10,
    },
  },
  {
    id: "customFormatter",
    input: [
      [0, 1],
      [1, 4],
      [2, 9],
      [3, 16],
      [4, 25],
    ],
    options: {
      width: 30,
      height: 10,
      formatter: (value: number, { axis }: FormatterHelpers) =>
        axis === "x" ? String.fromCharCode(65 + value) : value,
    } as Settings,
  },
] satisfies readonly PlotExampleSeed[];

export const EXAMPLE_DEFINITIONS = [
  ...PLOT_EXAMPLE_DEFINITIONS.map((example) => ({
    ...example,
    method: "plot" as const,
  })),
  ...RENDER_CHART_EXAMPLES,
  ...CANDLESTICK_EXAMPLES,
  ...EXPANDED_CANDLESTICK_EXAMPLES,
  ...HEATMAP_EXAMPLES,
  ...EXPANDED_HEATMAP_EXAMPLES,
  ...SPARKLINE_EXAMPLES,
  ...EXPANDED_SPARKLINE_EXAMPLES,
  ...HISTOGRAM_EXAMPLES,
] satisfies readonly ExampleDefinition[];

const ANSI_COLOR_SEQUENCE = /\u001b\[[0-9;]*m/g;

export function getExampleSource(example: ExampleDefinition) {
  const args: unknown[] = [example.input];

  if ("options" in example && example.options !== undefined) {
    args.push(example.options);
  }

  return `${example.method}(${args.map((value) => toJavaScriptLiteral(value)).join(", ")});`;
}

export function renderExample(example: ExampleDefinition) {
  let output: string;

  switch (example.method) {
    case "plot":
      output = plot(example.input, example.options);
      break;
    case "renderChart":
      output = renderChart(example.input);
      break;
    case "candlestick":
      output = candlestick(example.input);
      break;
    case "heatmap":
      output = heatmap(example.input);
      break;
    case "sparkline":
      output = sparkline(example.input, example.options);
      break;
    case "histogram": {
      const result =
        example.inputKind === "bins"
          ? histogram(example.input)
          : histogram(example.input, example.options);
      output = JSON.stringify(result, null, 2);
      break;
    }
  }

  return output.replace(ANSI_COLOR_SEQUENCE, "");
}
