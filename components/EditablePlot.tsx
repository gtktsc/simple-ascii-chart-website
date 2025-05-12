"use client";

import React from "react";
import { Coordinates, Settings } from "simple-ascii-chart";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("./DynamicEditablePlot"),
  { ssr: false }
);

type EditablePlotProps = {
  input: Coordinates;
  options: Settings;
};

export default function EditablePlot({ input, options }: EditablePlotProps) {
  return <DynamicComponentWithNoSSR input={input} options={options} />;
}
