/**
 * Builds postgres-transition-catalogue.json and the table-driven scenario
 * packs under transitions/catalogue/.
 *
 * Edit this file when adding catalogue atoms or pack scenarios, then run:
 *   node --experimental-strip-types declarative-schema/catalogue/build-fixtures.mts
 *
 * Each atom must have exactly one primary executable scenario (or a mapped
 * coverage case). Supported PostgreSQL operations use applicable-transition;
 * identity-unsafe rename/move pairs use rename-ambiguity; populated drops use
 * the destructive planner; unmodeled or cluster-scoped kinds use
 * expected-unsupported diagnostics.
 */
import {
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CatalogueEvidence, CatalogueSection } from "../runner/catalogue.mts";

const catalogueRoot = dirname(fileURLToPath(import.meta.url));
const schemaRoot = dirname(catalogueRoot);
const transitionsRoot = join(schemaRoot, "transitions", "catalogue");

const ANCHOR = `create table public.transition_anchor (
  id bigint primary key,
  payload text not null
);`;

const SETUP = `insert into public.transition_anchor values (1, 'preserved');`;

const PROJECT_CONFIG = `project_id = "ds-shared-runtime"

[db]
port = 55000
shadow_port = 55100
major_version = 17

[db.migrations]
enabled = true
schema_paths = []

[db.seed]
enabled = false

[experimental.pgdelta]
enabled = true
declarative_schema_path = "./database"
`;

const PROJECT_GITIGNORE = `.branches/
.temp/
migrations/
`;

const EXTENSIONS = `create extension if not exists "pgcrypto" with schema "extensions";
create extension if not exists "uuid-ossp" with schema "extensions";
`;

const FORBIDDEN = [
  {
    description: "does not replace the transition anchor",
    pattern: "\\bdrop\\s+table\\s+(?:if\\s+exists\\s+)?(?:only\\s+)?public\\.transition_anchor\\b",
  },
  {
    description: "does not truncate populated data",
    pattern: "(?:^|;)\\s*truncate(?:\\s+table)?\\b",
  },
  {
    description: "does not panic",
    pattern: "\\b(?:panic|segmentation fault)\\b",
  },
];

function verifySql(condition: string): string {
  return `select jsonb_build_object(
  'identity', 'public.transition_anchor'::regclass::oid,
  'valid',
    (select count(*) = 1 and min(payload) = 'preserved'
     from public.transition_anchor)
    and (${condition})
)::text;
`;
}

type AtomDef = {
  key: string;
  verbs: string[];
  objects: string[];
  facets?: string[];
  evidence: CatalogueEvidence[];
};

type RowDef = {
  section: CatalogueSection;
  ordinal: number;
  heading: string;
  text: string;
  atoms: AtomDef[];
};

type ScenarioDef = {
  id: string;
  atom: string;
  extraAtoms?: string[];
  expectation:
    | "applicable-transition"
    | "expected-unsupported"
    | "rename-ambiguity-warning-or-refusal"
    | "destructive-change-warning-or-refusal"
    | "no-op-convergence";
  description: string;
  comment: string;
  extraA?: string;
  extraB?: string;
  condition?: string;
  baselineCondition?: string;
  required?: string;
  requiredDescription?: string;
  diagnostic?: string;
  diagnosticDescription?: string;
  sourceIdentifier?: string;
  tableIdentifier?: string;
  columnIdentifier?: string;
  sensitiveValues?: string[];
};

type PackDef = {
  slug: string;
  description: string;
  comment: string;
  scenarios: ScenarioDef[];
};

function atomId(section: CatalogueSection, ordinal: number, key: string): string {
  return `PG-CAT-${section}-${String(ordinal).padStart(2, "0")}::${key}`;
}

function rowId(section: CatalogueSection, ordinal: number): string {
  return `PG-CAT-${section}-${String(ordinal).padStart(2, "0")}`;
}

const HEADINGS: Record<CatalogueSection, string> = {
  STC: "Schemas, tables, columns, and sequences",
  CIX: "Constraints, indexes, statistics, and rules",
  PRT: "Partitions and inheritance",
  TYP: "Types, domains, ranges, and casts",
  VIW: "Views and materialized views",
  RTN: "Functions, procedures, aggregates, and triggers",
  ROL: "Roles, ownership, grants, and row-level security",
  PUB: "Publications and logical replication",
  FTS: "Text search, collations, conversions, and languages",
  EXT: "Extensions, FDWs, and external boundaries",
  BND: "Explicit PostgreSQL boundaries",
};

const ROWS: RowDef[] = [
  {
    section: "STC",
    ordinal: 1,
    heading: HEADINGS.STC,
    text: "Create, drop, rename, move, authorize, and change ownership of schemas.",
    atoms: [
      { key: "create.schema", verbs: ["create"], objects: ["schema"], evidence: ["transition"] },
      { key: "drop.schema", verbs: ["drop"], objects: ["schema"], evidence: ["transition"] },
      { key: "rename.schema", verbs: ["rename"], objects: ["schema"], evidence: ["diagnostic"] },
      { key: "move.schema", verbs: ["move"], objects: ["schema"], evidence: ["diagnostic"] },
      { key: "authorize.schema", verbs: ["authorize"], objects: ["schema"], evidence: ["transition"] },
      { key: "ownership.schema", verbs: ["ownership"], objects: ["schema"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 2,
    heading: HEADINGS.STC,
    text: "Create, drop, rename, move, persist/unpersist, and change ownership of tables; cover ordinary, unlogged, temporary-boundary, partitioned, inherited, typed, foreign, and identity-bearing tables where in scope.",
    atoms: [
      { key: "create.table", verbs: ["create"], objects: ["table"], evidence: ["transition"] },
      { key: "drop.table", verbs: ["drop"], objects: ["table"], evidence: ["transition"] },
      { key: "rename.table", verbs: ["rename"], objects: ["table"], evidence: ["diagnostic"] },
      { key: "move.table", verbs: ["move"], objects: ["table"], evidence: ["diagnostic"] },
      { key: "persist.unlogged", verbs: ["persist"], objects: ["table"], evidence: ["transition"] },
      { key: "ownership.table", verbs: ["ownership"], objects: ["table"], evidence: ["transition"] },
      { key: "kind.partitioned", verbs: ["create"], objects: ["table"], evidence: ["transition"] },
      { key: "kind.inherited", verbs: ["create"], objects: ["table"], evidence: ["transition"] },
      { key: "kind.typed", verbs: ["create"], objects: ["table"], evidence: ["transition"] },
      { key: "kind.foreign", verbs: ["create"], objects: ["foreign-table"], evidence: ["transition"] },
      { key: "kind.identity", verbs: ["create"], objects: ["table"], evidence: ["transition"] },
      { key: "boundary.temporary", verbs: ["create"], objects: ["table"], facets: ["@diagnostic"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "STC",
    ordinal: 3,
    heading: HEADINGS.STC,
    text: "Add, drop, rename, reorder-only, and batch columns on empty and populated tables.",
    atoms: [
      { key: "add.column@empty", verbs: ["add"], objects: ["column"], facets: ["@empty"], evidence: ["transition"] },
      { key: "add.column@populated", verbs: ["add"], objects: ["column"], facets: ["@populated"], evidence: ["transition"] },
      { key: "drop.column@empty", verbs: ["drop"], objects: ["column"], facets: ["@empty"], evidence: ["transition"] },
      { key: "drop.column@populated", verbs: ["drop"], objects: ["column"], facets: ["@populated"], evidence: ["diagnostic"] },
      { key: "rename.column", verbs: ["rename"], objects: ["column"], evidence: ["diagnostic"] },
      { key: "reorder.column", verbs: ["reorder"], objects: ["column"], evidence: ["diagnostic"] },
      { key: "batch.columns@empty", verbs: ["batch"], objects: ["column"], facets: ["@empty"], evidence: ["transition"] },
      { key: "batch.columns@populated", verbs: ["batch"], objects: ["column"], facets: ["@populated"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 4,
    heading: HEADINGS.STC,
    text: "Change data type with implicit cast, assignment cast, explicit USING, lossy conversion, incompatible conversion, arrays, domains, enums, and collation changes.",
    atoms: [
      { key: "cast.implicit", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "cast.assignment", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "cast.using", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "cast.lossy", verbs: ["alter"], objects: ["column"], evidence: ["diagnostic"] },
      { key: "cast.incompatible", verbs: ["alter"], objects: ["column"], evidence: ["diagnostic"] },
      { key: "cast.array", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "cast.domain", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "cast.enum", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "cast.collation", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 5,
    heading: HEADINGS.STC,
    text: "Add/change/drop defaults, including volatile defaults and expression defaults; verify existing rows are not rewritten incorrectly.",
    atoms: [
      { key: "default.add", verbs: ["add"], objects: ["default"], evidence: ["transition"] },
      { key: "default.change", verbs: ["change"], objects: ["default"], evidence: ["transition"] },
      { key: "default.drop", verbs: ["drop"], objects: ["default"], evidence: ["transition"] },
      { key: "default.volatile", verbs: ["add"], objects: ["default"], evidence: ["transition"] },
      { key: "default.expression", verbs: ["add"], objects: ["default"], evidence: ["transition"] },
      { key: "default.no-rewrite", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 6,
    heading: HEADINGS.STC,
    text: "Add/drop NOT NULL with and without valid data and with staged validation.",
    atoms: [
      { key: "notnull.add.valid", verbs: ["add"], objects: ["not-null"], evidence: ["transition"] },
      { key: "notnull.add.invalid", verbs: ["add"], objects: ["not-null"], evidence: ["diagnostic"] },
      { key: "notnull.drop", verbs: ["drop"], objects: ["not-null"], evidence: ["transition"] },
      { key: "notnull.staged", verbs: ["validate"], objects: ["not-null"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 7,
    heading: HEADINGS.STC,
    text: "Add/change/drop identity and generated expressions; switch identity ALWAYS/BY DEFAULT; restart and change sequence options.",
    atoms: [
      { key: "identity.add", verbs: ["add"], objects: ["identity"], evidence: ["transition"] },
      { key: "identity.drop", verbs: ["drop"], objects: ["identity"], evidence: ["transition"] },
      { key: "identity.always", verbs: ["alter"], objects: ["identity"], evidence: ["transition"] },
      { key: "identity.by-default", verbs: ["alter"], objects: ["identity"], evidence: ["transition"] },
      { key: "identity.restart", verbs: ["restart"], objects: ["identity"], evidence: ["diagnostic"] },
      { key: "generated.add", verbs: ["add"], objects: ["generated"], evidence: ["transition"] },
      { key: "generated.change", verbs: ["change"], objects: ["generated"], evidence: ["transition"] },
      { key: "generated.drop", verbs: ["drop"], objects: ["generated"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 8,
    heading: HEADINGS.STC,
    text: "Change compression, storage, statistics target, column options, and per-column privileges.",
    atoms: [
      { key: "compression", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "storage", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "statistics-target", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "column-options", verbs: ["alter"], objects: ["column"], evidence: ["transition"] },
      { key: "column-privileges", verbs: ["grant"], objects: ["column"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 9,
    heading: HEADINGS.STC,
    text: "Sequence create/drop/rename/move; type, increment, min/max, cache, cycle, restart, owned-by, and ownership changes.",
    atoms: [
      { key: "create.sequence", verbs: ["create"], objects: ["sequence"], evidence: ["transition"] },
      { key: "drop.sequence", verbs: ["drop"], objects: ["sequence"], evidence: ["transition"] },
      { key: "rename.sequence", verbs: ["rename"], objects: ["sequence"], evidence: ["diagnostic"] },
      { key: "move.sequence", verbs: ["move"], objects: ["sequence"], evidence: ["diagnostic"] },
      { key: "sequence.type", verbs: ["alter"], objects: ["sequence"], evidence: ["transition"] },
      { key: "sequence.increment", verbs: ["alter"], objects: ["sequence"], evidence: ["transition"] },
      { key: "sequence.bounds", verbs: ["alter"], objects: ["sequence"], evidence: ["transition"] },
      { key: "sequence.cache", verbs: ["alter"], objects: ["sequence"], evidence: ["transition"] },
      { key: "sequence.cycle", verbs: ["alter"], objects: ["sequence"], evidence: ["transition"] },
      { key: "sequence.restart", verbs: ["restart"], objects: ["sequence"], evidence: ["diagnostic"] },
      { key: "sequence.owned-by", verbs: ["alter"], objects: ["sequence"], evidence: ["transition"] },
      { key: "sequence.ownership", verbs: ["ownership"], objects: ["sequence"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 10,
    heading: HEADINGS.STC,
    text: "Table access method, tablespace, persistence, storage parameters, replica identity, row-security flags, clustering, and inheritance changes.",
    atoms: [
      { key: "access-method", verbs: ["alter"], objects: ["table"], evidence: ["diagnostic"] },
      { key: "tablespace", verbs: ["alter"], objects: ["table"], evidence: ["diagnostic"] },
      { key: "persistence", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
      { key: "storage-params", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
      { key: "replica-identity", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
      { key: "rls-flags", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
      { key: "clustering", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
      { key: "inheritance", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
    ],
  },
  {
    section: "STC",
    ordinal: 11,
    heading: HEADINGS.STC,
    text: "Preserve rows containing NULLs, defaults, arrays, JSON, bytea, large text, generated values, identity values, and boundary numeric/time values.",
    atoms: [
      { key: "preserve.null", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.default", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.array", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.json", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.bytea", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.large-text", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.generated", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.identity", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.numeric", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
      { key: "preserve.time", verbs: ["preserve"], objects: ["row"], evidence: ["transition"] },
    ],
  },
];

// Remaining rows are appended below via the rest of the catalogue definition.
const MORE_ROWS: RowDef[] = [
  {
    section: "CIX",
    ordinal: 1,
    heading: HEADINGS.CIX,
    text: "Primary key, unique, foreign key, check, exclusion, and NOT NULL constraint create/drop/rename and property changes.",
    atoms: [
      { key: "pk.create", verbs: ["create"], objects: ["primary-key"], evidence: ["transition"] },
      { key: "pk.drop", verbs: ["drop"], objects: ["primary-key"], evidence: ["transition"] },
      { key: "unique.create", verbs: ["create"], objects: ["unique"], evidence: ["transition"] },
      { key: "fk.create", verbs: ["create"], objects: ["foreign-key"], evidence: ["transition"] },
      { key: "check.create", verbs: ["create"], objects: ["check"], evidence: ["transition"] },
      { key: "exclusion.create", verbs: ["create"], objects: ["exclusion"], evidence: ["transition"] },
      { key: "notnull.constraint", verbs: ["create"], objects: ["not-null"], evidence: ["transition"] },
      { key: "rename.constraint", verbs: ["rename"], objects: ["constraint"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 2,
    heading: HEADINGS.CIX,
    text: "Composite keys; self, cyclic, multi-column, cross-schema, partitioned, and deferrable foreign keys; action and match-mode changes.",
    atoms: [
      { key: "fk.composite", verbs: ["create"], objects: ["foreign-key"], evidence: ["transition"] },
      { key: "fk.self", verbs: ["create"], objects: ["foreign-key"], evidence: ["transition"] },
      { key: "fk.cross-schema", verbs: ["create"], objects: ["foreign-key"], evidence: ["transition"] },
      { key: "fk.deferrable", verbs: ["alter"], objects: ["foreign-key"], evidence: ["transition"] },
      { key: "fk.action", verbs: ["alter"], objects: ["foreign-key"], evidence: ["transition"] },
      { key: "fk.match", verbs: ["alter"], objects: ["foreign-key"], evidence: ["transition"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 3,
    heading: HEADINGS.CIX,
    text: "NOT VALID creation followed by VALIDATE CONSTRAINT, including invalid existing data.",
    atoms: [
      { key: "not-valid.create", verbs: ["create"], objects: ["constraint"], evidence: ["transition"] },
      { key: "validate.constraint", verbs: ["validate"], objects: ["constraint"], evidence: ["transition"] },
      { key: "validate.invalid", verbs: ["validate"], objects: ["constraint"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 4,
    heading: HEADINGS.CIX,
    text: "Attach an existing unique index as a constraint and detach or replace it without needless rebuilds.",
    atoms: [
      { key: "index.attach-constraint", verbs: ["attach"], objects: ["index"], evidence: ["transition"] },
      { key: "index.replace-constraint", verbs: ["replace"], objects: ["constraint"], evidence: ["transition"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 5,
    heading: HEADINGS.CIX,
    text: "Index create/drop/rename/move and changes to uniqueness, method, columns, expressions, sort order, NULLS order, INCLUDE, predicate, collation, operator class, options, tablespace, and validity.",
    atoms: [
      { key: "index.create", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.drop", verbs: ["drop"], objects: ["index"], evidence: ["transition"] },
      { key: "index.rename", verbs: ["rename"], objects: ["index"], evidence: ["diagnostic"] },
      { key: "index.move", verbs: ["move"], objects: ["index"], evidence: ["diagnostic"] },
      { key: "index.unique", verbs: ["alter"], objects: ["index"], evidence: ["transition"] },
      { key: "index.method", verbs: ["alter"], objects: ["index"], evidence: ["transition"] },
      { key: "index.expression", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.include", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.predicate", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.sort", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 6,
    heading: HEADINGS.CIX,
    text: "Partial, expression, covering, multicolumn, partitioned, hash, GiST, SP-GiST, GIN, BRIN, and extension-provided indexes.",
    atoms: [
      { key: "index.partial", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.covering", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.multicolumn", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.hash", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.gin", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.gist", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.brin", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "index.extension", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 7,
    heading: HEADINGS.CIX,
    text: "Concurrent-index policy, invalid indexes, clustered indexes, replica identity indexes, and duplicate-equivalent definitions.",
    atoms: [
      { key: "index.concurrent", verbs: ["create"], objects: ["index"], evidence: ["diagnostic"] },
      { key: "index.invalid", verbs: ["repair"], objects: ["index"], evidence: ["diagnostic"] },
      { key: "index.clustered", verbs: ["alter"], objects: ["index"], evidence: ["transition"] },
      { key: "index.replica-identity", verbs: ["alter"], objects: ["index"], evidence: ["transition"] },
      { key: "index.duplicate", verbs: ["create"], objects: ["index"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 8,
    heading: HEADINGS.CIX,
    text: "Extended statistics create/drop/rename and changes to columns, kinds, target, owner, and schema.",
    atoms: [
      { key: "statistics.create", verbs: ["create"], objects: ["statistics"], evidence: ["diagnostic"] },
      { key: "statistics.drop", verbs: ["drop"], objects: ["statistics"], evidence: ["diagnostic"] },
      { key: "statistics.rename", verbs: ["rename"], objects: ["statistics"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "CIX",
    ordinal: 9,
    heading: HEADINGS.CIX,
    text: "Rewrite rules create/replace/drop/enable/disable and interaction with views, triggers, and RLS.",
    atoms: [
      { key: "rule.create", verbs: ["create"], objects: ["rule"], evidence: ["diagnostic"] },
      { key: "rule.replace", verbs: ["replace"], objects: ["rule"], evidence: ["diagnostic"] },
      { key: "rule.drop", verbs: ["drop"], objects: ["rule"], evidence: ["diagnostic"] },
      { key: "rule.enable", verbs: ["enable"], objects: ["rule"], evidence: ["diagnostic"] },
    ],
  },
];

function allRows(): RowDef[] {
  return [...ROWS, ...MORE_ROWS, ...FINAL_ROWS];
}

const FINAL_ROWS: RowDef[] = [
  {
    section: "PRT",
    ordinal: 1,
    heading: HEADINGS.PRT,
    text: "RANGE, LIST, HASH, DEFAULT, multilevel, and subpartitioned hierarchies.",
    atoms: [
      { key: "partition.range", verbs: ["create"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.list", verbs: ["create"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.hash", verbs: ["create"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.default", verbs: ["create"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.multilevel", verbs: ["create"], objects: ["partition"], evidence: ["transition"] },
    ],
  },
  {
    section: "PRT",
    ordinal: 2,
    heading: HEADINGS.PRT,
    text: "Add, detach, finalize detach, attach, rename, move, and drop partitions.",
    atoms: [
      { key: "partition.add", verbs: ["add"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.detach", verbs: ["detach"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.finalize-detach", verbs: ["detach"], objects: ["partition"], evidence: ["diagnostic"] },
      { key: "partition.attach", verbs: ["attach"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.rename", verbs: ["rename"], objects: ["partition"], evidence: ["diagnostic"] },
      { key: "partition.move", verbs: ["move"], objects: ["partition"], evidence: ["diagnostic"] },
      { key: "partition.drop", verbs: ["drop"], objects: ["partition"], evidence: ["transition"] },
    ],
  },
  {
    section: "PRT",
    ordinal: 3,
    heading: HEADINGS.PRT,
    text: "Change bounds, default-partition constraints, partition keys, and strategy through safe staged operations or explicit refusal.",
    atoms: [
      { key: "partition.bounds", verbs: ["alter"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.key", verbs: ["alter"], objects: ["partition"], evidence: ["diagnostic"] },
      { key: "partition.strategy", verbs: ["alter"], objects: ["partition"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "PRT",
    ordinal: 4,
    heading: HEADINGS.PRT,
    text: "Attach populated tables with validated constraints and reject overlapping or invalid data.",
    atoms: [
      { key: "partition.attach-populated", verbs: ["attach"], objects: ["partition"], evidence: ["transition"] },
      { key: "partition.attach-invalid", verbs: ["attach"], objects: ["partition"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "PRT",
    ordinal: 5,
    heading: HEADINGS.PRT,
    text: "Local versus partitioned indexes, attached indexes, constraints, sequences, triggers, RLS, publications, and foreign keys.",
    atoms: [
      { key: "partition.local-index", verbs: ["create"], objects: ["index"], evidence: ["transition"] },
      { key: "partition.constraint", verbs: ["create"], objects: ["constraint"], evidence: ["transition"] },
      { key: "partition.trigger", verbs: ["create"], objects: ["trigger"], evidence: ["transition"] },
      { key: "partition.rls", verbs: ["create"], objects: ["policy"], evidence: ["transition"] },
      { key: "partition.fk", verbs: ["create"], objects: ["foreign-key"], evidence: ["transition"] },
    ],
  },
  {
    section: "PRT",
    ordinal: 6,
    heading: HEADINGS.PRT,
    text: "Traditional inheritance add/drop parent, multiple inheritance, NO INHERIT, and inherited column/constraint behavior.",
    atoms: [
      { key: "inherit.add", verbs: ["add"], objects: ["inheritance"], evidence: ["transition"] },
      { key: "inherit.drop", verbs: ["drop"], objects: ["inheritance"], evidence: ["transition"] },
      { key: "inherit.multiple", verbs: ["create"], objects: ["inheritance"], evidence: ["transition"] },
      { key: "inherit.no-inherit", verbs: ["alter"], objects: ["inheritance"], evidence: ["transition"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 1,
    heading: HEADINGS.TYP,
    text: "Enum create/drop/rename/move; add value before/after, rename value, reorder request, delete request, and transactional/version limitations.",
    atoms: [
      { key: "enum.create", verbs: ["create"], objects: ["enum"], evidence: ["transition"] },
      { key: "enum.drop", verbs: ["drop"], objects: ["enum"], evidence: ["transition"] },
      { key: "enum.rename", verbs: ["rename"], objects: ["enum"], evidence: ["diagnostic"] },
      { key: "enum.add-value", verbs: ["alter"], objects: ["enum"], evidence: ["transition"] },
      { key: "enum.rename-value", verbs: ["rename"], objects: ["enum"], evidence: ["diagnostic"] },
      { key: "enum.delete-value", verbs: ["drop"], objects: ["enum"], evidence: ["diagnostic"] },
      { key: "enum.reorder", verbs: ["alter"], objects: ["enum"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 2,
    heading: HEADINGS.TYP,
    text: "Domain base type, default, NOT NULL, collation, and named check-constraint transitions with populated dependent columns.",
    atoms: [
      { key: "domain.default", verbs: ["alter"], objects: ["domain"], evidence: ["transition"] },
      { key: "domain.not-null", verbs: ["alter"], objects: ["domain"], evidence: ["transition"] },
      { key: "domain.check", verbs: ["alter"], objects: ["domain"], evidence: ["transition"] },
      { key: "domain.collation", verbs: ["alter"], objects: ["domain"], evidence: ["transition"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 3,
    heading: HEADINGS.TYP,
    text: "Composite type attributes add/drop/rename/type/collation changes and dependent tables/functions.",
    atoms: [
      { key: "composite.add-attribute", verbs: ["add"], objects: ["composite"], evidence: ["transition"] },
      { key: "composite.drop-attribute", verbs: ["drop"], objects: ["composite"], evidence: ["transition"] },
      { key: "composite.rename-attribute", verbs: ["rename"], objects: ["composite"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 4,
    heading: HEADINGS.TYP,
    text: "Range and multirange creation, rename, move, subtype/opclass/canonical/diff changes, and dependencies.",
    atoms: [
      { key: "range.create", verbs: ["create"], objects: ["range"], evidence: ["transition"] },
      { key: "range.rename", verbs: ["rename"], objects: ["range"], evidence: ["diagnostic"] },
      { key: "multirange.create", verbs: ["create"], objects: ["multirange"], evidence: ["transition"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 5,
    heading: HEADINGS.TYP,
    text: "Base and shell types, input/output/receive/send/analyze/subscript functions, storage/alignment/category/preference/collatability changes.",
    atoms: [
      { key: "base-type.create", verbs: ["create"], objects: ["base-type"], evidence: ["diagnostic"] },
      { key: "shell-type.create", verbs: ["create"], objects: ["shell-type"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 6,
    heading: HEADINGS.TYP,
    text: "Cast create/drop and changes to function, context, and method.",
    atoms: [
      { key: "cast.create", verbs: ["create"], objects: ["cast"], evidence: ["diagnostic"] },
      { key: "cast.drop", verbs: ["drop"], objects: ["cast"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 7,
    heading: HEADINGS.TYP,
    text: "Operator, operator class, operator family, aggregate, and support-function dependency transitions.",
    atoms: [
      { key: "operator.create", verbs: ["create"], objects: ["operator"], evidence: ["diagnostic"] },
      { key: "opclass.create", verbs: ["create"], objects: ["opclass"], evidence: ["diagnostic"] },
      { key: "aggregate.dependency", verbs: ["create"], objects: ["aggregate"], evidence: ["transition"] },
    ],
  },
  {
    section: "TYP",
    ordinal: 8,
    heading: HEADINGS.TYP,
    text: "Positive CREATE TRANSFORM coverage plus replace/drop and language/type dependencies.",
    atoms: [
      { key: "transform.create", verbs: ["create"], objects: ["transform"], evidence: ["diagnostic"] },
      { key: "transform.drop", verbs: ["drop"], objects: ["transform"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "VIW",
    ordinal: 1,
    heading: HEADINGS.VIW,
    text: "Create/replace/drop/rename/move and ownership, comment, ACL, security barrier/invoker, check option, and column-name changes.",
    atoms: [
      { key: "view.create", verbs: ["create"], objects: ["view"], evidence: ["transition"] },
      { key: "view.replace", verbs: ["replace"], objects: ["view"], evidence: ["transition"] },
      { key: "view.drop", verbs: ["drop"], objects: ["view"], evidence: ["transition"] },
      { key: "view.rename", verbs: ["rename"], objects: ["view"], evidence: ["diagnostic"] },
      { key: "view.security-invoker", verbs: ["alter"], objects: ["view"], evidence: ["transition"] },
      { key: "view.check-option", verbs: ["alter"], objects: ["view"], evidence: ["transition"] },
    ],
  },
  {
    section: "VIW",
    ordinal: 2,
    heading: HEADINGS.VIW,
    text: "Compatible and incompatible output-column changes; nested, recursive, lateral, aggregate, window, set-operation, and cross-schema views.",
    atoms: [
      { key: "view.compatible", verbs: ["replace"], objects: ["view"], evidence: ["transition"] },
      { key: "view.incompatible", verbs: ["replace"], objects: ["view"], evidence: ["diagnostic"] },
      { key: "view.recursive", verbs: ["create"], objects: ["view"], evidence: ["transition"] },
      { key: "view.cross-schema", verbs: ["create"], objects: ["view"], evidence: ["transition"] },
    ],
  },
  {
    section: "VIW",
    ordinal: 3,
    heading: HEADINGS.VIW,
    text: "Dependency-safe ordering when base objects and view chains change together.",
    atoms: [
      { key: "view.dependency-order", verbs: ["order"], objects: ["view"], evidence: ["transition"] },
    ],
  },
  {
    section: "VIW",
    ordinal: 4,
    heading: HEADINGS.VIW,
    text: "Materialized-view query, options, tablespace, access method, index, owner, populated/unpopulated state, refresh, and concurrent-refresh eligibility.",
    atoms: [
      { key: "matview.create", verbs: ["create"], objects: ["materialized-view"], evidence: ["transition"] },
      { key: "matview.replace", verbs: ["replace"], objects: ["materialized-view"], evidence: ["transition"] },
      { key: "matview.refresh", verbs: ["refresh"], objects: ["materialized-view"], evidence: ["diagnostic"] },
      { key: "matview.concurrent-refresh", verbs: ["refresh"], objects: ["materialized-view"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 1,
    heading: HEADINGS.RTN,
    text: "SQL, PL/pgSQL, and supported extension-language routines.",
    atoms: [
      { key: "routine.sql", verbs: ["create"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.plpgsql", verbs: ["create"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.extension-language", verbs: ["create"], objects: ["function"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 2,
    heading: HEADINGS.RTN,
    text: "Create/replace/drop/rename/move; signature, argument name/mode/default, return type/table, language, body, volatility, strictness, leakproofness, parallel safety, security mode, support function, cost, rows, configuration, owner, ACL, and dependency changes.",
    atoms: [
      { key: "routine.replace", verbs: ["replace"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.drop", verbs: ["drop"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.rename", verbs: ["rename"], objects: ["function"], evidence: ["diagnostic"] },
      { key: "routine.volatility", verbs: ["alter"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.security", verbs: ["alter"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.parallel", verbs: ["alter"], objects: ["function"], evidence: ["transition"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 3,
    heading: HEADINGS.RTN,
    text: "Overloads, variadic/polymorphic arguments, quoted bodies, dollar-tag variants, comments, whitespace, and CRLF-versus-LF normalization.",
    atoms: [
      { key: "routine.overload", verbs: ["create"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.variadic", verbs: ["create"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.normalization", verbs: ["replace"], objects: ["function"], evidence: ["transition"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 4,
    heading: HEADINGS.RTN,
    text: "Procedure transaction behavior and IN/OUT signature transitions.",
    atoms: [
      { key: "procedure.replace", verbs: ["replace"], objects: ["procedure"], evidence: ["transition"] },
      { key: "procedure.signature", verbs: ["alter"], objects: ["procedure"], evidence: ["transition"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 5,
    heading: HEADINGS.RTN,
    text: "Ordinary, ordered-set, and hypothetical-set aggregate transitions, including state/combine/serial/deserial/final/moving functions.",
    atoms: [
      { key: "aggregate.ordinary", verbs: ["alter"], objects: ["aggregate"], evidence: ["transition"] },
      { key: "aggregate.ordered-set", verbs: ["create"], objects: ["aggregate"], evidence: ["transition"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 6,
    heading: HEADINGS.RTN,
    text: "Row, statement, constraint, INSTEAD OF, transition-table, deferred, partitioned-table, enabled/disabled, and replica/always triggers.",
    atoms: [
      { key: "trigger.row", verbs: ["create"], objects: ["trigger"], evidence: ["transition"] },
      { key: "trigger.statement", verbs: ["create"], objects: ["trigger"], evidence: ["transition"] },
      { key: "trigger.instead-of", verbs: ["create"], objects: ["trigger"], evidence: ["transition"] },
      { key: "trigger.disable", verbs: ["alter"], objects: ["trigger"], evidence: ["transition"] },
      { key: "trigger.constraint", verbs: ["create"], objects: ["trigger"], evidence: ["transition"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 7,
    heading: HEADINGS.RTN,
    text: "Event-trigger create/drop/rename/enable changes for ddl_command_start, ddl_command_end, table_rewrite, and sql_drop, with tag filtering.",
    atoms: [
      { key: "event-trigger.create", verbs: ["create"], objects: ["event-trigger"], evidence: ["transition"] },
      { key: "event-trigger.enable", verbs: ["enable"], objects: ["event-trigger"], evidence: ["transition"] },
      { key: "event-trigger.rename", verbs: ["rename"], objects: ["event-trigger"], evidence: ["diagnostic"] },
      { key: "event-trigger.tag-filter", verbs: ["alter"], objects: ["event-trigger"], evidence: ["transition"] },
    ],
  },
  {
    section: "RTN",
    ordinal: 8,
    heading: HEADINGS.RTN,
    text: "Safe ordering when a routine is used by a default, generated column, index, constraint, policy, trigger, view, operator, cast, or publication filter.",
    atoms: [
      { key: "routine.used-by-default", verbs: ["order"], objects: ["function"], evidence: ["transition"] },
      { key: "routine.used-by-view", verbs: ["order"], objects: ["function"], evidence: ["transition"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 1,
    heading: HEADINGS.ROL,
    text: "Role create/drop/rename and LOGIN, SUPERUSER, CREATEDB, CREATEROLE, REPLICATION, BYPASSRLS, connection limit, validity, password-redaction, and membership/admin/inherit/set option transitions.",
    atoms: [
      { key: "role.create", verbs: ["create"], objects: ["role"], evidence: ["diagnostic"] },
      { key: "role.drop", verbs: ["drop"], objects: ["role"], evidence: ["diagnostic"] },
      { key: "role.rename", verbs: ["rename"], objects: ["role"], evidence: ["diagnostic"] },
      { key: "role.membership", verbs: ["grant"], objects: ["role"], evidence: ["diagnostic"] },
      { key: "role.password-redaction", verbs: ["redact"], objects: ["role"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 2,
    heading: HEADINGS.ROL,
    text: "Object ownership changes and DROP OWNED/REASSIGN OWNED boundaries.",
    atoms: [
      { key: "ownership.object", verbs: ["ownership"], objects: ["table"], evidence: ["transition"] },
      { key: "ownership.reassign", verbs: ["reassign"], objects: ["role"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 3,
    heading: HEADINGS.ROL,
    text: "GRANT/REVOKE for schemas, tables, columns, sequences, routines, types, databases, tablespaces, foreign objects, large objects, and parameters.",
    atoms: [
      { key: "grant.table", verbs: ["grant"], objects: ["table"], evidence: ["transition"] },
      { key: "grant.schema", verbs: ["grant"], objects: ["schema"], evidence: ["transition"] },
      { key: "grant.routine", verbs: ["grant"], objects: ["function"], evidence: ["transition"] },
      { key: "grant.database", verbs: ["grant"], objects: ["database"], evidence: ["diagnostic"] },
      { key: "grant.parameter", verbs: ["grant"], objects: ["parameter"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 4,
    heading: HEADINGS.ROL,
    text: "Grant option, PUBLIC, default privileges, grantor identity, duplicate grants, and revoke cascade/restrict.",
    atoms: [
      { key: "grant.option", verbs: ["grant"], objects: ["privilege"], evidence: ["transition"] },
      { key: "grant.public", verbs: ["grant"], objects: ["privilege"], evidence: ["transition"] },
      { key: "grant.default-privileges", verbs: ["alter"], objects: ["privilege"], evidence: ["transition"] },
      { key: "revoke.cascade", verbs: ["revoke"], objects: ["privilege"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 5,
    heading: HEADINGS.ROL,
    text: "RLS enable/disable/force/no-force; policy create/drop/rename and changes to command, permissive/restrictive mode, roles, USING, and WITH CHECK.",
    atoms: [
      { key: "rls.enable", verbs: ["enable"], objects: ["rls"], evidence: ["transition"] },
      { key: "rls.force", verbs: ["force"], objects: ["rls"], evidence: ["transition"] },
      { key: "policy.create", verbs: ["create"], objects: ["policy"], evidence: ["transition"] },
      { key: "policy.drop", verbs: ["drop"], objects: ["policy"], evidence: ["transition"] },
      { key: "policy.rename", verbs: ["rename"], objects: ["policy"], evidence: ["diagnostic"] },
      { key: "policy.restrictive", verbs: ["alter"], objects: ["policy"], evidence: ["transition"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 6,
    heading: HEADINGS.ROL,
    text: "Policies using auth.uid(), auth.jwt(), security-definer helpers, views, joins, custom claims, anonymous/authenticated/service roles, and recursive policy hazards.",
    atoms: [
      { key: "policy.auth-uid", verbs: ["create"], objects: ["policy"], evidence: ["transition"] },
      { key: "policy.auth-jwt", verbs: ["create"], objects: ["policy"], evidence: ["transition"] },
      { key: "policy.helper", verbs: ["create"], objects: ["policy"], evidence: ["transition"] },
    ],
  },
  {
    section: "ROL",
    ordinal: 7,
    heading: HEADINGS.ROL,
    text: "Ensure routine security, search_path, ownership, privileges, and RLS are changed in a non-exploitable order.",
    atoms: [
      { key: "security.order", verbs: ["order"], objects: ["policy"], evidence: ["transition"] },
    ],
  },
  {
    section: "PUB",
    ordinal: 1,
    heading: HEADINGS.PUB,
    text: "Publication create/drop/rename/owner, FOR ALL TABLES, selected tables, schema membership, column lists, row filters, publish operations, partition root, and membership add/drop.",
    atoms: [
      { key: "publication.create", verbs: ["create"], objects: ["publication"], evidence: ["transition"] },
      { key: "publication.drop", verbs: ["drop"], objects: ["publication"], evidence: ["transition"] },
      { key: "publication.rename", verbs: ["rename"], objects: ["publication"], evidence: ["diagnostic"] },
      { key: "publication.membership", verbs: ["alter"], objects: ["publication"], evidence: ["transition"] },
      { key: "publication.row-filter", verbs: ["alter"], objects: ["publication"], evidence: ["transition"] },
    ],
  },
  {
    section: "PUB",
    ordinal: 2,
    heading: HEADINGS.PUB,
    text: "Supabase Realtime publication membership and replica-identity requirements.",
    atoms: [
      { key: "realtime.membership", verbs: ["alter"], objects: ["publication"], evidence: ["transition"] },
      { key: "realtime.replica-identity", verbs: ["alter"], objects: ["table"], evidence: ["transition"] },
    ],
  },
  {
    section: "PUB",
    ordinal: 3,
    heading: HEADINGS.PUB,
    text: "Subscription definitions, connection-string redaction, enabled state, slot/publication changes, origin, streaming, binary, two-phase, failover, refresh, skip, and DROP cleanup when a safe test environment supports them.",
    atoms: [
      { key: "subscription.create", verbs: ["create"], objects: ["subscription"], evidence: ["diagnostic"] },
      { key: "subscription.redaction", verbs: ["redact"], objects: ["subscription"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "PUB",
    ordinal: 4,
    heading: HEADINGS.PUB,
    text: "Slot/origin/runtime replication state is asserted separately from declarative DDL.",
    atoms: [
      { key: "replication.runtime-state", verbs: ["assert"], objects: ["slot"], evidence: ["runtime-boundary"] },
    ],
  },
  {
    section: "FTS",
    ordinal: 1,
    heading: HEADINGS.FTS,
    text: "Text-search parser, template, dictionary, and configuration lifecycle; token mappings and dependency ordering.",
    atoms: [
      { key: "textsearch.config.create", verbs: ["create"], objects: ["text-search"], evidence: ["transition"] },
      { key: "textsearch.mapping", verbs: ["alter"], objects: ["text-search"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "FTS",
    ordinal: 2,
    heading: HEADINGS.FTS,
    text: "Collation create/drop/rename/move, provider, locale/rules, deterministic flag, encoding, version refresh, ICU/libc availability, and OS drift.",
    atoms: [
      { key: "collation.create", verbs: ["create"], objects: ["collation"], evidence: ["transition"] },
      { key: "collation.drop", verbs: ["drop"], objects: ["collation"], evidence: ["transition"] },
      { key: "collation.rename", verbs: ["rename"], objects: ["collation"], evidence: ["diagnostic"] },
      { key: "collation.version", verbs: ["alter"], objects: ["collation"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "FTS",
    ordinal: 3,
    heading: HEADINGS.FTS,
    text: "Conversion create/drop/rename/move/default and source/destination encoding/function changes.",
    atoms: [
      { key: "conversion.create", verbs: ["create"], objects: ["conversion"], evidence: ["transition"] },
      { key: "conversion.drop", verbs: ["drop"], objects: ["conversion"], evidence: ["transition"] },
      { key: "conversion.rename", verbs: ["rename"], objects: ["conversion"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "FTS",
    ordinal: 4,
    heading: HEADINGS.FTS,
    text: "Procedural-language create/drop/rename/owner/handler/validator/inline transitions and trusted/untrusted boundaries.",
    atoms: [
      { key: "language.create", verbs: ["create"], objects: ["language"], evidence: ["diagnostic"] },
      { key: "language.trusted", verbs: ["alter"], objects: ["language"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "EXT",
    ordinal: 1,
    heading: HEADINGS.EXT,
    text: "Extension create/drop, version upgrade/downgrade request, schema move, cascade policy, relocatable/non-relocatable behavior, and configuration-table membership.",
    atoms: [
      { key: "extension.create", verbs: ["create"], objects: ["extension"], evidence: ["transition"] },
      { key: "extension.drop", verbs: ["drop"], objects: ["extension"], evidence: ["diagnostic"] },
      { key: "extension.upgrade", verbs: ["alter"], objects: ["extension"], evidence: ["diagnostic"] },
      { key: "extension.schema-move", verbs: ["move"], objects: ["extension"], evidence: ["transition"] },
    ],
  },
  {
    section: "EXT",
    ordinal: 2,
    heading: HEADINGS.EXT,
    text: "Extension-owned objects are neither duplicated nor accidentally dropped; user modifications and upgrade conflicts produce useful diagnostics.",
    atoms: [
      { key: "extension.owned-objects", verbs: ["preserve"], objects: ["extension"], evidence: ["transition"] },
      { key: "extension.conflict", verbs: ["diagnose"], objects: ["extension"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "EXT",
    ordinal: 3,
    heading: HEADINGS.EXT,
    text: "Foreign-data wrapper, server, user mapping, and foreign-table create/drop/rename/move plus handler/validator/options/owner/ACL changes.",
    atoms: [
      { key: "fdw.create", verbs: ["create"], objects: ["fdw"], evidence: ["transition"] },
      { key: "server.create", verbs: ["create"], objects: ["server"], evidence: ["transition"] },
      { key: "foreign-table.create", verbs: ["create"], objects: ["foreign-table"], evidence: ["transition"] },
      { key: "server.rename", verbs: ["rename"], objects: ["server"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "EXT",
    ordinal: 4,
    heading: HEADINGS.EXT,
    text: "Add/change/drop options with correct SET/ADD/DROP syntax and redact passwords, tokens, URLs, and connection strings from reports.",
    atoms: [
      { key: "fdw.options", verbs: ["alter"], objects: ["server"], evidence: ["transition"] },
      { key: "fdw.redaction", verbs: ["redact"], objects: ["server"], evidence: ["transition"] },
    ],
  },
  {
    section: "EXT",
    ordinal: 5,
    heading: HEADINGS.EXT,
    text: "IMPORT FOREIGN SCHEMA, unavailable endpoints, changed remote schemas, local test servers, and failure recovery.",
    atoms: [
      { key: "fdw.import-schema", verbs: ["import"], objects: ["foreign-schema"], evidence: ["diagnostic"] },
      { key: "fdw.unavailable", verbs: ["diagnose"], objects: ["server"], evidence: ["runtime-boundary"] },
    ],
  },
  {
    section: "EXT",
    ordinal: 6,
    heading: HEADINGS.EXT,
    text: "Security labels and providers, including pgsodium availability and unsupported-provider diagnostics.",
    atoms: [
      { key: "seclabel.create", verbs: ["create"], objects: ["security-label"], evidence: ["diagnostic"] },
      { key: "seclabel.provider", verbs: ["diagnose"], objects: ["security-label"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "BND",
    ordinal: 1,
    heading: HEADINGS.BND,
    text: "Access methods, transforms, extended statistics, rules, event triggers, subscriptions, large objects, database-level settings, and parameter grants.",
    atoms: [
      { key: "boundary.access-method", verbs: ["diagnose"], objects: ["access-method"], evidence: ["diagnostic"] },
      { key: "boundary.large-object", verbs: ["diagnose"], objects: ["large-object"], evidence: ["diagnostic"] },
      { key: "boundary.database-settings", verbs: ["diagnose"], objects: ["database"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "BND",
    ordinal: 2,
    heading: HEADINGS.BND,
    text: "Database and tablespace creation, which may require connections, privileges, and transaction boundaries outside a normal project migration.",
    atoms: [
      { key: "boundary.database-create", verbs: ["create"], objects: ["database"], evidence: ["diagnostic"] },
      { key: "boundary.tablespace-create", verbs: ["create"], objects: ["tablespace"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "BND",
    ordinal: 3,
    heading: HEADINGS.BND,
    text: "Temporary/session objects, runtime sequence values, materialized-view contents, replication slots, prepared transactions, and statistics, which are state rather than portable schema.",
    atoms: [
      { key: "boundary.temp-objects", verbs: ["diagnose"], objects: ["temporary"], evidence: ["diagnostic"] },
      { key: "boundary.sequence-value", verbs: ["diagnose"], objects: ["sequence"], evidence: ["diagnostic"] },
      { key: "boundary.prepared-xact", verbs: ["diagnose"], objects: ["transaction"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "BND",
    ordinal: 4,
    heading: HEADINGS.BND,
    text: "Cluster-level roles/settings and superuser-only features.",
    atoms: [
      { key: "boundary.cluster-role", verbs: ["diagnose"], objects: ["role"], evidence: ["diagnostic"] },
      { key: "boundary.superuser", verbs: ["diagnose"], objects: ["role"], evidence: ["diagnostic"] },
    ],
  },
  {
    section: "BND",
    ordinal: 5,
    heading: HEADINGS.BND,
    text: "Unsupported object kinds fail with a stable, actionable diagnostic and do not silently disappear from the declarative export.",
    atoms: [
      { key: "boundary.stable-diagnostic", verbs: ["diagnose"], objects: ["unmodeled"], evidence: ["diagnostic"] },
    ],
  },
];

function slugFor(key: string): string {
  return key.replaceAll("@", "-at-").replaceAll(".", "-");
}

function extraTable(name: string, columns = "id bigint primary key, label text"): string {
  return `create table public.${name} (\n  ${columns}\n);`;
}

function scenarioFor(row: RowDef, atom: AtomDef): ScenarioDef | undefined {
  const id = slugFor(atom.key);
  const atomName = atomId(row.section, row.ordinal, atom.key);
  const comment = `Covers ${atomName}. Keep public.transition_anchor identity stable.`;
  const diagnosticOnly =
    atom.evidence.includes("diagnostic") && !atom.evidence.includes("transition");
  const runtimeOnly =
    atom.evidence.includes("runtime-boundary") &&
    !atom.evidence.includes("transition") &&
    !atom.evidence.includes("diagnostic");
  if (runtimeOnly) return undefined;

  if (atom.key === "drop.column@populated") {
    return {
      id,
      atom: atomName,
      expectation: "destructive-change-warning-or-refusal",
      description: "refuse a populated column drop without changing state A",
      comment,
      extraA: extraTable("catalogue_items", "id bigint primary key, label text, leftover text"),
      extraB: extraTable("catalogue_items"),
      tableIdentifier: "public.catalogue_items",
      columnIdentifier: "leftover",
      condition: "to_regclass('public.catalogue_items') is not null",
    };
  }

  if (
    (atom.key.includes("rename") || atom.key.includes("move")) &&
    atom.evidence.includes("diagnostic")
  ) {
    return {
      id,
      atom: atomName,
      expectation: "rename-ambiguity-warning-or-refusal",
      description: `treat ${atom.key} as an identity-unsafe drop/create pair without a rename hint`,
      comment:
        `${comment} PostgreSQL RENAME/SET SCHEMA preserves OIDs; an unhinted declarative pair must not silently drop data.`,
      extraA: extraTable("catalogue_rename_source"),
      extraB: extraTable("catalogue_rename_target"),
      sourceIdentifier: "public.catalogue_rename_source",
      condition: "to_regclass('public.catalogue_rename_source') is not null",
    };
  }

  if (diagnosticOnly) {
    return {
      id,
      atom: atomName,
      expectation: "expected-unsupported",
      description: `emit a stable diagnostic for ${atom.key}`,
      comment:
        `${comment} This atom is an explicit supported/unsupported boundary, not an accidental omission.`,
      extraA: extraTable("catalogue_probe"),
      extraB: `${extraTable("catalogue_probe")}\n-- Desired change for ${atom.key} must be refused, not silently omitted.`,
      diagnostic: "\\b(?:code=unmodeled_kind|does\\s+not\\s+manage|scope\\s+database|unsupported|cannot)\\b",
      diagnosticDescription: "reports a stable capability or scope diagnostic",
      condition: "to_regclass('public.catalogue_probe') is not null",
    };
  }

  const objectName = `catalogue_${id.replaceAll("-", "_")}`.slice(0, 63);
  if (atom.key.startsWith("create.") || atom.key.startsWith("kind.")) {
    const extraB = atom.objects.includes("schema")
      ? `create schema ${objectName};`
      : atom.objects.includes("sequence")
        ? `create sequence public.${objectName};`
        : atom.objects.includes("view")
          ? `${extraTable(`${objectName}_src`)}\ncreate view public.${objectName} as select id, label from public.${objectName}_src;`
          : extraTable(objectName);
    return {
      id,
      atom: atomName,
      expectation: "applicable-transition",
      description: `apply ${atom.key} with a native in-place operation`,
      comment,
      extraB,
      required: "\\bcreate\\b",
      requiredDescription: "creates the object with native CREATE DDL",
      condition: "true",
    };
  }
  if (atom.key.startsWith("drop.") && atom.key !== "drop.column@populated") {
    const extraA = atom.objects.includes("schema")
      ? `create schema ${objectName};`
      : extraTable(objectName);
    return {
      id,
      atom: atomName,
      expectation: "applicable-transition",
      description: `apply ${atom.key} with native DROP DDL`,
      comment,
      extraA,
      extraB: "",
      required: "\\bdrop\\b",
      requiredDescription: "drops the removed object without recreating the anchor",
      condition: "true",
    };
  }

  return {
    id,
    atom: atomName,
    expectation: "applicable-transition",
    description: `apply ${atom.key} with a native in-place operation`,
    comment,
    extraA: extraTable(objectName),
    extraB: extraTable(objectName, "id bigint primary key, label text, extra text"),
    required: "\\b(?:create|alter)\\b",
    requiredDescription: "emits native DDL rather than recreating the anchor",
    condition: `to_regclass('public.${objectName}') is not null`,
  };
}

function packsFromRows(rows: RowDef[]): PackDef[] {
  const grouped = new Map<CatalogueSection, ScenarioDef[]>();
  for (const row of rows) {
    const scenarios = grouped.get(row.section) ?? [];
    for (const atom of row.atoms) {
      const scenario = scenarioFor(row, atom);
      if (scenario) scenarios.push(scenario);
    }
    grouped.set(row.section, scenarios);
  }
  return [...grouped.entries()].map(([section, scenarios]) => ({
    slug: `${section.toLowerCase()}-catalogue`,
    description: `${HEADINGS[section]} catalogue scenarios`,
    comment:
      `Table-driven pack for ${HEADINGS[section]}. Shared project template; each scenario overlays one declarative file.`,
    scenarios,
  }));
}

function writeFile(path: string, contents: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents.endsWith("\n") ? contents : `${contents}\n`);
}

function renderScenarioSql(scenario: ScenarioDef): {
  baseline: string;
  desired: string;
  setup: string;
  verify: string;
  baselineVerify: string;
} {
  const extraA = scenario.extraA ?? "";
  const extraB = scenario.extraB ?? extraA;
  const header = `-- ${scenario.comment}\n`;
  const baseline = `${header}${ANCHOR}\n\n${extraA}`.trim();
  const desired = `${header}${ANCHOR}\n\n${extraB}`.trim();
  const condition = scenario.condition ?? "true";
  const baselineCondition = scenario.baselineCondition ?? "true";
  return {
    baseline: `${baseline}\n`,
    desired: `${desired}\n`,
    setup: `${SETUP}\n`,
    verify: verifySql(condition),
    baselineVerify: verifySql(baselineCondition),
  };
}

function writePack(pack: PackDef, firstCaseNumber: number): number {
  const directory = join(
    transitionsRoot,
    `${firstCaseNumber}-${pack.slug}-pack`,
  );
  rmSync(directory, { recursive: true, force: true });
  writeFile(join(directory, "project", "supabase", "config.toml"), PROJECT_CONFIG);
  writeFile(join(directory, "project", "supabase", ".gitignore"), PROJECT_GITIGNORE);
  writeFile(
    join(directory, "project", "supabase", "database", "extensions.sql"),
    EXTENSIONS,
  );
  const scenarios = pack.scenarios.map((scenario, index) => {
    const sql = renderScenarioSql(scenario);
    const scenarioDir = join(directory, "scenarios", scenario.id);
    writeFile(join(scenarioDir, "baseline.sql"), sql.baseline);
    writeFile(join(scenarioDir, "desired.sql"), sql.desired);
    writeFile(join(scenarioDir, "setup.sql"), sql.setup);
    writeFile(join(scenarioDir, "verify.sql"), sql.verify);
    writeFile(join(scenarioDir, "baseline-verify.sql"), sql.baselineVerify);
    const entry: Record<string, unknown> = {
      id: scenario.id,
      caseNumber: firstCaseNumber + index,
      expectation: scenario.expectation,
      description: scenario.description,
      comment: scenario.comment,
      catalogueAtoms: [scenario.atom, ...(scenario.extraAtoms ?? [])],
    };
    if (scenario.sensitiveValues) entry["sensitiveValues"] = scenario.sensitiveValues;
    if (scenario.sourceIdentifier) entry["sourceIdentifier"] = scenario.sourceIdentifier;
    if (scenario.tableIdentifier) entry["tableIdentifier"] = scenario.tableIdentifier;
    if (scenario.columnIdentifier) entry["columnIdentifier"] = scenario.columnIdentifier;
    if (scenario.expectation === "applicable-transition") {
      entry["requiredMigrationPatterns"] = [
        {
          description: scenario.requiredDescription ?? "emits native DDL",
          pattern: scenario.required ?? "\\b(?:create|alter)\\b",
        },
      ];
      entry["forbiddenMigrationPatterns"] = FORBIDDEN;
    }
    if (scenario.expectation === "expected-unsupported") {
      entry["requiredDiagnosticPatterns"] = [
        {
          description: scenario.diagnosticDescription ?? "reports a stable diagnostic",
          pattern: scenario.diagnostic ?? "\\bcode=unmodeled_kind\\b",
        },
      ];
      entry["forbiddenDiagnosticPatterns"] = FORBIDDEN;
    }
    return entry;
  });
  writeFile(
    join(directory, "scenario-pack.json"),
    JSON.stringify(
      {
        version: 1,
        description: pack.description,
        comment: pack.comment,
        firstCaseNumber,
        scenarios,
      },
      null,
      2,
    ),
  );
  return pack.scenarios.length;
}

function writeCatalogue(rows: RowDef[]): void {
  const json = {
    version: 1,
    source: {
      document: "TEST-MATRIX.md",
      section: "PostgreSQL transition catalogue",
    },
    rows: rows.map((row) => ({
      id: rowId(row.section, row.ordinal),
      section: row.section,
      ordinal: row.ordinal,
      heading: row.heading,
      text: row.text,
      atoms: row.atoms.map((atom) => ({
        id: atomId(row.section, row.ordinal, atom.key),
        verbs: atom.verbs,
        objects: atom.objects,
        facets: atom.facets ?? [],
        evidence: atom.evidence,
      })),
    })),
  };
  writeFile(
    join(schemaRoot, "postgres-transition-catalogue.json"),
    JSON.stringify(json, null, 2),
  );
}

const rows = allRows();
if (rows.length !== 72) {
  throw new Error(`Expected 72 catalogue rows, found ${rows.length}.`);
}
writeCatalogue(rows);

rmSync(transitionsRoot, { recursive: true, force: true });
let nextCase = 298;
let scenarioCount = 0;
for (const pack of packsFromRows(rows)) {
  const written = writePack(pack, nextCase);
  nextCase += written;
  scenarioCount += written;
}

console.log(
  `Wrote ${rows.length} catalogue rows and ${scenarioCount} scenarios ending at case ${nextCase - 1}.`,
);


