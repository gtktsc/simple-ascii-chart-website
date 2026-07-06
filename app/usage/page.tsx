import type { Metadata } from "next";
import {
  Code,
  Heading,
  Link as PixxlLink,
  PageSection,
  Prose,
  PublicPage,
  Stack,
} from "@pixxl-tools/components";
import CodeSnippet from "../../components/CodeSnippet";
import {
  CLI_PACKAGE_NAME,
  EXTERNAL_LINKS,
  PACKAGE_NAME,
  SITE_ROUTES,
} from "../../lib/siteConstants";
import { formatMessage } from "../../lib/messages.mjs";
import { buildPageMetadata } from "../../lib/seoMetadata";
import messages from "../../messages/en.json";

export const metadata: Metadata = buildPageMetadata({
  description: messages.usage.description,
  pathname: SITE_ROUTES.usage,
  title: messages.usage.title,
});

export default function Usage() {
  return (
    <PublicPage
      description={messages.usage.description}
      title={messages.usage.title}
    >
      <Stack gap="lg">
        <PageSection>
          <Prose>
            <p>{messages.usage.intro}</p>
          </Prose>
        </PageSection>

        <PageSection title={messages.usage.library.title}>
          <Stack gap="md">
            <Prose>
              <p>
                {messages.usage.library.installPrefix}{" "}
                <strong>{PACKAGE_NAME}</strong>{" "}
                {messages.usage.library.installSuffix}
              </p>
            </Prose>
            <CodeSnippet language="bash">{messages.usage.snippets.npmInstall}</CodeSnippet>
            <CodeSnippet language="bash">{messages.usage.snippets.yarnInstall}</CodeSnippet>
            <Prose>
              <p>{messages.usage.library.import}</p>
            </Prose>
            <CodeSnippet language="javascript">
              {messages.usage.snippets.libraryExample}
            </CodeSnippet>
          </Stack>
        </PageSection>

        <PageSection title={messages.usage.cli.title}>
          <Stack gap="md">
            <Prose>
              <p>
                {messages.usage.cli.introPrefix}{" "}
                <PixxlLink href={EXTERNAL_LINKS.cliRepository}>
                  {messages.usage.cli.link}
                </PixxlLink>
                .
              </p>
              <p>{messages.usage.cli.install}</p>
            </Prose>
            <CodeSnippet language="bash">
              {formatMessage(messages.usage.snippets.cliInstall, {
                cliPackageName: CLI_PACKAGE_NAME,
              })}
            </CodeSnippet>
            <Prose>
              <p>{messages.usage.cli.render}</p>
            </Prose>
            <CodeSnippet language="bash">{messages.usage.snippets.cliExample}</CodeSnippet>
          </Stack>
        </PageSection>

        <PageSection title={messages.usage.api.title}>
          <Stack gap="md">
            <Prose>
              <p>{messages.usage.api.intro}</p>
              <p>
                {messages.usage.api.get} <Code>input</Code>{" "}
                {messages.usage.api.andOptional} <Code>settings</Code>{" "}
                {messages.usage.api.queryParameters}
              </p>
              <ul>
                <li>
                  <strong>input</strong>: {messages.usage.api.inputDescription}
                </li>
                <li>
                  <strong>settings</strong>:{" "}
                  {messages.usage.api.settingsDescription}
                </li>
              </ul>
            </Prose>

            <CodeSnippet language="bash">{messages.usage.snippets.apiGet}</CodeSnippet>

            <CodeSnippet language="bash">{messages.usage.snippets.apiPost}</CodeSnippet>

            <Heading as="h3" size="sm">
              {messages.usage.api.response}
            </Heading>
            <CodeSnippet language="bash">
              {messages.usage.snippets.apiResponse}
            </CodeSnippet>

            <Prose>
              <p>
                {messages.usage.api.errorResponse}{" "}
                <Code>{messages.usage.snippets.errorShape}</Code>.
              </p>
            </Prose>
          </Stack>
        </PageSection>
      </Stack>
    </PublicPage>
  );
}
