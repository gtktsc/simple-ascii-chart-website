import {
  Card,
  Code,
  Heading,
  Inline,
  PageSection,
  Prose,
  PublicPage,
  SimpleGrid,
  Stack,
  Tag,
} from "@pixxl-tools/components";
import type { GeneratedApiSurface } from "../app/generated/api-docs";
import messages from "../messages/en.json";
import CodeCard from "./CodeCard";
import DocumentationAnchorNav from "./DocumentationAnchorNav";
import VersionBreadcrumbs from "./VersionBreadcrumbs";
import { formatMessage } from "../lib/messages.mjs";

type SurfaceMessages =
  (typeof messages.documentation.surfaces)[keyof typeof messages.documentation.surfaces];

function renderDescription(description: string) {
  return description.split(/(`[^`]+`)/g).map((part, index) => {
    if (!part) return null;
    if (part.startsWith("`") && part.endsWith("`")) {
      return <Tag key={`${part}-${index}`}>{part.slice(1, -1)}</Tag>;
    }
    return part;
  });
}

function groupAnchor(name: string) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function OptionGroup({
  group,
}: {
  group: GeneratedApiSurface["optionGroups"][number];
}) {
  return (
    <PageSection id={groupAnchor(group.name)} title={group.name}>
      <Stack gap="md">
        <Prose density="compact">
          <p>{renderDescription(group.description)}</p>
        </Prose>
        <pre className="documentation-type-definition">
          <code>{`type ${group.name} = ${group.signature};`}</code>
        </pre>
        <SimpleGrid minItemWidth="280px">
          {group.options.map((option) => (
            <Card
              key={`${group.name}.${option.key}`}
              padding="lg"
              variant="soft"
            >
              <Stack gap="sm">
                <Heading as="h3" size="sm">
                  <Code>{option.key}</Code>
                </Heading>
                <Inline gap="xs" wrap>
                  <Tag>{option.typeSignature}</Tag>
                  <Tag>
                    {option.required
                      ? messages.documentation.required
                      : messages.documentation.optional}
                  </Tag>
                </Inline>
                <Prose density="compact">
                  <p>{renderDescription(option.description)}</p>
                  <p>
                    {messages.documentation.relatedExamples}:{" "}
                    {option.exampleIds.map((exampleId, index) => (
                      <span key={exampleId}>
                        {index > 0 ? ", " : null}
                        <a href={`#example-${exampleId}`}>
                          {
                            messages.documentation.exampleTitles[
                              exampleId as keyof typeof messages.documentation.exampleTitles
                            ]
                          }
                        </a>
                      </span>
                    ))}
                  </p>
                </Prose>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </PageSection>
  );
}

export default function ApiDocumentationPage({
  copy,
  currentVersion,
  surface,
}: {
  copy: SurfaceMessages;
  currentVersion: string;
  surface: GeneratedApiSurface;
}) {
  const navItems = surface.optionGroups.map((group) => ({
    href: `#${groupAnchor(group.name)}`,
    id: group.name,
    label: group.name,
  }));

  return (
    <PublicPage
      breadcrumbs={
        <VersionBreadcrumbs
          currentLabel={copy.title}
          section="documentation"
          version={currentVersion}
        />
      }
      description={copy.description}
      title={formatMessage(messages.documentation.surfaceVersionTitle, {
        surface: copy.title,
        version: currentVersion,
      })}
    >
      <Stack gap="lg">
        <PageSection title={messages.documentation.signature}>
          <CodeCard
            language="javascript"
            title={messages.documentation.signature}
          >
            {surface.signature}
          </CodeCard>
        </PageSection>

        <PageSection title={messages.documentation.examples}>
          <Stack gap="lg">
            {surface.examples.map((example) => (
              <Stack gap="md" id={`example-${example.id}`} key={example.id}>
                <Heading as="h3" size="sm">
                  {
                    messages.documentation.exampleTitles[
                      example.id as keyof typeof messages.documentation.exampleTitles
                    ]
                  }
                </Heading>
                <CodeCard
                  expandable
                  language="javascript"
                  title={messages.documentation.source}
                >
                  {example.code}
                </CodeCard>
                <CodeCard language="bash" title={messages.documentation.output}>
                  {example.output}
                </CodeCard>
              </Stack>
            ))}
          </Stack>
        </PageSection>

        {surface.exports.length > 0 ? (
          <PageSection title={messages.documentation.publicExports}>
            <SimpleGrid minItemWidth="280px">
              {surface.exports.map((exportDoc) => (
                <Card key={exportDoc.name} padding="lg" variant="soft">
                  <Stack gap="sm">
                    <Heading as="h3" size="sm">
                      {exportDoc.name}
                    </Heading>
                    <Prose density="compact">
                      <p>{renderDescription(exportDoc.description)}</p>
                    </Prose>
                    <pre className="documentation-type-definition">
                      <code>{exportDoc.signature}</code>
                    </pre>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </PageSection>
        ) : null}

        {surface.typeReferences.length > 0 ? (
          <PageSection title={messages.documentation.publicTypes}>
            <Stack gap="md">
              {surface.typeReferences.map((type) => (
                <Card key={type.name} padding="lg" variant="soft">
                  <Stack gap="sm">
                    <Heading as="h3" size="sm">
                      {type.name}
                    </Heading>
                    <Prose density="compact">
                      <p>{renderDescription(type.description)}</p>
                    </Prose>
                    <pre className="documentation-type-definition">
                      <code>{`type ${type.name} = ${type.signature};`}</code>
                    </pre>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </PageSection>
        ) : null}

        {surface.optionGroups.length > 0 ? (
          <div className="documentation-layout">
            <aside className="documentation-index">
              <Card
                padding="lg"
                title={messages.documentation.surfaceIndex}
                variant="soft"
              >
                <DocumentationAnchorNav items={navItems} />
              </Card>
            </aside>
            <Stack className="documentation-settings" gap="lg">
              {surface.optionGroups.map((group) => (
                <OptionGroup group={group} key={group.name} />
              ))}
            </Stack>
          </div>
        ) : null}
      </Stack>
    </PublicPage>
  );
}
