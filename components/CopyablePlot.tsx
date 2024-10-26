"use client";

import React, { useState } from "react";

type CodeBlockProps = {
  children: React.ReactNode;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof children !== "string") {
      return;
    }

    navigator.clipboard.writeText(children);
    setCopied(true);

    // Automatically hide the copied message after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const dismissAlert = () => {
    setCopied(false); // Dismiss the alert manually
  };

  return (
    <div className="copyable-plot-wrapper">
      <pre
        className="copyable-plot"
        onClick={handleCopy}
        role="button"
        aria-label="Click to copy the plot"
      >
        <code>{children}</code>
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
