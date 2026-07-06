import chart from "simple-ascii-chart";
import messages from "../messages/en.json" with { type: "json" };
import { formatMessage } from "./messages.mjs";

export function renderEditableChart(input, options, plotFn = chart) {
  try {
    return plotFn(input, options);
  } catch (error) {
    if (error instanceof Error) {
      return formatMessage(messages.editablePlot.plottingError, {
        message: error.message,
      });
    }

    return messages.editablePlot.unknownPlottingError;
  }
}

export function isEditablePlotPayload(input, options) {
  return (
    (Array.isArray(input) || typeof input === "object") &&
    typeof options === "object"
  );
}

export function getEditablePlotValidationError() {
  return messages.editablePlot.validationError;
}

export function getEditablePlotExecutionError(error) {
  if (error instanceof Error) {
    return formatMessage(messages.editablePlot.executionError, {
      message: error.message,
    });
  }

  return null;
}
