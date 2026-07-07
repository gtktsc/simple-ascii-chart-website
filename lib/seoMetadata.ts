import type { Metadata } from "next";
import {
  PACKAGE_NAME,
  PIXEL_SITE_LOCALE,
  SITE_SOCIAL_IMAGE,
  SITE_TWITTER_HANDLE,
  SITE_URL,
} from "./siteConstants";
import messages from "../messages/en.json";

type BuildPageMetadataOptions = {
  description: string;
  index?: boolean;
  pathname: string;
  title: string;
};

const ensureLeadingSlash = (value: string) => {
  return value.startsWith("/") ? value : `/${value}`;
};

export const toCanonicalAbsoluteUrl = (pathname: string) => {
  return new URL(ensureLeadingSlash(pathname), SITE_URL).toString();
};

const toRenderedTitle = (pathname: string, title: string) => {
  if (ensureLeadingSlash(pathname) === "/") {
    return title;
  }

  return `${title} | ${PACKAGE_NAME}`;
};

export const buildPageMetadata = ({
  description,
  index = true,
  pathname,
  title,
}: BuildPageMetadataOptions): Metadata => {
  const canonicalPath = ensureLeadingSlash(pathname);
  const canonicalUrl = toCanonicalAbsoluteUrl(canonicalPath);
  const renderedTitle = toRenderedTitle(canonicalPath, title);
  const socialImageUrl = toCanonicalAbsoluteUrl(SITE_SOCIAL_IMAGE.path);

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: messages.metadata.socialImageAlt,
          height: SITE_SOCIAL_IMAGE.height,
          url: socialImageUrl,
          width: SITE_SOCIAL_IMAGE.width,
        },
      ],
      locale: PIXEL_SITE_LOCALE.replace("-", "_"),
      siteName: messages.metadata.applicationName,
      title: renderedTitle,
      type: "website",
      url: canonicalUrl,
    },
    robots: {
      follow: true,
      index,
    },
    title:
      canonicalPath === "/"
        ? {
            absolute: title,
          }
        : title,
    twitter: {
      card: "summary_large_image",
      creator: SITE_TWITTER_HANDLE,
      description,
      images: [socialImageUrl],
      site: SITE_TWITTER_HANDLE,
      title: renderedTitle,
    },
  };
};
