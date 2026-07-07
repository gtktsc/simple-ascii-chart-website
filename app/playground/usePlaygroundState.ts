"use client";

import { useState } from "react";
import type { Coordinates, Settings } from "simple-ascii-chart";
import {
  DEFAULT_PLAYGROUND_INPUT,
  DEFAULT_PLAYGROUND_OPTIONS,
} from "../../lib/siteConstants";
import {
  parsePlaygroundInput,
  parsePlaygroundOptions,
} from "../../lib/playgroundQuery.mjs";

function getBrowserSearch() {
  return typeof window === "undefined" ? "" : window.location.search;
}

export function usePlaygroundState() {
  const [input] = useState<Coordinates>(() =>
    parsePlaygroundInput(
      getBrowserSearch(),
      DEFAULT_PLAYGROUND_INPUT,
    ),
  );
  const [options] = useState<Settings>(() =>
    parsePlaygroundOptions(
      getBrowserSearch(),
      DEFAULT_PLAYGROUND_OPTIONS,
    ),
  );

  return { input, options };
}
