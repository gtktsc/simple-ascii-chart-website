import Link from "next/link";
import CodeBlock from "../../components/CopyablePlot";

export default function Usage() {
  return (
    <div>
      <p>
        Simple ASCII Chart is a versatile tool that allows you to generate
        ASCII-based charts in different environments: as a library, via the CLI,
        or through the API.
      </p>

      <h2>Library Usage</h2>
      <p>
        To use the <strong>simple-ascii-chart</strong> library in your project,
        install it via npm or yarn:
      </p>

      <CodeBlock bash>npm install simple-ascii-chart</CodeBlock>
      <CodeBlock bash>yarn add simple-ascii-chart</CodeBlock>

      <p>Once installed, import and use it in your code like this:</p>
      <CodeBlock javascript>{`import plot from 'simple-ascii-chart';

const input = [
  [1, 1],
  [2, 4],
  [3, 8],
  [4, 16],
];

const settings = { width: 20, height: 10 };
console.log(plot(input, settings));
`}</CodeBlock>

      <h2>CLI Usage</h2>
      <p>
        You can also generate ASCII charts from the command line using the
        <Link
          href="https://github.com/gtktsc/simple-ascii-chart-cli"
          target="_blank"
        >
          {" "}
          Simple ASCII Chart CLI
        </Link>
        .
      </p>
      <p>To install the CLI globally, run:</p>
      <CodeBlock bash>npm install -g simple-ascii-chart-cli</CodeBlock>

      <p>Once installed, you can generate charts directly in your terminal:</p>
      <CodeBlock
        bash
      >{`simple-ascii-chart "[[1, 1], [2, 4], [3, 8]]" --width 20 --height 10`}</CodeBlock>

      <p>
        This command will output the chart directly in your terminal. For more
        details, visit the
        <Link
          href="https://github.com/gtktsc/simple-ascii-chart-cli"
          target="_blank"
        >
          {" "}
          CLI GitHub repository
        </Link>
        .
      </p>

      <h2>API Usage</h2>
      <p>The API supports both GET query params and POST JSON requests.</p>
      <p>
        For GET requests, use the same two query parameters as before:
        <code> input </code> and optional <code> settings</code>.
      </p>
      <ul>
        <li>
          <strong>input</strong>: The data for the chart, provided as an array
          of arrays (points).
        </li>
        <li>
          <strong>settings</strong>: Optional settings for customizing the chart
          appearance (e.g., width, height).
        </li>
      </ul>

      <p>GET example:</p>
      <CodeBlock bash>{`curl -G https://simple-ascii-chart.vercel.app/api \\
  --data-urlencode 'input=[[1,2],[2,3],[3,4]]' \\
  --data-urlencode 'settings={"width":50,"height":10}'
`}</CodeBlock>

      <p>POST example:</p>
      <CodeBlock bash>{`curl -X POST https://simple-ascii-chart.vercel.app/api \\
  -H 'content-type: application/json' \\
  -d '{"input":[[1,2],[2,3],[3,4]],"settings":{"width":50,"height":10}}'
`}</CodeBlock>

      <p>Example API call response:</p>
      <CodeBlock bash>{`  ▲
 4┤   ┏━━
  │   ┃
 2┤ ┏━┛
 1┤━┛
  └┬─┬─┬▶
   1 2 3`}</CodeBlock>

      <p>
        Error responses return JSON in a standardized shape:
        <code>{" { error: { code, message, details? } } "}</code>
      </p>
    </div>
  );
}
