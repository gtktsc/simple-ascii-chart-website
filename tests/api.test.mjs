import { test } from "vitest";
import assert from "node:assert/strict";
import {
  handleGetChartRequest,
  handlePostChartRequest,
} from "../lib/api.mjs";

async function expectJsonError(response, status, expectedError = {}) {
  assert.equal(response.status, status);
  assert.equal(
    response.headers.get("content-type"),
    "application/json; charset=utf-8"
  );

  const payload = await response.json();

  assert.ok(payload.error);
  assert.equal(typeof payload.error.code, "string");
  assert.equal(typeof payload.error.message, "string");

  if (expectedError.code) {
    assert.equal(payload.error.code, expectedError.code);
  }

  if (expectedError.message) {
    assert.equal(payload.error.message, expectedError.message);
  }

  if (expectedError.details) {
    assert.equal(payload.error.details, expectedError.details);
  }

  return payload;
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

  await expectJsonError(response, 400, {
    code: "INVALID_INPUT_JSON",
    message: "Invalid input JSON.",
  });
});

test("GET /api returns structured error on missing input", async () => {
  const request = new Request("http://localhost/api");
  const response = handleGetChartRequest(request);

  await expectJsonError(response, 400, {
    code: "MISSING_INPUT",
    message: "Missing required query parameter: input.",
  });
});

test("GET /api returns structured error on invalid settings JSON", async () => {
  const request = new Request(
    "http://localhost/api?input=%5B%5B1%2C1%5D%5D&settings=%7Bbad"
  );
  const response = handleGetChartRequest(request);

  await expectJsonError(response, 400, {
    code: "INVALID_SETTINGS_JSON",
    message: "Invalid settings JSON.",
  });
});

test("GET /api returns chart error details when plotting fails", async () => {
  const request = new Request(
    `http://localhost/api?input=${encodeURIComponent(JSON.stringify("bad"))}`,
  );
  const response = handleGetChartRequest(request);

  await expectJsonError(response, 400, {
    code: "INVALID_CHART_DATA",
    details: "coordinates: must be an array",
    message: "Unable to render chart from the provided input/settings.",
  });
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
  await expectJsonError(response, 400, {
    code: "MISSING_INPUT",
    message: "Missing required body field: input.",
  });
});

test("POST /api returns structured error on malformed JSON body", async () => {
  const request = new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{ bad json",
  });

  const response = await handlePostChartRequest(request);
  await expectJsonError(response, 400, {
    code: "INVALID_BODY_JSON",
    message: "Request body must be valid JSON.",
  });
});

test("POST /api returns structured error on non-object body", async () => {
  const request = new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify([1, 2, 3]),
  });

  const response = await handlePostChartRequest(request);
  await expectJsonError(response, 400, {
    code: "INVALID_BODY",
    message: "Request body must be a JSON object.",
  });
});

test("POST /api returns structured error on null body", async () => {
  const request = new Request("http://localhost/api", {
    body: "null",
    headers: { "content-type": "application/json" },
    method: "POST",
  });

  const response = await handlePostChartRequest(request);
  await expectJsonError(response, 400, {
    code: "INVALID_BODY",
    message: "Request body must be a JSON object.",
  });
});
