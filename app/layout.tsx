import type { Metadata } from "next";
import { Affix, PixxlProvider } from "@pixxl/components";
import "@pixxl/components/styles.css";
import "../styles/global.css";
import SiteNavbar from "../components/SiteNavbar";

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
  return (
    <html lang="en">
      <body>
        <PixxlProvider className="site-shell">
          <Affix className="site-navbar-affix">
            <SiteNavbar />
          </Affix>
          <main className="site-main">{children}</main>
        </PixxlProvider>
      </body>
    </html>
  );
}
