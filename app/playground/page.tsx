"use client";

import React, { useState } from "react";
import EditablePlot from "../../components/EditablePlot";
import { Coordinates, Settings } from "simple-ascii-chart";

function parseInputFromUrl(defaultInput: Coordinates): Coordinates {
  if (typeof window === "undefined") {
    return defaultInput;
  }

  const value = new URLSearchParams(window.location.search).get("input");

  if (!value) {
    return defaultInput;
  }

  try {
    return JSON.parse(value) as Coordinates;
  } catch (error) {
    console.error("Error parsing input URL parameter:", error);
    return defaultInput;
  }
}

function parseOptionsFromUrl(defaultOptions: Settings): Settings {
  if (typeof window === "undefined") {
    return defaultOptions;
  }

  const value = new URLSearchParams(window.location.search).get("options");

  if (!value) {
    return defaultOptions;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Error parsing options URL parameter:", error);
    return defaultOptions;
  }
}

export default function Playground() {
  const defaultInput: Coordinates = [
    [1, 2],
    [2, 4],
    [3, 6],
    [4, 8],
  ];

  const defaultOptions: Settings = {
    width: 30,
    height: 15,
  };

  const [input] = useState<Coordinates>(parseInputFromUrl(defaultInput));

  const [options] = useState<Settings>(parseOptionsFromUrl(defaultOptions));

  return (
    <div>
      <EditablePlot input={input} options={options} />
    </div>
  );
}
