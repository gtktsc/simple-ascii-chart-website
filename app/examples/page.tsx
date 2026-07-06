import chart, {
  type Coordinates,
  type FormatterHelpers,
  type Settings,
} from "simple-ascii-chart";
import {
  ActionLink,
  Card,
  Prose,
  PublicPage,
  Section,
  SimpleGrid,
  Stack,
} from "@pixxl-tools/components";
import CodeSnippet from "../../components/CodeSnippet";
import {
  buildPlaygroundHref,
  toJavaScriptLiteral,
} from "../../lib/optionsSerialization.mjs";

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
    title: "With points",
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
      points: [
        { y: 5, x: 2 },
        { x: 3, y: 2 },
      ],
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
    options: { mode: "bar", width: 30, height: 20, axisCenter: [0, 0] },
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
      mode: "horizontalBar",
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
    title: "With complex Legend",
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
      title: "Legend",
      width: 30,
      points: [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ],
      thresholds: [{ x: 1, y: 2 }],
      height: 10,
      legend: {
        position: "right",
        series: ["S1", "S2"],
        thresholds: ["T1"],
        points: ["P1", "P2"],
      },
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
      mode: "bar",
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
      mode: "bar",
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
      mode: "horizontalBar",
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
      formatter: (value: number, { axis }: FormatterHelpers) =>
        axis === "x" ? String.fromCharCode(65 + value) : value,
    } as Settings,
  },
];

export default function Examples() {
  return (
    <PublicPage
      description="Generated input, settings, terminal output, and playground links."
      title="Examples"
    >
      <Stack gap="lg">
        {examples.map((example, index) => {
          const result = chart(
            example.input as Coordinates,
            example.options as Settings,
          );
          const playgroundHref = buildPlaygroundHref(
            example.input,
            example.options,
          );

          return (
            <Section
              actions={
                playgroundHref ? (
                  <ActionLink href={playgroundHref} size="sm" variant="outline">
                    Open in Playground
                  </ActionLink>
                ) : undefined
              }
              key={`${example.title}-${index}`}
              title={example.title || `Example ${index + 1}`}
            >
              <Stack gap="md">
                <SimpleGrid minItemWidth="260px">
                  <Card title="Input" variant="soft">
                    <CodeSnippet language="javascript" maxHeight="20rem">
                      {toJavaScriptLiteral(example.input)}
                    </CodeSnippet>
                  </Card>
                  <Card title="Options" variant="soft">
                    <CodeSnippet language="javascript" maxHeight="20rem">
                      {toJavaScriptLiteral(example.options)}
                    </CodeSnippet>
                  </Card>
                </SimpleGrid>

                <Card title="Output">
                  <CodeSnippet language="bash" maxHeight="28rem">
                    {result}
                  </CodeSnippet>
                </Card>

                {!playgroundHref ? (
                  <Prose density="compact">
                    <p>
                      Not shareable via URL: this example includes values that
                      cannot be safely serialized to query parameters.
                    </p>
                  </Prose>
                ) : null}
              </Stack>
            </Section>
          );
        })}
      </Stack>
    </PublicPage>
  );
}
