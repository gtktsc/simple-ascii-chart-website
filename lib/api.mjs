import plot from "simple-ascii-chart";
import messages from "../messages/en.json" with { type: "json" };
import { formatMessage } from "./messages.mjs";
import { API_ERROR_CODES } from "./apiConstants.mjs";
import { parseGetPayload, parsePostPayload } from "./apiPayloads.mjs";
import {
  createJsonErrorResponse,
  createTextResponse,
} from "./apiResponses.mjs";

function renderChart(input, settings) {
  try {
    const result = plot(input, settings);

    return createTextResponse(result);
  } catch (error) {
    return createJsonErrorResponse(
      400,
      API_ERROR_CODES.invalidChartData,
      messages.api.errors.INVALID_CHART_DATA,
      error instanceof Error
        ? formatMessage(messages.api.errors.CHART_ERROR_DETAILS, {
            message: error.message,
          })
        : undefined,
    );
  }
}

export function handleGetChartRequest(request) {
  const parsed = parseGetPayload(request);

  if (parsed.error) {
    return parsed.error;
  }

  return renderChart(parsed.value.input, parsed.value.settings);
}

export async function handlePostChartRequest(request) {
  const parsed = await parsePostPayload(request);

  if (parsed.error) {
    return parsed.error;
  }

  return renderChart(parsed.value.input, parsed.value.settings);
}
