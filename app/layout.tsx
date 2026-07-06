import type { Metadata, Viewport } from "next";
import { AppMain, AppShell } from "@pixxl-tools/components";
import "@pixxl-tools/components/styles.css";
import "./site.css";
import SiteFooter from "../components/SiteFooter";
import SiteNavbar from "../components/SiteNavbar";
import { SiteProviders } from "../components/SiteProviders";
import { buildPageMetadata } from "../lib/seoMetadata";
import {
  PACKAGE_NAME,
  SITE_ROUTES,
  SITE_URL,
} from "../lib/siteConstants";
import messages from "../messages/en.json";

export const metadata: Metadata = {
  ...buildPageMetadata({
    description: messages.metadata.description,
    pathname: SITE_ROUTES.home,
    title: messages.metadata.homeTitle,
  }),
  applicationName: PACKAGE_NAME,
  authors: [
    {
      name: messages.metadata.authorName,
      url: messages.metadata.authorUrl,
    },
  ],
  creator: messages.metadata.authorName,
  icons: {
    apple: [
      {
        sizes: "180x180",
        type: "image/png",
        url: "/apple-touch-icon.png",
      },
    ],
    icon: [
      {
        sizes: "any",
        url: "/favicon.ico",
      },
      {
        sizes: "16x16",
        type: "image/png",
        url: "/favicon-16x16.png",
      },
      {
        sizes: "32x32",
        type: "image/png",
        url: "/favicon-32x32.png",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(SITE_URL),
  publisher: messages.metadata.authorName,
  title: {
    default: messages.metadata.homeTitle,
    template: messages.metadata.titleTemplate,
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#111923",
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ font: "var(--pixxl-font-body)", margin: 0 }}>
        <SiteProviders>
          <AppShell density="comfortable">
            <SiteNavbar />
            <AppMain>{children}</AppMain>
            <SiteFooter year={currentYear} />
          </AppShell>
        </SiteProviders>
      </body>
    </html>
  );
}
