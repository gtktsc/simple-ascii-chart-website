import chart, { type Coordinates, type Settings } from "simple-ascii-chart";
import {
  ActionLink,
  PageSection,
  PlayIcon,
  Prose,
  SimpleGrid,
  Stack,
} from "@pixxl-tools/components";
import CodeCard from "../../components/CodeCard";
import { CODE_SNIPPET_HEIGHTS } from "../../lib/siteConstants";
import {
  buildPlaygroundHref,
  toJavaScriptLiteral,
} from "../../lib/optionsSerialization.mjs";
import messages from "../../messages/en.json";
import type { ExampleDefinition } from "./exampleData";

type ExampleSectionProps = {
  example: ExampleDefinition;
  title: string;
};

export default function ExampleSection({
  example,
  title,
}: ExampleSectionProps) {
  const result = chart(example.input as Coordinates, example.options as Settings);
  const playgroundHref = buildPlaygroundHref(example.input, example.options);

  return (
    <PageSection
      actions={
        playgroundHref ? (
          <ActionLink href={playgroundHref} size="sm" variant="outline">
            <PlayIcon size="sm" />
            {messages.examples.openInPlayground}
          </ActionLink>
        ) : undefined
      }
      title={title}
    >
      <Stack gap="md">
        <SimpleGrid minItemWidth="260px" style={{ alignItems: "start" }}>
          <CodeCard
            expandable
            language="javascript"
            maxHeight={CODE_SNIPPET_HEIGHTS.examplesSource}
            title={messages.common.input}
            variant="soft"
          >
            {toJavaScriptLiteral(example.input)}
          </CodeCard>
          <CodeCard
            expandable
            language="javascript"
            maxHeight={CODE_SNIPPET_HEIGHTS.examplesSource}
            title={messages.common.options}
            variant="soft"
          >
            {toJavaScriptLiteral(example.options)}
          </CodeCard>
        </SimpleGrid>

        <CodeCard
          language="bash"
          maxHeight={CODE_SNIPPET_HEIGHTS.examplesOutput}
          title={messages.common.output}
        >
          {result}
        </CodeCard>

        {!playgroundHref ? (
          <Prose density="compact">
            <p>{messages.examples.notShareable}</p>
          </Prose>
        ) : null}
      </Stack>
    </PageSection>
  );
}
