"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ResponsiveNavbar,
  type ResponsiveNavbarRenderLinkState,
} from "@pixxl/components";
import type { PixxlNavItem } from "@pixxl/components";

const navItems: readonly PixxlNavItem[] = [
  { href: "/", id: "about", label: "About" },
  { href: "/usage", id: "usage", label: "Usage" },
  { href: "/examples", id: "examples", label: "Examples" },
  { href: "/documentation", id: "documentation", label: "Documentation" },
  { href: "/playground", id: "playground", label: "Playground" },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const value = activeNavValue(pathname);

  return (
    <ResponsiveNavbar
      brand={
        <Link className="site-brand" href="/">
          simple-ascii-chart
        </Link>
      }
      className="site-navbar"
      items={navItems}
      renderLink={renderNavLink}
      value={value}
    />
  );
}

function activeNavValue(pathname: string) {
  if (pathname === "/") {
    return "about";
  }

  return navItems.find((item) => {
    if (item.href === "/") {
      return false;
    }

    return pathname.startsWith(item.href ?? "");
  })?.id;
}

function renderNavLink(
  item: PixxlNavItem,
  _index: number,
  state: ResponsiveNavbarRenderLinkState,
) {
  return (
    <Link
      aria-current={state.selected ? "page" : undefined}
      className="pixxl-action-link site-nav-link"
      data-size="sm"
      data-state={state.selected ? "selected" : "idle"}
      data-tone={state.selected ? "primary" : "neutral"}
      data-variant={state.selected ? "soft" : "ghost"}
      href={item.href ?? "#"}
      onClick={state.mobile ? state.close : undefined}
    >
      {item.label}
    </Link>
  );
}
