/** Symbols used to draw chart axes. */
export declare const AXIS: {
  n: string;
  ns: string;
  y: string;
  nse: string;
  x: string;
  we: string;
  e: string;
  intersectionXY: string;
  intersectionX: string;
  intersectionY: string;
};

/** Symbols used to draw line and area charts. */
export declare const CHART: {
  we: string;
  wns: string;
  ns: string;
  nse: string;
  wsn: string;
  sne: string;
  area: string;
};

/** Symbol used for an empty graph cell. */
export declare const EMPTY: " ";

/** Symbols used to draw X-axis and Y-axis thresholds. */
export declare const THRESHOLDS: { x: string; y: string };

/** Symbol used for point overlays. */
export declare const POINT: "●";

/** Layout and formatting constants used by version 5.4.0. */
export declare const LAYOUT: {
  readonly MIN_PLOT_HEIGHT: 3;
  readonly DEFAULT_DECIMAL_PLACES: 3;
  readonly K_FORMAT_THRESHOLD: 1000;
  readonly DEFAULT_PADDING: 2;
  readonly DEFAULT_Y_SHIFT_OFFSET: 1;
};

/** Numeric X and Y coordinates. */
export type Point = [x: number, y: number];

/** Optional or partially defined axis-center coordinates. */
export type MaybePoint = Point | undefined | [number | undefined, number | undefined];

/** One numeric data series. */
export type SingleLine = Point[];

/** Multiple numeric data series. */
export type MultiLine = SingleLine[];

/** Input accepted by `plot`. */
export type Coordinates = SingleLine | MultiLine;

/** ANSI color names supported by version 5.4.0. */
export type Color = `ansi${
  | "Red"
  | "Green"
  | "Black"
  | "Yellow"
  | "Blue"
  | "Magenta"
  | "Cyan"
  | "White"}`;

/** Context received by the custom line renderer. */
export type LineFormatterArgs = {
  /** Original X coordinate. */
  x: number;
  /** Original Y coordinate. */
  y: number;
  /** Resolved plot-column coordinate. */
  plotX: number;
  /** Resolved plot-row coordinate. */
  plotY: number;
  /** Source data series. */
  input: SingleLine;
  /** Source datum index. */
  index: number;
  /** Minimum resolved Y value. */
  minY: number;
  /** Minimum resolved X value. */
  minX: number;
  /** Resolved X expansion table. */
  expansionX: number[];
  /** Resolved Y expansion table. */
  expansionY: number[];
  /** Converts data coordinates to plot coordinates. */
  toPlotCoordinates: (x: number, y: number) => Point;
};

/** Custom glyph positioned in plot coordinates. */
export type CustomSymbol = { x: number; y: number; symbol: string };

/** Context received by the axis formatter. */
export type FormatterHelpers = {
  /** Axis currently being formatted. */
  axis: "x" | "y";
  /** Resolved numeric X range. */
  xRange: number[];
  /** Resolved numeric Y range. */
  yRange: number[];
};

/** Per-call symbol overrides. */
export type Symbols = {
  /** Axis-symbol overrides. */
  axis?: Partial<typeof AXIS>;
  /** Line and area-symbol overrides. */
  chart?: Partial<typeof CHART>;
  /** Empty-cell symbol. */
  empty?: string;
  /** Background-cell symbol. */
  background?: string;
  /** Border symbol. */
  border?: string;
  /** Threshold-symbol overrides. */
  thresholds?: Partial<typeof THRESHOLDS>;
  /** Point-overlay symbol. */
  point?: string;
};

/** Axis label formatter. */
export type Formatter = (value: number, helpers: FormatterHelpers) => number | string;

/** Legend configuration. */
export type Legend = {
  /** Legend position. */
  position?: "left" | "right" | "top" | "bottom";
  /** Series label or labels. */
  series?: string | string[];
  /** Point label or labels. */
  points?: string | string[];
  /** Threshold label or labels. */
  thresholds?: string | string[];
};

/** Numeric X-axis or Y-axis threshold. */
export type Threshold = {
  /** X coordinate for a vertical threshold. */
  x?: number;
  /** Y coordinate for a horizontal threshold. */
  y?: number;
  /** ANSI threshold color. */
  color?: Color;
};

/** Numeric point overlay. */
export type GraphPoint = {
  /** X coordinate. */
  x: number;
  /** Y coordinate. */
  y: number;
  /** ANSI point color. */
  color?: Color;
};

/** Callback used to select a color for a series. */
export type ColorGetter = (series: number, coordinates: MultiLine) => Color;

/** Static or callback-based series colors. */
export type Colors = Color | Color[] | ColorGetter;

/** Plot modes supported by version 5.4.0. */
export type GraphMode = "line" | "point" | "bar" | "horizontalBar";

/** Configuration accepted by `plot` in version 5.4.0. */
export type Settings = {
  /** Static or callback-based series colors. */
  color?: Colors;
  /** Plot width in terminal columns. */
  width?: number;
  /** Plot height in terminal rows. */
  height?: number;
  /** Explicit Y-axis range as `[minimum, maximum]`. */
  yRange?: [number, number];
  /** Reserves enough space for complete Y-axis tick labels. */
  showTickLabel?: boolean;
  /** Hides the X-axis line. */
  hideXAxis?: boolean;
  /** Hides X-axis tick markers and labels. */
  hideXAxisTicks?: boolean;
  /** Hides the Y-axis line. */
  hideYAxis?: boolean;
  /** Hides Y-axis tick markers and labels. */
  hideYAxisTicks?: boolean;
  /** Explicit numeric X-axis tick values. */
  customXAxisTicks?: number[];
  /** Explicit numeric Y-axis tick values. */
  customYAxisTicks?: number[];
  /** Chart title rendered above the plot. */
  title?: string;
  /** X-axis label. */
  xLabel?: string;
  /** Y-axis label. */
  yLabel?: string;
  /** Numeric reference lines. */
  thresholds?: Threshold[];
  /** Point overlays. */
  points?: GraphPoint[];
  /** Fills the area between line series and the X-axis baseline. */
  fillArea?: boolean;
  /** Legend placement and labels. */
  legend?: Legend;
  /** Explicit X-axis and Y-axis intersection. */
  axisCenter?: MaybePoint;
  /** Shared numeric axis-label formatter. */
  formatter?: Formatter;
  /** Custom renderer function for occupied series cells. */
  lineFormatter?: (args: LineFormatterArgs) => CustomSymbol | CustomSymbol[];
  /** Per-call symbol overrides. */
  symbols?: Symbols;
  /** Graph primitive. Defaults to `line`. */
  mode?: GraphMode;
  /** Logs out-of-bounds drawing attempts. */
  debugMode?: boolean;
};

/** Plot function available in version 5.4.0. */
export declare const plot: (coordinates: Coordinates, settings?: Settings) => string;
