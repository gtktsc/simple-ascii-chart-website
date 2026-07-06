"use client";

import { usePathname } from "next/navigation";
import {
  ActionLink,
  Link as PixxlLink,
  ResponsiveNavbar,
  type ResponsiveNavbarRenderLinkState,
} from "@pixxl-tools/components";
import type { PixxlNavItem } from "@pixxl-tools/components";
import NavControls from "./NavControls";

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
      actions={<NavControls />}
      brand={
        <PixxlLink href="/">
          simple-ascii-chart
        </PixxlLink>
      }
      items={navItems}
      mobileActions={<NavControls />}
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
    <ActionLink
      aria-current={state.selected ? "page" : undefined}
      href={item.href ?? "#"}
      onClick={state.mobile ? state.close : undefined}
      size="sm"
      tone={state.selected ? "primary" : "neutral"}
      variant={state.selected ? "soft" : "ghost"}
    >
      {item.label}
    </ActionLink>
  );
}
