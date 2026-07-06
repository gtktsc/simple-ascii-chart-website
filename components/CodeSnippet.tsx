"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { ClipboardButton, CodeFrame } from "@pixxl/components";

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
  const codeRef = useRef<HTMLElement>(null);
  const code = children ?? "";

  useEffect(() => {
    const codeElement = codeRef.current;

    if (!codeElement) {
      return;
    }

    codeElement.textContent = code;
    codeElement.removeAttribute("data-highlighted");

    if (language) {
      hljs.highlightElement(codeElement);
    }
  }, [code, language]);

  return (
    <CodeFrame
      actions={
        <ClipboardButton
          copiedLabel="Copied"
          label="Copy"
          resetDelayMs={1800}
          value={code}
        />
      }
      className="site-code-snippet"
      maxHeight={maxHeight}
    >
      <code
        className={language ? `language-${language}` : undefined}
        ref={codeRef}
      >
        {code}
      </code>
    </CodeFrame>
  );
}
