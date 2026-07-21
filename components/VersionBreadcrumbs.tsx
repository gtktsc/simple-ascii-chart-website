import { Breadcrumbs } from "@pixxl-tools/components";
import {
  documentationVersionRoute,
  SITE_ROUTES,
} from "../lib/siteConstants";
import messages from "../messages/en.json";

type VersionBreadcrumbsProps = {
  currentLabel?: string;
  section: "documentation" | "examples";
  version: string;
};

export default function VersionBreadcrumbs({
  currentLabel,
  section,
  version,
}: VersionBreadcrumbsProps) {
  const isDocumentation = section === "documentation";
  const sectionHref = isDocumentation
    ? SITE_ROUTES.documentation
    : SITE_ROUTES.examples;
  const sectionLabel = isDocumentation
    ? messages.nav.documentation
    : messages.nav.examples;
  const versionHref = isDocumentation
    ? documentationVersionRoute(version)
    : undefined;
  const items = [
    { href: SITE_ROUTES.home, label: messages.breadcrumbs.home },
    { href: sectionHref, label: sectionLabel },
    { href: currentLabel ? versionHref : undefined, label: version },
    ...(currentLabel ? [{ label: currentLabel }] : []),
  ];

  return <Breadcrumbs aria-label={messages.breadcrumbs.label} items={items} />;
}
