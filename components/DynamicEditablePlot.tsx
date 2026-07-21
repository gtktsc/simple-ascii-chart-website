"use client";

import Editor from "@monaco-editor/react";
import type { Coordinates, Settings } from "simple-ascii-chart";
import {
  Button,
  Section,
  SimpleGrid,
  Stack,
  Text,
} from "@pixxl-tools/components";
import CodeSnippet from "./CodeSnippet";
import {
  EDITOR_HEIGHT,
  EDITOR_LANGUAGE,
  EDITOR_OPTIONS,
  EDITOR_THEME,
} from "./editablePlotConstants";
import { CODE_SNIPPET_HEIGHTS } from "../lib/siteConstants";
import { formatMessage } from "../lib/messages.mjs";
import messages from "../messages/en.json";
import { useEditablePlot } from "./useEditablePlot";

type EditablePlotProps = {
  input: Coordinates;
  options: Settings;
  version: string;
};

export default function EditablePlot({
  input,
  options,
  version,
}: EditablePlotProps) {
  const { mountInputEditor, mountOptionsEditor, result, runCode } =
    useEditablePlot({ input, options, version });

  return (
    <Stack gap="lg">
      <SimpleGrid className="playground-editor-grid" minItemWidth="320px">
        <Section
          className="playground-editor-section"
          description={messages.editablePlot.inputDescription}
          title={messages.common.input}
          variant="soft"
        >
          <div className="playground-editor-shell">
            <Editor
              defaultLanguage={EDITOR_LANGUAGE}
              defaultValue={formatMessage(
                messages.editablePlot.templates.input,
                {
                  input: JSON.stringify(input),
                }
              )}
              height={EDITOR_HEIGHT}
              onMount={mountInputEditor}
              options={EDITOR_OPTIONS}
              theme={EDITOR_THEME}
              width="100%"
            />
          </div>
        </Section>

        <Section
          className="playground-editor-section"
          description={messages.editablePlot.optionsDescription}
          title={messages.common.options}
          variant="soft"
        >
          <div className="playground-editor-shell">
            <Editor
              defaultLanguage={EDITOR_LANGUAGE}
              defaultValue={formatMessage(
                messages.editablePlot.templates.options,
                {
                  options: JSON.stringify(options),
                }
              )}
              height={EDITOR_HEIGHT}
              onMount={mountOptionsEditor}
              options={EDITOR_OPTIONS}
              theme={EDITOR_THEME}
              width="100%"
            />
          </div>
        </Section>
      </SimpleGrid>

      <Section
        actions={
          <Button onClick={runCode} tone="primary">
            {messages.editablePlot.runAction}
          </Button>
        }
        className="playground-output-section"
        title={messages.common.output}
      >
        {result ? (
          <CodeSnippet
            language="bash"
            maxHeight={CODE_SNIPPET_HEIGHTS.playgroundOutput}
          >
            {result}
          </CodeSnippet>
        ) : (
          <Text tone="muted">{messages.editablePlot.emptyOutput}</Text>
        )}
      </Section>
    </Stack>
  );
}
