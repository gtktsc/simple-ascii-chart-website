import type { Metadata } from "next";
import {
  Card,
  Code,
  Heading,
  PageSection,
  Prose,
  PublicPage,
  SimpleGrid,
  Stack,
  Tag,
} from "@pixxl-tools/components";
import CodeCard from "../../components/CodeCard";
import DocumentationAnchorNav from "../../components/DocumentationAnchorNav";
import {
  CODE_SNIPPET_HEIGHTS,
  PACKAGE_NAME,
  SITE_ROUTES,
} from "../../lib/siteConstants";
import { formatMessage } from "../../lib/messages.mjs";
import { buildPageMetadata } from "../../lib/seoMetadata";
import messages from "../../messages/en.json";
import {
  SETTINGS_DOCS,
  SETTINGS_PREVIEW_INPUT_CODE,
} from "../generated/settings-docs";
import type { GeneratedTypeDefinition } from "../generated/settings-docs";

type SettingMessages = Record<string, { description: string; title: string }>;

export const metadata: Metadata = buildPageMetadata({
  description: messages.documentation.description,
  pathname: SITE_ROUTES.documentation,
  title: messages.documentation.title,
});

const settingMessages: SettingMessages = messages.settings;

function getSettingMessages(key: string) {
  return (
    settingMessages[key] ?? {
      description: "",
      title: key,
    }
  );
}

const navItems = SETTINGS_DOCS.map((setting) => ({
  href: `#${setting.anchor}`,
  id: setting.key,
  label: getSettingMessages(setting.key).title,
}));

function renderDescription(description: string) {
  return description.split(/(`[^`]+`)/g).map((part, index) => {
    if (!part) {
      return null;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <Tag key={`${part}-${index}`}>{part.slice(1, -1)}</Tag>;
    }

    return part;
  });
}

function renderMetadataTag(value: string) {
  return (
    <Tag className="documentation-metadata-tag">
      <Code>{value}</Code>
    </Tag>
  );
}

function formatTypeDefinition(definition: GeneratedTypeDefinition) {
  return `type ${definition.name} = ${definition.signature};`;
}

export default function Documentation() {
  return (
    <PublicPage
      description={messages.documentation.description}
      title={messages.documentation.title}
    >
      <Stack gap="lg">
        <PageSection>
          <Prose>
            <p>
              {messages.documentation.introPrefix} <Code>{PACKAGE_NAME}</Code>{" "}
              {messages.documentation.introSuffix}
            </p>
          </Prose>
        </PageSection>

        <div className="documentation-layout">
          <aside className="documentation-index">
            <Card
              padding="lg"
              title={messages.documentation.settingsIndex}
              variant="soft"
            >
              <DocumentationAnchorNav items={navItems} />
            </Card>
          </aside>

          <Stack className="documentation-settings" gap="lg">
            {SETTINGS_DOCS.map((setting) => {
              const settingMessage = getSettingMessages(setting.key);

              return (
                <PageSection
                  id={setting.anchor}
                  key={setting.key}
                  title={settingMessage.title}
                >
                  <Stack gap="md">
                    <SimpleGrid minItemWidth="220px">
                      <Card padding="lg" variant="soft">
                        <Stack gap="sm">
                          <Heading as="h3" size="sm">
                            {messages.documentation.settingKey}
                          </Heading>
                          {renderMetadataTag(setting.key)}
                        </Stack>
                      </Card>
                      <Card padding="lg" variant="soft">
                        <Stack gap="sm">
                          <Heading as="h3" size="sm">
                            {messages.common.type}
                          </Heading>
                          {renderMetadataTag(setting.typeSignature)}
                          {setting.typeDefinitions.length > 0 ? (
                            <Stack gap="xs">
                              {setting.typeDefinitions.map((definition) => (
                                <pre
                                  className="documentation-type-definition"
                                  key={definition.name}
                                >
                                  <code>{formatTypeDefinition(definition)}</code>
                                </pre>
                              ))}
                            </Stack>
                          ) : null}
                        </Stack>
                      </Card>
                    </SimpleGrid>

                    <Prose density="compact">
                      <p>{renderDescription(settingMessage.description)}</p>
                    </Prose>

                    <CodeCard
                      expandable
                      language="javascript"
                      maxHeight={CODE_SNIPPET_HEIGHTS.documentationSource}
                      title={messages.common.options}
                    >
                      {formatMessage(
                        messages.documentation.snippets.previewSource,
                        {
                          input: SETTINGS_PREVIEW_INPUT_CODE,
                          settings: setting.exampleSettings,
                        },
                      )}
                    </CodeCard>
                    <CodeCard
                      language="bash"
                      maxHeight={CODE_SNIPPET_HEIGHTS.documentationPreview}
                      title={messages.common.output}
                    >
                      {setting.preview}
                    </CodeCard>
                  </Stack>
                </PageSection>
              );
            })}
          </Stack>
        </div>
      </Stack>
    </PublicPage>
  );
}
