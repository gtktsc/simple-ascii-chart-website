"use client";

import { usePathname } from "next/navigation";
import {
  ActionLink,
  BookOpenIcon,
  Box,
  ChartLineIcon,
  CloseIcon,
  CommandIcon,
  HomeIcon,
  IconButton,
  Link as PixxlLink,
  MenuIcon,
  Navbar,
  PlayIcon,
  Stack,
} from "@pixxl-tools/components";
import { useState, type ReactNode } from "react";
import { MOBILE_NAV_QUERY, useMediaQuery } from "../hooks/useMediaQuery";
import {
  getLibraryVersionFromPathname,
  routeForLibraryVersion,
} from "../lib/documentationVersions.mjs";
import { PACKAGE_NAME, SITE_ROUTES } from "../lib/siteConstants";
import messages from "../messages/en.json";
import NavControls from "./NavControls";
import { useSitePreferences } from "./SiteProviders";

type NavItem = {
  href: string;
  icon: ReactNode;
  id: string;
  label: string;
};

const navItems: readonly NavItem[] = [
  {
    href: SITE_ROUTES.home,
    icon: <HomeIcon size="sm" />,
    id: "about",
    label: messages.nav.about,
  },
  {
    href: SITE_ROUTES.usage,
    icon: <CommandIcon size="sm" />,
    id: "usage",
    label: messages.nav.usage,
  },
  {
    href: SITE_ROUTES.examples,
    icon: <ChartLineIcon size="sm" />,
    id: "examples",
    label: messages.nav.examples,
  },
  {
    href: SITE_ROUTES.documentation,
    icon: <BookOpenIcon size="sm" />,
    id: "documentation",
    label: messages.nav.documentation,
  },
  {
    href: SITE_ROUTES.playground,
    icon: <PlayIcon size="sm" />,
    id: "playground",
    label: messages.nav.playground,
  },
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const { libraryVersion } = useSitePreferences();
  const isMobile = useMediaQuery(MOBILE_NAV_QUERY);
  const [menuState, setMenuState] = useState({
    isOpen: false,
    pathname: "",
  });
  const activeId = activeNavValue(pathname);
  const isMenuOpen = menuState.isOpen && menuState.pathname === pathname;
  const menuLabel = isMenuOpen
    ? messages.nav.closeMenuLabel
    : messages.nav.openMenuLabel;
  const selectedVersion =
    getLibraryVersionFromPathname(pathname) ?? libraryVersion;

  const renderLink = (item: NavItem) => {
    const selected = activeId === item.id;

    return (
      <ActionLink
        aria-current={selected ? "page" : undefined}
        href={routeForLibraryVersion(item.href, selectedVersion)}
        key={item.id}
        onClick={
          isMobile
            ? () => setMenuState({ isOpen: false, pathname })
            : undefined
        }
        size="sm"
        tone={selected ? "primary" : "neutral"}
        variant={selected ? "soft" : "ghost"}
      >
        {item.icon}
        <span>{item.label}</span>
      </ActionLink>
    );
  };

  return (
    <>
      <Navbar
        actions={
          isMobile ? (
            <IconButton
              aria-expanded={isMenuOpen}
              label={menuLabel}
              onClick={() =>
                setMenuState({ isOpen: !isMenuOpen, pathname })
              }
              size="sm"
              variant="outline"
            >
              {isMenuOpen ? <CloseIcon size="sm" /> : <MenuIcon size="sm" />}
            </IconButton>
          ) : (
            <NavControls />
          )
        }
        aria-label={messages.nav.mainNavigationLabel}
        brand={<PixxlLink href={SITE_ROUTES.home}>{PACKAGE_NAME}</PixxlLink>}
      >
        {isMobile ? null : navItems.map(renderLink)}
      </Navbar>

      {isMobile && isMenuOpen ? (
        <Box as="nav" padding="md" variant="soft">
          <Stack align="center" gap="sm">
            {navItems.map(renderLink)}
            <NavControls justify="center" />
          </Stack>
        </Box>
      ) : null}
    </>
  );
}

function activeNavValue(pathname: string) {
  if (pathname === SITE_ROUTES.home) {
    return "about";
  }

  return navItems.find((item) => {
    if (item.href === SITE_ROUTES.home) {
      return false;
    }

    return pathname.startsWith(item.href);
  })?.id;
}
