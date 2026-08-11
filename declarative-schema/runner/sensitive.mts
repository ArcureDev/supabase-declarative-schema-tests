export function sensitiveRepresentations(value: string): string[] {
  const jsonEscaped = JSON.stringify(value).slice(1, -1);
  const base64 = Buffer.from(value, "utf8").toString("base64");
  return [
    value,
    value.replaceAll("'", "''"),
    jsonEscaped,
    encodeURIComponent(value),
    base64,
    base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, ""),
  ].filter((candidate, index, values) =>
    candidate.length > 0 && values.indexOf(candidate) === index
  );
}
