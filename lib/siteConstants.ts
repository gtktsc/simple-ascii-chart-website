import type { Coordinates, Settings } from "simple-ascii-chart";

export const SITE_ROUTES = {
  home: "/",
  usage: "/usage",
  examples: "/examples",
  documentation: "/documentation",
  playground: "/playground",
} as const;

export const EXTERNAL_LINKS = {
  libraryPackage: "https://www.npmjs.com/package/simple-ascii-chart",
  libraryRepository: "https://github.com/gtktsc/ascii-chart",
  cliPackage: "https://www.npmjs.com/package/simple-ascii-chart-cli",
  cliRepository: "https://github.com/gtktsc/simple-ascii-chart-cli",
  support: "https://buymeacoffee.com/gtktsc",
} as const;

export const PACKAGE_NAME = "simple-ascii-chart";
export const CLI_PACKAGE_NAME = "simple-ascii-chart-cli";
export const PIXEL_SITE_LOCALE = "en-US";
export const SITE_URL = "https://simple-ascii-chart.vercel.app";
export const SITE_TWITTER_HANDLE = "@gtktsc";

export const SITE_SOCIAL_IMAGE = {
  height: 630,
  path: "/og/simple-ascii-chart.png",
  width: 1200,
} as const;

export const CODE_SNIPPET_HEIGHTS = {
  homeDemo: "22rem",
  examplesSource: "20rem",
  examplesOutput: "28rem",
  documentationSource: "22rem",
  documentationPreview: "28rem",
  playgroundOutput: "32rem",
} as const;

export const DEFAULT_PLAYGROUND_INPUT: Coordinates = [
  [1, 2],
  [2, 4],
  [3, 6],
  [4, 8],
];

export const DEFAULT_PLAYGROUND_OPTIONS: Settings = {
  width: 30,
  height: 15,
};
