import { redirect } from "next/navigation";
import { LATEST_DOCUMENTATION_VERSION } from "../../lib/documentationVersions.mjs";
import { examplesVersionRoute } from "../../lib/siteConstants";

export default function Examples() {
  redirect(examplesVersionRoute(LATEST_DOCUMENTATION_VERSION));
}
