import assert from "node:assert/strict";
import { test } from "vitest";
import {
  DOCUMENTATION_VERSIONS,
  LATEST_DOCUMENTATION_VERSION,
  findDocumentationVersion,
  getLibraryVersionFromPathname,
  isDocumentationSurface,
  routeForLibraryVersion,
} from "../lib/documentationVersions.mjs";
import {
  documentationSurfaceRoute,
  documentationVersionRoute,
  examplesVersionRoute,
  playgroundVersionRoute,
} from "../lib/siteConstants.ts";
import { API_DOCS_BY_VERSION } from "../app/generated/api-docs.ts";
import historicalOutputs from "../docs/versions/5.4.0/example-outputs.json" with { type: "json" };
import historicalSources from "../docs/versions/5.4.0/example-sources.json" with { type: "json" };
import messages from "../messages/en.json" with { type: "json" };
import packageMetadata from "../package.json" with { type: "json" };
import { EDITABLE_PLOT_RUNTIME_VERSIONS } from "../lib/editablePlot.mjs";

test("version registry keeps latest and historical documentation explicit", () => {
  assert.equal(LATEST_DOCUMENTATION_VERSION, "6.0.0");
  assert.deepEqual(
    DOCUMENTATION_VERSIONS.map(({ id }) => id),
    ["6.0.0", "5.4.0"],
  );
  assert.deepEqual(
    Object.keys(messages.documentation.versions),
    DOCUMENTATION_VERSIONS.map(({ id }) => id),
  );
  assert.deepEqual(findDocumentationVersion("5.4.0")?.surfaces, [
    "plot",
    "reference",
  ]);
  assert.equal(findDocumentationVersion("invalid"), undefined);
  assert.equal(isDocumentationSurface("5.4.0", "plot"), true);
  assert.equal(isDocumentationSurface("5.4.0", "render-chart"), false);
  assert.equal(isDocumentationSurface("invalid", "plot"), false);
});

test("generated documentation snapshots exist for every registered version", () => {
  assert.deepEqual(Object.keys(API_DOCS_BY_VERSION), ["6.0.0", "5.4.0"]);
  DOCUMENTATION_VERSIONS.forEach(({ id, surfaces }) => {
    assert.deepEqual(
      API_DOCS_BY_VERSION[id].map((surface) => surface.id),
      surfaces,
    );
  });
});

test("every registered version has a matching playground runtime", () => {
  assert.deepEqual(
    [...EDITABLE_PLOT_RUNTIME_VERSIONS].sort(),
    DOCUMENTATION_VERSIONS.map(({ id }) => id).sort(),
  );
});

test("every registered version is installed as an exact library dependency", () => {
  const aliasPrefix = "npm:simple-ascii-chart@";
  const dependencyVersions = Object.entries(packageMetadata.dependencies)
    .flatMap(([name, specifier]) => {
      if (name === "simple-ascii-chart") return [specifier];
      if (specifier.startsWith(aliasPrefix)) {
        return [specifier.slice(aliasPrefix.length)];
      }

      return [];
    });

  dependencyVersions.forEach((version) => {
    assert.match(version, /^\d+\.\d+\.\d+$/u);
  });
  assert.deepEqual(
    dependencyVersions.sort(),
    DOCUMENTATION_VERSIONS.map(({ id }) => id).sort(),
  );
});

test("version routes are canonical and preserve API surfaces", () => {
  assert.equal(documentationVersionRoute("6.0.0"), "/documentation/6.0.0");
  assert.equal(
    documentationSurfaceRoute("5.4.0", "plot"),
    "/documentation/5.4.0/plot",
  );
  assert.equal(examplesVersionRoute("5.4.0"), "/examples/5.4.0");
  assert.equal(playgroundVersionRoute("5.4.0"), "/playground/5.4.0");
  assert.equal(
    getLibraryVersionFromPathname("/documentation/5.4.0/plot"),
    "5.4.0",
  );
  assert.equal(getLibraryVersionFromPathname("/usage"), undefined);
  assert.equal(
    getLibraryVersionFromPathname("/playground/5.4.0"),
    "5.4.0",
  );
  assert.equal(
    routeForLibraryVersion("/documentation/6.0.0/plot", "5.4.0"),
    "/documentation/5.4.0/plot",
  );
  assert.equal(
    routeForLibraryVersion("/documentation/6.0.0/render-chart", "5.4.0"),
    "/documentation/5.4.0",
  );
  assert.equal(
    routeForLibraryVersion("/examples/6.0.0", "5.4.0"),
    "/examples/5.4.0",
  );
  assert.equal(
    routeForLibraryVersion("/playground/6.0.0", "5.4.0"),
    "/playground/5.4.0",
  );
  assert.equal(routeForLibraryVersion("/usage", "5.4.0"), "/usage");
});

test("historical examples have immutable output for every example", () => {
  assert.deepEqual(
    Object.keys(historicalOutputs),
    [
      "basicWidthHeight",
      "logarithmicScale",
      "exponentialGrowth",
      "areaFill",
      "customThresholds",
      "withPoints",
      "customAxisCenter",
      "barChart",
      "horizontalBarChart",
      "titleAndLabels",
      "legend",
      "complexLegend",
      "singleSeriesBarChart",
      "negativeBarChart",
      "singleSeriesHorizontalBarChart",
      "customFormatter",
    ],
  );
  assert.deepEqual(Object.keys(historicalSources), Object.keys(historicalOutputs));
  Object.values(historicalOutputs).forEach((output) => {
    assert.equal(typeof output, "string");
    assert.ok(output.length > 0);
  });
  Object.values(historicalSources).forEach(({ input, options }) => {
    assert.ok(input.length > 0);
    assert.ok(options.length > 0);
  });
});
