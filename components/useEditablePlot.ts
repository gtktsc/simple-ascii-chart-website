"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import type { Coordinates, Settings } from "simple-ascii-chart";
import { LATEST_DOCUMENTATION_VERSION } from "../lib/documentationVersions.mjs";
import {
  getEditablePlotExecutionError,
  getEditablePlotRuntime,
  getEditablePlotValidationError,
  isEditablePlotPayload,
  renderEditableChart,
} from "../lib/editablePlot.mjs";

type EditorHandle = Parameters<OnMount>[0];

type UseEditablePlotOptions = {
  input: Coordinates;
  options: Settings;
  version?: string;
};

function identifyEditorInput(editor: EditorHandle, name: string) {
  const textarea = editor.getDomNode()?.querySelector("textarea");

  if (!textarea) {
    return;
  }

  textarea.id = name;
  textarea.name = name;
}

export function useEditablePlot({
  input,
  options,
  version = LATEST_DOCUMENTATION_VERSION,
}: UseEditablePlotOptions) {
  const inputEditorRef = useRef<EditorHandle | null>(null);
  const optionsEditorRef = useRef<EditorHandle | null>(null);
  const initialInputRef = useRef(input);
  const initialOptionsRef = useRef(options);
  const plotRuntime = getEditablePlotRuntime(version);

  const [result, setResult] = useState(() =>
    renderEditableChart(input, options, plotRuntime),
  );

  const plot = useCallback((nextInput: Coordinates, nextOptions: Settings) => {
    setResult(renderEditableChart(nextInput, nextOptions, plotRuntime));
  }, [plotRuntime]);

  const runCode = useCallback(() => {
    try {
      const inputCode = inputEditorRef.current?.getValue() ?? "";
      const optionsCode = optionsEditorRef.current?.getValue() ?? "";

      const userInput = new Function(`${inputCode}; return input;`)();
      const userOptions = new Function(`${optionsCode}; return options;`)();

      if (isEditablePlotPayload(userInput, userOptions)) {
        plot(userInput as Coordinates, userOptions as Settings);
      } else {
        setResult(getEditablePlotValidationError());
      }
    } catch (error) {
      const errorMessage = getEditablePlotExecutionError(error);

      if (errorMessage) {
        setResult(errorMessage);
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

  const mountInputEditor = useCallback(
    (editor: EditorHandle) => {
      inputEditorRef.current = editor;
      identifyEditorInput(editor, "playground-input-code");
      handleSaveShortcut(editor);
    },
    [handleSaveShortcut],
  );

  const mountOptionsEditor = useCallback(
    (editor: EditorHandle) => {
      optionsEditorRef.current = editor;
      identifyEditorInput(editor, "playground-options-code");
      handleSaveShortcut(editor);
    },
    [handleSaveShortcut],
  );

  useEffect(() => {
    void formatEditor(inputEditorRef.current);
    void formatEditor(optionsEditorRef.current);
  }, [formatEditor]);

  useEffect(() => {
    setResult(
      renderEditableChart(
        initialInputRef.current,
        initialOptionsRef.current,
        plotRuntime,
      ),
    );
  }, [plotRuntime]);

  return {
    mountInputEditor,
    mountOptionsEditor,
    result,
    runCode,
  };
}
