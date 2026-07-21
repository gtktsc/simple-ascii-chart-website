import { redirect } from "next/navigation";
import { LATEST_DOCUMENTATION_VERSION } from "../../lib/documentationVersions.mjs";
import { documentationVersionRoute } from "../../lib/siteConstants";

export default function Documentation() {
  redirect(documentationVersionRoute(LATEST_DOCUMENTATION_VERSION));
}
