import messages from "../messages/en.json" with { type: "json" };
import { API_ERROR_CODES } from "./apiConstants.mjs";
import { createJsonErrorResponse } from "./apiResponses.mjs";

const JSON_CONTEXT_ERRORS = {
  INPUT: {
    code: API_ERROR_CODES.invalidInputJson,
    message: messages.api.errors.INVALID_INPUT_JSON,
  },
  SETTINGS: {
    code: API_ERROR_CODES.invalidSettingsJson,
    message: messages.api.errors.INVALID_SETTINGS_JSON,
  },
};

function parseJsonWithContext(rawValue, context) {
  try {
    return { value: JSON.parse(rawValue) };
  } catch {
    const error = JSON_CONTEXT_ERRORS[context];

    return {
      error: createJsonErrorResponse(400, error.code, error.message),
    };
  }
}

export function parseGetPayload(request) {
  const { searchParams } = new URL(request.url);
  const inputRaw = searchParams.get("input");
  const settingsRaw = searchParams.get("settings");

  if (!inputRaw) {
    return {
      error: createJsonErrorResponse(
        400,
        API_ERROR_CODES.missingInput,
        messages.api.errors.MISSING_INPUT_QUERY,
      ),
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

export async function parsePostPayload(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return {
      error: createJsonErrorResponse(
        400,
        API_ERROR_CODES.invalidBodyJson,
        messages.api.errors.INVALID_BODY_JSON,
      ),
    };
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      error: createJsonErrorResponse(
        400,
        API_ERROR_CODES.invalidBody,
        messages.api.errors.INVALID_BODY,
      ),
    };
  }

  if (!("input" in body)) {
    return {
      error: createJsonErrorResponse(
        400,
        API_ERROR_CODES.missingInput,
        messages.api.errors.MISSING_INPUT_BODY,
      ),
    };
  }

  return {
    value: {
      input: body.input,
      settings: body.settings,
    },
  };
}
