"use client";

import { Select } from "@pixxl-tools/components";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  DOCUMENTATION_VERSIONS,
  LATEST_DOCUMENTATION_VERSION,
  getLibraryVersionFromPathname,
  routeForLibraryVersion,
} from "../lib/documentationVersions.mjs";
import { formatMessage } from "../lib/messages.mjs";
import messages from "../messages/en.json";
import { useSitePreferences } from "./SiteProviders";

export default function LibraryVersionPicker() {
  const pathname = usePathname();
  const router = useRouter();
  const { libraryVersion, setLibraryVersion } = useSitePreferences();
  const routeVersion = getLibraryVersionFromPathname(pathname);
  const currentVersion = routeVersion ?? libraryVersion;
  const options = DOCUMENTATION_VERSIONS.map(({ id: version }) => ({
    label:
      version === LATEST_DOCUMENTATION_VERSION
        ? formatMessage(messages.documentation.latestVersionLabel, { version })
        : version,
    value: version,
  }));

  useEffect(() => {
    if (routeVersion) setLibraryVersion(routeVersion);
  }, [routeVersion, setLibraryVersion]);

  return (
    <Select
      aria-label={messages.documentation.versionLabel}
      id="library-documentation-version"
      onValueChange={(version) => {
        setLibraryVersion(version);
        const route = routeForLibraryVersion(pathname, version);
        const search = pathname.startsWith("/playground/")
          ? window.location.search
          : "";
        if (route !== pathname) router.push(`${route}${search}`);
      }}
      options={options}
      size="sm"
      value={currentVersion}
    />
  );
}
