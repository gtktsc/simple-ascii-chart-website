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
      <p>
        <Link href="/playground">Explore the interactive playground</Link> or
        learn more about the{" "}
        <Link href="/documentation">API and configuration settings</Link>.
      </p>
    </div>
  );
}
