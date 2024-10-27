"use client";

import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import chart, { Coordinates, Settings } from "simple-ascii-chart";
import CodeBlock from "./CopyablePlot";

type EditablePlotProps = {
  input: Coordinates;
  options: Settings;
};

export default function EditablePlot({
  input,
  options,
}: EditablePlotProps): JSX.Element {
  const leftEditorRef = useRef<any>(null);
  const rightEditorRef = useRef<any>(null);

  const [result, setResult] = useState<string | null>(null);

  // Run code to extract `input` and `options` values and plot
  const runCode = () => {
    try {
      const leftCode = leftEditorRef.current?.getValue();
      const rightCode = rightEditorRef.current?.getValue();

      const userInput = new Function(`${leftCode}; return input;`)();
      const userOptions = new Function(`${rightCode}; return options;`)();

      if (
        (Array.isArray(userInput) || typeof userInput === "object") &&
        typeof userOptions === "object"
      ) {
        plot(userInput, userOptions);
      } else {
        setResult(
          "Ensure 'input' is a valid Coordinates type and 'options' is a Settings object."
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      }
    }
  };

  // Plot function using Coordinates and Settings types
  const plot = (input: Coordinates, options: Settings) => {
    try {
      setResult(chart(input, options));
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Plotting error: ${error.message}`);
      }
    }
  };

  // Function to handle save shortcut (cmd+s / ctrl+s)
  const handleSaveShortcut = (editor: any) => {
    if (editor) {
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        async () => {
          await formatEditor(editor); // First format the editor
          runCode(); // Then run the code to regenerate the plot
        }
      );
    }
  };

  // Function to format the editor content
  const formatEditor = async (editor: any) => {
    if (editor) {
      const action = editor.getAction("editor.action.formatDocument");
      await action?.run(); // Format the document before running the code
    }
  };

  // Initial call to plot with provided props
  useEffect(() => {
    try {
      formatEditor(leftEditorRef.current); // Format input on initial load
      formatEditor(rightEditorRef.current); // Format options on initial load
      plot(input, options); // Initial plot
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      }
    }
  }, [input, options]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on" as const,
    automaticLayout: true,
    rulers: [], // No rulers
    overviewRulerLanes: 0, // Disable overview ruler
    wordWrap: "on" as const, // Enable word wrapping
    scrollbar: {
      vertical: "hidden" as const, // Hide the vertical scrollbar
    },
  };

  return (
    <>
      <div>
        <Editor
          height="200px"
          defaultLanguage="javascript"
          defaultValue={`const input = ${JSON.stringify(input)};`}
          options={editorOptions}
          onMount={(editor) => {
            leftEditorRef.current = editor;
            handleSaveShortcut(editor); // Register save shortcut
          }}
        />
        <Editor
          height="200px"
          defaultLanguage="javascript"
          defaultValue={`const options = ${JSON.stringify(options)};`}
          options={editorOptions}
          onMount={(editor) => {
            rightEditorRef.current = editor;
            handleSaveShortcut(editor); // Register save shortcut
          }}
        />
      </div>

      <div>
        <button onClick={runCode}>Run Code and Plot</button>
        <CodeBlock bash>{result}</CodeBlock>
      </div>
    </>
  );
}
