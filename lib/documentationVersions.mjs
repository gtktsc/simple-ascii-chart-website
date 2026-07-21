import { API_DOC_SURFACES } from "./apiDocsConstants.mjs";

export const LATEST_DOCUMENTATION_VERSION = "6.0.0";

export const DOCUMENTATION_VERSIONS = [
  {
    id: LATEST_DOCUMENTATION_VERSION,
    surfaces: API_DOC_SURFACES,
  },
  {
    id: "5.4.0",
    surfaces: ["plot", "reference"],
  },
];

export function findDocumentationVersion(version) {
  return DOCUMENTATION_VERSIONS.find(({ id }) => id === version);
}

export function isDocumentationSurface(version, surface) {
  return findDocumentationVersion(version)?.surfaces.includes(surface) ?? false;
}

export function getLibraryVersionFromPathname(pathname) {
  const [section, version] = pathname.split("/").filter(Boolean);

  if (
    section !== "documentation" &&
    section !== "examples" &&
    section !== "playground"
  ) {
    return undefined;
  }

  return findDocumentationVersion(version)?.id;
}

export function routeForLibraryVersion(pathname, version) {
  const [section, , surface] = pathname.split("/").filter(Boolean);

  if (section === "documentation") {
    return surface && isDocumentationSurface(version, surface)
      ? `/documentation/${version}/${surface}`
      : `/documentation/${version}`;
  }

  if (section === "examples") return `/examples/${version}`;

  if (section === "playground") return `/playground/${version}`;

  return pathname;
}
