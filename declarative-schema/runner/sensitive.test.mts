import assert from "node:assert/strict";
import test from "node:test";
import {
  redactKnownSecrets,
  redactSensitiveText,
} from "./sensitive.mts";

test("redacts credentials emitted by local Supabase status and debug output", () => {
  const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.signature";
  const output = [
    `anon key: ${jwt}`,
    "service_role_key=service-role-value",
    "Authorization: Bearer bearer-value",
    "DB URL: postgresql://postgres:password@127.0.0.1:54322/postgres",
  ].join("\n");

  const redacted = redactKnownSecrets(output);
  assert.doesNotMatch(redacted, /signature|service-role-value|bearer-value|password/);
  assert.match(redacted, /\[REDACTED_JWT\]|\[REDACTED\]/);
  assert.match(redacted, /\[REDACTED_DATABASE_URL\]/);
});

test("combines automatic redaction with fixture-declared encoded values", () => {
  const secret = "PGDELTA_EXPLICIT_SECRET";
  const output = [
    secret,
    encodeURIComponent(secret),
    Buffer.from(secret).toString("base64"),
    "access_token=generated-access-token",
  ].join("\n");

  const redacted = redactSensitiveText(output, [secret]);
  assert.doesNotMatch(redacted, /PGDELTA_EXPLICIT_SECRET|generated-access-token/i);
  assert.equal((redacted.match(/\[REDACTED\]/g) ?? []).length, 4);
});
