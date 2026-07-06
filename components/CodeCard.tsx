"use client";

import {
  Card,
  IconButton,
  MaximizeIcon,
  MinimizeIcon,
} from "@pixxl-tools/components";
import { useState } from "react";
import messages from "../messages/en.json";
import CodeSnippet from "./CodeSnippet";

type CodeCardProps = {
  children?: string | null;
  expandable?: boolean;
  language?: "bash" | "javascript";
  maxHeight?: number | string;
  title: string;
  variant?: "soft";
};

export default function CodeCard({
  children,
  expandable = false,
  language,
  maxHeight,
  title,
  variant,
}: CodeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const collapsed = expandable && !expanded;
  const displayMaxHeight = expandable ? undefined : maxHeight;
  const toggleLabel = expanded
    ? messages.common.collapse
    : messages.common.expand;

  return (
    <Card
      actions={
        expandable ? (
          <IconButton
            aria-expanded={expanded}
            label={toggleLabel}
            onClick={() => setExpanded((current) => !current)}
            size="sm"
            title={toggleLabel}
            variant="outline"
          >
            {expanded ? (
              <MinimizeIcon size="sm" />
            ) : (
              <MaximizeIcon size="sm" />
            )}
          </IconButton>
        ) : undefined
      }
      className="site-code-card"
      data-collapsed={collapsed ? "true" : undefined}
      title={title}
      variant={variant}
    >
      <CodeSnippet language={language} maxHeight={displayMaxHeight}>
        {children}
      </CodeSnippet>
    </Card>
  );
}
