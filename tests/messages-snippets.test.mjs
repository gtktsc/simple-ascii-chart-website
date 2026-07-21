import { test } from "vitest";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import messages from "../messages/en.json" with { type: "json" };
import { formatMessage } from "../lib/messages.mjs";

test("home and usage snippets live in locale messages", () => {
  assert.match(messages.home.demoCode, /xLabel: 'Step/);
  assert.match(messages.home.demoCode, /legend: \{ position: 'bottom'/);
  assert.match(
    messages.usage.snippets.libraryExample,
    /import plot from 'simple-ascii-chart'/
  );
  assert.equal(
    formatMessage(messages.usage.snippets.cliInstall, {
      cliPackageName: "simple-ascii-chart-cli",
    }),
    "npm install -g simple-ascii-chart-cli"
  );
  assert.match(messages.usage.snippets.apiGet, /curl -G/);
  assert.match(messages.usage.snippets.apiPost, /content-type/);
  assert.match(messages.usage.snippets.apiResponse, /┏━━/);
});

test("documentation navigation copy lives in locale messages", () => {
  assert.equal(messages.documentation.surfaces.plot.title, "plot");
  assert.match(messages.documentation.surfaces["render-chart"].description, /structured charts/i);
  assert.equal(messages.documentation.exampleTitles["renderer-braille"], "Braille backend");
});

test("formatMessage replaces missing values with empty strings", () => {
  assert.equal(formatMessage("Hello {name} {missing}", { name: "Ada" }), "Hello Ada ");
});

test("manifest display names are locale-backed", () => {
  const manifestSource = fs.readFileSync(
    path.join(process.cwd(), "app/manifest.ts"),
    "utf8"
  );

  assert.ok(
    manifestSource.includes("messages.metadata.applicationName")
  );
  assert.ok(
    manifestSource.includes("messages.metadata.manifestShortName")
  );
  assert.equal(
    fs.existsSync(path.join(process.cwd(), "app/manifest.webmanifest")),
    false
  );
  assert.equal(messages.metadata.manifestShortName, "ASCII Chart");
});
