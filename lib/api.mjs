import plot from "simple-ascii-chart";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};

const TEXT_HEADERS = {
  "content-type": "text/plain; charset=utf-8",
};

function errorResponse(status, code, message, details) {
  const payload = {
    error: {
      code,
      message,
    },
  };

  if (details) {
    payload.error.details = details;
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  });
}

function parseJsonWithContext(rawValue, context) {
  try {
    return { value: JSON.parse(rawValue) };
  } catch {
    return {
      error: errorResponse(400, `INVALID_${context}_JSON`, `Invalid ${context.toLowerCase()} JSON.`),
    };
  }
}

function parseGetPayload(request) {
  const { searchParams } = new URL(request.url);
  const inputRaw = searchParams.get("input");
  const settingsRaw = searchParams.get("settings");

  if (!inputRaw) {
    return {
      error: errorResponse(400, "MISSING_INPUT", "Missing required query parameter: input."),
    };
  }

  const inputResult = parseJsonWithContext(inputRaw, "INPUT");

  if (inputResult.error) {
    return inputResult;
  }

  if (!settingsRaw) {
    return { value: { input: inputResult.value, settings: undefined } };
  }

  const settingsResult = parseJsonWithContext(settingsRaw, "SETTINGS");

  if (settingsResult.error) {
    return settingsResult;
  }

  return {
    value: {
      input: inputResult.value,
      settings: settingsResult.value,
    },
  };
}

async function parsePostPayload(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return {
      error: errorResponse(400, "INVALID_BODY_JSON", "Request body must be valid JSON."),
    };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      error: errorResponse(400, "INVALID_BODY", "Request body must be a JSON object."),
    };
  }

  if (!("input" in body)) {
    return {
      error: errorResponse(400, "MISSING_INPUT", "Missing required body field: input."),
    };
  }

  return {
    value: {
      input: body.input,
      settings: body.settings,
    },
  };
}

function renderChart(input, settings) {
  try {
    const result = plot(input, settings);

    return new Response(result, {
      status: 200,
      headers: TEXT_HEADERS,
    });
  } catch (error) {
    return errorResponse(
      400,
      "INVALID_CHART_DATA",
      "Unable to render chart from the provided input/settings.",
      error instanceof Error ? error.message : undefined
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
