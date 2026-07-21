import chart from "simple-ascii-chart";
import historicalChart from "simple-ascii-chart-5-4-0";
import process from "process";
import messages from "../messages/en.json" with { type: "json" };
import { LATEST_DOCUMENTATION_VERSION } from "./documentationVersions.mjs";
import { formatMessage } from "./messages.mjs";

export function withBrowserTerminalFallback(
  plotFn,
  input,
  options,
  environment = globalThis,
) {
  const hadProcess = Object.prototype.hasOwnProperty.call(environment, "process");
  const runtimeProcess = environment.process ?? {};
  const stdoutDescriptor = Object.getOwnPropertyDescriptor(
    runtimeProcess,
    "stdout",
  );
  const needsStdout = !runtimeProcess.stdout;

  if (!hadProcess) environment.process = runtimeProcess;
  if (needsStdout) {
    Object.defineProperty(runtimeProcess, "stdout", {
      configurable: true,
      value: {},
      writable: true,
    });
  }

  try {
    return plotFn(input, options);
  } finally {
    if (needsStdout) {
      if (stdoutDescriptor) {
        Object.defineProperty(runtimeProcess, "stdout", stdoutDescriptor);
      } else {
        delete runtimeProcess.stdout;
      }
    }

    if (!hadProcess) delete environment.process;
  }
}

const editablePlotRuntimes = Object.freeze({
  "5.4.0": historicalChart,
  [LATEST_DOCUMENTATION_VERSION]: (input, options) =>
    withBrowserTerminalFallback(chart, input, options, { process }),
});

export const EDITABLE_PLOT_RUNTIME_VERSIONS = Object.freeze(
  Object.keys(editablePlotRuntimes),
);

export function getEditablePlotRuntime(version) {
  const runtime = editablePlotRuntimes[version];

  if (!runtime) {
    throw new Error(
      formatMessage(messages.playground.errors.unsupportedVersion, { version }),
    );
  }

  return runtime;
}

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
