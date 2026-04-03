import test from "node:test";
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
