import { redirect } from "next/navigation";
import { LATEST_DOCUMENTATION_VERSION } from "../../lib/documentationVersions.mjs";
import { playgroundVersionRoute } from "../../lib/siteConstants";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Playground({ searchParams }: PageProps) {
  const query = new URLSearchParams();

  Object.entries(await searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
    } else if (value !== undefined) {
      query.set(key, value);
    }
  });

  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  redirect(`${playgroundVersionRoute(LATEST_DOCUMENTATION_VERSION)}${suffix}`);
}
