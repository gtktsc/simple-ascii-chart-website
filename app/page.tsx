import Image from "next/image";
import {
  ActionLink,
  Card,
  Link as PixxlLink,
  Prose,
  PublicPage,
  Section,
  SimpleGrid,
  Stack,
} from "@pixxl/components";
import CodeSnippet from "../components/CodeSnippet";

const demoCode = `let step = 0;
const interval = 0.1;
const maxPoints = 20;
const sinPoints: Point[] = [];
const cosPoints: Point[] = [];

setInterval(() => {
  console.clear();

  sinPoints.push([step, Math.sin(step)]);
  cosPoints.push([step, Math.cos(step)]);

  if (sinPoints.length > maxPoints) sinPoints.shift();
  if (cosPoints.length > maxPoints) cosPoints.shift();

  console.log(
    plot([sinPoints, cosPoints], {
      showTickLabel: true,
      color: ['ansiRed', 'ansiBlue'],
      width: 120,
      height: 16,
      yRange: [-1, 1],
      xLabel: 'Step (π)',
      yLabel: 'Amplitude',
      legend: { position: 'bottom', series: ['Sine', 'Cosine'] },
      axisCenter: [undefined, 0],
      formatter: (x, { axis }) => {
        if (axis === 'y') return x;
        return \`\${(x / Math.PI).toFixed(1)}π\`;
      },
    }),
  );

  step += interval;
}, 200);`;

const resources = [
  {
    href: "https://www.npmjs.com/package/simple-ascii-chart",
    label: "Library package",
    title: "simple-ascii-chart",
  },
  {
    href: "https://github.com/gtktsc/ascii-chart",
    label: "Source repository",
    title: "Library repo",
  },
  {
    href: "https://www.npmjs.com/package/simple-ascii-chart-cli",
    label: "CLI package",
    title: "simple-ascii-chart-cli",
  },
  {
    href: "https://github.com/gtktsc/simple-ascii-chart-cli",
    label: "Source repository",
    title: "CLI repo",
  },
];

export default function Home() {
  return (
    <PublicPage
      actions={
        <ActionLink href="/playground" tone="primary">
          Open playground
        </ActionLink>
      }
      description="Terminal-native TypeScript charts for CLIs, logs, APIs, and docs."
      title="simple-ascii-chart"
    >
      <Stack gap="lg">
        <Prose>
          <p>
            Simple ASCII Chart is a lightweight and flexible TypeScript library
            for customizable ASCII charts directly in terminal output. It
            visualizes two-dimensional data, multiple series, colors,
            formatting, thresholds, legends, and axis labels.
          </p>
        </Prose>

        <div className="chart-gif-wrapper">
          <Image
            alt="Simple ASCII Chart"
            height={352}
            loading="eager"
            src="/simple-asci-chart.gif"
            unoptimized
            width={742}
          />
        </div>

        <CodeSnippet language="javascript">{demoCode}</CodeSnippet>

        <Prose>
          <p>
            Generate compact charts where graphical rendering is not available:
            command-line tools, build logs, API responses, diagnostics, and
            lightweight dashboards.
          </p>
        </Prose>

        <SimpleGrid minItemWidth="220px">
          <ActionLink href="/usage" variant="soft">
            Usage
          </ActionLink>
          <ActionLink href="/documentation" variant="soft">
            API documentation
          </ActionLink>
        </SimpleGrid>

        <SimpleGrid minItemWidth="220px">
          {resources.map((resource) => (
            <Card key={resource.href} title={resource.title} variant="soft">
              <PixxlLink href={resource.href}>{resource.label}</PixxlLink>
            </Card>
          ))}
        </SimpleGrid>

        <Section title="Support" variant="soft">
          <Prose density="compact">
            <p>
              If this project helps you, consider supporting the open-source
              work:{" "}
              <PixxlLink href="https://buymeacoffee.com/gtktsc">
                Buy me a coffee
              </PixxlLink>
              .
            </p>
          </Prose>
        </Section>
      </Stack>
    </PublicPage>
  );
}
