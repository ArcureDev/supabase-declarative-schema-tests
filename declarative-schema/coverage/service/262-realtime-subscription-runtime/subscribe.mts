import { createClient } from "@supabase/supabase-js";

const url = process.env["SUPABASE_API_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
if (!url || !serviceRoleKey) {
  throw new Error("Local Realtime endpoint credentials were not provided.");
}

const client = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
const channel = client.channel("coverage-262");

try {
  const payloadPromise = new Promise<Record<string, unknown>>((resolve) => {
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "realtime_source_262",
      },
      (payload) => {
        resolve(payload.new);
      },
    );
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Timed out subscribing to the Realtime channel.")),
      15_000,
    );
    channel.subscribe((status, error) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);
        resolve();
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        clearTimeout(timeout);
        reject(error ?? new Error(`Realtime subscription failed: ${status}.`));
      }
    });
  });

  const { error } = await client
    .from("realtime_source_262")
    .insert({ id: 263, payload: "runtime-event" });
  if (error) throw error;

  let timeout!: NodeJS.Timeout;
  const row = await Promise.race([
    payloadPromise,
    new Promise<never>((_resolve, reject) =>
      timeout = setTimeout(
        () => reject(new Error("Timed out waiting for the Realtime row event.")),
        15_000,
      )
    ),
  ]);
  clearTimeout(timeout);
  if (row["id"] !== 263 || row["payload"] !== "runtime-event") {
    throw new Error(`Unexpected Realtime payload: ${JSON.stringify(row)}`);
  }
  console.log(JSON.stringify({ valid: true, event: "INSERT" }));
} finally {
  await client.removeChannel(channel);
}
