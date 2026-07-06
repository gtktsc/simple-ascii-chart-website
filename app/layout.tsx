import type { Metadata } from "next";
import { AppMain, AppShell } from "@pixxl-tools/components";
import "@pixxl-tools/components/styles.css";
import SiteFooter from "../components/SiteFooter";
import SiteNavbar from "../components/SiteNavbar";
import { SiteProviders } from "../components/SiteProviders";

// Define static metadata
export const metadata: Metadata = {
  title: "simple-ascii-chart",
  description:
    "Simple ASCII Chart is a lightweight and flexible TypeScript library designed to create customizable ASCII charts directly in the terminal.",
  keywords: [
    "chart",
    "ascii",
    "javascript",
    "typescript",
    "plot",
    "ascii-chart",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }}>
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
