import { JSON_HEADERS, TEXT_HEADERS } from "./apiConstants.mjs";

export function createJsonErrorResponse(status, code, message, details) {
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

export function createTextResponse(body) {
  return new Response(body, {
    status: 200,
    headers: TEXT_HEADERS,
  });
}
