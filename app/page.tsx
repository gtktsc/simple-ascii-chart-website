import Link from "next/link";
import Image from "next/image";
import CodeBlock from "../components/CopyablePlot";

export default function Home() {
  return (
    <div>
      <p>
        Simple ASCII Chart is a lightweight and flexible TypeScript library
        designed to create customizable ASCII charts directly in the terminal.
        It allows you to visualize two-dimensional data, create multiple series,
        and customize appearance with settings like colors, formatting, and axis
        labels.
      </p>
      <div className="chart-gif-wrapper">
        <Image
          src="/simple-asci-chart.gif"
          alt="Simple ASCII Chart"
          width={742}
          height={352}
        />
      </div>
      <CodeBlock javascript>
        {`let step = 0;
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
}, 200);`}
        `
      </CodeBlock>

      <p>
        With Simple ASCII Chart, you can generate insightful, minimalistic
        charts that work well in terminal environments, making it ideal for
        command-line tools or logging important data.
      </p>
      <div>
        <div>
          <Link href="/playground">Explore the interactive playground</Link> or
          learn more about the{" "}
          <Link href="/documentation">API and configuration settings</Link>.
        </div>
        <div></div>
        <Link href="https://www.npmjs.com/package/simple-ascii-chart">
          simple-ascii-chart NPM package
        </Link>
        <div></div>
        <Link href="https://github.com/gtktsc/ascii-chart">
          simple-ascii-chart repo
        </Link>
        <div></div>
        <Link href="https://www.npmjs.com/package/simple-ascii-chart-cli">
          simple-ascii-chart-cli NPM package
        </Link>
        <div></div>
        <Link href="https://github.com/gtktsc/simple-ascii-chart-cli">
          simple-ascii-chart-cli repo
        </Link>
      </div>
    </div>
  );
}
