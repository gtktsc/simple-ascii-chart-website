"use client";

import { ClipboardButton, CodeFrame } from "@pixxl-tools/components";
import messages from "../messages/en.json";

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
          copiedLabel={messages.common.copied}
          data-tone="primary"
          data-variant="solid"
          label={messages.common.copy}
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
