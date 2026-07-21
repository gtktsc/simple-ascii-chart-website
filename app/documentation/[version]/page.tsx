import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Card,
  Heading,
  Link as PixxlLink,
  PageSection,
  Prose,
  PublicPage,
  SimpleGrid,
  Stack,
  Text,
} from "@pixxl-tools/components";
import { API_DOCS_BY_VERSION } from "../../generated/api-docs";
import {
  DOCUMENTATION_VERSIONS,
  findDocumentationVersion,
} from "../../../lib/documentationVersions.mjs";
import {
  documentationSurfaceRoute,
  documentationVersionRoute,
} from "../../../lib/siteConstants";
import { formatMessage } from "../../../lib/messages.mjs";
import { buildPageMetadata } from "../../../lib/seoMetadata";
import messages from "../../../messages/en.json";
import VersionBreadcrumbs from "../../../components/VersionBreadcrumbs";

type PageProps = { params: Promise<{ version: string }> };

const surfaceMessages = messages.documentation.surfaces;

export function generateStaticParams() {
  return DOCUMENTATION_VERSIONS.map(({ id }) => ({ version: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { version } = await params;
  if (!findDocumentationVersion(version)) return {};

  return buildPageMetadata({
    description:
      messages.documentation.versions[
        version as keyof typeof messages.documentation.versions
      ].description,
    pathname: documentationVersionRoute(version),
    title: formatMessage(messages.documentation.versionTitle, { version }),
  });
}

export default async function DocumentationVersion({ params }: PageProps) {
  const { version } = await params;
  const versionDefinition = findDocumentationVersion(version);
  const surfaces = API_DOCS_BY_VERSION[version];
  if (!versionDefinition || !surfaces) notFound();
  const versionCopy =
    messages.documentation.versions[
      version as keyof typeof messages.documentation.versions
    ];

  return (
    <PublicPage
      breadcrumbs={
        <VersionBreadcrumbs section="documentation" version={version} />
      }
      description={versionCopy.description}
      title={formatMessage(messages.documentation.versionTitle, { version })}
    >
      <Stack gap="lg">
        <PageSection>
          <Prose>
            <p>{messages.documentation.intro}</p>
            <p>
              {version === "5.4.0"
                ? messages.documentation.historicalGeneratedNotice
                : messages.documentation.generatedNotice}
            </p>
          </Prose>
        </PageSection>

        <PageSection title={messages.documentation.browseTitle}>
          <SimpleGrid minItemWidth="240px">
            {surfaces.map((surface) => {
              const baseCopy =
                surfaceMessages[surface.id as keyof typeof surfaceMessages];
              const copy =
                version === "5.4.0" && surface.id === "reference"
                  ? messages.documentation.historicalSurfaces.reference
                  : baseCopy;

              return (
                <PixxlLink
                  href={documentationSurfaceRoute(version, surface.id)}
                  key={surface.id}
                >
                  <Card padding="lg">
                    <Stack gap="sm">
                      <Heading as="h3" size="sm">
                        {copy.title}
                      </Heading>
                      <Text tone="muted">{copy.description}</Text>
                    </Stack>
                  </Card>
                </PixxlLink>
              );
            })}
          </SimpleGrid>
        </PageSection>
      </Stack>
    </PublicPage>
  );
}
