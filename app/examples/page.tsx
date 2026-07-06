import type { Metadata } from "next";
import { PublicPage, Stack } from "@pixxl-tools/components";
import { buildPageMetadata } from "../../lib/seoMetadata";
import { SITE_ROUTES } from "../../lib/siteConstants";
import messages from "../../messages/en.json";
import { EXAMPLE_DEFINITIONS } from "./exampleData";
import ExampleSection from "./ExampleSection";

export const metadata: Metadata = buildPageMetadata({
  description: messages.examples.description,
  pathname: SITE_ROUTES.examples,
  title: messages.examples.title,
});

export default function Examples() {
  return (
    <PublicPage
      description={messages.examples.description}
      title={messages.examples.title}
    >
      <Stack gap="lg">
        {EXAMPLE_DEFINITIONS.map((example) => (
          <ExampleSection
            example={example}
            key={example.id}
            title={messages.examples.items[example.id]}
          />
        ))}
      </Stack>
    </PublicPage>
  );
}
