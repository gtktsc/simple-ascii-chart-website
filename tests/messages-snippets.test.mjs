import test from "node:test";
import assert from "node:assert/strict";
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

test("documentation preview snippet lives in locale messages", () => {
  assert.equal(
    formatMessage(messages.documentation.snippets.previewSource, {
      input: "[[1,1]]",
      settings: "{ width: 30 }",
    }),
    "const input = [[1,1]];\nconst settings = { width: 30 };\n\nconsole.log(plot(input, settings));"
  );
});
