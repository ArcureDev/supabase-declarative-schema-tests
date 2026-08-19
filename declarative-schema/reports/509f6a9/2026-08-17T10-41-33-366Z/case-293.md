# Case: 293-cli-version-evidence

- Coverage: Capture the pinned Supabase CLI version and the declarative command surface as report evidence without starting services.
- Requirements: `C5`

## Capture Supabase CLI version (config plane)

- Command: `npx supabase --version`
- Result: **OK**
- Duration: `0.7s`

## Capture declarative command surface (config plane)

- Command: `npx supabase db schema declarative --help`
- Result: **OK**
- Duration: `0.5s`

## Coverage evaluation

- Command: `coverage evaluation`
- Result: **OK**
- Duration: `0.0s`
<!-- declarative-schema-command-result case="293-cli-version-evidence" engine="next" command="generate" status="OK" -->
<!-- declarative-schema-command-result case="293-cli-version-evidence" engine="next" command="sync" status="OK" -->
<!-- declarative-schema-command-result case="293-cli-version-evidence" engine="next" command="sync-verification" status="OK" -->

