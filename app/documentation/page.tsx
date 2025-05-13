import React from "react";
import chart, { Coordinates, Settings } from "simple-ascii-chart";
import CodeBlock from "../../components/CopyablePlot";
import Link from "next/link";

// Define basic input for all examples
const input: Coordinates = [
  [1, 1],
  [2, 4],
  [3, 9],
  [4, 16],
  [5, 25],
];

const examples = [
  {
    id: "width-height",
    title: "Custom Width and Height",
    description: "Sets the width and height of the graph.",
    possibleValues: "Numeric values for width and height, e.g., 20, 8.",
    settings: { width: 60, height: 8 } as Settings,
  },
  {
    id: "yrange",
    title: "Y-Axis Range (yRange)",
    description: "Specifies the range for the y-axis.",
    possibleValues:
      "A tuple specifying [min, max] values for the y-axis, e.g., [0, 30].",
    settings: { yRange: [0, 30], width: 60 } as Settings,
  },
  {
    id: "show-tick-label",
    title: "Show Tick Labels",
    description: "Enables or disables tick labels on the axis.",
    possibleValues: "Boolean (true or false).",
    settings: { showTickLabel: true, width: 60 } as Settings,
  },
  {
    id: "bar-chart",
    title: "Bar chart",
    description: "Draw bar chart.",
    possibleValues: "Boolean (true or false).",
    settings: { barChart: true, width: 60 } as Settings,
  },
  {
    id: "horizontal-bar-chart",
    title: "Horizontal Bar chart",
    description: "Draw horizontal bar chart.",
    possibleValues: "Boolean (true or false).",
    settings: { horizontalBarChart: true, width: 60 } as Settings,
  },
  {
    id: "hide-x-axis",
    title: "Hide X-Axis",
    description: "Hides the x-axis from the graph.",
    possibleValues: "Boolean (true or false).",
    settings: { hideXAxis: true, width: 60 } as Settings,
  },
  {
    id: "hide-y-axis",
    title: "Hide Y-Axis",
    description: "Hides the y-axis from the graph.",
    possibleValues: "Boolean (true or false).",
    settings: { hideYAxis: true, width: 60 } as Settings,
  },
  {
    id: "title",
    title: "Plot Title",
    description: "Adds a title to the graph.",
    possibleValues:
      'A string value representing the title, e.g., "Sample Plot Title".',
    settings: { title: "Sample Plot Title", width: 60 } as Settings,
  },
  {
    id: "x-label",
    title: "X-Axis Label",
    description: "Adds a label to the x-axis.",
    possibleValues:
      'A string value representing the x-axis label, e.g., "X Axis".',
    settings: { xLabel: "X Axis", width: 60 } as Settings,
  },
  {
    id: "y-label",
    title: "Y-Axis Label",
    description: "Adds a label to the y-axis.",
    possibleValues:
      'A string value representing the y-axis label, e.g., "Y Axis".',
    settings: { yLabel: "Y Axis", width: 60 } as Settings,
  },
  {
    id: "thresholds",
    title: "Thresholds",
    description: "Adds threshold lines at specific x or y coordinates.",
    possibleValues:
      'An array of thresholds, each with optional x, y coordinates and a color, e.g., [{ x: 3, color: "ansiRed" }].',
    settings: {
      width: 60,
      thresholds: [{ x: 3 }, { y: 15 }],
    } as Settings,
  },
  {
    id: "points",
    title: "Points",
    description: "Adds points lines at specific x, y coordinates.",
    possibleValues:
      'An array of points, each x, y coordinates and a color, e.g., [{ x: 3, y:6, color: "ansiRed" }].',
    settings: {
      width: 60,
      points: [{ x: 3, y: 15 }],
    } as Settings,
  },
  {
    id: "fill-area",
    title: "Fill Area",
    description: "Fills the area under the lines.",
    possibleValues: "Boolean (true or false).",
    settings: { fillArea: true, width: 60 } as Settings,
  },
  {
    id: "legend",
    title: "Legend",
    description: "Adds a legend to the graph.",
    possibleValues:
      'An object specifying the position and series names, e.g., { position: "top", series: ["Series 1"] }.',
    settings: {
      width: 60,
      legend: { position: "top", series: ["Series 1"] },
    } as Settings,
  },
  {
    id: "axis-center",
    title: "Axis Center",
    description: "Specifies a custom center for the axes.",
    possibleValues:
      "A tuple specifying the x and y coordinates, e.g., [2, 10].",
    settings: { width: 60, axisCenter: [2, 10] } as Settings,
  },
  {
    id: "formatter",
    title: "Custom Formatter",
    description: "Formats the axis labels with custom logic.",
    possibleValues:
      "A formatter function that returns custom labels, e.g., (value, { axis }) => ...",
    settings: {
      width: 60,
      formatter: (value, { axis }) => {
        if (axis === "x") return ["A", "B", "C", "D", "E"][value - 1];
        return value;
      },
    } as Settings,
  },
  {
    id: "line-formatter",
    title: "Custom Line Formatter",
    description: "Formats the lines with custom symbols.",
    possibleValues:
      "A function that returns custom symbols for each point, e.g., (args) => { ... }",
    settings: {
      width: 60,
      lineFormatter: ({ plotX, plotY }) => {
        return [{ x: plotX, y: plotY, symbol: plotX % 2 === 0 ? "▲" : "▼" }];
      },
    } as Settings,
  },
  {
    id: "custom-symbols",
    title: "Custom Symbols",
    description: "Overrides the default axis and chart symbols.",
    possibleValues:
      'An object defining custom symbols for the axis and chart, e.g., { axis: { ns: "|", we: "-" }, chart: { ns: "*", we: "*" } }.',
    settings: {
      width: 60,
      symbols: {
        axis: { ns: "|", we: "-" },
        chart: { ns: "*", we: "*" },
      },
    } as Settings,
  },
];

export default function Documentation() {
  return (
    <div>
      <p>
        Below are examples for each configuration option. You can click on any
        option to view the corresponding example.
      </p>

      <ul>
        {examples.map((example) => (
          <li key={example.id}>
            <Link href={`#${example.id}`}>{example.title}</Link>
          </li>
        ))}
      </ul>

      {examples.map((example, index) => (
        <div key={index} id={example.id}>
          <h2>{example.title}</h2>
          <p>
            <strong>Description:</strong> {example.description}
          </p>
          <p>
            <strong>Possible Values:</strong> {example.possibleValues}
          </p>
          <CodeBlock bash>{chart(input, example.settings)}</CodeBlock>
        </div>
      ))}
    </div>
  );
}
