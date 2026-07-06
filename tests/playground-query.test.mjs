import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePlaygroundInput,
  parsePlaygroundOptions,
} from "../lib/playgroundQuery.mjs";

test("parsePlaygroundInput returns parsed input query JSON", () => {
  const fallback = [[0, 0]];
  const input = [
    [1, 1],
    [2, 4],
  ];
  const search = `?input=${encodeURIComponent(JSON.stringify(input))}`;

  assert.deepEqual(parsePlaygroundInput(search, fallback), input);
});

test("parsePlaygroundOptions returns fallback and reports malformed query JSON", () => {
  const fallback = { width: 30 };
  let reportedError = null;

  const result = parsePlaygroundOptions("?options={bad", fallback, (error) => {
    reportedError = error;
  });

  assert.equal(result, fallback);
  assert.ok(reportedError instanceof SyntaxError);
});
