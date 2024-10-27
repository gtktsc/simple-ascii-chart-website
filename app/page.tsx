import Link from "next/link";

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
