import { test } from "vitest";
import assert from "node:assert/strict";
import messages from "../messages/en.json" with { type: "json" };
import {
  getEditablePlotExecutionError,
  getEditablePlotValidationError,
  isEditablePlotPayload,
  renderEditableChart,
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
