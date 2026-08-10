# Supabase declarative schema CLI matrix

This suite contains exactly one checked-in Supabase project under `runtime/`.
Each SQL file under `migrations/` is an independent snapshot case. Transition
cases under `transitions/` contain baseline state A, desired state B, and
post-generation verification SQL. The runner tests pg-delta next entirely
through the Supabase CLI while reusing the runtime project's local PostgreSQL
container.

The implemented fixture inventory and the broader transition-testing roadmap
are tracked in [`TEST-MATRIX.md`](./TEST-MATRIX.md).

For snapshot cases, the runner:

1. Removes any stale shared test runtime from an interrupted earlier run.
2. Copies the next migration case and the runtime project to an isolated working
   directory.
3. For the first fixture, runs
   `npx supabase db schema declarative generate --local --reset --overwrite --debug`
   to start and initialize the shared local database from its migrations.
4. Before each subsequent fixture, explicitly runs
   `npx supabase db reset --local --no-seed --debug`, then runs
   `npx supabase db schema declarative generate --local --overwrite --debug`.
   The explicit reset is required because generate's `--reset` does not reload a
   different working directory's migrations when the shared container is
   already running.
5. Removes the migration SQL files from the isolated copy.
6. Runs `npx supabase db schema declarative sync --no-apply --debug` to recreate a
   migration from the generated declarative schema without an interactive apply
   prompt.
7. Writes a new timestamped report under `reports/`, recording `OK` or the
   command error for every project. For example:
   `reports/report-2026-08-08T16-15-27-077Z.md`.
8. Stops and removes the shared local database once with
   `npx supabase stop --no-backup`. Cleanup failures are included in the report.

For a transition case, the runner writes declarative state A and runs
`sync --apply`, allowing the CLI to generate and apply its own baseline
migration. It inserts representative data, captures catalog identity, replaces
the same declarative file with state B, and runs `sync --no-apply`. The
rename-ambiguity fixture passes only when the planner explicitly warns or
refuses without inferring a native rename. Catalog identity and data are queried
again to prove that planning left state A unchanged.

A command that exits with code 0 but emits `code=unmodeled_kind` is recorded as
a warning rather than an error. Because pg-delta explicitly omitted an
unsupported object from the exported declarative schema, the safety behavior is
unchanged: legacy is tried, sync is skipped after an unsafe generate result, and
the overall run remains nonzero rather than reporting a lossy round trip as
successful.

When a snapshot case's pg-delta next `generate` or `sync` command fails, the
runner retries that same command with `SUPABASE_USE_PG_DELTA_NEXT=false`. The
report records the legacy result separately. A successful legacy retry does not
hide the next failure or change the runner's nonzero exit status.

The report's case-results table shows the primary and legacy outcomes
independently. The legacy outcome is `NOT RUN` when the primary engine did not
need a fallback; otherwise it is `OK`, `WARNING`, or `FAILED`.

After each run, reports that contain command-result metadata are aggregated by
the seven-character Supabase checksum into
`versions/version-<ISO-8601-datetime>-<checksum>.md`, for example
`versions/version-20260809T080000Z-f9bd289.md`.
Each version file keeps the newest complete snapshot for every case, so a
targeted run updates its selected cases without removing the other cases. Its
matrix contains `generate`, `sync`, and `sync-verification` results for pg-delta
next and, when fallback commands ran, legacy. A command that was not run is
shown as a dash; a skipped primary command is recorded as `ERROR`.
Each matrix source link targets an explicit, stable anchor on that case's
section in the originating report.

When any command for a case fails or produces a warning, that case's report
section also includes the complete fixture migration SQL so the problematic
database definition can be copied directly into an issue or reproduction.

When pg-delta next `generate` fails or produces a warning, the runner snapshots
every file it produced before retrying with legacy. It then snapshots every file
produced by the legacy attempt, regardless of whether that retry succeeds. Both
sets are written to the report with their relative filenames and full contents;
an empty set is reported explicitly.

The checked-in runtime project and fixtures are never mutated. Temporary
working copies and their potentially sensitive pg-delta debug bundles are
stored in `.tmp/`, which is ignored by Git.

Docker must be running. From the repository root, run:

```powershell
npm run test:declarative-schema
```

Progress is always shown for every phase, including its status and duration:

```text
Testing 01-basic-table...
  - generate declarative schema from migrations
    result: OK (31.2s, exit 0)
  - remove migration SQL from working copy
    result: OK (1 file(s) removed)
  - sync migration from declarative schema
    result: OK (27.8s, exit 0)
Testing 02-enum-type...
  - reset shared database from current fixture migrations
    result: OK (4.2s, exit 0)
  - generate declarative schema from migrations
    result: OK (1.3s, exit 0)
```

To additionally print each exact CLI command immediately before it runs:

```powershell
npm run test:declarative-schema -- --verbose
```

To select numbered snapshot or transition cases, use `--case=` with one number,
an inclusive range, a comma-separated list, or a combination of ranges and
numbers:

```powershell
npm run test:declarative-schema -- --case=18
npm run test:declarative-schema -- --case=10-20
npm run test:declarative-schema -- --case=11,15,24
npm run test:declarative-schema -- --case=10-15,24
npm run test:declarative-schema -- --case=181
```

To rerun only the failed or warning cases from the newest timestamped report,
use `--failed`. Reports created before this option was added are supported too:

```powershell
npm run test:declarative-schema -- --failed
```

Options can be combined:

```powershell
npm run test:declarative-schema -- --case=18 --verbose
```

Command output remains captured in that run's timestamped file under `reports/`
so errors can be reviewed later without overwriting earlier results. The exact
path is printed when the runner finishes.

The runner uses `SUPABASE_USE_PG_DELTA_NEXT=true` for its primary commands and
sets it to `false` only for legacy retries. It executes projects sequentially
against the shared runtime because each reset replaces its complete database
state. Generated schemas, migrations, caches, and diagnostics remain isolated
in a separate working directory for each fixture.
