import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import messages from "../messages/en.json" with { type: "json" };
import legacyExampleOutputs from "../docs/versions/5.4.0/api-example-outputs.json" with { type: "json" };
import {
  ANSI_COLORS,
  ChartErrorCode,
  DEFAULT_SYMBOLS,
  candlestick,
  heatmap,
  histogram,
  plot,
  renderChart,
  sparkline,
} from "simple-ascii-chart";
import { API_DOC_SURFACES } from "./apiDocsConstants.mjs";
import { LATEST_DOCUMENTATION_VERSION } from "./documentationVersions.mjs";

const require = createRequire(import.meta.url);
const generatorDirectory = path.dirname(fileURLToPath(import.meta.url));
const ANSI_COLOR_SEQUENCE = /\u001b\[[0-9;]*m/g;
const PUBLIC_EXPORT_NAMES = [
  "ANSI_COLORS",
  "ANSI_RESET",
  "AXIS",
  "CHART",
  "EMPTY",
  "THRESHOLDS",
  "POINT",
  "LAYOUT",
  "DEFAULT_SYMBOLS",
  "ChartErrorCode",
  "ChartTypeError",
  "ChartRangeError",
];

const SURFACE_DEFINITIONS = [
  {
    id: "plot",
    signature: "plot(data: PlotCoordinates, settings?: Settings): string",
    groups: [
      "Settings",
      "Legend",
      "Threshold",
      "GraphPoint",
      "XAxis",
      "YAxis",
      "Coloring",
      "ChartValueLabels",
    ],
  },
  {
    id: "render-chart",
    signature: "renderChart<X extends ChartX>(spec: ChartSpec<X>): string",
    groups: [
      "ChartSpec",
      "ChartSeries",
      "ChartLegend",
      "ChartOverlayPoint",
      "ChartThreshold",
      "XAxis",
      "YAxis",
      "Coloring",
      "ChartValueLabels",
      "ChartSpanAnnotation",
      "ChartTextAnnotation",
      "ChartArrowAnnotation",
      "ChartErrorBarAnnotation",
    ],
  },
  {
    id: "candlestick",
    signature: "candlestick(spec: CandlestickSpec): string",
    groups: [
      "CandlestickSpec",
      "CandlestickStyle",
      "CandlestickMarkStyle",
      "CandlestickSymbols",
      "XAxis",
      "YAxis",
    ],
  },
  {
    id: "heatmap",
    signature: "heatmap(spec: HeatmapSpec): string",
    groups: [
      "HeatmapSpec",
      "HeatmapLevel",
      "HeatmapThreshold",
      "HeatmapSymbols",
    ],
  },
  {
    id: "sparkline",
    signature: "sparkline(values, options?: SparklineOptions): string",
    groups: ["SparklineOptions", "SparklineThreshold", "SparklineSymbols"],
  },
  {
    id: "histogram",
    signature: "histogram(values, options?: HistogramOptions): HistogramData",
    groups: ["HistogramOptions"],
  },
  {
    id: "renderers",
    signature: "type Renderer = 'ascii' | 'braille'",
    groups: [],
  },
  {
    id: "reference",
    signature: "import * as asciiChart from 'simple-ascii-chart'",
    groups: [
      "Symbols",
      "SparklineSymbols",
      "HeatmapSymbols",
      "CandlestickSymbols",
      "AnnotationSymbols",
      "ArrowHeadSymbols",
      "ErrorBarSymbols",
      "ColorContext",
      "FormatterHelpers",
      "LineFormatterArgs",
      "ValueLabelContext",
    ],
    references: [
      "GraphMode",
      "Interpolation",
      "Overflow",
      "Renderer",
      "ChartWidth",
      "LabelCollisionPolicy",
      "LegendPosition",
      "BarLayout",
      "XScale",
      "Color",
      "ChartX",
      "PlotCoordinates",
      "ChartDatum",
      "CandlestickDatum",
      "HeatmapValue",
      "HistogramData",
      "SparklineColor",
    ],
  },
];

const LEGACY_SURFACE_DEFINITIONS = [
  {
    id: "plot",
    signature: "plot(coordinates: Coordinates, settings?: Settings): string",
    groups: ["Settings", "Legend", "Threshold", "GraphPoint"],
  },
  {
    id: "reference",
    signature: "import plot, * as asciiChart from 'simple-ascii-chart'",
    groups: ["Symbols", "FormatterHelpers", "LineFormatterArgs"],
    references: [
      "GraphMode",
      "Color",
      "Coordinates",
      "Point",
      "MaybePoint",
      "Colors",
    ],
  },
];

const plotInput = [
  [0, 2],
  [1, 5],
  [2, 3],
  [3, 8],
];

const exampleDefinitions = [
  {
    id: "plot-complete",
    surface: "plot",
    code: `plot([[0, 2], [1, 5], [2, 3], [3, 8]], {
  width: 30,
  height: 10,
  title: 'Requests',
  color: 'ansiCyan',
  interpolation: 'linear',
  xAxis: { ticks: 4, label: 'minute' },
  yAxis: { domain: [0, 10], label: 'requests' },
});`,
    render: () =>
      plot(plotInput, {
        width: 30,
        height: 10,
        title: "Requests",
        color: "ansiCyan",
        interpolation: "linear",
        xAxis: { ticks: 4, label: "minute" },
        yAxis: { domain: [0, 10], label: "requests" },
      }),
  },
  {
    id: "structured-complete",
    surface: "render-chart",
    code: `renderChart({
  width: 42,
  height: 10,
  series: [
    { id: 'latency', data: [['Mon', 42], ['Tue', 68], ['Wed', 51]] },
    { id: 'errors', data: [['Mon', 2], ['Tue', 7], ['Wed', 3]], yAxis: 'secondary' },
  ],
  xAxis: { scale: 'band' },
  secondaryYAxis: { domain: [0, 10] },
  annotations: [{ id: 'warning', type: 'span', axis: 'y', from: 60, to: 80 }],
  legend: { position: 'bottom', series: true },
});`,
    render: () =>
      renderChart({
        width: 42,
        height: 10,
        series: [
          {
            id: "latency",
            data: [
              ["Mon", 42],
              ["Tue", 68],
              ["Wed", 51],
            ],
          },
          {
            id: "errors",
            data: [
              ["Mon", 2],
              ["Tue", 7],
              ["Wed", 3],
            ],
            yAxis: "secondary",
          },
        ],
        xAxis: { scale: "band" },
        secondaryYAxis: { domain: [0, 10] },
        annotations: [
          { id: "warning", type: "span", axis: "y", from: 60, to: 80 },
        ],
        legend: { position: "bottom", series: true },
      }),
  },
  {
    id: "candlestick-complete",
    surface: "candlestick",
    code: `candlestick({
  width: 30,
  height: 10,
  data: [[0, 100, 112, 96, 108], [1, 108, 114, 102, 105]],
  style: {
    rising: { symbol: '+', color: 'ansiGreen' },
    falling: { symbol: 'x', color: 'ansiRed' },
  },
  thresholds: [{ id: 'target', y: 110, color: 'ansiCyan' }],
});`,
    render: () =>
      candlestick({
        width: 30,
        height: 10,
        data: [
          [0, 100, 112, 96, 108],
          [1, 108, 114, 102, 105],
        ],
        style: {
          rising: { symbol: "+", color: "ansiGreen" },
          falling: { symbol: "x", color: "ansiRed" },
        },
        thresholds: [{ id: "target", y: 110, color: "ansiCyan" }],
      }),
  },
  {
    id: "heatmap-levels",
    surface: "heatmap",
    code: `heatmap({
  columns: ['Linux', 'macOS', 'Windows'],
  rows: ${JSON.stringify(messages.generator.exampleData.nodeVersions)},
  data: [['pass', 'pass', 'fail'], ['pass', 'pending', 'pass']],
  levels: [
    { value: 'pass', symbol: '●', color: 'ansiGreen', label: 'Passed' },
    { value: 'pending', symbol: '○', color: 'ansiYellow', label: 'Pending' },
    { value: 'fail', symbol: '×', color: 'ansiRed', label: 'Failed' },
  ],
  legend: true,
});`,
    render: () =>
      heatmap({
        columns: ["Linux", "macOS", "Windows"],
        rows: messages.generator.exampleData.nodeVersions,
        data: [
          ["pass", "pass", "fail"],
          ["pass", "pending", "pass"],
        ],
        levels: [
          { value: "pass", symbol: "●", color: "ansiGreen", label: "Passed" },
          {
            value: "pending",
            symbol: "○",
            color: "ansiYellow",
            label: "Pending",
          },
          { value: "fail", symbol: "×", color: "ansiRed", label: "Failed" },
        ],
        legend: true,
      }),
  },
  {
    id: "heatmap-threshold",
    surface: "heatmap",
    code: `heatmap({
  data: [[42, 68, 83], [35, 79, null]],
  threshold: {
    value: 80,
    belowColor: 'ansiCyan',
    aboveColor: 'ansiBrightRed',
    belowSymbol: '·',
    aboveSymbol: '!',
  },
});`,
    render: () =>
      heatmap({
        data: [
          [42, 68, 83],
          [35, 79, null],
        ],
        threshold: {
          value: 80,
          belowColor: "ansiCyan",
          aboveColor: "ansiBrightRed",
          belowSymbol: "·",
          aboveSymbol: "!",
        },
      }),
  },
  {
    id: "sparkline-options",
    surface: "sparkline",
    code: `sparkline([1, 3, null, 2], {
  threshold: { value: 3, belowColor: 'ansiBlue', aboveColor: 'ansiRed' },
  symbols: { empty: '_' },
});`,
    render: () =>
      sparkline([1, 3, null, 2], {
        threshold: { value: 3, belowColor: "ansiBlue", aboveColor: "ansiRed" },
        symbols: { empty: "_" },
      }),
  },
  {
    id: "histogram-options",
    surface: "histogram",
    code: "histogram([1, 1, 2, 2, 2, 4], { binCount: 3 });",
    render: () =>
      JSON.stringify(histogram([1, 1, 2, 2, 2, 4], { binCount: 3 }), null, 2),
  },
  {
    id: "renderer-ascii",
    surface: "renderers",
    code: "plot(data, { renderer: 'ascii', width: 30, height: 8 });",
    render: () => plot(plotInput, { renderer: "ascii", width: 30, height: 8 }),
  },
  {
    id: "renderer-braille",
    surface: "renderers",
    code: "plot(data, { renderer: 'braille', width: 30, height: 8 });",
    render: () =>
      plot(plotInput, { renderer: "braille", width: 30, height: 8 }),
  },
  {
    id: "public-reference",
    surface: "reference",
    code: `console.log(DEFAULT_SYMBOLS.sparkline.levels);
console.log(Object.keys(ANSI_COLORS));
console.log(ChartErrorCode);`,
    render: () =>
      [
        DEFAULT_SYMBOLS.sparkline.levels.join(" "),
        Object.keys(ANSI_COLORS).join(", "),
        Object.values(ChartErrorCode).join("\n"),
      ].join("\n\n"),
  },
];

const legacyExampleDefinitions = [
  {
    id: "plot-legacy-complete",
    surface: "plot",
    code: `plot([[0, 2], [1, 5], [2, 3], [3, 8]], {
  width: 30,
  height: 10,
  title: 'Requests',
  color: 'ansiCyan',
  xLabel: 'minute',
  yLabel: 'requests',
});`,
    output: legacyExampleOutputs["plot-legacy-complete"],
  },
  {
    id: "public-reference-legacy",
    surface: "reference",
    code: `console.log(Object.keys(AXIS));
console.log(Object.keys(CHART));
console.log(LAYOUT);`,
    output: legacyExampleOutputs["public-reference-legacy"],
  },
];

const optionCoverageByExample = {
  "plot-complete": [
    "Settings.color",
    "Settings.width",
    "Settings.height",
    "Settings.aspectRatio",
    "Settings.yRange",
    "Settings.overflow",
    "Settings.renderer",
    "Settings.showTickLabel",
    "Settings.hideXAxis",
    "Settings.hideXAxisTicks",
    "Settings.hideYAxis",
    "Settings.hideYAxisTicks",
    "Settings.customXAxisTicks",
    "Settings.customYAxisTicks",
    "Settings.title",
    "Settings.titleColor",
    "Settings.xLabel",
    "Settings.yLabel",
    "Settings.thresholds",
    "Settings.points",
    "Settings.fillArea",
    "Settings.legend",
    "Settings.axisCenter",
    "Settings.formatter",
    "Settings.lineFormatter",
    "Settings.symbols",
    "Settings.borderColor",
    "Settings.backgroundColor",
    "Settings.mode",
    "Settings.interpolation",
    "Settings.coloring",
    "Settings.barLayout",
    "Settings.valueLabels",
    "Settings.debugMode",
    "Settings.xAxis",
    "Settings.yAxis",
    "Legend.position",
    "Legend.series",
    "Legend.points",
    "Legend.thresholds",
    "Legend.color",
    "Threshold.x",
    "Threshold.y",
    "Threshold.color",
    "GraphPoint.x",
    "GraphPoint.y",
    "GraphPoint.color",
    "XAxis.scale",
    "XAxis.domain",
    "XAxis.ticks",
    "XAxis.label",
    "XAxis.formatter",
    "XAxis.hidden",
    "XAxis.hideTicks",
    "XAxis.labelCollision",
    "XAxis.color",
    "YAxis.domain",
    "YAxis.ticks",
    "YAxis.label",
    "YAxis.formatter",
    "YAxis.hidden",
    "YAxis.hideTicks",
    "YAxis.showTickLabel",
    "YAxis.color",
    "Coloring.type",
    "Coloring.getColor",
    "Coloring.by",
    "Coloring.colors",
    "Coloring.domain",
    "ChartValueLabels.formatter",
    "ChartValueLabels.color",
  ],
  "structured-complete": [
    "ChartSpec.series",
    "ChartSpec.width",
    "ChartSpec.height",
    "ChartSpec.aspectRatio",
    "ChartSpec.title",
    "ChartSpec.titleColor",
    "ChartSpec.overflow",
    "ChartSpec.renderer",
    "ChartSpec.xAxis",
    "ChartSpec.yAxis",
    "ChartSpec.secondaryYAxis",
    "ChartSpec.legend",
    "ChartSpec.axisCenter",
    "ChartSpec.points",
    "ChartSpec.thresholds",
    "ChartSpec.annotations",
    "ChartSpec.symbols",
    "ChartSpec.borderColor",
    "ChartSpec.backgroundColor",
    "ChartSpec.debugMode",
    "ChartSpec.barLayout",
    "ChartSpec.valueLabels",
    "ChartSeries.id",
    "ChartSeries.name",
    "ChartSeries.data",
    "ChartSeries.mode",
    "ChartSeries.interpolation",
    "ChartSeries.color",
    "ChartSeries.coloring",
    "ChartSeries.fillArea",
    "ChartSeries.lineFormatter",
    "ChartSeries.yAxis",
    "ChartLegend.position",
    "ChartLegend.series",
    "ChartLegend.points",
    "ChartLegend.thresholds",
    "ChartLegend.color",
    "ChartOverlayPoint.x",
    "ChartOverlayPoint.y",
    "ChartOverlayPoint.color",
    "ChartOverlayPoint.id",
    "ChartOverlayPoint.name",
    "ChartThreshold.x",
    "ChartThreshold.y",
    "ChartThreshold.color",
    "ChartThreshold.id",
    "ChartThreshold.name",
    "XAxis.scale",
    "XAxis.domain",
    "XAxis.ticks",
    "XAxis.label",
    "XAxis.formatter",
    "XAxis.hidden",
    "XAxis.hideTicks",
    "XAxis.labelCollision",
    "XAxis.color",
    "YAxis.domain",
    "YAxis.ticks",
    "YAxis.label",
    "YAxis.formatter",
    "YAxis.hidden",
    "YAxis.hideTicks",
    "YAxis.showTickLabel",
    "YAxis.color",
    "Coloring.type",
    "Coloring.getColor",
    "Coloring.by",
    "Coloring.colors",
    "Coloring.domain",
    "ChartValueLabels.formatter",
    "ChartValueLabels.color",
    "ChartSpanAnnotation.id",
    "ChartSpanAnnotation.color",
    "ChartSpanAnnotation.type",
    "ChartSpanAnnotation.axis",
    "ChartSpanAnnotation.from",
    "ChartSpanAnnotation.to",
    "ChartSpanAnnotation.symbol",
    "ChartTextAnnotation.id",
    "ChartTextAnnotation.color",
    "ChartTextAnnotation.type",
    "ChartTextAnnotation.x",
    "ChartTextAnnotation.y",
    "ChartTextAnnotation.text",
    "ChartTextAnnotation.align",
    "ChartArrowAnnotation.id",
    "ChartArrowAnnotation.color",
    "ChartArrowAnnotation.type",
    "ChartArrowAnnotation.from",
    "ChartArrowAnnotation.to",
    "ChartArrowAnnotation.lineSymbol",
    "ChartErrorBarAnnotation.id",
    "ChartErrorBarAnnotation.color",
    "ChartErrorBarAnnotation.type",
    "ChartErrorBarAnnotation.x",
    "ChartErrorBarAnnotation.y",
    "ChartErrorBarAnnotation.yError",
  ],
  "candlestick-complete": [
    "CandlestickSpec.data",
    "CandlestickSpec.width",
    "CandlestickSpec.height",
    "CandlestickSpec.title",
    "CandlestickSpec.xAxis",
    "CandlestickSpec.yAxis",
    "CandlestickSpec.style",
    "CandlestickSpec.thresholds",
    "CandlestickSpec.symbols",
    "CandlestickSpec.debugMode",
    "CandlestickStyle.wick",
    "CandlestickStyle.rising",
    "CandlestickStyle.falling",
    "CandlestickStyle.unchanged",
    "CandlestickMarkStyle.symbol",
    "CandlestickMarkStyle.color",
    "CandlestickSymbols.wick",
    "CandlestickSymbols.rising",
    "CandlestickSymbols.falling",
    "CandlestickSymbols.unchanged",
    "XAxis.scale",
    "XAxis.domain",
    "XAxis.ticks",
    "XAxis.label",
    "XAxis.formatter",
    "XAxis.hidden",
    "XAxis.hideTicks",
    "XAxis.labelCollision",
    "XAxis.color",
    "YAxis.domain",
    "YAxis.ticks",
    "YAxis.label",
    "YAxis.formatter",
    "YAxis.hidden",
    "YAxis.hideTicks",
    "YAxis.showTickLabel",
    "YAxis.color",
  ],
  "heatmap-levels": [
    "HeatmapSpec.rows",
    "HeatmapSpec.columns",
    "HeatmapSpec.title",
    "HeatmapSpec.legend",
    "HeatmapSpec.symbols",
    "HeatmapSpec.data",
    "HeatmapSpec.levels",
    "HeatmapLevel.value",
    "HeatmapLevel.symbol",
    "HeatmapLevel.color",
    "HeatmapLevel.label",
    "HeatmapSymbols.cell",
    "HeatmapSymbols.empty",
    "HeatmapSymbols.gap",
  ],
  "heatmap-threshold": [
    "HeatmapSpec.data",
    "HeatmapSpec.threshold",
    "HeatmapThreshold.value",
    "HeatmapThreshold.belowColor",
    "HeatmapThreshold.aboveColor",
    "HeatmapThreshold.belowSymbol",
    "HeatmapThreshold.aboveSymbol",
    "HeatmapThreshold.belowLabel",
    "HeatmapThreshold.aboveLabel",
    "HeatmapSymbols.belowThreshold",
    "HeatmapSymbols.aboveThreshold",
  ],
  "sparkline-options": [
    "SparklineOptions.symbols",
    "SparklineOptions.color",
    "SparklineOptions.threshold",
    "SparklineThreshold.value",
    "SparklineThreshold.belowColor",
    "SparklineThreshold.aboveColor",
    "SparklineSymbols.levels",
    "SparklineSymbols.empty",
  ],
  "histogram-options": ["HistogramOptions.binCount"],
  "public-reference": [
    "Symbols.axis",
    "Symbols.chart",
    "Symbols.empty",
    "Symbols.background",
    "Symbols.border",
    "Symbols.thresholds",
    "Symbols.point",
    "Symbols.candlestick",
    "Symbols.annotations",
    "Symbols.ellipsis",
    "SparklineSymbols.levels",
    "SparklineSymbols.empty",
    "HeatmapSymbols.cell",
    "HeatmapSymbols.belowThreshold",
    "HeatmapSymbols.aboveThreshold",
    "HeatmapSymbols.empty",
    "HeatmapSymbols.gap",
    "CandlestickSymbols.wick",
    "CandlestickSymbols.rising",
    "CandlestickSymbols.falling",
    "CandlestickSymbols.unchanged",
    "AnnotationSymbols.span",
    "AnnotationSymbols.arrowLine",
    "AnnotationSymbols.arrowHeads",
    "AnnotationSymbols.errorBar",
    "ArrowHeadSymbols.left",
    "ArrowHeadSymbols.right",
    "ArrowHeadSymbols.up",
    "ArrowHeadSymbols.down",
    "ArrowHeadSymbols.upLeft",
    "ArrowHeadSymbols.upRight",
    "ArrowHeadSymbols.downLeft",
    "ArrowHeadSymbols.downRight",
    "ErrorBarSymbols.horizontal",
    "ErrorBarSymbols.vertical",
    "ErrorBarSymbols.leftCap",
    "ErrorBarSymbols.rightCap",
    "ErrorBarSymbols.topCap",
    "ErrorBarSymbols.bottomCap",
    "ErrorBarSymbols.center",
    "ColorContext.series",
    "ColorContext.mode",
    "ColorContext.x",
    "ColorContext.y",
    "ColorContext.plotX",
    "ColorContext.plotY",
    "FormatterHelpers.axis",
    "FormatterHelpers.xRange",
    "FormatterHelpers.yRange",
    "LineFormatterArgs.x",
    "LineFormatterArgs.y",
    "LineFormatterArgs.plotX",
    "LineFormatterArgs.plotY",
    "LineFormatterArgs.input",
    "LineFormatterArgs.index",
    "LineFormatterArgs.minY",
    "LineFormatterArgs.minX",
    "LineFormatterArgs.expansionX",
    "LineFormatterArgs.expansionY",
    "LineFormatterArgs.toPlotCoordinates",
    "ValueLabelContext.seriesIndex",
    "ValueLabelContext.seriesId",
    "ValueLabelContext.seriesName",
    "ValueLabelContext.datumIndex",
    "ValueLabelContext.x",
    "ValueLabelContext.y",
    "ValueLabelContext.mode",
    "ValueLabelContext.layout",
  ],
};

const legacyOptionCoverageByExample = {
  "plot-legacy-complete": [
    "Settings.color",
    "Settings.width",
    "Settings.height",
    "Settings.yRange",
    "Settings.showTickLabel",
    "Settings.hideXAxis",
    "Settings.hideXAxisTicks",
    "Settings.hideYAxis",
    "Settings.hideYAxisTicks",
    "Settings.customXAxisTicks",
    "Settings.customYAxisTicks",
    "Settings.title",
    "Settings.xLabel",
    "Settings.yLabel",
    "Settings.thresholds",
    "Settings.points",
    "Settings.fillArea",
    "Settings.legend",
    "Settings.axisCenter",
    "Settings.formatter",
    "Settings.lineFormatter",
    "Settings.symbols",
    "Settings.mode",
    "Settings.debugMode",
    "Legend.position",
    "Legend.series",
    "Legend.points",
    "Legend.thresholds",
    "Threshold.x",
    "Threshold.y",
    "Threshold.color",
    "GraphPoint.x",
    "GraphPoint.y",
    "GraphPoint.color",
  ],
  "public-reference-legacy": [
    "Symbols.axis",
    "Symbols.chart",
    "Symbols.empty",
    "Symbols.background",
    "Symbols.border",
    "Symbols.thresholds",
    "Symbols.point",
    "FormatterHelpers.axis",
    "FormatterHelpers.xRange",
    "FormatterHelpers.yRange",
    "LineFormatterArgs.x",
    "LineFormatterArgs.y",
    "LineFormatterArgs.plotX",
    "LineFormatterArgs.plotY",
    "LineFormatterArgs.input",
    "LineFormatterArgs.index",
    "LineFormatterArgs.minY",
    "LineFormatterArgs.minX",
    "LineFormatterArgs.expansionX",
    "LineFormatterArgs.expansionY",
    "LineFormatterArgs.toPlotCoordinates",
  ],
};

function findPackageRoot() {
  let current = path.dirname(require.resolve("simple-ascii-chart"));

  while (!fs.existsSync(path.join(current, "package.json"))) {
    const parent = path.dirname(current);
    if (parent === current)
      throw new Error(messages.generator.errors.missingPackageRoot);
    current = parent;
  }

  return current;
}

function readDefaultTypeDefinitions(version) {
  if (version === "5.4.0") {
    return fs.readFileSync(
      path.resolve(generatorDirectory, "../docs/versions/5.4.0/index.d.ts"),
      "utf8",
    );
  }

  return fs.readFileSync(
    path.join(findPackageRoot(), "dist/index.d.ts"),
    "utf8",
  );
}

function jsDocText(node) {
  const comments = ts
    .getJSDocCommentsAndTags(node)
    .filter((entry) => ts.isJSDoc(entry))
    .map((entry) => entry.comment)
    .filter(Boolean)
    .map((comment) =>
      typeof comment === "string"
        ? comment
        : comment.map((part) => part.text).join(""),
    );

  return comments.join("\n").trim();
}

function propertyName(member, sourceFile) {
  if (!member.name) return "";
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
    return member.name.text;
  return member.name.getText(sourceFile);
}

function mergeOptions(options) {
  const merged = new Map();

  options.forEach((option) => {
    const current = merged.get(option.key);
    if (!current) {
      merged.set(option.key, option);
      return;
    }

    merged.set(option.key, {
      ...current,
      description: current.description || option.description,
      required: current.required && option.required,
      typeSignature:
        current.typeSignature === option.typeSignature
          ? current.typeSignature
          : `${current.typeSignature} | ${option.typeSignature}`,
    });
  });

  return [...merged.values()];
}

function collectOptions(node, context, seen = new Set()) {
  if (!node) return [];
  if (ts.isParenthesizedTypeNode(node))
    return collectOptions(node.type, context, seen);
  if (ts.isTypeLiteralNode(node)) {
    return node.members.filter(ts.isPropertySignature).map((member) => ({
      key: propertyName(member, context.sourceFile),
      anchor: propertyName(member, context.sourceFile)
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase(),
      typeSignature: member.type?.getText(context.sourceFile) ?? "unknown",
      description: jsDocText(member),
      required: !member.questionToken,
    }));
  }
  if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node)) {
    return mergeOptions(
      node.types.flatMap((type) => collectOptions(type, context, seen)),
    );
  }
  if (!ts.isTypeReferenceNode(node)) return [];

  const referenceName = node.typeName.getText(context.sourceFile);
  if (["Readonly", "Partial"].includes(referenceName)) {
    return collectOptions(node.typeArguments?.[0], context, seen);
  }
  if (referenceName === "Omit") {
    const omitted = new Set(
      node.typeArguments?.[1]
        ? [
            ...node.typeArguments[1]
              .getText(context.sourceFile)
              .matchAll(/["']([^"']+)["']/g),
          ].map((match) => match[1])
        : [],
    );
    return collectOptions(node.typeArguments?.[0], context, seen).filter(
      ({ key }) => !omitted.has(key),
    );
  }
  if (seen.has(referenceName)) return [];
  const declaration = context.aliases.get(referenceName);
  if (!declaration) return [];
  return collectOptions(
    declaration.type,
    context,
    new Set([...seen, referenceName]),
  );
}

export function parsePublicTypeDefinitions(dtsContent) {
  const sourceFile = ts.createSourceFile(
    "index.d.ts",
    dtsContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const aliases = new Map(
    sourceFile.statements
      .filter(ts.isTypeAliasDeclaration)
      .map((declaration) => [declaration.name.text, declaration]),
  );
  const context = { aliases, sourceFile };

  return Object.fromEntries(
    [...aliases].map(([name, declaration]) => [
      name,
      {
        name,
        description: jsDocText(declaration),
        signature: declaration.type.getText(sourceFile),
        options: collectOptions(declaration.type, context),
      },
    ]),
  );
}

export function parsePublicValueDefinitions(dtsContent) {
  const sourceFile = ts.createSourceFile(
    "index.d.ts",
    dtsContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const values = [];

  sourceFile.statements.forEach((statement) => {
    if (ts.isVariableStatement(statement)) {
      statement.declarationList.declarations.forEach((declaration) => {
        const name = declaration.name.getText(sourceFile);
        values.push({
          name,
          description: jsDocText(statement) || jsDocText(declaration),
          signature: declaration.getText(sourceFile),
        });
      });
    }
    if (ts.isClassDeclaration(statement) && statement.name) {
      values.push({
        name: statement.name.text,
        description: jsDocText(statement),
        signature: statement.getText(sourceFile),
      });
    }
  });

  const valuesByName = new Map(values.map((value) => [value.name, value]));

  sourceFile.statements
    .filter(ts.isExportDeclaration)
    .filter((statement) =>
      statement.exportClause
        ? ts.isNamedExports(statement.exportClause)
        : false,
    )
    .flatMap((statement) => statement.exportClause.elements)
    .forEach((specifier) => {
      const localName = (specifier.propertyName ?? specifier.name).text;
      const exportedName = specifier.name.text;
      const value = valuesByName.get(localName);

      if (!value || exportedName === localName) return;

      values.push({
        ...value,
        name: exportedName,
        signature: value.signature.replace(localName, exportedName),
      });
    });

  return Object.fromEntries(values.map((value) => [value.name, value]));
}

function sanitizeOutput(output) {
  return output.replace(ANSI_COLOR_SEQUENCE, "");
}

function anchorFor(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function validateApiDocs(surfaces, expectedSurfaceIds = API_DOC_SURFACES) {
  const ids = surfaces.map(({ id }) => id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(messages.generator.errors.duplicateSurfaceId);
  }
  if (ids.join("|") !== expectedSurfaceIds.join("|")) {
    throw new Error(
      messages.generator.errors.incompleteSurfaces.replace(
        "{ids}",
        ids.join(", "),
      ),
    );
  }

  surfaces.forEach((surface) => {
    const exampleIds = surface.examples.map(({ id }) => id);
    if (new Set(exampleIds).size !== exampleIds.length) {
      throw new Error(
        messages.generator.errors.duplicateExampleId.replace(
          "{id}",
          surface.id,
        ),
      );
    }

    const anchors = surface.optionGroups.map(({ name }) => anchorFor(name));
    if (new Set(anchors).size !== anchors.length) {
      throw new Error(
        messages.generator.errors.duplicateAnchor.replace("{id}", surface.id),
      );
    }

    const groupNames = new Set(surface.optionGroups.map(({ name }) => name));
    const knownPaths = new Set(
      surface.optionGroups.flatMap((group) =>
        group.options.map((option) => `${group.name}.${option.key}`),
      ),
    );
    const coveredPaths = new Set(
      surface.examples.flatMap(({ covers }) => covers),
    );

    coveredPaths.forEach((coveredPath) => {
      if (!knownPaths.has(coveredPath)) {
        throw new Error(
          messages.generator.errors.unknownCoveragePath.replace(
            "{path}",
            coveredPath,
          ),
        );
      }
    });
    knownPaths.forEach((knownPath) => {
      if (!coveredPaths.has(knownPath)) {
        throw new Error(
          messages.generator.errors.missingOptionExample.replace(
            "{path}",
            knownPath,
          ),
        );
      }
    });

    surface.optionGroups.forEach((group) => {
      if (!group.description) {
        throw new Error(
          messages.generator.errors.missingTypeDescription.replace(
            "{name}",
            group.name,
          ),
        );
      }
      if (group.options.length === 0) {
        throw new Error(
          messages.generator.errors.missingTypeOptions.replace(
            "{name}",
            group.name,
          ),
        );
      }
      group.options.forEach((option) => {
        if (!option.description) {
          throw new Error(
            messages.generator.errors.missingOptionDescription.replace(
              "{path}",
              `${group.name}.${option.key}`,
            ),
          );
        }
        if (option.exampleIds.length === 0) {
          throw new Error(
            messages.generator.errors.missingOptionExample.replace(
              "{path}",
              `${group.name}.${option.key}`,
            ),
          );
        }
      });
    });
    surface.examples.forEach((example) => {
      if (!example.code.trim() || !example.output.trim()) {
        throw new Error(
          messages.generator.errors.incompleteExample.replace(
            "{id}",
            example.id,
          ),
        );
      }
    });
    if (groupNames.size > 0 && surface.examples.length === 0) {
      throw new Error(
        messages.generator.errors.missingSurfaceExamples.replace(
          "{id}",
          surface.id,
        ),
      );
    }
    surface.exports.forEach((exportDoc) => {
      if (!exportDoc.description || !exportDoc.signature) {
        throw new Error(
          messages.generator.errors.missingExportDescription.replace(
            "{name}",
            exportDoc.name,
          ),
        );
      }
    });
  });
}

export function generateApiDocs({
  version = LATEST_DOCUMENTATION_VERSION,
  dtsContent = readDefaultTypeDefinitions(version),
} = {}) {
  const legacy = version === "5.4.0";
  const surfaceDefinitions = legacy
    ? LEGACY_SURFACE_DEFINITIONS
    : SURFACE_DEFINITIONS;
  const definitions = legacy ? legacyExampleDefinitions : exampleDefinitions;
  const coverage = legacy
    ? legacyOptionCoverageByExample
    : optionCoverageByExample;
  const publicExportNames = legacy
    ? ["AXIS", "CHART", "EMPTY", "THRESHOLDS", "POINT", "LAYOUT"]
    : PUBLIC_EXPORT_NAMES;
  const types = parsePublicTypeDefinitions(dtsContent);
  const values = parsePublicValueDefinitions(dtsContent);
  const surfaces = surfaceDefinitions.map(
    ({ references = [], ...definition }) => {
      const examples = definitions
        .filter(({ surface }) => surface === definition.id)
        .map(({ render, ...example }) => ({
          ...example,
          covers: coverage[example.id] ?? [],
          output: sanitizeOutput(render ? render() : example.output),
        }));

      return {
        ...definition,
        optionGroups: definition.groups.map((name) => {
          const type = types[name];
          if (!type) {
            throw new Error(
              messages.generator.errors.missingPublicType.replace(
                "{name}",
                name,
              ),
            );
          }
          return {
            ...type,
            options: type.options.map((option) => ({
              ...option,
              exampleIds: examples
                .filter(({ covers }) =>
                  covers.includes(`${name}.${option.key}`),
                )
                .map(({ id }) => id),
            })),
          };
        }),
        typeReferences: references.map((name) => {
          const type = types[name];
          if (!type) {
            throw new Error(
              messages.generator.errors.missingPublicType.replace(
                "{name}",
                name,
              ),
            );
          }
          if (!type.description) {
            throw new Error(
              messages.generator.errors.missingTypeDescription.replace(
                "{name}",
                name,
              ),
            );
          }
          return {
            ...type,
            options: type.options.map((option) => ({
              ...option,
              exampleIds: [],
            })),
          };
        }),
        examples,
        exports:
          definition.id === "reference"
            ? publicExportNames.map((name) => {
                const exportDoc = values[name];
                if (!exportDoc) {
                  throw new Error(
                    messages.generator.errors.missingPublicExport.replace(
                      "{name}",
                      name,
                    ),
                  );
                }
                return exportDoc;
              })
            : [],
      };
    },
  );

  validateApiDocs(
    surfaces,
    surfaceDefinitions.map(({ id }) => id),
  );
  return surfaces;
}
