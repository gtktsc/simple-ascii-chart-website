import type * as Monaco from "monaco-editor";

export const EDITOR_HEIGHT = "200px";
export const EDITOR_LANGUAGE = "javascript";
export const EDITOR_THEME = "light";

export const EDITOR_OPTIONS: Monaco.editor.IStandaloneEditorConstructionOptions = {
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
