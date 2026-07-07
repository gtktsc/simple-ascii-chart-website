import { test } from "vitest";
import assert from "node:assert/strict";
import {
  buildPlaygroundHref,
  canSerializeForPlayground,
  toJavaScriptLiteral,
} from "../lib/optionsSerialization.mjs";

test("toJavaScriptLiteral preserves function literals", () => {
  const options = {
    width: 30,
    formatter: (value) => value,
  };

  const literal = toJavaScriptLiteral(options);

  assert.match(literal, /width: 30/);
  assert.match(literal, /formatter:\s*\(value\) => value/);
});

test("toJavaScriptLiteral serializes scalar and nested values", () => {
  assert.equal(toJavaScriptLiteral(null), "null");
  assert.equal(toJavaScriptLiteral(Number.POSITIVE_INFINITY), "null");
  assert.equal(toJavaScriptLiteral(true), "true");
  assert.equal(toJavaScriptLiteral([]), "[]");
  assert.equal(toJavaScriptLiteral({}), "{}");

  const literal = toJavaScriptLiteral({
    "invalid-key": "quoted",
    nested: [{ value: 1 }, undefined],
  });

  assert.match(literal, /"invalid-key": "quoted"/);
  assert.match(literal, /nested: \[/);
  assert.match(literal, /undefined/);
});

test("canSerializeForPlayground rejects non-json values", () => {
  assert.equal(canSerializeForPlayground(undefined), false);
  assert.equal(canSerializeForPlayground(Number.NaN), false);
  assert.equal(canSerializeForPlayground(1n), false);
  assert.equal(canSerializeForPlayground(Symbol("bad")), false);
  assert.equal(canSerializeForPlayground(new Date()), false);
  assert.equal(canSerializeForPlayground([1, undefined]), false);
});

test("canSerializeForPlayground accepts json-safe values", () => {
  assert.equal(
    canSerializeForPlayground({
      enabled: true,
      items: [null, "label", 1],
    }),
    true,
  );
});

test("buildPlaygroundHref returns URL for serializable payloads", () => {
  const href = buildPlaygroundHref(
    [
      [1, 1],
      [2, 2],
    ],
    { width: 20, height: 8 }
  );

  assert.ok(href);
  assert.match(href, /^\/playground\?/);
  assert.match(href, /input=/);
  assert.match(href, /options=/);
});

test("buildPlaygroundHref rejects non-serializable payloads", () => {
  const href = buildPlaygroundHref(
    [
      [1, 1],
      [2, 2],
    ],
    { formatter: (value) => value }
  );

  assert.equal(href, null);
  assert.equal(
    canSerializeForPlayground({ formatter: (value) => value }),
    false
  );
});

test("buildPlaygroundHref rejects non-serializable input", () => {
  assert.equal(buildPlaygroundHref({ value: undefined }, { width: 20 }), null);
});
