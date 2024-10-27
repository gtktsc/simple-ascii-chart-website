import React from "react";
import chart, { Coordinates, Settings } from "simple-ascii-chart";
import CodeBlock from "../../components/CopyablePlot";
import Link from "next/link";

// Helper function to render input in a compact format
function formatCompactInput(input: unknown) {
  if (!input) {
    return `[]`;
  }

  if (!Array.isArray(input)) {
    return `[]`;
  }

  if (Array.isArray(input[0][0])) {
    // Handle multi-series input (number[][][])
    return `[${(input as number[][][])
      .map(
        (series) =>
          `[${series.map((pair) => `[${pair.join(",")}]`).join(", ")}]`
      )
      .join(", ")}]`;
  } else {
    // Handle single-series input (number[][])
    return `[${(input as number[][])
      .map((pair) => `[${pair.join(",")}]`)
      .join(", ")}]`;
  }
}

export default function Examples() {
  const examples = [
    {
      title: "Basic Example with Width/Height",
      input: [
        [1, 2],
        [2, 4],
        [3, 6],
        [4, 8],
      ],
      options: { width: 30, height: 15 },
    },
    {
      title: "Logarithmic Scale",
      input: Array.from({ length: 15 }, (_, i) => [i, Math.log(i + 1)]),
      options: { width: 35, height: 15 },
    },
    {
      title: "Exponential Growth",
      input: Array.from({ length: 15 }, (_, i) => [i, Math.pow(2, i / 2)]),
      options: { width: 35, height: 15 },
    },
    {
      title: "With Area Fill",
      input: [
        [0, 1],
        [1, 1.5],
        [2, 2],
        [3, 2.5],
        [4, 3],
        [5, 3.5],
      ],
      options: { width: 20, height: 10, fillArea: true },
    },
    {
      title: "Custom Thresholds",
      input: [
        [1, 2],
        [2, 5],
        [3, 8],
        [4, 3],
        [5, 7],
        [6, 1],
      ],
      options: {
        width: 30,
        height: 10,
        thresholds: [{ y: 5 }, { x: 3 }],
      },
    },
    {
      title: "With Custom Axis Center",
      input: [
        [-3, -1],
        [-2, 0],
        [-1, 1],
        [0, 2],
        [1, 3],
        [2, 5],
        [3, 7],
      ],
      options: { width: 30, height: 10, axisCenter: [0, 0] },
    },
    {
      title: "Bar Chart",
      input: [
        [-3, -1],
        [-2, 0],
        [-1, 1],
        [0, 2],
        [1, 3],
        [2, 5],
        [3, -7],
      ],
      options: { barChart: true, width: 30, height: 20, axisCenter: [0, 0] },
    },
    {
      title: "Horizontal Bar Chart",
      input: [
        [-3, -1],
        [-2, 0],
        [-1, 1],
        [0, 2],
        [1, 3],
        [2, 5],
      ],
      options: {
        horizontalBarChart: true,
        width: 30,
        height: 20,
        axisCenter: [0, 0],
      },
    },
    {
      title: "With Title and Labels",
      input: [
        [0, 1],
        [1, 2],
        [2, 4],
        [3, 9],
        [4, 16],
        [5, 25],
      ],
      options: {
        width: 30,
        height: 10,
        title: "Sample Plot",
        xLabel: "X-Axis",
        yLabel: "Y-Axis",
      },
    },
    {
      title: "With Legend",
      input: [
        [
          [0, 1],
          [1, 2],
          [2, 4],
        ],
        [
          [0, 1],
          [1, 3],
          [2, 6],
        ],
      ],
      options: {
        width: 30,
        height: 10,
        legend: { position: "bottom", series: ["Series 1", "Series 2"] },
      },
    },
    {
      title: "Bar chart",
      input: [
        [
          [0, 1],
          [1, 2],
          [2, 4],
        ],
      ],
      options: {
        width: 30,
        barChart: true,
        height: 10,
      },
    },
    {
      title: "Bar chart with negative values and axis center",
      input: [
        [
          [0, 1],
          [1, 2],
          [2, 4],
          [3, -4],
          [4, -2],
        ],
      ],
      options: {
        width: 30,
        barChart: true,
        height: 10,
        axisCenter: [0, 0],
      },
    },
    {
      title: "Horizontal bar chart",
      input: [
        [
          [0, 1],
          [1, 2],
          [2, 4],
        ],
      ],
      options: {
        width: 30,
        horizontalBarChart: true,
        height: 10,
      },
    },
    {
      title: "Custom Formatter",
      input: [
        [0, 1],
        [1, 4],
        [2, 9],
        [3, 16],
        [4, 25],
      ],
      options: {
        width: 30,
        height: 10,
        formatter: (value, { axis }) =>
          axis === "x" ? String.fromCharCode(65 + value) : value,
      } as Settings,
    },
  ];

  return (
    <div>
      {examples.map((example, index) => {
        const result = chart(
          example.input as Coordinates,
          example.options as Settings
        );

        return (
          <div key={index}>
            <h2>{example.title || `Example ${index + 1}`}</h2>
            <div>
              <div>
                <strong>Input:</strong>
                <CodeBlock javascript>
                  {formatCompactInput(example.input)}
                </CodeBlock>
              </div>
              <div>
                <strong>Options:</strong>
                <CodeBlock javascript>
                  {JSON.stringify(example.options, null, 0)}
                </CodeBlock>
              </div>
            </div>
            <CodeBlock bash>{result}</CodeBlock>
            <Link
              href={`/playground?input=${encodeURIComponent(
                JSON.stringify(example.input)
              )}&options=${encodeURIComponent(
                JSON.stringify(example.options)
              )}`}
            >
              Open in Playground
            </Link>
          </div>
        );
      })}
    </div>
  );
}
