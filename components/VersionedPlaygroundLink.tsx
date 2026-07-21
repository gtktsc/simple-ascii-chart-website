"use client";

import {
  ActionLink,
  type ActionLinkProps,
} from "@pixxl-tools/components";
import { playgroundVersionRoute } from "../lib/siteConstants";
import { useSitePreferences } from "./SiteProviders";

type VersionedPlaygroundLinkProps = Omit<ActionLinkProps, "href">;

export default function VersionedPlaygroundLink(
  props: VersionedPlaygroundLinkProps,
) {
  const { libraryVersion } = useSitePreferences();

  return (
    <ActionLink {...props} href={playgroundVersionRoute(libraryVersion)} />
  );
}
