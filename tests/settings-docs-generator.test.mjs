import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { test } from "vitest";
import { API_DOC_SURFACES } from "../lib/apiDocsConstants.mjs";
import {
  generateApiDocs,
  parsePublicTypeDefinitions,
  parsePublicValueDefinitions,
  validateApiDocs,
} from "../lib/settingsDocsGenerator.mjs";

const require = createRequire(import.meta.url);
const packageEntry = require.resolve("simple-ascii-chart");
const dtsContent = fs.readFileSync(
  path.join(path.dirname(packageEntry), "index.d.ts"),
  "utf8",
);
const legacyDtsContent = fs.readFileSync(
  path.resolve("docs/versions/5.4.0/index.d.ts"),
  "utf8",
);

test("generateApiDocs covers every task-first documentation surface", () => {
  const docs = generateApiDocs({ dtsContent });

  assert.deepEqual(
    docs.map(({ id }) => id),
    API_DOC_SURFACES,
  );
  assert.deepEqual(
    docs.slice(0, 6).map(({ id }) => id),
    [
      "plot",
      "render-chart",
      "candlestick",
      "heatmap",
      "sparkline",
      "histogram",
    ],
  );
});

test("5.4.0 snapshot preserves its smaller historical API", () => {
  const docs = generateApiDocs({
    dtsContent: legacyDtsContent,
    version: "5.4.0",
  });

  assert.deepEqual(
    docs.map(({ id }) => id),
    ["plot", "reference"],
  );
  const settings = docs
    .find(({ id }) => id === "plot")
    .optionGroups.find(({ name }) => name === "Settings");
  assert.equal(settings.options.length, 24);
  assert.equal(settings.options.some(({ key }) => key === "renderer"), false);
  assert.match(docs[0].examples[0].output, /Requests/);
});

test("every configurable property has declaration copy and an executable surface example", () => {
  const docs = generateApiDocs({ dtsContent });

  docs.forEach((surface) => {
    if (surface.optionGroups.length > 0) assert.ok(surface.examples.length > 0);
    surface.optionGroups.forEach((group) => {
      assert.ok(group.description.length > 0, group.name);
      assert.ok(group.options.length > 0, group.name);
      group.options.forEach((option) => {
        assert.ok(option.key.length > 0, group.name);
        assert.ok(
          option.typeSignature.length > 0,
          `${group.name}.${option.key}`,
        );
        assert.ok(option.description.length > 0, `${group.name}.${option.key}`);
        assert.ok(option.exampleIds.length > 0, `${group.name}.${option.key}`);
      });
    });
    surface.examples.forEach((example) => {
      assert.ok(example.code.length > 0, example.id);
      assert.ok(example.output.length > 0, example.id);
      assert.doesNotMatch(example.output, /\u001b\[[0-9;]*m/);
    });
  });
});

test("coverage validation rejects unknown and missing option paths", () => {
  const withUnknown = structuredClone(generateApiDocs({ dtsContent }));
  withUnknown[0].examples[0].covers.push("Settings.notPublic");
  assert.throws(
    () => validateApiDocs(withUnknown),
    /Unknown executable example coverage path/,
  );

  const withMissing = structuredClone(generateApiDocs({ dtsContent }));
  withMissing[0].examples[0].covers = withMissing[0].examples[0].covers.filter(
    (path) => path !== "Settings.width",
  );
  assert.throws(() => validateApiDocs(withMissing), /Settings.width/);
});

test("coverage validation fails closed for malformed documentation records", () => {
  const createSurface = () => ({
    examples: [
      {
        code: "render()",
        covers: ["Group.value"],
        id: "example",
        output: "chart",
      },
    ],
    exports: [
      { description: "Public value.", name: "VALUE", signature: "VALUE: 1" },
    ],
    id: "surface",
    optionGroups: [
      {
        description: "Group options.",
        name: "Group",
        options: [
          {
            description: "Option value.",
            exampleIds: ["example"],
            key: "value",
          },
        ],
      },
    ],
  });
  const expectFailure = (mutate, pattern, expected = ["surface"]) => {
    const surfaces = [createSurface()];
    mutate(surfaces);
    assert.throws(() => validateApiDocs(surfaces, expected), pattern);
  };

  expectFailure(
    (surfaces) => surfaces.push(structuredClone(surfaces[0])),
    /Duplicate API documentation surface ID/,
    ["surface", "surface"],
  );
  expectFailure(() => {}, /surfaces are incomplete/, ["other"]);
  expectFailure(
    ([surface]) => surface.examples.push(structuredClone(surface.examples[0])),
    /Duplicate example ID/,
  );
  expectFailure(
    ([surface]) =>
      surface.optionGroups.push({
        ...structuredClone(surface.optionGroups[0]),
        name: "group",
      }),
    /Duplicate documentation anchor/,
  );
  expectFailure(
    ([surface]) => {
      surface.optionGroups[0].description = "";
    },
    /Missing description for Group/,
  );
  expectFailure(
    ([surface]) => {
      surface.optionGroups[0].options = [];
      surface.examples[0].covers = [];
    },
    /Missing options for Group/,
  );
  expectFailure(
    ([surface]) => {
      surface.optionGroups[0].options[0].description = "";
    },
    /Missing description for Group.value/,
  );
  expectFailure(
    ([surface]) => {
      surface.optionGroups[0].options[0].exampleIds = [];
    },
    /Missing executable example coverage for Group.value/,
  );
  expectFailure(
    ([surface]) => {
      surface.examples[0].code = "";
    },
    /Incomplete executable example/,
  );
  expectFailure(
    ([surface]) => {
      surface.exports[0].description = "";
    },
    /Missing description or signature for public export/,
  );
});

test("AST parsing exposes required, optional, nested, and union properties", () => {
  const definitions = parsePublicTypeDefinitions(dtsContent);

  const settings = new Map(
    definitions.Settings.options.map((option) => [option.key, option]),
  );
  const heatmap = new Map(
    definitions.HeatmapSpec.options.map((option) => [option.key, option]),
  );
  const sparkline = new Map(
    definitions.SparklineOptions.options.map((option) => [option.key, option]),
  );

  assert.equal(settings.get("width").required, false);
  assert.match(settings.get("width").description, /terminal columns/);
  assert.equal(heatmap.get("data").required, true);
  assert.match(heatmap.get("threshold").description, /Binary visual mapping/);
  assert.deepEqual([...sparkline.keys()].sort(), [
    "color",
    "symbols",
    "threshold",
  ]);
});

test("nested symbol, annotation, callback, and helper surfaces stay documented", () => {
  const docs = generateApiDocs({ dtsContent });
  const groups = new Map(
    docs.flatMap((surface) =>
      surface.optionGroups.map((group) => [group.name, group]),
    ),
  );

  [
    "AnnotationSymbols",
    "ArrowHeadSymbols",
    "ErrorBarSymbols",
    "CandlestickSymbols",
    "HeatmapSymbols",
    "SparklineSymbols",
    "ColorContext",
    "FormatterHelpers",
    "LineFormatterArgs",
    "ValueLabelContext",
    "HistogramOptions",
  ].forEach((name) => assert.ok(groups.has(name), name));

  assert.deepEqual(
    groups.get("HistogramOptions").options.map(({ key }) => key),
    ["binCount"],
  );
  assert.deepEqual(
    groups.get("ArrowHeadSymbols").options.map(({ key }) => key),
    [
      "left",
      "right",
      "up",
      "down",
      "upLeft",
      "upRight",
      "downLeft",
      "downRight",
    ],
  );
});

test("closed variants expose their complete declaration signatures", () => {
  const reference = generateApiDocs({ dtsContent }).find(
    ({ id }) => id === "reference",
  );
  const types = new Map(
    reference.typeReferences.map((type) => [type.name, type.signature]),
  );

  assert.match(types.get("Renderer"), /'ascii' \| 'braille'/);
  assert.match(types.get("GraphMode"), /'horizontalBar'/);
  assert.match(types.get("BarLayout"), /'normalized'/);
  assert.match(types.get("LabelCollisionPolicy"), /'truncate'/);
  assert.match(types.get("Color"), /BrightWhite/);
});

test("shared reference documents constants and stable error contracts", () => {
  const values = parsePublicValueDefinitions(dtsContent);
  const reference = generateApiDocs({ dtsContent }).find(
    ({ id }) => id === "reference",
  );

  [
    "ANSI_COLORS",
    "DEFAULT_SYMBOLS",
    "ChartErrorCode",
    "ChartTypeError",
    "ChartRangeError",
  ].forEach((name) => {
    assert.ok(values[name].description.length > 0, name);
    assert.ok(
      reference.exports.some((exportDoc) => exportDoc.name === name),
      name,
    );
  });
});

test("parser reads JSDoc and property optionality without README conventions", () => {
  const definitions = parsePublicTypeDefinitions(`
/** Example configuration. */
type Example = {
  /** Required value. */
  value: number;
  /** Optional label. */
  label?: string;
};
`);

  assert.equal(definitions.Example.description, "Example configuration.");
  assert.deepEqual(
    definitions.Example.options.map(({ key, required }) => ({ key, required })),
    [
      { key: "value", required: true },
      { key: "label", required: false },
    ],
  );
});

test("type parser resolves wrappers, intersections, omissions, and cycles", () => {
  const definitions = parsePublicTypeDefinitions(`
type Base = {
  /** Text value. */
  value: string;
  /** Removable value. */
  shared: string;
  /** Untyped marker. */
  marker?;
};
type Alternate = {
  /** Numeric value. */
  value?: number;
};
type Wrapped = Readonly<(Base & Partial<Alternate>)>;
type Trimmed = Omit<Base, "shared">;
type Recursive = Recursive;
type UnknownReference = Missing;
type Primitive = string;
`);

  assert.equal(
    definitions.Wrapped.options.find(({ key }) => key === "value")
      .typeSignature,
    "string | number",
  );
  assert.equal(
    definitions.Wrapped.options.find(({ key }) => key === "value").required,
    false,
  );
  assert.equal(
    definitions.Wrapped.options.find(({ key }) => key === "marker")
      .typeSignature,
    "unknown",
  );
  assert.deepEqual(
    definitions.Trimmed.options.map(({ key }) => key),
    ["value", "marker"],
  );
  assert.deepEqual(definitions.Recursive.options, []);
  assert.deepEqual(definitions.UnknownReference.options, []);
  assert.deepEqual(definitions.Primitive.options, []);
});

test("value parser follows public export aliases", () => {
  const values = parsePublicValueDefinitions(`
/** Internal catalog. */
declare const INTERNAL_CODES: {
  readonly INVALID_VALUE: "INVALID_VALUE";
};
/** Internal error. */
declare class InternalError extends Error {}
export { INTERNAL_CODES as PublicCodes, InternalError as PublicError };
export { INTERNAL_CODES, MISSING as MissingCodes };
export * from "./other";
`);

  assert.equal(values.PublicCodes.name, "PublicCodes");
  assert.equal(values.PublicCodes.description, "Internal catalog.");
  assert.match(values.PublicCodes.signature, /^PublicCodes:/);
  assert.equal(values.PublicError.description, "Internal error.");
  assert.match(values.PublicError.signature, /^declare class PublicError/);
});

test("generator fails closed when required public declaration types are missing", () => {
  assert.throws(
    () => generateApiDocs({ dtsContent: "/** Empty. */ type Empty = {};" }),
    /Missing public type definition: Settings/,
  );
});
