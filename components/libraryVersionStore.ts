import {
  LATEST_DOCUMENTATION_VERSION,
  findDocumentationVersion,
} from "../lib/documentationVersions.mjs";

export const LIBRARY_VERSION_STORAGE_KEY = "library-version";

const listeners = new Set<() => void>();
let currentLibraryVersion = LATEST_DOCUMENTATION_VERSION;

export const isLibraryVersion = (
  value: string | null | undefined,
): value is string =>
  Boolean(value && findDocumentationVersion(value));

export const readPreferredLibraryVersion = () => {
  const storedVersion = localStorage.getItem(LIBRARY_VERSION_STORAGE_KEY);

  return isLibraryVersion(storedVersion)
    ? storedVersion
    : LATEST_DOCUMENTATION_VERSION;
};

const emitLibraryVersionChange = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeToLibraryVersion = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

export const getLibraryVersionSnapshot = () => currentLibraryVersion;

export const getServerLibraryVersionSnapshot = () =>
  LATEST_DOCUMENTATION_VERSION;

export const applyLibraryVersion = (version: string, persist = false) => {
  if (!isLibraryVersion(version)) return;

  currentLibraryVersion = version;

  if (persist) {
    localStorage.setItem(LIBRARY_VERSION_STORAGE_KEY, version);
  }

  emitLibraryVersionChange();
};
