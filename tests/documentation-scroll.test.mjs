import assert from "node:assert/strict";
import test from "node:test";
import {
  canScrollContainer,
  getScrollDeltaToKeepItemVisible,
} from "../lib/documentationScroll.mjs";

test("getScrollDeltaToKeepItemVisible returns zero for visible items", () => {
  assert.equal(
    getScrollDeltaToKeepItemVisible({
      containerBottom: 300,
      containerTop: 100,
      itemBottom: 220,
      itemTop: 140,
    }),
    0,
  );
});

test("getScrollDeltaToKeepItemVisible scrolls up to reveal clipped top", () => {
  assert.equal(
    getScrollDeltaToKeepItemVisible({
      containerBottom: 300,
      containerTop: 100,
      itemBottom: 140,
      itemTop: 80,
    }),
    -20,
  );
});

test("getScrollDeltaToKeepItemVisible scrolls down to reveal clipped bottom", () => {
  assert.equal(
    getScrollDeltaToKeepItemVisible({
      containerBottom: 300,
      containerTop: 100,
      itemBottom: 340,
      itemTop: 260,
    }),
    40,
  );
});

test("canScrollContainer allows auto and scroll overflow with clipped content", () => {
  assert.equal(
    canScrollContainer({
      clientHeight: 300,
      overflowY: "auto",
      scrollHeight: 420,
    }),
    true,
  );

  assert.equal(
    canScrollContainer({
      clientHeight: 300,
      overflowY: "scroll",
      scrollHeight: 420,
    }),
    true,
  );
});

test("canScrollContainer rejects visible overflow and unclipped content", () => {
  assert.equal(
    canScrollContainer({
      clientHeight: 300,
      overflowY: "visible",
      scrollHeight: 420,
    }),
    false,
  );

  assert.equal(
    canScrollContainer({
      clientHeight: 300,
      overflowY: "auto",
      scrollHeight: 300,
    }),
    false,
  );
});
