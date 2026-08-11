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

const automaticSecretPatterns: ReadonlyArray<{
  pattern: RegExp;
  replacement: string;
}> = [
  {
    pattern:
      /((?:anon|service[_ -]?role|jwt|api|access|refresh)[_ -]?(?:key|secret|token)\s*[:=]\s*["']?)[^\s"'`]+/gi,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /(authorization\s*:\s*bearer\s+)[^\s"'`]+/gi,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /\bpostgres(?:ql)?:\/\/[^\s"'`]+/gi,
    replacement: "[REDACTED_DATABASE_URL]",
  },
  {
    pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    replacement: "[REDACTED_JWT]",
  },
];

/**
 * Redacts credentials that the Supabase CLI can print independently of fixture
 * data. Fixture-declared sensitive values remain necessary because they catch
 * arbitrary domain secrets and their encoded forms.
 */
export function redactKnownSecrets(text: string): string {
  return automaticSecretPatterns.reduce(
    (redacted, { pattern, replacement }) =>
      redacted.replace(pattern, replacement),
    text,
  );
}

export function redactSensitiveText(
  text: string,
  sensitiveValues: string[],
): string {
  const explicitlyRedacted = [...new Set(
    sensitiveValues.flatMap(sensitiveRepresentations),
  )]
    .sort((left, right) => right.length - left.length)
    .reduce((redacted, value) => {
      const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return redacted.replace(new RegExp(escaped, "gi"), "[REDACTED]");
    }, text);
  return redactKnownSecrets(explicitlyRedacted);
}
