import {
  Code,
  Link as PixxlLink,
  Prose,
  PublicPage,
  Section,
  Stack,
} from "@pixxl/components";
import CodeSnippet from "../../components/CodeSnippet";

export default function Usage() {
  return (
    <PublicPage
      description="Install the library, run the CLI, or call the chart API."
      title="Usage"
    >
      <Stack gap="lg">
        <Prose>
          <p>
            Simple ASCII Chart generates ASCII-based charts in different
            environments: as a TypeScript library, through the CLI, or over the
            API.
          </p>
        </Prose>

        <Section title="Library usage">
          <Prose>
            <p>
              Install <strong>simple-ascii-chart</strong> with npm or yarn:
            </p>
          </Prose>
          <CodeSnippet language="bash">npm install simple-ascii-chart</CodeSnippet>
          <CodeSnippet language="bash">yarn add simple-ascii-chart</CodeSnippet>
          <Prose>
            <p>Import and call the chart function from application code:</p>
          </Prose>
          <CodeSnippet language="javascript">{`import plot from 'simple-ascii-chart';

const input = [
  [1, 1],
  [2, 4],
  [3, 8],
  [4, 16],
];

const settings = { width: 20, height: 10 };
console.log(plot(input, settings));
`}</CodeSnippet>
        </Section>

        <Section title="CLI usage">
          <Prose>
            <p>
              Generate ASCII charts from the command line with the{" "}
              <PixxlLink href="https://github.com/gtktsc/simple-ascii-chart-cli">
                Simple ASCII Chart CLI
              </PixxlLink>
              .
            </p>
            <p>Install the CLI globally:</p>
          </Prose>
          <CodeSnippet language="bash">
            npm install -g simple-ascii-chart-cli
          </CodeSnippet>
          <Prose>
            <p>Then render a chart directly in the terminal:</p>
          </Prose>
          <CodeSnippet language="bash">{`simple-ascii-chart "[[1, 1], [2, 4], [3, 8]]" --width 20 --height 10`}</CodeSnippet>
        </Section>

        <Section title="API usage">
          <Prose>
            <p>The API supports GET query params and POST JSON requests.</p>
            <p>
              GET accepts <Code>input</Code> and optional{" "}
              <Code>settings</Code> query parameters.
            </p>
            <ul>
              <li>
                <strong>input</strong>: chart data as an array of points.
              </li>
              <li>
                <strong>settings</strong>: optional chart appearance settings.
              </li>
            </ul>
          </Prose>

          <CodeSnippet language="bash">{`curl -G https://simple-ascii-chart.vercel.app/api \\
  --data-urlencode 'input=[[1,2],[2,3],[3,4]]' \\
  --data-urlencode 'settings={"width":50,"height":10}'
`}</CodeSnippet>

          <CodeSnippet language="bash">{`curl -X POST https://simple-ascii-chart.vercel.app/api \\
  -H 'content-type: application/json' \\
  -d '{"input":[[1,2],[2,3],[3,4]],"settings":{"width":50,"height":10}}'
`}</CodeSnippet>

          <Prose>
            <p>Example API response:</p>
          </Prose>
          <CodeSnippet language="bash">{`  ▲
 4┤   ┏━━
  │   ┃
 2┤ ┏━┛
 1┤━┛
  └┬─┬─┬▶
   1 2 3`}</CodeSnippet>

          <Prose>
            <p>
              Error responses return JSON as{" "}
              <Code>{`{ error: { code, message, details? } }`}</Code>.
            </p>
          </Prose>
        </Section>
      </Stack>
    </PublicPage>
  );
}
