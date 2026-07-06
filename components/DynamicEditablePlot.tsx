"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import chart, { type Coordinates, type Settings } from "simple-ascii-chart";
import {
  Button,
  Section,
  SimpleGrid,
  Stack,
  Text,
} from "@pixxl-tools/components";
import CodeSnippet from "./CodeSnippet";

type EditablePlotProps = {
  input: Coordinates;
  options: Settings;
};

type EditorHandle = Parameters<OnMount>[0];

function renderChart(nextInput: Coordinates, nextOptions: Settings) {
  try {
    return chart(nextInput, nextOptions);
  } catch (error) {
    if (error instanceof Error) {
      return `Plotting error: ${error.message}`;
    }

    return "Plotting error: Unknown error.";
  }
}

const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  folding: false,
  fontSize: 14,
  glyphMargin: false,
  lineDecorationsWidth: 0,
  lineNumbers: "off",
  minimap: { enabled: false },
  overviewRulerLanes: 0,
  rulers: [],
  scrollbar: {
    vertical: "hidden",
  },
  wordWrap: "on",
};

export default function EditablePlot({ input, options }: EditablePlotProps) {
  const leftEditorRef = useRef<EditorHandle | null>(null);
  const rightEditorRef = useRef<EditorHandle | null>(null);

  const [result, setResult] = useState(() => renderChart(input, options));

  const plot = useCallback((nextInput: Coordinates, nextOptions: Settings) => {
    setResult(renderChart(nextInput, nextOptions));
  }, []);

  const runCode = useCallback(() => {
    try {
      const leftCode = leftEditorRef.current?.getValue() ?? "";
      const rightCode = rightEditorRef.current?.getValue() ?? "";

      const userInput = new Function(`${leftCode}; return input;`)();
      const userOptions = new Function(`${rightCode}; return options;`)();

      if (
        (Array.isArray(userInput) || typeof userInput === "object") &&
        typeof userOptions === "object"
      ) {
        plot(userInput as Coordinates, userOptions as Settings);
      } else {
        setResult(
          "Ensure 'input' is a valid Coordinates type and 'options' is a Settings object.",
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      }
    }
  }, [plot]);

  const formatEditor = useCallback(async (editor: EditorHandle | null) => {
    if (!editor) {
      return;
    }

    const action = editor.getAction("editor.action.formatDocument");
    await action?.run();
  }, []);

  const handleSaveShortcut = useCallback(
    (editor: EditorHandle) => {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
        await formatEditor(editor);
        runCode();
      });
    },
    [formatEditor, runCode],
  );

  useEffect(() => {
    void formatEditor(leftEditorRef.current);
    void formatEditor(rightEditorRef.current);
  }, [formatEditor]);

  return (
    <Stack gap="lg">
      <SimpleGrid minItemWidth="320px">
        <Section description="Edit const input." title="Input" variant="soft">
          <Editor
            defaultLanguage="javascript"
            defaultValue={`const input = ${JSON.stringify(input)};`}
            height="200px"
            onMount={(editor) => {
              leftEditorRef.current = editor;
              handleSaveShortcut(editor);
            }}
            options={editorOptions}
            theme="light"
          />
        </Section>

        <Section description="Edit const options." title="Options" variant="soft">
          <Editor
            defaultLanguage="javascript"
            defaultValue={`const options = ${JSON.stringify(options)};`}
            height="200px"
            onMount={(editor) => {
              rightEditorRef.current = editor;
              handleSaveShortcut(editor);
            }}
            options={editorOptions}
            theme="light"
          />
        </Section>
      </SimpleGrid>

      <Section
        actions={
          <Button onClick={runCode} tone="primary">
            Run code and plot
          </Button>
        }
        title="Output"
      >
        {result ? (
          <CodeSnippet language="bash" maxHeight="32rem">
            {result}
          </CodeSnippet>
        ) : (
          <Text tone="muted">Run code to render output.</Text>
        )}
      </Section>
    </Stack>
  );
}
