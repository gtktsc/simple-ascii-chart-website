import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Home from "../app/page";
import RootLayout from "../app/layout";
import Usage from "../app/usage/page";
import Examples from "../app/examples/page";
import VersionedExamples, {
  generateMetadata as generateExamplesMetadata,
  generateStaticParams as generateExamplesStaticParams,
} from "../app/examples/[version]/page";
import ExampleSection from "../app/examples/ExampleSection";
import {
  EXAMPLE_DEFINITIONS,
  getExampleSource,
  renderExample,
} from "../app/examples/exampleData";
import Documentation from "../app/documentation/page";
import DocumentationVersion, {
  generateMetadata as generateDocumentationVersionMetadata,
  generateStaticParams as generateDocumentationVersionStaticParams,
} from "../app/documentation/[version]/page";
import DocumentationSurface, {
  generateMetadata as generateDocumentationSurfaceMetadata,
  generateStaticParams as generateDocumentationSurfaceStaticParams,
} from "../app/documentation/[version]/[surface]/page";
import Playground from "../app/playground/page";
import VersionedPlayground, {
  generateMetadata as generatePlaygroundMetadata,
  generateStaticParams as generatePlaygroundStaticParams,
} from "../app/playground/[version]/page";
import PlaygroundClient from "../app/playground/PlaygroundClient";
import { usePlaygroundState } from "../app/playground/usePlaygroundState";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import manifest from "../app/manifest";
import { GET, POST } from "../app/api/route";
import AboutDemoImage from "../components/AboutDemoImage";
import ApiDocumentationPage from "../components/ApiDocumentationPage";
import CodeCard from "../components/CodeCard";
import CodeSnippet from "../components/CodeSnippet";
import DocumentationAnchorNav from "../components/DocumentationAnchorNav";
import DynamicEditablePlot from "../components/DynamicEditablePlot";
import EditablePlot from "../components/EditablePlot";
import JsonLd from "../components/JsonLd";
import NavControls from "../components/NavControls";
import SiteFooter from "../components/SiteFooter";
import SiteNavbar from "../components/SiteNavbar";
import { SiteProviders, useSitePreferences } from "../components/SiteProviders";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  isTheme,
  readPreferredTheme,
  subscribeToTheme,
  THEME_COOKIE_NAME,
} from "../components/siteThemeStore";
import {
  applyLibraryVersion,
  getLibraryVersionSnapshot,
  getServerLibraryVersionSnapshot,
  isLibraryVersion,
  LIBRARY_VERSION_STORAGE_KEY,
  readPreferredLibraryVersion,
  subscribeToLibraryVersion,
} from "../components/libraryVersionStore";
import { useEditablePlot } from "../components/useEditablePlot";
import { usePersistentTheme } from "../components/usePersistentTheme";
import { MOBILE_NAV_QUERY, useMediaQuery } from "../hooks/useMediaQuery";
import { buildPageMetadata, toCanonicalAbsoluteUrl } from "../lib/seoMetadata";
import {
  DEFAULT_PLAYGROUND_INPUT,
  DEFAULT_PLAYGROUND_OPTIONS,
  EXTERNAL_LINKS,
  PACKAGE_NAME,
  SITE_ROUTES,
  SITE_URL,
} from "../lib/siteConstants";
import messages from "../messages/en.json";
import { API_DOCS_BY_VERSION } from "../app/generated/api-docs";

function renderWithProviders(ui: React.ReactNode) {
  return render(<SiteProviders>{ui}</SiteProviders>);
}

function installMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    matches,
    media: query,
    removeEventListener: vi.fn(),
  }));
}

describe("pages and routes", () => {
  test("provides at least 50 additional renderer examples", () => {
    expect(EXAMPLE_DEFINITIONS.length).toBeGreaterThanOrEqual(104);
    expect(new Set(EXAMPLE_DEFINITIONS.map(({ id }) => id)).size).toBe(
      EXAMPLE_DEFINITIONS.length,
    );

    const counts = Object.groupBy(
      EXAMPLE_DEFINITIONS,
      ({ method }) => method,
    );

    expect(Object.keys(counts).sort()).toEqual([
      "candlestick",
      "heatmap",
      "histogram",
      "plot",
      "renderChart",
      "sparkline",
    ]);

    Object.values(counts).forEach((examples) => {
      expect(examples?.length).toBeGreaterThanOrEqual(6);
    });

    EXAMPLE_DEFINITIONS.forEach((example) => {
      expect(messages.examples.items[example.id]).toBeTruthy();
      expect(getExampleSource(example)).toMatch(
        new RegExp(`^${example.method}\\(`),
      );
      expect(renderExample(example)).not.toMatch(/\u001b\[[0-9;]*m/);
    });
  });

  test.each(["candlestick", "heatmap", "sparkline"] as const)(
    "provides at least 25 %s examples",
    (method) => {
      const examples = EXAMPLE_DEFINITIONS.filter(
        (example) => example.method === method,
      );

      expect(examples.length).toBeGreaterThanOrEqual(25);
      examples.forEach((example) => {
        expect(renderExample(example)).not.toMatch(/\u001b\[[0-9;]*m/);
      });
    },
  );

  test("renders primary pages with shared providers", async () => {
    renderWithProviders(<Home />);
    expect(screen.getAllByText(PACKAGE_NAME).length).toBeGreaterThan(0);
    expect(screen.getByText(messages.home.primaryAction)).toBeTruthy();
    expect(
      screen.getByText(messages.home.primaryAction).closest("a")?.getAttribute("href")
    ).toBe("/playground/6.0.0");
    expect(
      screen
        .getByText(messages.home.projectArticle.link)
        .closest("a")
        ?.getAttribute("href")
    ).toBe(EXTERNAL_LINKS.projectArticle);
    cleanup();

    renderWithProviders(<Usage />);
    expect(screen.getAllByText(messages.usage.title).length).toBeGreaterThan(0);
    expect(screen.getByText(messages.usage.library.title)).toBeTruthy();
    cleanup();

    renderWithProviders(
      await VersionedExamples({ params: Promise.resolve({ version: "6.0.0" }) })
    );
    expect(screen.getByText("Examples for 6.0.0")).toBeTruthy();
    expect(
      screen.getByRole("navigation", { name: messages.breadcrumbs.label }),
    ).toBeTruthy();
    expect(
      screen.getAllByText(messages.examples.openInPlayground).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(messages.examples.notShareable)).toBeTruthy();
    cleanup();

    renderWithProviders(
      await DocumentationVersion({
        params: Promise.resolve({ version: "6.0.0" }),
      })
    );
    expect(screen.getByText("Documentation for 6.0.0")).toBeTruthy();
    expect(
      screen.getByRole("navigation", { name: messages.breadcrumbs.label }),
    ).toBeTruthy();
    expect(screen.getByText(messages.documentation.intro)).toBeTruthy();
    expect(
      screen.getByText(messages.documentation.surfaces.plot.title)
    ).toBeTruthy();
    cleanup();

    renderWithProviders(
      await VersionedPlayground({
        params: Promise.resolve({ version: "6.0.0" }),
      })
    );
    await waitFor(() => {
      expect(screen.getByText("Playground — 6.0.0")).toBeTruthy();
    });
  });

  test("renders layout shell and static metadata routes", async () => {
    const layout = RootLayout({ children: <div>content</div> });
    expect(layout.type).toBe("html");

    expect(sitemap().map((entry) => entry.url)).toContain(`${SITE_URL}/usage`);
    expect(sitemap().map((entry) => entry.url)).toContain(
      `${SITE_URL}/documentation/6.0.0/render-chart`
    );
    expect(robots()).toMatchObject({
      host: SITE_URL,
      rules: { allow: "/", disallow: "/api", userAgent: "*" },
    });
    expect(manifest()).toMatchObject({
      display: "standalone",
      name: messages.metadata.applicationName,
    });
    expect(toCanonicalAbsoluteUrl("usage")).toBe(`${SITE_URL}/usage`);
    expect(
      buildPageMetadata({
        description: "No index",
        index: false,
        pathname: "private",
        title: "Private",
      }).robots
    ).toMatchObject({ follow: true, index: false });

    const getResponse = await GET(
      new Request(
        `http://localhost/api?input=${encodeURIComponent(
          JSON.stringify([[1, 1]])
        )}`
      )
    );
    expect(getResponse.status).toBe(200);

    const postResponse = await POST(
      new Request("http://localhost/api", {
        body: JSON.stringify({ input: [[1, 1]], settings: { width: 20 } }),
        method: "POST",
      })
    );
    expect(postResponse.status).toBe(200);
  });

  test("versioned routes expose static params, metadata, redirects, and not-found behavior", async () => {
    expect(generateDocumentationVersionStaticParams()).toEqual([
      { version: "6.0.0" },
      { version: "5.4.0" },
    ]);
    expect(generateExamplesStaticParams()).toEqual([
      { version: "6.0.0" },
      { version: "5.4.0" },
    ]);
    expect(generatePlaygroundStaticParams()).toEqual([
      { version: "6.0.0" },
      { version: "5.4.0" },
    ]);
    expect(generateDocumentationSurfaceStaticParams()).toContainEqual({
      surface: "render-chart",
      version: "6.0.0",
    });
    expect(generateDocumentationSurfaceStaticParams()).toContainEqual({
      surface: "reference",
      version: "5.4.0",
    });

    await expect(
      generateDocumentationVersionMetadata({
        params: Promise.resolve({ version: "6.0.0" }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: "/documentation/6.0.0" },
      title: "Documentation for 6.0.0",
    });
    await expect(
      generateDocumentationVersionMetadata({
        params: Promise.resolve({ version: "invalid" }),
      }),
    ).resolves.toEqual({});
    await expect(
      generateDocumentationSurfaceMetadata({
        params: Promise.resolve({ surface: "reference", version: "5.4.0" }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: "/documentation/5.4.0/reference" },
      title: "Shared API reference — 5.4.0",
    });
    await expect(
      generateDocumentationSurfaceMetadata({
        params: Promise.resolve({ surface: "plot", version: "6.0.0" }),
      }),
    ).resolves.toMatchObject({ title: "plot — 6.0.0" });
    await expect(
      generateDocumentationSurfaceMetadata({
        params: Promise.resolve({ surface: "missing", version: "6.0.0" }),
      }),
    ).resolves.toEqual({});
    await expect(
      generateExamplesMetadata({
        params: Promise.resolve({ version: "5.4.0" }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: "/examples/5.4.0" },
      title: "Examples for 5.4.0",
    });
    await expect(
      generateExamplesMetadata({
        params: Promise.resolve({ version: "6.0.0" }),
      }),
    ).resolves.toMatchObject({ title: "Examples for 6.0.0" });
    await expect(
      generateExamplesMetadata({
        params: Promise.resolve({ version: "invalid" }),
      }),
    ).resolves.toEqual({});
    await expect(
      generatePlaygroundMetadata({
        params: Promise.resolve({ version: "5.4.0" }),
      }),
    ).resolves.toMatchObject({
      alternates: { canonical: "/playground/5.4.0" },
      title: "Playground — 5.4.0",
    });
    await expect(
      generatePlaygroundMetadata({
        params: Promise.resolve({ version: "invalid" }),
      }),
    ).resolves.toEqual({});

    expect(() => Documentation()).toThrow(
      "NEXT_REDIRECT:/documentation/6.0.0",
    );
    expect(() => Examples()).toThrow("NEXT_REDIRECT:/examples/6.0.0");
    await expect(
      Playground({
        searchParams: Promise.resolve({
          input: "[[1,2]]",
          option: ["one", "two"],
        }),
      }),
    ).rejects.toThrow(
      "NEXT_REDIRECT:/playground/6.0.0?input=%5B%5B1%2C2%5D%5D&option=one&option=two",
    );
    await expect(
      Playground({
        searchParams: Promise.resolve({ omitted: undefined }),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/playground/6.0.0");

    await expect(
      DocumentationVersion({
        params: Promise.resolve({ version: "invalid" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(
      DocumentationSurface({
        params: Promise.resolve({ surface: "missing", version: "6.0.0" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(
      VersionedExamples({
        params: Promise.resolve({ version: "invalid" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(
      VersionedPlayground({
        params: Promise.resolve({ version: "invalid" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    renderWithProviders(
      await DocumentationVersion({
        params: Promise.resolve({ version: "5.4.0" }),
      }),
    );
    expect(
      screen.getByText(messages.documentation.historicalGeneratedNotice),
    ).toBeTruthy();
    cleanup();

    renderWithProviders(
      await DocumentationSurface({
        params: Promise.resolve({ surface: "plot", version: "6.0.0" }),
      }),
    );
    expect(screen.getByText("plot — 6.0.0")).toBeTruthy();
    cleanup();

    renderWithProviders(
      await DocumentationSurface({
        params: Promise.resolve({ surface: "reference", version: "5.4.0" }),
      }),
    );
    expect(screen.getByText("Shared API reference — 5.4.0")).toBeTruthy();
    cleanup();
  });

  test("renders complete generated API documentation surfaces", () => {
    const plot = API_DOCS_BY_VERSION["6.0.0"].find(
      (surface) => surface.id === "plot",
    );
    const reference = API_DOCS_BY_VERSION["6.0.0"].find(
      (surface) => surface.id === "reference",
    );
    expect(plot).toBeTruthy();
    expect(reference).toBeTruthy();
    const requiredPlot = structuredClone(plot!);
    requiredPlot.optionGroups[0].description = "`Settings`";
    requiredPlot.optionGroups[0].options[0].description = "`Color`";
    requiredPlot.optionGroups[0].options[0].required = true;
    requiredPlot.optionGroups[0].options[0].exampleIds = [
      "plot-complete",
      "renderer-ascii",
    ];

    render(
      <ApiDocumentationPage
        copy={messages.documentation.surfaces.plot}
        currentVersion="6.0.0"
        surface={requiredPlot}
      />,
    );
    expect(screen.getByText("plot — 6.0.0")).toBeTruthy();
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
    expect(screen.getAllByText("width").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(messages.documentation.optional).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(messages.documentation.required).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(messages.documentation.exampleTitles["renderer-ascii"])).toBeTruthy();
    cleanup();

    render(
      <ApiDocumentationPage
        copy={messages.documentation.surfaces.reference}
        currentVersion="6.0.0"
        surface={reference!}
      />,
    );
    expect(screen.getByText(messages.documentation.publicExports)).toBeTruthy();
    expect(screen.getByText("ChartErrorCode")).toBeTruthy();
    expect(screen.getByText(messages.documentation.publicTypes)).toBeTruthy();
  });

  test("renders non-shareable example section without playground action", () => {
    const example = EXAMPLE_DEFINITIONS.find(
      (item) => item.id === "customFormatter"
    );
    expect(example).toBeTruthy();

    renderWithProviders(
      <ExampleSection
        inputSource="[[0, 1]]"
        optionsSource="{ formatter: () => 'A' }"
        output="terminal output"
        showNotShareable
        title={messages.examples.items.customFormatter}
      />
    );

    expect(screen.getByText(messages.examples.notShareable)).toBeTruthy();
  });

  test("historical examples link shareable data to their matching playground", async () => {
    renderWithProviders(
      await VersionedExamples({ params: Promise.resolve({ version: "5.4.0" }) })
    );

    expect(screen.getByText("Examples for 5.4.0")).toBeTruthy();
    const playgroundLinks = screen
      .getAllByText(messages.examples.openInPlayground)
      .map((label) => label.closest("a"));

    expect(playgroundLinks).toHaveLength(15);
    playgroundLinks.forEach((link) => {
      expect(link?.getAttribute("href")).toMatch(
        /^\/playground\/5\.4\.0\?input=/
      );
    });
    expect(screen.getByText(messages.examples.notShareable)).toBeTruthy();
    expect(screen.getAllByText(/8┤/).length).toBeGreaterThan(0);
  });
});

describe("presentational components", () => {
  test("JsonLd escapes unsafe script payloads", () => {
    const { container } = render(<JsonLd data={{ name: "<script>" }} />);
    const script = container.querySelector("script");

    expect(script?.type).toBe("application/ld+json");
    expect(script?.innerHTML).toContain("\\u003cscript>");
    expect(script?.innerHTML).not.toContain("<script>");
  });

  test("CodeSnippet renders copy action and code text", () => {
    render(<CodeSnippet language="javascript">console.log(1);</CodeSnippet>);

    expect(screen.getByText(messages.common.copy)).toBeTruthy();
    expect(
      screen.getByText("console.log(1);").getAttribute("data-language")
    ).toBe("javascript");
  });

  test("CodeSnippet falls back to empty string for null children", () => {
    const { container } = render(<CodeSnippet>{null}</CodeSnippet>);

    expect(container.querySelector("code")?.textContent).toBe("");
  });

  test("CodeCard toggles collapsed state", () => {
    render(
      <CodeCard expandable title="Example">
        const value = 1;
      </CodeCard>
    );

    const card = screen.getByText("Example").closest("section");
    expect(card?.getAttribute("data-collapsed")).toBe("true");

    fireEvent.click(screen.getByLabelText(messages.common.expand));
    expect(card?.hasAttribute("data-collapsed")).toBe(false);

    fireEvent.click(screen.getByLabelText(messages.common.collapse));
    expect(card?.getAttribute("data-collapsed")).toBe("true");
  });

  test("SiteFooter renders year and support link", () => {
    render(<SiteFooter year={2030} />);

    expect(screen.getByText(messages.footer.support)).toBeTruthy();
    expect(screen.getByText(/2030/)).toBeTruthy();
  });
});

describe("theme and preferences", () => {
  test("library version store validates, persists, and notifies", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToLibraryVersion(listener);

    expect(isLibraryVersion("6.0.0")).toBe(true);
    expect(isLibraryVersion("7.0.0")).toBe(false);
    expect(getServerLibraryVersionSnapshot()).toBe("6.0.0");

    applyLibraryVersion("5.4.0", true);
    expect(getLibraryVersionSnapshot()).toBe("5.4.0");
    expect(localStorage.getItem(LIBRARY_VERSION_STORAGE_KEY)).toBe("5.4.0");
    expect(readPreferredLibraryVersion()).toBe("5.4.0");
    expect(listener).toHaveBeenCalledTimes(1);

    applyLibraryVersion("7.0.0", true);
    expect(getLibraryVersionSnapshot()).toBe("5.4.0");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    applyLibraryVersion("6.0.0");
  });

  test("site theme store reads local, cookie, and system preferences", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToTheme(listener);

    expect(isTheme("dark")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(getServerThemeSnapshot()).toBe("light");

    applyTheme("dark");
    expect(getThemeSnapshot()).toBe("dark");
    expect(listener).toHaveBeenCalledTimes(1);

    localStorage.setItem(THEME_COOKIE_NAME, "light");
    expect(readPreferredTheme()).toBe("light");
    localStorage.removeItem(THEME_COOKIE_NAME);

    document.cookie = `${THEME_COOKIE_NAME}=dark`;
    expect(readPreferredTheme()).toBe("dark");

    document.cookie = `${THEME_COOKIE_NAME}=bad`;
    installMatchMedia(true);
    expect(readPreferredTheme()).toBe("dark");

    unsubscribe();
    applyTheme("light");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("usePersistentTheme applies and persists theme", async () => {
    installMatchMedia(false);
    const { result } = renderHook(() => usePersistentTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe("light");
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem(THEME_COOKIE_NAME)).toBe("dark");
    expect(document.cookie).toContain(`${THEME_COOKIE_NAME}=dark`);
  });

  test("useSitePreferences requires provider and NavControls toggles theme", () => {
    function Consumer() {
      useSitePreferences();
      return null;
    }

    expect(() => render(<Consumer />)).toThrow(
      messages.sitePreferences.errors.missingProvider
    );

    renderWithProviders(<NavControls />);
    fireEvent.click(screen.getByLabelText(messages.theme.switchToDark));
    expect(localStorage.getItem(THEME_COOKIE_NAME)).toBe("dark");
  });

  test("AboutDemoImage follows active theme", async () => {
    localStorage.setItem(THEME_COOKIE_NAME, "dark");

    renderWithProviders(<AboutDemoImage alt="demo" />);

    await waitFor(() => {
      expect(screen.getByAltText("demo").getAttribute("src")).toBe(
        "/about-demo-dark.gif"
      );
    });
  });
});

describe("navigation and browser hooks", () => {
  test("useMediaQuery syncs current match and unsubscribes", async () => {
    let listener: (() => void) | undefined;
    const media = {
      addEventListener: vi.fn((_event: string, callback: () => void) => {
        listener = callback;
      }),
      matches: true,
      media: MOBILE_NAV_QUERY,
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockReturnValue(media);

    const { result, unmount } = renderHook(() =>
      useMediaQuery(MOBILE_NAV_QUERY)
    );

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    act(() => {
      media.matches = false;
      listener?.();
    });
    expect(result.current).toBe(false);

    unmount();
    expect(media.removeEventListener).toHaveBeenCalledWith("change", listener);
  });

  test("SiteNavbar marks active desktop link", async () => {
    installMatchMedia(false);
    window.history.pushState({}, "", SITE_ROUTES.documentation);
    localStorage.setItem(LIBRARY_VERSION_STORAGE_KEY, "5.4.0");
    applyLibraryVersion("5.4.0");

    renderWithProviders(<SiteNavbar />);

    await waitFor(() => {
      expect(
        screen
          .getByText(messages.nav.documentation)
          .closest("a")
          ?.getAttribute("aria-current")
      ).toBe("page");
    });
    expect(screen.getByText(PACKAGE_NAME)).toBeTruthy();
    expect(
      screen
        .getByText(messages.nav.documentation)
        .closest("a")
        ?.getAttribute("href")
    ).toBe("/documentation/5.4.0");
    expect(
      screen.getByText(messages.nav.examples).closest("a")?.getAttribute("href")
    ).toBe("/examples/5.4.0");

    applyLibraryVersion("6.0.0");
    localStorage.removeItem(LIBRARY_VERSION_STORAGE_KEY);
  });

  test("SiteNavbar opens and closes mobile menu", async () => {
    installMatchMedia(true);
    window.history.pushState({}, "", SITE_ROUTES.examples);

    renderWithProviders(<SiteNavbar />);

    const menuButton = await screen.findByLabelText(messages.nav.openMenuLabel);
    fireEvent.click(menuButton);
    expect(
      screen
        .getByLabelText(messages.nav.closeMenuLabel)
        .getAttribute("aria-expanded")
    ).toBe("true");

    fireEvent.click(screen.getByText(messages.nav.usage));
    await waitFor(() => {
      expect(
        screen
          .getByLabelText(messages.nav.openMenuLabel)
          .getAttribute("aria-expanded")
      ).toBe("false");
    });
  });

  test("SiteNavbar marks home link active at root path", async () => {
    installMatchMedia(false);
    window.history.pushState({}, "", SITE_ROUTES.home);

    renderWithProviders(<SiteNavbar />);

    await waitFor(() => {
      expect(
        screen
          .getByText(messages.nav.about)
          .closest("a")
          ?.getAttribute("aria-current")
      ).toBe("page");
    });
  });

  test("DocumentationAnchorNav responds to hash, click, and selected item scroll", async () => {
    const items = [
      { href: "#alpha", id: "alpha", label: "Alpha" },
      { href: "#beta", id: "beta", label: "Beta" },
    ];

    document.body.innerHTML =
      '<section id="alpha"></section><section id="beta"></section>';
    window.history.pushState({}, "", "#beta");
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      overflowY: "auto",
    } as CSSStyleDeclaration);

    const { container } = render(
      <div className="documentation-index">
        <div className="pixxl-card">
          <DocumentationAnchorNav items={items} />
        </div>
      </div>
    );
    const card = container.querySelector(".pixxl-card") as HTMLElement;
    Object.defineProperties(card, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 220 },
    });
    card.getBoundingClientRect = () => ({ bottom: 100, top: 0 } as DOMRect);

    await waitFor(() => {
      expect(screen.getByText("Beta").getAttribute("data-state")).toBe(
        "selected"
      );
    });

    const alpha = screen.getByText("Alpha");
    alpha.getBoundingClientRect = () => ({ bottom: 140, top: 120 } as DOMRect);
    fireEvent.click(alpha);
    expect(screen.getByText("Alpha").getAttribute("data-state")).toBe(
      "selected"
    );

    await waitFor(() => {
      expect(card.scrollTop).toBeGreaterThan(0);
    });
  });

  test("DocumentationAnchorNav handles invalid hashes and empty values", async () => {
    window.history.pushState({}, "", "#%E0%A4%A");

    render(
      <DocumentationAnchorNav
        items={[
          { href: "#%E0%A4%A", id: "encoded", label: "Encoded" },
          { href: "/plain", id: "plain", label: "Plain" },
        ]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Encoded").getAttribute("data-state")).toBe(
        "selected"
      );
    });
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    cleanup();

    render(<DocumentationAnchorNav items={[]} />);
    expect(screen.queryByText("Encoded")).toBeNull();
  });

  test("DocumentationAnchorNav skips selected item scrolling without card", async () => {
    render(
      <DocumentationAnchorNav
        items={[{ href: "#alpha", id: "alpha", label: "Alpha" }]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Alpha").getAttribute("data-state")).toBe(
        "selected"
      );
    });
  });
});

describe("playground components and hooks", () => {
  test("usePlaygroundState reads URL query values", () => {
    const input = [[9, 9]];
    const options = { height: 4, width: 12 };
    window.history.pushState(
      {},
      "",
      `/playground?input=${encodeURIComponent(
        JSON.stringify(input)
      )}&options=${encodeURIComponent(JSON.stringify(options))}`
    );

    const { result } = renderHook(() => usePlaygroundState());

    expect(result.current.input).toEqual(input);
    expect(result.current.options).toEqual(options);
  });

  test("usePlaygroundState falls back on malformed URL values", () => {
    window.history.pushState({}, "", "/playground?input={bad&options={bad");

    const { result } = renderHook(() => usePlaygroundState());

    expect(result.current.input).toEqual(DEFAULT_PLAYGROUND_INPUT);
    expect(result.current.options).toEqual(DEFAULT_PLAYGROUND_OPTIONS);
  });

  test("useEditablePlot runs editor code, validation, and syntax errors", async () => {
    const { result } = renderHook(() =>
      useEditablePlot({
        input: [[1, 1]],
        options: { height: 4, width: 12 },
      })
    );
    let shortcutHandler: (() => void | Promise<void>) | undefined;
    const inputEditorDomNode = document.createElement("div");
    const inputEditorTextarea = document.createElement("textarea");
    inputEditorDomNode.append(inputEditorTextarea);
    const optionsEditorDomNode = document.createElement("div");
    const optionsEditorTextarea = document.createElement("textarea");
    optionsEditorDomNode.append(optionsEditorTextarea);
    const inputEditor = {
      addCommand: vi.fn(
        (_shortcut: number, callback: () => void | Promise<void>) => {
          shortcutHandler = callback;
        }
      ),
      getAction: () => ({ run: vi.fn(async () => undefined) }),
      getDomNode: () => inputEditorDomNode,
      getValue: vi.fn(() => "const input = [[1, 2], [2, 4]]"),
    };
    const optionsEditor = {
      addCommand: vi.fn(),
      getAction: () => ({ run: vi.fn(async () => undefined) }),
      getDomNode: () => optionsEditorDomNode,
      getValue: vi.fn(() => "const options = { width: 16, height: 6 }"),
    };

    act(() => {
      result.current.mountInputEditor(inputEditor as never);
      result.current.mountOptionsEditor(optionsEditor as never);
      result.current.runCode();
    });
    expect(inputEditorTextarea.id).toBe("playground-input-code");
    expect(inputEditorTextarea.name).toBe("playground-input-code");
    expect(optionsEditorTextarea.id).toBe("playground-options-code");
    expect(optionsEditorTextarea.name).toBe("playground-options-code");
    expect(result.current.result).toMatch(/[┤▲▶]/);

    inputEditor.getValue.mockReturnValue("const input = 1");
    act(() => {
      result.current.runCode();
    });
    expect(result.current.result).toBe(messages.editablePlot.validationError);

    inputEditor.getValue.mockReturnValue("const input = [");
    act(() => {
      result.current.runCode();
    });
    expect(result.current.result).toMatch(/^Error:/);

    inputEditor.getValue.mockReturnValue("const input = [[2, 2]]");
    optionsEditor.getValue.mockReturnValue(
      "const options = { width: 12, height: 4 }"
    );
    await act(async () => {
      await shortcutHandler?.();
    });
    expect(result.current.result).toMatch(/[┤▲▶]/);
  });

  test("DynamicEditablePlot renders editors and updates output", async () => {
    render(
      <DynamicEditablePlot
        input={[[1, 1]]}
        options={{ height: 4, width: 12 }}
        version="6.0.0"
      />
    );

    expect(screen.getByText(messages.editablePlot.runAction)).toBeTruthy();
    const editors = screen.getAllByLabelText("Monaco editor");
    expect(editors).toHaveLength(2);
    expect(editors[0]?.id).toBe("playground-input-code");
    expect(editors[0]?.getAttribute("name")).toBe("playground-input-code");
    expect(editors[1]?.id).toBe("playground-options-code");
    expect(editors[1]?.getAttribute("name")).toBe("playground-options-code");
    fireEvent.click(screen.getByText(messages.editablePlot.runAction));

    await waitFor(() => {
      expect(screen.getByText(messages.common.output)).toBeTruthy();
    });
  });

  test("EditablePlot wrapper loads dynamic component", async () => {
    render(
      <EditablePlot
        input={[[1, 1]]}
        options={{ height: 4, width: 12 }}
        version="6.0.0"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(messages.editablePlot.runAction)).toBeTruthy();
    });
  });

  test("PlaygroundClient renders selected version and editable plot", async () => {
    renderWithProviders(<PlaygroundClient version="5.4.0" />);

    await waitFor(() => {
      expect(screen.getByText("Playground — 5.4.0")).toBeTruthy();
      expect(screen.getByText(messages.playground.shortcutHint)).toBeTruthy();
      expect(screen.getByText(messages.editablePlot.runAction)).toBeTruthy();
    });
  });
});
