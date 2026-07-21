import {
  ActionLink,
  Inline,
  PageSection,
  PlayIcon,
  Prose,
  SimpleGrid,
  Stack,
} from "@pixxl-tools/components";
import CodeCard from "../../components/CodeCard";
import { CODE_SNIPPET_HEIGHTS } from "../../lib/siteConstants";
import messages from "../../messages/en.json";

type ExampleSectionProps = {
  inputSource?: string;
  optionsSource?: string;
  output: string;
  playgroundHref?: string | null;
  showNotShareable?: boolean;
  source?: string;
  title: string;
};

export default function ExampleSection({
  inputSource,
  optionsSource,
  output,
  playgroundHref,
  showNotShareable = false,
  source,
  title,
}: ExampleSectionProps) {
  return (
    <PageSection title={title}>
      <Stack gap="md">
        {playgroundHref ? (
          <Inline justify="end" wrap>
            <ActionLink href={playgroundHref} size="sm" variant="outline">
              <PlayIcon size="sm" />
              {messages.examples.openInPlayground}
            </ActionLink>
          </Inline>
        ) : null}

        {source ? (
          <CodeCard
            expandable
            language="javascript"
            maxHeight={CODE_SNIPPET_HEIGHTS.examplesSource}
            title={messages.common.source}
            variant="soft"
          >
            {source}
          </CodeCard>
        ) : (
          <SimpleGrid minItemWidth="260px" style={{ alignItems: "start" }}>
            <CodeCard
              expandable
              language="javascript"
              maxHeight={CODE_SNIPPET_HEIGHTS.examplesSource}
              title={messages.common.input}
              variant="soft"
            >
              {inputSource}
            </CodeCard>
            <CodeCard
              expandable
              language="javascript"
              maxHeight={CODE_SNIPPET_HEIGHTS.examplesSource}
              title={messages.common.options}
              variant="soft"
            >
              {optionsSource}
            </CodeCard>
          </SimpleGrid>
        )}

        <CodeCard
          language="bash"
          maxHeight={CODE_SNIPPET_HEIGHTS.examplesOutput}
          title={messages.common.output}
        >
          {output}
        </CodeCard>

        {showNotShareable ? (
          <Prose density="compact">
            <p>{messages.examples.notShareable}</p>
          </Prose>
        ) : null}
      </Stack>
    </PageSection>
  );
}
