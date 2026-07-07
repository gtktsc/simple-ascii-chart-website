import React, { useEffect, useRef } from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

type BasicProps = {
  actions?: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  brand?: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onValueChange?: (value: string) => void;
  title?: React.ReactNode;
  value?: string;
  [key: string]: unknown;
};

const pickDomProps = ({
  actions,
  as,
  brand,
  children,
  description,
  label,
  onValueChange,
  title,
  ...props
}: BasicProps) => props;

function createBox(defaultTag: keyof React.JSX.IntrinsicElements) {
  return function BoxComponent({
    actions,
    as,
    brand,
    children,
    description,
    title,
    ...props
  }: BasicProps) {
    const Tag = (as ?? defaultTag) as React.ElementType;

    return (
      <Tag {...pickDomProps(props)}>
        {brand}
        {title ? <h2>{title}</h2> : null}
        {description ? <p>{description}</p> : null}
        {actions}
        {children}
      </Tag>
    );
  };
}

const Icon = ({ size: _size }: { size?: string }) => <span aria-hidden="true" />;

vi.mock("@pixxl-tools/components", () => {
  const Box = createBox("div");
  const Inline = createBox("div");
  const Stack = createBox("div");
  const SimpleGrid = createBox("div");
  const PageSection = createBox("section");
  const Prose = createBox("div");
  const PublicPage = createBox("main");
  const Section = createBox("section");
  const Text = createBox("span");
  const Heading = createBox("h2");
  const Tag = createBox("span");
  const Code = createBox("code");
  const Container = createBox("div");
  const AppFooter = createBox("footer");
  const AppMain = createBox("main");
  const AppShell = createBox("div");
  const MediaStage = createBox("div");
  const Navbar = createBox("nav");

  function Link({ children, href = "#", onClick, ...props }: BasicProps) {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
        {...pickDomProps(props)}
      >
        {children}
      </a>
    );
  }

  function ActionLink({ children, href = "#", onClick, ...props }: BasicProps) {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
        {...pickDomProps(props)}
      >
        {children}
      </a>
    );
  }

  function Button({ children, onClick, ...props }: BasicProps) {
    return (
      <button onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} type="button" {...pickDomProps(props)}>
        {children}
      </button>
    );
  }

  function IconButton({ children, label, onClick, ...props }: BasicProps) {
    return (
      <button
        aria-label={label}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        type="button"
        {...pickDomProps(props)}
      >
        {children}
      </button>
    );
  }

  function ClipboardButton({ label, value }: BasicProps) {
    return (
      <button data-clipboard-value={String(value ?? "")} type="button">
        {label}
      </button>
    );
  }

  function CodeFrame({ actions, children, maxHeight }: BasicProps) {
    return (
      <div data-max-height={String(maxHeight ?? "")}>
        {actions}
        <pre>{children}</pre>
      </div>
    );
  }

  function Card({ actions, children, title, ...props }: BasicProps) {
    return (
      <section className={`pixxl-card ${String(props.className ?? "")}`} {...pickDomProps(props)}>
        {title ? <h3>{title}</h3> : null}
        {actions}
        {children}
      </section>
    );
  }

  function AnchorNav({
    items = [],
    onValueChange,
    value,
  }: BasicProps & {
    items?: Array<{ href: string; id: string; label: string }>;
  }) {
    return (
      <nav>
        {items.map((item) => (
          <a
            className="pixxl-anchor-nav-item"
            data-state={item.id === value ? "selected" : undefined}
            href={item.href}
            key={item.id}
            onClick={(event) => {
              event.preventDefault();
              onValueChange?.(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    );
  }

  function PixxlProvider({ children, theme }: BasicProps) {
    return <div data-theme={String(theme ?? "")}>{children}</div>;
  }

  return {
    ActionLink,
    AnchorNav,
    AppFooter,
    AppMain,
    AppShell,
    BookOpenIcon: Icon,
    Box,
    Button,
    Card,
    ChartLineIcon: Icon,
    ClipboardButton,
    CloseIcon: Icon,
    Code,
    CodeFrame,
    CommandIcon: Icon,
    Container,
    Heading,
    HomeIcon: Icon,
    IconButton,
    Inline,
    Link,
    MaximizeIcon: Icon,
    MediaStage,
    MenuIcon: Icon,
    MinimizeIcon: Icon,
    MoonIcon: Icon,
    Navbar,
    PageSection,
    PixxlProvider,
    PlayIcon: Icon,
    Prose,
    PublicPage,
    Section,
    SimpleGrid,
    Stack,
    SunIcon: Icon,
    Tag,
    Text,
  };
});

vi.mock("@pixxl-tools/components/styles.css", () => ({}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) =>
    React.createElement("img", { alt, ...props }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => window.location.pathname,
}));

vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<{ default: React.ComponentType<unknown> }>) => {
    const LazyComponent = React.lazy(loader);

    return function DynamicComponent(props: unknown) {
      return (
        <React.Suspense fallback={null}>
          <LazyComponent {...(props as object)} />
        </React.Suspense>
      );
    };
  },
}));

vi.mock("monaco-editor", () => ({
  KeyCode: { KeyS: 83 },
  KeyMod: { CtrlCmd: 2048 },
}));

vi.mock("@monaco-editor/react", () => {
  function MonacoEditor({
    defaultValue = "",
    onMount,
  }: {
    defaultValue?: string;
    onMount?: (editor: {
      addCommand: (shortcut: number, callback: () => void | Promise<void>) => void;
      getAction: () => { run: () => Promise<void> };
      getValue: () => string;
    }) => void;
  }) {
    const valueRef = useRef(defaultValue);

    useEffect(() => {
      onMount?.({
        addCommand: vi.fn(),
        getAction: () => ({ run: vi.fn(async () => undefined) }),
        getValue: () => valueRef.current,
      });
    }, [onMount]);

    return (
      <textarea
        aria-label="Monaco editor"
        defaultValue={defaultValue}
        onChange={(event) => {
          valueRef.current = event.target.value;
        }}
      />
    );
  }

  return {
    default: MonacoEditor,
  };
});

afterEach(() => {
  cleanup();
  document.cookie = "theme=; path=/; max-age=0";
  localStorage.clear();
  window.history.pushState({}, "", "/");
});

Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    matches: false,
    media: query,
    removeEventListener: vi.fn(),
  })),
  writable: true,
});

window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
window.cancelAnimationFrame = (handle) => window.clearTimeout(handle);
