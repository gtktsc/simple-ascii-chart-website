"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  applyLibraryVersion,
  getLibraryVersionSnapshot,
  getServerLibraryVersionSnapshot,
  readPreferredLibraryVersion,
  subscribeToLibraryVersion,
} from "./libraryVersionStore";

export function usePersistentLibraryVersion() {
  const libraryVersion = useSyncExternalStore(
    subscribeToLibraryVersion,
    getLibraryVersionSnapshot,
    getServerLibraryVersionSnapshot,
  );

  useEffect(() => {
    applyLibraryVersion(readPreferredLibraryVersion());
  }, []);

  const setLibraryVersion = useCallback((version: string) => {
    applyLibraryVersion(version, true);
  }, []);

  return { libraryVersion, setLibraryVersion };
}
