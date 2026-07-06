import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seoMetadata";
import { SITE_ROUTES } from "../../lib/siteConstants";
import messages from "../../messages/en.json";
import PlaygroundClient from "./PlaygroundClient";

export const metadata: Metadata = buildPageMetadata({
  description: messages.playground.description,
  pathname: SITE_ROUTES.playground,
  title: messages.playground.title,
});

export default function Playground() {
  return <PlaygroundClient />;
}
