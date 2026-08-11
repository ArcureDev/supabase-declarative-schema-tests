Deno.serve(async (request) => {
  const body = await request.json().catch(() => ({}));
  return Response.json(
    { boundary: "jwt-verified", case: body.case ?? null },
    { headers: { "x-case": "266" } },
  );
});
