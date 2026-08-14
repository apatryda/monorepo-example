---
name: create-nest-app
description: Scaffold a new NestJS app as a workspace package in this monorepo. Use when asked to create/add a new NestJS app, service, or package.
---

This repo is a Yarn Berry (PnP) workspace with `workspaces: ["packages/*"]`
(root [package.json](../../../package.json)). New NestJS apps are added as
workspace packages under `packages/<app-name>`, following the pattern of the
existing [packages/nest-app](../../../packages/nest-app).

> **Shell note:** this repo has no committed `.yarn/releases` binary and no
> `yarnPath` in [.yarnrc.yml](../../../.yarnrc.yml) — it relies on Corepack
> reading `packageManager` from the root `package.json`. If your shell's
> `yarn` isn't on PATH, run `corepack yarn ...` instead of `yarn ...` for
> every command below.

## 1. Scaffold with the Nest CLI

Run this from the repo root. Use `--skip-git` and `--skip-install` because git
init and dependency install happen once at the monorepo root, not per package:

```bash
yarn dlx @nestjs/cli new <app-name> \
  --directory packages/<app-name> \
  --package-manager yarn \
  --skip-git \
  --skip-install
```

> **PnP note:** `nm-packages/` is a separate top-level workspace root that is
> excluded from PnP resolution (`pnpIgnorePatterns` in
> [.yarnrc.yml](../../../.yarnrc.yml)) because some of its dependencies
> (e.g. Prisma) don't work under PnP. Only scaffold there instead of
> `packages/` if the new app needs a dependency known to be PnP-incompatible.

## 2. Set the package scope

The generator writes `"name": "<app-name>"`. Change it to match this repo's
scope, matching how [packages/nest-app/package.json](../../../packages/nest-app/package.json)
does it:

```diff
-  "name": "<app-name>",
+  "name": "@example/<app-name>",
```

Leave `"private": true` and `"license": "UNLICENSED"` as generated.

## 3. Install and regenerate editor SDKs

```bash
yarn install
yarn dlx @yarnpkg/sdks vscode
```

The second command refreshes `.yarn/sdks` and is needed whenever a new
PnP-linked package with its own TypeScript/ESLint/Prettier is added, so
editor tooling (`typescript.tsdk`, `eslint.nodePath`, etc.) resolves
correctly for the new package. Compare the new package's
`.vscode/settings.json` against
[packages/nest-app/.vscode/settings.json](../../../packages/nest-app/.vscode/settings.json)
— in particular `jest.jestCommandLine` should reference the new package's
workspace name (`yarn workspace @example/<app-name> run jest`).

## 4. Reference dependencies between packages

To depend on another workspace package (e.g. a shared service), use the
`workspace:` protocol:

```bash
yarn workspace @example/<app-name> add @example/<other-package>@"workspace:*"
```

## Verify

```bash
yarn workspace @example/<app-name> run lint
yarn workspace @example/<app-name> run build
yarn workspace @example/<app-name> run test
```

## What not to hand-write

The scaffold already generates a working `eslint.config.mjs` (flat config,
`typescript-eslint` + `eslint-plugin-prettier`), `.prettierrc`, `tsconfig.json`,
`tsconfig.build.json`, and `nest-cli.json` — do not recreate these by hand,
only adjust them if the task specifically calls for different lint/compiler
rules than [packages/nest-app](../../../packages/nest-app) uses.
