"use client";

import { AnchorNav, type AnchorNavItem } from "@pixxl-tools/components";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  canScrollContainer,
  getScrollDeltaToKeepItemVisible,
} from "../lib/documentationScroll.mjs";

type DocumentationAnchorNavProps = {
  items: readonly AnchorNavItem[];
};

const ACTIVE_SECTION_TOP_OFFSET = 128;

function getHashAnchor() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function getValueFromHash(items: readonly AnchorNavItem[]) {
  const anchor = getHashAnchor();

  return items.find((item) => item.href === `#${anchor}`)?.id;
}

export default function DocumentationAnchorNav({
  items,
}: DocumentationAnchorNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string | undefined>(items[0]?.id);
  const sectionItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        anchor: item.href.startsWith("#") ? item.href.slice(1) : "",
      })),
    [items],
  );

  useEffect(() => {
    let animationFrame = 0;

    const updateValue = (nextValue?: string) => {
      setValue((currentValue) =>
        currentValue === nextValue ? currentValue : nextValue,
      );
    };

    const updateFromHash = () => {
      updateValue(getValueFromHash(items) ?? items[0]?.id);
    };

    const updateFromScroll = () => {
      let nextValue = items[0]?.id;

      sectionItems.forEach((item) => {
        if (!item.anchor) {
          return;
        }

        const section = document.getElementById(item.anchor);

        if (
          section &&
          section.getBoundingClientRect().top <= ACTIVE_SECTION_TOP_OFFSET
        ) {
          nextValue = item.id;
        }
      });

      updateValue(nextValue);
    };

    const scheduleScrollUpdate = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateFromScroll();
      });
    };

    updateFromHash();
    scheduleScrollUpdate();

    window.addEventListener("hashchange", updateFromHash);
    window.addEventListener("resize", scheduleScrollUpdate);
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("hashchange", updateFromHash);
      window.removeEventListener("resize", scheduleScrollUpdate);
      window.removeEventListener("scroll", scheduleScrollUpdate);
    };
  }, [items, sectionItems]);

  useEffect(() => {
    if (!value) {
      return;
    }

    const selectedItem = navRef.current?.querySelector<HTMLElement>(
      ".pixxl-anchor-nav-item[data-state='selected']",
    );
    const indexCard = selectedItem?.closest<HTMLElement>(
      ".documentation-index > .pixxl-card",
    );

    if (!selectedItem || !indexCard) {
      return;
    }

    const { overflowY } = getComputedStyle(indexCard);

    if (
      !canScrollContainer({
        clientHeight: indexCard.clientHeight,
        overflowY,
        scrollHeight: indexCard.scrollHeight,
      })
    ) {
      return;
    }

    const containerRect = indexCard.getBoundingClientRect();
    const itemRect = selectedItem.getBoundingClientRect();
    const scrollDelta = getScrollDeltaToKeepItemVisible({
      containerBottom: containerRect.bottom,
      containerTop: containerRect.top,
      itemBottom: itemRect.bottom,
      itemTop: itemRect.top,
    });

    indexCard.scrollTop += scrollDelta;
  }, [value]);

  return (
    <div ref={navRef}>
      <AnchorNav
        items={items}
        onValueChange={(nextValue) => setValue(nextValue)}
        orientation="vertical"
        value={value}
      />
    </div>
  );
}
