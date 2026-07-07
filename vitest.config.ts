import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: [
        "app/generated/**",
        "next-env.d.ts",
        "tests/**",
        "*.config.*",
      ],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "hooks/**/*.ts",
        "lib/**/*.{ts,mjs}",
      ],
      provider: "v8",
      reporter: ["text", "json-summary"],
      thresholds: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{mjs,ts,tsx}"],
    restoreMocks: true,
    setupFiles: ["./tests/setup.tsx"],
  },
});
