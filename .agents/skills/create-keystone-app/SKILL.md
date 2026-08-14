---
name: create-keystone-app
description: Scaffold a new Keystone 6 (headless CMS) app under nm-packages/ in this monorepo. Use when asked to create/add a new Keystone app or CMS backend.
---

New Keystone apps live under `nm-packages/<app-name>`, following the pattern
of the existing [nm-packages/keystone-app](../../../nm-packages/keystone-app).
The [create-vue-app skill](../create-vue-app/SKILL.md) has no equivalent
"official artifact" reference for Keystone — the
[reconstructed command-history artifact](https://claude.ai/code/artifact/4471e711-0265-49b2-9db8-b7b3c85704ae)
only covers the root repo setup, NestJS services, Vue apps, and a Go proxy;
it has no Keystone section. This skill is built entirely from the real
`nm-packages/keystone-app` plus the official `create-keystone-app` CLI.

## How this differs from create-nest-app / create-vue-app

Unlike `packages/nest-app` and `packages/vue-app`, `nm-packages/keystone-app`
is **not** a member of the root Yarn workspace:

- Root [package.json](../../../package.json)'s `workspaces` field is only
  `["packages/*"]` — `nm-packages/*` isn't listed.
- `nm-packages/keystone-app` has its **own** `.yarnrc.yml`
  (`nodeLinker: node-modules`), its own `yarn.lock`, and its own
  `node_modules` — a fully standalone Yarn project, not PnP-linked into the
  root install.
- Root [.yarnrc.yml](../../../.yarnrc.yml)'s `pnpIgnorePatterns: [./nm-packages/**]`
  exists specifically so the root Yarn install doesn't try to PnP-link this
  directory — because Prisma (which Keystone uses under the hood) doesn't
  work reliably under Yarn PnP. This is the same incompatibility covered
  earlier in this project's history.
- Consequence: there's no root `yarn install` / `yarn dlx @yarnpkg/sdks vscode`
  step for a new Keystone app the way there is for `packages/*` apps — you
  install and manage it entirely from inside its own directory.
- It ships with a `Dockerfile` + `docker-entrypoint.sh` and a service entry
  in root [docker-compose.yml](../../../docker-compose.yml), since it's
  normally run containerized rather than via a root-level dev script.

## 1. Scaffold with the Keystone CLI

```bash
yarn create keystone-app nm-packages/<app-name>
```

The CLI (`create-keystone-app`, invoked here as `yarn create <pkg>` — same
`corepack yarn` shell caveat as the other two skills applies) only takes a
target directory, no feature flags.

## 2. Keep the CLI's versions — choose SQLite or Postgres

I scaffolded a fresh reference app to compare: `create-keystone-app@latest`
today produces a different stack than what's pinned in
[nm-packages/keystone-app/package.json](../../../nm-packages/keystone-app/package.json)
— newer `@keystone-6/*` majors and Prisma 7 (vs the old app's Prisma 5,
pinned exact). Don't trust specific version numbers written down here,
they'll drift; diff the freshly-scaffolded `package.json` against that file
directly to see the current gap. Two structural differences worth knowing
about, since they're easy to mistake for cruft: `next`/`react`/`react-dom`
now show up as direct dependencies — the old app doesn't need them because
its older core version bundles Next.js internally, so this isn't leftover
junk to strip out; and there's a new top-level `prisma.config.ts` that
didn't exist before.

**Default: don't downgrade anything.** Use whatever `create-keystone-app`
scaffolds. Prisma 7 replaces the old built-in native query-engine binary
with an explicit **driver adapter** per database — plausibly what actually
fixes the Prisma/PnP incompatibility noted above, since a JS driver adapter
has no native-binary-in-`node_modules` resolution problem (still not
independently verified, but no longer a reason to avoid the newer version).

Leave `schema.ts`'s `./generated/keystone/types` import, `prisma.config.ts`,
and the `.gitignore`'s `generated/` entry exactly as scaffolded — none of
that is SQLite-specific, just how this CLI version organizes generated
output. The DB provider is the one thing you do choose — see Options A/B
below.

### Fixes needed either way

Both database options below need these two — neither is DB-specific, and
I confirmed both by testing SQLite and Postgres independently:

1. Add `rxjs` as a direct dependency. It's missing from the CLI scaffold —
   without it, `yarn build` fails with
   `Module not found: Can't resolve 'rxjs/internal/Observable'` inside
   `apollo-upload-client` (pulled in by `@keystone-6/core`'s Admin UI, via
   `@keystone-6/core/dist/context-*.js`).
2. Fix the scaffolded `onConnect` auto-seed hook — it's broken as
   generated, but only against a **real** database connection, so it won't
   surface until you actually run this against a live database (neither
   `yarn build` nor `yarn dev` without a reachable DB ever execute it):
   ```diff
   -          const password = crypto.getRandomValues(new Uint8Array(16)).toHex()
   +          const password = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex')
   ```
   `Uint8Array.prototype.toHex()` isn't available on Node `v22.18.0`/`v22.23.2`
   (confirmed on both the local dev machine and the `node:22-slim` Docker
   image — `typeof new Uint8Array(1).toHex` is `undefined` on both). Without
   this fix the hook throws
   `TypeError: crypto.getRandomValues(...).toHex is not a function`, caught
   internally so the app doesn't crash, but no initial admin user is ever
   created and the Admin UI's sign-in page has no account to log in with.
   This isn't specific to that Node version — I bisected across majors and
   `toHex()` doesn't exist in **any** currently-shipping LTS: absent through
   Node 24.19.0 (the latest v24 LTS as of testing), and only actually
   appears starting in **Node v25.0.0** (via the V8 14.1 upgrade). v25 is an
   odd-numbered, non-LTS release, so this won't reach a shipping LTS until
   whatever becomes the next one (v26, expected ~October 2026) picks it up —
   bumping the Dockerfile's Node version isn't a fix here; this code-level
   fix stays necessary regardless of which current Node release is used.

### Option A — SQLite (CLI default, simplest, no external infra)

Don't touch the DB config at all. With just the two fixes above, this runs
completely standalone: `yarn install && yarn build && yarn dev` connects to
a local `keystone.db` file, syncs the schema, seeds the initial admin user,
and serves GraphQL + Admin UI — verified end-to-end locally (no Docker, no
Postgres). Good for a quick prototype or an app that doesn't need to join
this repo's shared Postgres/docker-compose setup. If you pick this option,
**skip steps 8 and "Running tests in the dockerized environment" below** —
there's no database to provision or container to wire up; "Quick local
check" is the actual full test.

### Option B — Postgres via the Prisma 7 driver adapter (matches this repo's other apps)

Pick this if the new app should join this repo's shared `postgres`
container like [nm-packages/keystone-app](../../../nm-packages/keystone-app)
does (needed for steps 8 onward).

1. Swap the DB adapter packages: remove `@prisma/adapter-better-sqlite3`
   and `better-sqlite3`, add `@prisma/adapter-pg` and `pg` instead.
2. In `keystone.ts`, change `provider: 'sqlite'` to `'postgresql'` and swap
   the adapter:
   ```diff
   -import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
   +import { PrismaPg } from '@prisma/adapter-pg'
   ```
   ```diff
   -      provider: 'sqlite',
   -      prismaClientOptions: () => ({
   -        adapter: new PrismaBetterSqlite3({ url: 'file:./keystone.db' }),
   -      }),
   +      provider: 'postgresql',
   +      prismaClientOptions: () => ({
   +        adapter: new PrismaPg({
   +          connectionString:
   +            process.env.DATABASE_URL ||
   +            'postgres://postgres:password@localhost:5432/keystone',
   +        }),
   +      }),
   ```
   Note the option key is `connectionString`, not `url` — that's specific
   to the better-sqlite3 adapter.
3. In `prisma.config.ts`, point `datasource.url` at the same Postgres
   connection string instead of `'file:./keystone.db'`.

### Alternative — match the old app's exact pinned versions

Only do this if a task specifically needs parity with
`nm-packages/keystone-app` (e.g. sharing a Prisma schema/migration
history). Downgrade instead: open
[nm-packages/keystone-app/package.json](../../../nm-packages/keystone-app/package.json)
and copy its exact `@keystone-6/core`, `@keystone-6/auth`,
`@keystone-6/fields-document`, `@prisma/client`, and `prisma` versions
(note `@prisma/client`/`prisma` are pinned exact there, not a range — match
that exactly, not with a caret). Also add `slate` + `slate-dom` at the
versions that same file pins (required for `yarn build` to succeed at that
older `@keystone-6/fields-document` version — same class of
missing-dependency issue as `rxjs` above, confirmed the same way), remove
`@prisma/adapter-pg`/`pg`/`next`/`react`/`react-dom`/`prisma.config.ts`, and
revert the `schema.ts` types import to `./.keystone/types`. This pins you
to whatever `nm-packages/keystone-app` currently has, which may itself
already be behind the latest Keystone/Prisma releases — only do it
deliberately.

## 3. Set the package scope

Unlike the Nest/Vue CLIs, `create-keystone-app` does **not** name the
package after the target directory — it always writes the literal string
`"keystone-app"` regardless of what you scaffolded into (confirmed: scaffolding
into `nm-packages/keystone-app-2` still produced `"name": "keystone-app"`).
Change it explicitly:

```diff
-  "name": "keystone-app",
+  "name": "@example/<app-name>",
```

matching [nm-packages/keystone-app/package.json](../../../nm-packages/keystone-app/package.json).

## 4. Add the Yarn linker config

The CLI doesn't generate a `.yarnrc.yml`. Add one so this app installs with
classic `node_modules` instead of inheriting PnP behavior if ever run from
a context that expects it:

```yaml
enableGlobalCache: false
nodeLinker: node-modules
```

(matches [nm-packages/keystone-app/.yarnrc.yml](../../../nm-packages/keystone-app/.yarnrc.yml))

## 5. Mark it as a standalone Yarn project, then install

`nm-packages/<app-name>` sits inside the root repo's directory tree but
isn't a workspace member (see the comparison section above). Without an
explicit marker, Yarn walks up from `nm-packages/<app-name>` and finds the
**root** repo's `package.json`/`yarn.lock` first, and `yarn install` fails
immediately:

```
Usage Error: The nearest package directory ... doesn't seem to be part of
the project declared in /home/.../monorepo-example.
```

Create an empty `yarn.lock` to fix this — it's exactly what
[nm-packages/keystone-app/yarn.lock](../../../nm-packages/keystone-app/yarn.lock)
already is (a real, populated one, but the same file that started this way):

```bash
touch nm-packages/<app-name>/yarn.lock
cd nm-packages/<app-name>
corepack yarn install
```

This creates its own populated `yarn.lock` and `node_modules` — do **not**
run this from the repo root, and there's no `@yarnpkg/sdks` regeneration
step here since this package isn't PnP-linked. Expect a wall of
`YN0068`/peer-dependency warnings referencing packages this app doesn't use
(`vue-loader`, `vite`, `@types/supertest`, ...) — that's Yarn's config
cascading up to the root [.yarnrc.yml](../../../.yarnrc.yml)'s
`packageExtensions`, harmless noise, not a problem with the new app.

## 6. Generate the Prisma/GraphQL schema once, before adding `postinstall`

```bash
corepack yarn build
```

`keystone build` generates `schema.prisma`, `schema.graphql`, and the
`.keystone/` Admin UI build **without needing a live database** — confirmed
by running it with no Postgres reachable at all. Do this **before** adding
a `postinstall` script (next step), regardless of which option you picked
in step 2: if `postinstall` runs during `yarn install` before these files
exist, it fails with `Your Prisma and GraphQL schemas are not up to date`
and takes the whole install down with it. Running `build` once first
breaks that chicken-and-egg problem.

## 7. Add the postinstall script

Now that `schema.prisma`/`schema.graphql` exist and match `keystone.ts`,
add `"postinstall": "keystone postinstall"` to `package.json` scripts (the
existing app has it) and re-run `corepack yarn install` to confirm it now
passes cleanly — this is what keeps the generated schema files in sync on
every future install.

## 8. Containerize, matching the existing app

Only applies if you chose **Option B (Postgres)** in step 2 — a SQLite app
(Option A) has no database to provision and no reason to join
docker-compose; "Quick local check" below is its real test.

Copy the pattern from [nm-packages/keystone-app/Dockerfile](../../../nm-packages/keystone-app/Dockerfile),
[docker-entrypoint.sh](../../../nm-packages/keystone-app/docker-entrypoint.sh),
and [.dockerignore](../../../nm-packages/keystone-app/.dockerignore) as-is —
don't rename the internal `/keystone-app` path the `Dockerfile` hardcodes
(`RUN mkdir /keystone-app`, `WORKDIR /keystone-app`); each service is its
own container, so every Keystone app reusing the same internal path is
fine, and rewriting it isn't necessary.

The existing `Dockerfile`'s `RUN npx prisma generate` step predates Prisma 7
and `prisma.config.ts` — `keystone build`'s own schema generation (step 6)
already produces the Prisma client, so that line may now be redundant
rather than wrong; it didn't break anything in testing.

Then:

1. **Create the database.** [docker-entrypoint-initdb.d/001_create_databases.sql](../../../docker-entrypoint-initdb.d/001_create_databases.sql)
   `CREATE DATABASE`s the existing apps' databases when the `postgres`
   container's volume is first initialized — add a line for the new app
   here too (e.g. `CREATE DATABASE example_<app-name>;`). This only runs
   on a **fresh** Postgres volume, though: if the `postgres` container
   already has data (check with `docker ps`), this script won't re-run.
   Create the database directly against the live container instead:
   ```bash
   docker exec <postgres-container-name> psql -U example -d postgres -c "CREATE DATABASE example_<app-name>;"
   ```
2. **Add the service** to root [docker-compose.yml](../../../docker-compose.yml),
   mirroring the `keystone-app` block: `build.context` → `nm-packages/<app-name>`,
   `depends_on: [postgres]`, `DATABASE_PROVIDER`/`DATABASE_URL` (pointing at
   the database from step 1) / `DATABASE_ENABLE_LOGGING` env vars, a unique
   `VIRTUAL_HOST`, a unique `image` name, the next free host port (check
   existing `ports:` entries — `keystone-app` is `3003:3000`), and the same
   volume pattern (`./nm-packages/<app-name>:/keystone-app:rw` +
   `/keystone-app/.keystone`).

Verified end-to-end against this repo's actual running `postgres` container,
not just file copies — see "Running tests in the dockerized environment"
at the end of this skill for the exact steps and expected output.

## Quick local check (optional, faster feedback)

`corepack yarn build` (already run once in step 6) confirms the app
compiles without needing a database at all, regardless of which option you
picked in step 2.

**Option A (SQLite):** `corepack yarn dev` is the real, complete test —
verified end-to-end locally: it connects to a local `keystone.db` file,
syncs the schema, runs the `onConnect` seed hook, and serves GraphQL +
Admin UI, no external services required. Confirm the same way as the
Docker section below (log lines, `curl` checks) just against
`localhost:3000` directly.

**Option B (Postgres):** `corepack yarn dev` needs a **live, reachable
Postgres** matching `DATABASE_URL`; without one it fails fast and clearly:
```
Error: P1001: Can't reach database server at `localhost:5432`
```
That's expected on its own, not a sign anything is broken — but it also
means neither `build` nor a DB-less `dev` can catch bugs that only trigger
against a real connection (see the `onConnect`/`toHex` bug in step 2, which
only surfaced once this was actually run against live Postgres). Treat this
as a fast pre-check, not a substitute for the Docker test pass below.

## What not to hand-write

`schema.ts` (`list`/`fields`/`access` API) and `auth.ts` (`createAuth`/
`withAuth`) are unchanged in the fresh scaffold — don't rewrite their
structure from scratch, follow [nm-packages/keystone-app/schema.ts](../../../nm-packages/keystone-app/schema.ts)
and [nm-packages/keystone-app/auth.ts](../../../nm-packages/keystone-app/auth.ts)
for the list/field/session conventions this repo already uses.

## Running tests in the dockerized environment (docker compose)

Only applies to **Option B (Postgres)** apps — Option A (SQLite) has no
container to test; "Quick local check" above is already its full,
verified end-to-end test.

Neither `create-keystone-app` nor `nm-packages/keystone-app` scaffolds an
automated test suite (no `jest`, no `test` script — `grep '"test' package.json`
comes back empty on the real app too). "Testing" this app means actually
running the containerized service end-to-end and checking it comes up
correctly — this is the only way earlier bugs in this skill (the
`slate`/`rxjs` build failures, the `postinstall` ordering issue, the
`onConnect`/`toHex` bug) were actually caught; `build`/`dev` alone missed
all of them.

1. **Build the image:**
   ```bash
   docker compose build <app-name>
   ```

2. **Make sure its database exists** (see step 8.1) — `docker compose up`
   will start fine even without it, but the app will fail to sync its
   schema against a database that was never created.

3. **Start it:**
   ```bash
   docker compose up -d <app-name>
   ```

4. **Check the logs for the expected startup sequence:**
   ```bash
   docker compose logs <app-name>
   ```
   A healthy instance logs, in order: `✨ Generated GraphQL and Prisma
   schemas`, `🚀 Your database is now in sync with your Prisma schema`,
   `✅ GraphQL API ready`, `Created initial user: admin@example.com /
   <password>`, `✅ Admin UI ready`. Any `TypeError`, `P1001`, or missing
   "Created initial user" line means something's wrong — check the
   version-drift and `onConnect` fixes in step 2 first.

5. **Smoke-test the actual endpoints:**
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:<port>/
   # expect 302 (redirect to sign-in — confirms Admin UI is serving)

   curl -s -X POST http://localhost:<port>/api/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"query { __typename }"}'
   # expect {"data":{"__typename":"Query"}}
   ```

6. **Tear down when done:**
   ```bash
   docker compose down <app-name>
   ```
   This stops and removes the container but leaves the built image and
   database behind. If the app was only ever a throwaway test, also:
   ```bash
   docker rmi example-<app-name>
   docker exec <postgres-container-name> psql -U example -d postgres -c "DROP DATABASE example_<app-name>;"
   ```
   and remove the `nm-packages/<app-name>` directory, its
   `docker-compose.yml` service block, and its line in
   `docker-entrypoint-initdb.d/001_create_databases.sql`.
