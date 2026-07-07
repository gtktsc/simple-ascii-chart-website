import type { Metadata } from "next";
import {
  ActionLink,
  Card,
  Heading,
  Link as PixxlLink,
  MediaStage,
  PageSection,
  PublicPage,
  SimpleGrid,
  Stack,
  Text,
} from "@pixxl-tools/components";
import CodeCard from "../components/CodeCard";
import AboutDemoImage from "../components/AboutDemoImage";
import {
  CODE_SNIPPET_HEIGHTS,
  EXTERNAL_LINKS,
  PACKAGE_NAME,
  SITE_ROUTES,
} from "../lib/siteConstants";
import { buildPageMetadata } from "../lib/seoMetadata";
import {
  createSoftwareSourceCodeStructuredData,
  createWebSiteStructuredData,
} from "../lib/structuredData";
import messages from "../messages/en.json";
import JsonLd from "../components/JsonLd";

export const metadata: Metadata = buildPageMetadata({
  description: messages.home.description,
  pathname: SITE_ROUTES.home,
  title: messages.metadata.homeTitle,
});

const resources = [
  {
    href: EXTERNAL_LINKS.libraryPackage,
    label: messages.home.resources.libraryPackage.label,
    title: messages.home.resources.libraryPackage.title,
  },
  {
    href: EXTERNAL_LINKS.libraryRepository,
    label: messages.home.resources.libraryRepository.label,
    title: messages.home.resources.libraryRepository.title,
  },
  {
    href: EXTERNAL_LINKS.cliPackage,
    label: messages.home.resources.cliPackage.label,
    title: messages.home.resources.cliPackage.title,
  },
  {
    href: EXTERNAL_LINKS.cliRepository,
    label: messages.home.resources.cliRepository.label,
    title: messages.home.resources.cliRepository.title,
  },
];

const primaryLinks = [
  {
    href: SITE_ROUTES.usage,
    label: messages.home.usageLink,
  },
  {
    href: SITE_ROUTES.documentation,
    label: messages.home.documentationLink,
  },
];

function LinkedCard({
  href,
  label,
  title,
}: {
  href: string;
  label?: string;
  title: string;
}) {
  return (
    <PixxlLink href={href}>
      <Card padding="lg">
        <Stack gap="md">
          <Heading as="h2" size="sm">
            {title}
          </Heading>
          {label ? <Text tone="muted">{label}</Text> : null}
        </Stack>
      </Card>
    </PixxlLink>
  );
}

export default function Home() {
  const structuredData = [
    createWebSiteStructuredData(),
    createSoftwareSourceCodeStructuredData(),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <PublicPage
        actions={
          <ActionLink href={SITE_ROUTES.playground} tone="primary">
            {messages.home.primaryAction}
          </ActionLink>
        }
        description={messages.home.description}
        title={PACKAGE_NAME}
      >
        <Stack gap="lg">
          <PageSection title={PACKAGE_NAME}>
            <Stack gap="md">
              <Text>{messages.home.intro}</Text>

              <MediaStage aspectRatio="16 / 9" fit="cover" style={{ minHeight: 0 }}>
                <AboutDemoImage alt={messages.home.heroAlt} />
              </MediaStage>

              <CodeCard
                expandable
                language="javascript"
                maxHeight={CODE_SNIPPET_HEIGHTS.homeDemo}
                title={messages.home.demoCodeTitle}
                variant="soft"
              >
                {messages.home.demoCode}
              </CodeCard>

              <Text tone="muted">{messages.home.useCases}</Text>
            </Stack>
          </PageSection>

          <PageSection>
            <SimpleGrid minItemWidth="220px">
              {primaryLinks.map((link) => (
                <LinkedCard
                  href={link.href}
                  key={link.href}
                  title={link.label}
                />
              ))}
            </SimpleGrid>
          </PageSection>

          <PageSection>
            <SimpleGrid minItemWidth="220px">
              {resources.map((resource) => (
                <LinkedCard
                  href={resource.href}
                  key={resource.href}
                  label={resource.label}
                  title={resource.title}
                />
              ))}
            </SimpleGrid>
          </PageSection>

          <PageSection title={messages.home.projectArticle.title}>
            <Text>
              {messages.home.projectArticle.description}{" "}
              <PixxlLink href={EXTERNAL_LINKS.projectArticle}>
                {messages.home.projectArticle.link}
              </PixxlLink>
              .
            </Text>
          </PageSection>

          <PageSection title={messages.home.support.title}>
            <Text>
              {messages.home.support.prefix}{" "}
              <PixxlLink href={EXTERNAL_LINKS.support}>
                {messages.home.support.link}
              </PixxlLink>
              .
            </Text>
          </PageSection>
        </Stack>
      </PublicPage>
    </>
  );
}
