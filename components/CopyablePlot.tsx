"use client";

import React, { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // You can choose any Highlight.js theme

type CodeBlockProps = {
  children: React.ReactNode;
  javascript?: boolean;
  bash?: boolean;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  javascript = false,
  bash = false,
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if ((javascript || bash) && codeRef.current) {
      hljs.highlightElement(codeRef.current); // Apply Highlight.js
    }
  }, [javascript, bash, children]);

  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children); // Copy directly if it's a string
    } else if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText); // Otherwise, get the text content
    }
    setCopied(true);

    // Automatically hide the copied message after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const dismissAlert = () => {
    setCopied(false);
  };

  const languageClass = javascript
    ? "language-javascript"
    : bash
    ? "language-bash"
    : "";

  return (
    <div className="copyable-plot-wrapper">
      <pre
        className="copyable-plot"
        onClick={handleCopy}
        role="button"
        aria-label="Click to copy the code"
      >
        <code ref={codeRef} className={languageClass}>
          {children}
        </code>
      </pre>

      {copied && (
        <div
          className="toast-notification"
          onClick={dismissAlert}
          aria-label="Dismiss alert"
          role="alert"
        >
          Copied to clipboard
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
