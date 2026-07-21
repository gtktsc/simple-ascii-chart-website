import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApiDocumentationPage from "../../../../components/ApiDocumentationPage";
import { API_DOCS_BY_VERSION } from "../../../generated/api-docs";
import {
  DOCUMENTATION_VERSIONS,
  findDocumentationVersion,
} from "../../../../lib/documentationVersions.mjs";
import { documentationSurfaceRoute } from "../../../../lib/siteConstants";
import { formatMessage } from "../../../../lib/messages.mjs";
import { buildPageMetadata } from "../../../../lib/seoMetadata";
import messages from "../../../../messages/en.json";

type PageProps = { params: Promise<{ surface: string; version: string }> };

const surfaceMessages = messages.documentation.surfaces;

function findSurface(version: string, id: string) {
  return API_DOCS_BY_VERSION[version]?.find((surface) => surface.id === id);
}

export function generateStaticParams() {
  return DOCUMENTATION_VERSIONS.flatMap(({ id: version, surfaces }) =>
    surfaces.map((surface) => ({ surface, version })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surface: id, version } = await params;
  const surface = findSurface(version, id);
  if (!surface) return {};
  const baseCopy = surfaceMessages[id as keyof typeof surfaceMessages];
  const copy =
    version === "5.4.0" && id === "reference"
      ? messages.documentation.historicalSurfaces.reference
      : baseCopy;

  return buildPageMetadata({
    description: copy.description,
    pathname: documentationSurfaceRoute(version, id),
    title: formatMessage(messages.documentation.surfaceVersionTitle, {
      surface: copy.title,
      version,
    }),
  });
}

export default async function DocumentationSurface({ params }: PageProps) {
  const { surface: id, version } = await params;
  const versionDefinition = findDocumentationVersion(version);
  const surface = findSurface(version, id);
  if (!versionDefinition || !surface) notFound();
  const baseCopy = surfaceMessages[id as keyof typeof surfaceMessages];
  const copy =
    version === "5.4.0" && id === "reference"
      ? messages.documentation.historicalSurfaces.reference
      : baseCopy;

  return (
    <ApiDocumentationPage
      copy={copy}
      currentVersion={version}
      surface={surface}
    />
  );
}
