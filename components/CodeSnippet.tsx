"use client";

import { ClipboardButton, CodeFrame } from "@pixxl-tools/components";

type CodeSnippetProps = {
  children?: string | null;
  language?: "bash" | "javascript";
  maxHeight?: number | string;
};

export default function CodeSnippet({
  children = "",
  language,
  maxHeight,
}: CodeSnippetProps) {
  const code = children ?? "";

  return (
    <CodeFrame
      actions={
        <ClipboardButton
          copiedLabel="Copied"
          data-tone="primary"
          data-variant="solid"
          label="Copy"
          resetDelayMs={1800}
          value={code}
        />
      }
      maxHeight={maxHeight}
    >
      <code data-language={language}>{code}</code>
    </CodeFrame>
  );
}
