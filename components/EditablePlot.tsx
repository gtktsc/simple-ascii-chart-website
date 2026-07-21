"use client";

import { Coordinates, Settings } from "simple-ascii-chart";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("./DynamicEditablePlot"),
  { ssr: false }
);

type EditablePlotProps = {
  input: Coordinates;
  options: Settings;
  version: string;
};

export default function EditablePlot({ input, options, version }: EditablePlotProps) {
  return (
    <DynamicComponentWithNoSSR
      input={input}
      options={options}
      version={version}
    />
  );
}
