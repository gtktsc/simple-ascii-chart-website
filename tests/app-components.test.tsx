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
import ExampleSection from "../app/examples/ExampleSection";
import { EXAMPLE_DEFINITIONS } from "../app/examples/exampleData";
import Documentation from "../app/documentation/page";
import Playground from "../app/playground/page";
import PlaygroundClient from "../app/playground/PlaygroundClient";
import { usePlaygroundState } from "../app/playground/usePlaygroundState";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import manifest from "../app/manifest";
import { GET, POST } from "../app/api/route";
import AboutDemoImage from "../components/AboutDemoImage";
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
import { useEditablePlot } from "../components/useEditablePlot";
import { usePersistentTheme } from "../components/usePersistentTheme";
import { MOBILE_NAV_QUERY, useMediaQuery } from "../hooks/useMediaQuery";
import {
  buildPageMetadata,
  toCanonicalAbsoluteUrl,
} from "../lib/seoMetadata";
import {
  DEFAULT_PLAYGROUND_INPUT,
  DEFAULT_PLAYGROUND_OPTIONS,
  EXTERNAL_LINKS,
  PACKAGE_NAME,
  SITE_ROUTES,
  SITE_URL,
} from "../lib/siteConstants";
import messages from "../messages/en.json";

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
  test("renders primary pages with shared providers", async () => {
    renderWithProviders(<Home />);
    expect(screen.getAllByText(PACKAGE_NAME).length).toBeGreaterThan(0);
    expect(screen.getByText(messages.home.primaryAction)).toBeTruthy();
    expect(
      screen.getByText(messages.home.projectArticle.link).closest("a")?.getAttribute("href"),
    ).toBe(EXTERNAL_LINKS.projectArticle);
    cleanup();

    renderWithProviders(<Usage />);
    expect(screen.getAllByText(messages.usage.title).length).toBeGreaterThan(0);
    expect(screen.getByText(messages.usage.library.title)).toBeTruthy();
    cleanup();

    renderWithProviders(<Examples />);
    expect(screen.getByText(messages.examples.title)).toBeTruthy();
    expect(screen.getAllByText(messages.examples.openInPlayground).length).toBeGreaterThan(0);
    expect(screen.getByText(messages.examples.notShareable)).toBeTruthy();
    cleanup();

    renderWithProviders(<Documentation />);
    expect(screen.getByText(messages.documentation.title)).toBeTruthy();
    expect(screen.getByText(/The options below/)).toBeTruthy();
    cleanup();

    renderWithProviders(<Playground />);
    await waitFor(() => {
      expect(screen.getByText(messages.playground.title)).toBeTruthy();
    });
  });

  test("renders layout shell and static metadata routes", async () => {
    const layout = RootLayout({ children: <div>content</div> });
    expect(layout.type).toBe("html");

    expect(sitemap().map((entry) => entry.url)).toContain(`${SITE_URL}/usage`);
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
      }).robots,
    ).toMatchObject({ follow: true, index: false });

    const getResponse = await GET(
      new Request(
        `http://localhost/api?input=${encodeURIComponent(JSON.stringify([[1, 1]]))}`,
      ),
    );
    expect(getResponse.status).toBe(200);

    const postResponse = await POST(
      new Request("http://localhost/api", {
        body: JSON.stringify({ input: [[1, 1]], settings: { width: 20 } }),
        method: "POST",
      }),
    );
    expect(postResponse.status).toBe(200);
  });

  test("renders non-shareable example section without playground action", () => {
    const example = EXAMPLE_DEFINITIONS.find((item) => item.id === "customFormatter");
    expect(example).toBeTruthy();

    renderWithProviders(
      <ExampleSection
        example={example ?? EXAMPLE_DEFINITIONS[0]}
        title={messages.examples.items.customFormatter}
      />,
    );

    expect(screen.getByText(messages.examples.notShareable)).toBeTruthy();
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
    expect(screen.getByText("console.log(1);").getAttribute("data-language")).toBe("javascript");
  });

  test("CodeSnippet falls back to empty string for null children", () => {
    const { container } = render(<CodeSnippet>{null}</CodeSnippet>);

    expect(container.querySelector("code")?.textContent).toBe("");
  });

  test("CodeCard toggles collapsed state", () => {
    render(
      <CodeCard expandable title="Example">
        const value = 1;
      </CodeCard>,
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

    expect(() => render(<Consumer />)).toThrow(messages.sitePreferences.errors.missingProvider);

    renderWithProviders(<NavControls />);
    fireEvent.click(screen.getByLabelText(messages.theme.switchToDark));
    expect(localStorage.getItem(THEME_COOKIE_NAME)).toBe("dark");
  });

  test("AboutDemoImage follows active theme", async () => {
    localStorage.setItem(THEME_COOKIE_NAME, "dark");

    renderWithProviders(<AboutDemoImage alt="demo" />);

    await waitFor(() => {
      expect(screen.getByAltText("demo").getAttribute("src")).toBe("/about-demo-dark.gif");
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

    const { result, unmount } = renderHook(() => useMediaQuery(MOBILE_NAV_QUERY));

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

    renderWithProviders(<SiteNavbar />);

    await waitFor(() => {
      expect(
        screen.getByText(messages.nav.documentation).closest("a")?.getAttribute("aria-current"),
      ).toBe("page");
    });
    expect(screen.getByText(PACKAGE_NAME)).toBeTruthy();
  });

  test("SiteNavbar opens and closes mobile menu", async () => {
    installMatchMedia(true);
    window.history.pushState({}, "", SITE_ROUTES.examples);

    renderWithProviders(<SiteNavbar />);

    const menuButton = await screen.findByLabelText(messages.nav.openMenuLabel);
    fireEvent.click(menuButton);
    expect(screen.getByLabelText(messages.nav.closeMenuLabel).getAttribute("aria-expanded")).toBe(
      "true",
    );

    fireEvent.click(screen.getByText(messages.nav.usage));
    await waitFor(() => {
      expect(screen.getByLabelText(messages.nav.openMenuLabel).getAttribute("aria-expanded")).toBe(
        "false",
      );
    });
  });

  test("SiteNavbar marks home link active at root path", async () => {
    installMatchMedia(false);
    window.history.pushState({}, "", SITE_ROUTES.home);

    renderWithProviders(<SiteNavbar />);

    await waitFor(() => {
      expect(screen.getByText(messages.nav.about).closest("a")?.getAttribute("aria-current")).toBe(
        "page",
      );
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
      </div>,
    );
    const card = container.querySelector(".pixxl-card") as HTMLElement;
    Object.defineProperties(card, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 220 },
    });
    card.getBoundingClientRect = () =>
      ({ bottom: 100, top: 0 }) as DOMRect;

    await waitFor(() => {
      expect(screen.getByText("Beta").getAttribute("data-state")).toBe("selected");
    });

    const alpha = screen.getByText("Alpha");
    alpha.getBoundingClientRect = () =>
      ({ bottom: 140, top: 120 }) as DOMRect;
    fireEvent.click(alpha);
    expect(screen.getByText("Alpha").getAttribute("data-state")).toBe("selected");

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
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Encoded").getAttribute("data-state")).toBe("selected");
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
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Alpha").getAttribute("data-state")).toBe("selected");
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
      `/playground?input=${encodeURIComponent(JSON.stringify(input))}&options=${encodeURIComponent(
        JSON.stringify(options),
      )}`,
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
      }),
    );
    let shortcutHandler: (() => void | Promise<void>) | undefined;
    const inputEditor = {
      addCommand: vi.fn((_shortcut: number, callback: () => void | Promise<void>) => {
        shortcutHandler = callback;
      }),
      getAction: () => ({ run: vi.fn(async () => undefined) }),
      getValue: vi.fn(() => "const input = [[1, 2], [2, 4]]"),
    };
    const optionsEditor = {
      addCommand: vi.fn(),
      getAction: () => ({ run: vi.fn(async () => undefined) }),
      getValue: vi.fn(() => "const options = { width: 16, height: 6 }"),
    };

    act(() => {
      result.current.mountInputEditor(inputEditor as never);
      result.current.mountOptionsEditor(optionsEditor as never);
      result.current.runCode();
    });
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
    optionsEditor.getValue.mockReturnValue("const options = { width: 12, height: 4 }");
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
      />,
    );

    expect(screen.getByText(messages.editablePlot.runAction)).toBeTruthy();
    expect(screen.getAllByLabelText("Monaco editor")).toHaveLength(2);
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
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(messages.editablePlot.runAction)).toBeTruthy();
    });
  });

  test("PlaygroundClient renders shortcut hint and editable plot", async () => {
    renderWithProviders(<PlaygroundClient />);

    await waitFor(() => {
      expect(screen.getByText(messages.playground.shortcutHint)).toBeTruthy();
      expect(screen.getByText(messages.editablePlot.runAction)).toBeTruthy();
    });
  });
});
