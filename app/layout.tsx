import type { Metadata } from "next";
import Link from "next/link";
import "../styles/global.css";

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
        <nav className="navbar">
          <div className="navbar-links">
            <span>simple-ascii-chart</span>
            <Link href="/">About</Link>
            <Link href="/usage">Usage</Link>
            <Link href="/examples">Examples</Link>
            <Link href="/documentation">Documentation</Link>
            <Link href="/playground">Playground</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
