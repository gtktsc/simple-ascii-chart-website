import test from "node:test";
import assert from "node:assert/strict";
import {
  handleGetChartRequest,
  handlePostChartRequest,
} from "../lib/api.mjs";

async function expectJsonError(response, status) {
  assert.equal(response.status, status);
  assert.equal(
    response.headers.get("content-type"),
    "application/json; charset=utf-8"
  );

  const payload = await response.json();

  assert.ok(payload.error);
  assert.equal(typeof payload.error.code, "string");
  assert.equal(typeof payload.error.message, "string");
}

test("GET /api returns chart for valid input", async () => {
  const request = new Request(
    "http://localhost/api?input=%5B%5B1%2C1%5D%2C%5B2%2C3%5D%5D&settings=%7B%22width%22%3A20%2C%22height%22%3A8%7D"
  );

  const response = handleGetChartRequest(request);
  const text = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.match(text, /[┤▲▶]/);
});

test("GET /api returns structured error on invalid input JSON", async () => {
  const request = new Request("http://localhost/api?input=%5B1,2");
  const response = handleGetChartRequest(request);

  await expectJsonError(response, 400);
});

test("POST /api returns chart for valid body", async () => {
  const request = new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      input: [
        [1, 1],
        [2, 3],
      ],
      settings: { width: 20, height: 8 },
    }),
  });

  const response = await handlePostChartRequest(request);
  const text = await response.text();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.match(text, /[┤▲▶]/);
});

test("POST /api returns structured error on missing input", async () => {
  const request = new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ settings: { width: 20 } }),
  });

  const response = await handlePostChartRequest(request);
  await expectJsonError(response, 400);
});

test("POST /api returns structured error on malformed JSON body", async () => {
  const request = new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{ bad json",
  });

  const response = await handlePostChartRequest(request);
  await expectJsonError(response, 400);
});
