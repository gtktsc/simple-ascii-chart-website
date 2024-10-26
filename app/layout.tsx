import Link from "next/link";
import "../styles/global.css"; // Add necessary CSS here or in the file

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
