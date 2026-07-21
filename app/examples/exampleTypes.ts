import type {
  CandlestickSpec,
  ChartSpec,
  ChartX,
  HeatmapSpec,
  HistogramData,
  HistogramOptions,
  PlotCoordinates,
  Settings,
  SparklineOptions,
} from "simple-ascii-chart";
import messages from "../../messages/en.json";

export type ExampleId = keyof typeof messages.examples.items;

export type ExampleMethod =
  | "plot"
  | "renderChart"
  | "candlestick"
  | "heatmap"
  | "sparkline"
  | "histogram";

export type PlotExampleDefinition = {
  id: ExampleId;
  input: PlotCoordinates;
  method: "plot";
  options: Settings;
};

export type RenderChartExampleDefinition = {
  id: ExampleId;
  input: ChartSpec<ChartX>;
  method: "renderChart";
};

export type CandlestickExampleDefinition = {
  id: ExampleId;
  input: CandlestickSpec;
  method: "candlestick";
};

export type HeatmapExampleDefinition = {
  id: ExampleId;
  input: HeatmapSpec;
  method: "heatmap";
};

export type SparklineExampleDefinition = {
  id: ExampleId;
  input: readonly (number | null)[];
  method: "sparkline";
  options?: SparklineOptions;
};

export type HistogramExampleDefinition =
  | {
      id: ExampleId;
      input: readonly number[];
      inputKind: "samples";
      method: "histogram";
      options?: HistogramOptions;
    }
  | {
      id: ExampleId;
      input: HistogramData;
      inputKind: "bins";
      method: "histogram";
    };

export type ExampleDefinition =
  | PlotExampleDefinition
  | RenderChartExampleDefinition
  | CandlestickExampleDefinition
  | HeatmapExampleDefinition
  | SparklineExampleDefinition
  | HistogramExampleDefinition;

