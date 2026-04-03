function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function isValidIdentifier(key) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

function indent(depth, indentSize) {
  return " ".repeat(depth * indentSize);
}

function stringifyValue(value, depth, indentSize) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return "null";
    }

    return String(value);
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "function") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    const lines = value.map(
      (entry) => `${indent(depth + 1, indentSize)}${stringifyValue(entry, depth + 1, indentSize)}`
    );

    return `[
${lines.join(",\n")}
${indent(depth, indentSize)}]`;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined);

    if (entries.length === 0) {
      return "{}";
    }

    const lines = entries.map(([key, entryValue]) => {
      const safeKey = isValidIdentifier(key) ? key : JSON.stringify(key);
      return `${indent(depth + 1, indentSize)}${safeKey}: ${stringifyValue(entryValue, depth + 1, indentSize)}`;
    });

    return `{
${lines.join(",\n")}
${indent(depth, indentSize)}}`;
  }

  return JSON.stringify(value);
}

export function toJavaScriptLiteral(value, indentSize = 2) {
  return stringifyValue(value, 0, indentSize);
}

function hasNonSerializableValue(value) {
  if (value === undefined) {
    return true;
  }

  if (value === null) {
    return false;
  }

  if (typeof value === "function" || typeof value === "bigint" || typeof value === "symbol") {
    return true;
  }

  if (typeof value === "number") {
    return !Number.isFinite(value);
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(hasNonSerializableValue);
  }

  if (isPlainObject(value)) {
    return Object.values(value).some(hasNonSerializableValue);
  }

  return true;
}

export function canSerializeForPlayground(value) {
  return !hasNonSerializableValue(value);
}

function encodeJsonQueryParam(value) {
  if (!canSerializeForPlayground(value)) {
    return null;
  }

  return encodeURIComponent(JSON.stringify(value));
}

export function buildPlaygroundHref(input, options) {
  const encodedInput = encodeJsonQueryParam(input);
  const encodedOptions = encodeJsonQueryParam(options);

  if (!encodedInput || !encodedOptions) {
    return null;
  }

  return `/playground?input=${encodedInput}&options=${encodedOptions}`;
}
