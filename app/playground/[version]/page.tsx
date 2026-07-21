import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaygroundClient from "../PlaygroundClient";
import {
  DOCUMENTATION_VERSIONS,
  findDocumentationVersion,
} from "../../../lib/documentationVersions.mjs";
import { formatMessage } from "../../../lib/messages.mjs";
import { buildPageMetadata } from "../../../lib/seoMetadata";
import { playgroundVersionRoute } from "../../../lib/siteConstants";
import messages from "../../../messages/en.json";

type PageProps = { params: Promise<{ version: string }> };

export function generateStaticParams() {
  return DOCUMENTATION_VERSIONS.map(({ id }) => ({ version: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { version } = await params;
  if (!findDocumentationVersion(version)) return {};

  return buildPageMetadata({
    description: messages.playground.description,
    pathname: playgroundVersionRoute(version),
    title: formatMessage(messages.playground.versionTitle, { version }),
  });
}

export default async function VersionedPlayground({ params }: PageProps) {
  const { version } = await params;
  if (!findDocumentationVersion(version)) notFound();

  return <PlaygroundClient version={version} />;
}
