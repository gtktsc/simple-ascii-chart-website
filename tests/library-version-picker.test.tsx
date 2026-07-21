import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import LibraryVersionPicker from "../components/LibraryVersionPicker";
import messages from "../messages/en.json";

const state = vi.hoisted(() => ({
  libraryVersion: "6.0.0",
  pathname: "/documentation/6.0.0/plot",
  push: vi.fn(),
  setLibraryVersion: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => state.pathname,
  useRouter: () => ({ push: state.push }),
}));

vi.mock("../components/SiteProviders", () => ({
  useSitePreferences: () => ({
    libraryVersion: state.libraryVersion,
    setLibraryVersion: state.setLibraryVersion,
  }),
}));

beforeEach(() => {
  state.pathname = "/documentation/6.0.0/plot";
  state.push.mockClear();
  state.setLibraryVersion.mockClear();
});

test("version picker navigates to the selected canonical route", () => {
  render(<LibraryVersionPicker />);

  fireEvent.change(screen.getByLabelText(messages.documentation.versionLabel), {
    target: { value: "5.4.0" },
  });

  expect(state.setLibraryVersion).toHaveBeenCalledWith("5.4.0");
  expect(state.push).toHaveBeenCalledWith("/documentation/5.4.0/plot");
});

test("version picker persists globally without leaving unrelated pages", () => {
  state.pathname = "/usage";
  render(<LibraryVersionPicker />);

  fireEvent.change(screen.getByLabelText(messages.documentation.versionLabel), {
    target: { value: "5.4.0" },
  });

  expect(state.setLibraryVersion).toHaveBeenCalledWith("5.4.0");
  expect(state.push).not.toHaveBeenCalled();
});

test("version picker preserves playground query values", () => {
  state.pathname = "/playground/6.0.0";
  window.history.pushState({}, "", "/playground/6.0.0?input=%5B%5B1%2C2%5D%5D&options=%7B%7D");
  render(<LibraryVersionPicker />);

  fireEvent.change(screen.getByLabelText(messages.documentation.versionLabel), {
    target: { value: "5.4.0" },
  });

  expect(state.push).toHaveBeenCalledWith(
    "/playground/5.4.0?input=%5B%5B1%2C2%5D%5D&options=%7B%7D",
  );
});
