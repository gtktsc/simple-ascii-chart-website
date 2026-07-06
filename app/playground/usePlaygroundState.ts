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
import messages from "../../messages/en.json";

function getBrowserSearch() {
  return typeof window === "undefined" ? "" : window.location.search;
}

export function usePlaygroundState() {
  const [input] = useState<Coordinates>(() =>
    parsePlaygroundInput(
      getBrowserSearch(),
      DEFAULT_PLAYGROUND_INPUT,
      (error: unknown) => {
        console.error(messages.playground.errors.parseInputUrl, error);
      },
    ),
  );
  const [options] = useState<Settings>(() =>
    parsePlaygroundOptions(
      getBrowserSearch(),
      DEFAULT_PLAYGROUND_OPTIONS,
      (error: unknown) => {
        console.error(messages.playground.errors.parseOptionsUrl, error);
      },
    ),
  );

  return { input, options };
}
