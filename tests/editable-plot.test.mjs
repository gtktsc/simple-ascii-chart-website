import { test } from "vitest";
import assert from "node:assert/strict";
import historicalChart from "simple-ascii-chart-5-4-0";
import messages from "../messages/en.json" with { type: "json" };
import {
  getEditablePlotExecutionError,
  getEditablePlotRuntime,
  getEditablePlotValidationError,
  isEditablePlotPayload,
  renderEditableChart,
  withBrowserTerminalFallback,
} from "../lib/editablePlot.mjs";
import { formatMessage } from "../lib/messages.mjs";

test("renderEditableChart returns plotting error message for thrown errors", () => {
  const result = renderEditableChart([], {}, () => {
    throw new Error("Bad chart data");
  });

  assert.equal(result, "Plotting error: Bad chart data");
});

test("renderEditableChart returns unknown message for non-error throws", () => {
  const result = renderEditableChart([], {}, () => {
    throw "Bad chart data";
  });

  assert.equal(result, "Plotting error: Unknown error.");
});

test("renderEditableChart returns chart output for valid input", () => {
  const result = renderEditableChart(
    [
      [1, 1],
      [2, 3],
    ],
    { height: 8, width: 20 },
  );

  assert.match(result, /[┤▲▶]/);
});

test("playground runtime matches the selected library version", () => {
  const input = [
    [1, 1],
    [2, 3],
  ];
  const options = { height: 4, renderer: "braille", width: 12 };
  const historicalOutput = getEditablePlotRuntime("5.4.0")(input, options);
  const latestOutput = getEditablePlotRuntime("6.0.0")(input, options);

  assert.equal(getEditablePlotRuntime("5.4.0"), historicalChart);
  assert.doesNotMatch(historicalOutput, /[\u2800-\u28ff]/u);
  assert.match(latestOutput, /[\u2800-\u28ff]/u);
  assert.throws(
    () => getEditablePlotRuntime("invalid"),
    /Unsupported playground library version: invalid/,
  );
});

test("browser terminal fallback supplies and restores process.stdout", () => {
  const environment = {};
  const output = withBrowserTerminalFallback(
    () => String(environment.process.stdout.columns ?? 80),
    [],
    {},
    environment,
  );

  assert.equal(output, "80");
  assert.equal("process" in environment, false);

  const processObject = {};
  const existingEnvironment = { process: processObject };
  withBrowserTerminalFallback(
    () => String(existingEnvironment.process.stdout.columns ?? 80),
    [],
    {},
    existingEnvironment,
  );
  assert.equal(existingEnvironment.process, processObject);
  assert.equal("stdout" in processObject, false);

  const descriptorProcess = {};
  Object.defineProperty(descriptorProcess, "stdout", {
    configurable: true,
    value: undefined,
    writable: false,
  });
  withBrowserTerminalFallback(
    () => "restored",
    [],
    {},
    { process: descriptorProcess },
  );
  assert.deepEqual(Object.getOwnPropertyDescriptor(descriptorProcess, "stdout"), {
    configurable: true,
    enumerable: false,
    value: undefined,
    writable: false,
  });
});

test("editable plot validation accepts array/object payloads", () => {
  assert.equal(isEditablePlotPayload([[1, 1]], { width: 20 }), true);
  assert.equal(isEditablePlotPayload({ series: [[1, 1]] }, { width: 20 }), true);
});

test("editable plot validation rejects primitive settings", () => {
  assert.equal(isEditablePlotPayload([[1, 1]], "bad"), false);
  assert.equal(
    getEditablePlotValidationError(),
    "Ensure 'input' is a valid Coordinates type and 'options' is a Settings object."
  );
});

test("getEditablePlotExecutionError formats editor execution errors", () => {
  assert.equal(
    getEditablePlotExecutionError(new Error("Unexpected token")),
    "Error: Unexpected token"
  );
});

test("getEditablePlotExecutionError ignores non-error values", () => {
  assert.equal(getEditablePlotExecutionError("Unexpected token"), null);
});

test("editable plot editor templates come from locale messages", () => {
  assert.equal(
    formatMessage(messages.editablePlot.templates.input, {
      input: "[[1,2]]",
    }),
    "const input = [[1,2]];"
  );
  assert.equal(
    formatMessage(messages.editablePlot.templates.options, {
      options: "{\"width\":30}",
    }),
    "const options = {\"width\":30};"
  );
});
