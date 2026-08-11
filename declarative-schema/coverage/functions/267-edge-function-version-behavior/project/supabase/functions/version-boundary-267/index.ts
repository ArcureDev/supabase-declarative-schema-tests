Deno.serve((request) => {
  const requested = request.headers.get("x-case-version");
  const version = requested === "267-v2" ? "267-v2" : "267-v1";
  return Response.json(
    { case: 267, version },
    { headers: { "x-function-version": version } },
  );
});
