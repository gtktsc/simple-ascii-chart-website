export const PLAYGROUND_QUERY_KEYS = {
  input: "input",
  options: "options",
};

function readSearchParam(search, key) {
  return new URLSearchParams(search).get(key);
}

export function parseQueryJson(search, key, fallback, onError) {
  const value = readSearchParam(search, key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    onError?.(error);
    return fallback;
  }
}

export function parsePlaygroundInput(search, fallback, onError) {
  return parseQueryJson(search, PLAYGROUND_QUERY_KEYS.input, fallback, onError);
}

export function parsePlaygroundOptions(search, fallback, onError) {
  return parseQueryJson(search, PLAYGROUND_QUERY_KEYS.options, fallback, onError);
}
