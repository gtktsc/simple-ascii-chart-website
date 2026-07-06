import {
  EXTERNAL_LINKS,
  PACKAGE_NAME,
  PIXEL_SITE_LOCALE,
  SITE_ROUTES,
  SITE_SOCIAL_IMAGE,
} from "./siteConstants";
import { toCanonicalAbsoluteUrl } from "./seoMetadata";
import messages from "../messages/en.json";

const author = {
  "@type": "Person",
  name: messages.metadata.authorName,
  url: messages.metadata.authorUrl,
};

export const createWebSiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: messages.metadata.description,
    inLanguage: PIXEL_SITE_LOCALE,
    name: PACKAGE_NAME,
    url: toCanonicalAbsoluteUrl(SITE_ROUTES.home),
  };
};

export const createSoftwareSourceCodeStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    author,
    codeRepository: EXTERNAL_LINKS.libraryRepository,
    description: messages.home.intro,
    image: toCanonicalAbsoluteUrl(SITE_SOCIAL_IMAGE.path),
    inLanguage: PIXEL_SITE_LOCALE,
    license: `${EXTERNAL_LINKS.libraryRepository}/blob/main/LICENSE`,
    name: PACKAGE_NAME,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    sameAs: [
      EXTERNAL_LINKS.libraryPackage,
      EXTERNAL_LINKS.libraryRepository,
      EXTERNAL_LINKS.cliPackage,
      EXTERNAL_LINKS.cliRepository,
    ],
    url: toCanonicalAbsoluteUrl(SITE_ROUTES.home),
  };
};
