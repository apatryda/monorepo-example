---
name: create-vue-app
description: Scaffold a new Vue app as a workspace package in this monorepo. Use when asked to create/add a new Vue app or frontend package.
---

This repo is a Yarn Berry (PnP) workspace with `workspaces: ["packages/*"]`
(root [package.json](../../../package.json)). New Vue apps are added as
workspace packages under `packages/<app-name>`, following the pattern of the
existing [packages/vue-app](../../../packages/vue-app).

> **Shell note:** this repo has no committed `.yarn/releases` binary and no
> `yarnPath` in [.yarnrc.yml](../../../.yarnrc.yml) — it relies on Corepack
> reading `packageManager` from the root `package.json`. If your shell's
> `yarn` isn't on PATH, run `corepack yarn ...` instead of `yarn ...` for
> every command below.

## 1. Identify the template: this repo uses create-vuetify, not create-vue

[packages/vue-app](../../../packages/vue-app) was **not** scaffolded with
`create-vue` — its dependencies (`vuetify`, `eslint-config-vuetify`,
`vite-plugin-vuetify`, `unplugin-vue-router`, `unplugin-vue-components`,
`unplugin-auto-import`, `vite-plugin-vue-layouts-next`, `@fontsource/roboto`,
`@mdi/font`) and its `src/{pages,layouts,router,stores,plugins,styles}`
structure come from `create-vuetify`. Don't default to plain `create-vue`.

New apps are scaffolded with `create-vuetify`'s **"Full" preset**
(`eslint,pinia,i18n,mcp`) rather than matching `vue-app`'s exact feature set.
`vue-app` itself only has `eslint,pinia` — it predates `i18n`/`mcp` being
part of the template. Scaffolding with Full is a deliberate step up for new
apps, not a mismatch to fix: it adds `vue-i18n` and the `@vuetify/mcp` dev
server out of the box.

## 2. Scaffold with create-vuetify

Run from the repo root, non-interactively:

```bash
yarn dlx create-vuetify@latest \
  --name <app-name> \
  --dir packages/<app-name> \
  --preset=full \
  --router=file-router \
  --typescript \
  --packageManager yarn
```

`--preset=full` pulls in `eslint,pinia,i18n,mcp` in one go (equivalent to
`--features=eslint,pinia,i18n,mcp`). Keep `--router=file-router` and
`--typescript` explicit — that's `vue-app`'s file-based routing (via
`unplugin-vue-router`) and TypeScript usage, and the preset alone doesn't
fix those. Don't pass `--css`; `vue-app` uses plain Vuetify + Sass, not
UnoCSS or Tailwind. Omit `--install`; dependencies are installed once at the
monorepo root in step 5.

> **Version drift warning:** `create-vuetify`'s upstream template changes
> over time (e.g. it may scaffold Vuetify 4 / vue-router 5 instead of the
> Vuetify 3.10 / vue-router 4.5 this repo's `vue-app` uses, and may drop or
> change the auto-import/layouts plugins). After scaffolding, diff the new
> package's `package.json` and `vite.config.mts` against
> [packages/vue-app/package.json](../../../packages/vue-app/package.json)
> and [packages/vue-app/vite.config.mts](../../../packages/vue-app/vite.config.mts).
> Align major dependency versions (especially `vuetify`, `vue-router`,
> `vite`, `@vitejs/plugin-vue`) with what the rest of the repo already uses
> unless the task specifically calls for the newer versions. Also remove any
> newly-templated files this repo's convention doesn't carry (e.g. an
> `AGENTS.md` the generator may add) if they don't fit.

## 3. Add Pug template support

`create-vuetify` doesn't scaffold this, but `vue-app` uses `<template
lang="pug">` (see [packages/vue-app/src/App.vue](../../../packages/vue-app/src/App.vue))
and carries `pug` + `pug-plain-loader` as devDependencies for it. If the new
app should support Pug templates too, add at least `pug` — that alone is
enough for `@vue/compiler-sfc` to compile `lang="pug"` blocks under Vite:

```bash
yarn workspace @example/<app-name> add -D pug pug-plain-loader
```

Skip this step if the new app only needs plain HTML templates.

## 4. Set the package scope

The generator writes `"name": "<app-name>"`. Change it to match this repo's
scope, matching how [packages/vue-app/package.json](../../../packages/vue-app/package.json)
and [packages/nest-app/package.json](../../../packages/nest-app/package.json) do it:

```diff
-  "name": "<app-name>",
+  "name": "@example/<app-name>",
```

## 5. Install and regenerate editor SDKs

```bash
yarn install
yarn dlx @yarnpkg/sdks vscode
```

The second command refreshes `.yarn/sdks` so editor tooling resolves
correctly for the new PnP-linked package. `vue-app` itself doesn't commit a
per-package `.vscode/settings.json`, so it's not required — but if you add
one, follow [packages/nest-app/.vscode/settings.json](../../../packages/nest-app/.vscode/settings.json)'s
pattern (point `eslint.nodePath`, `prettier.prettierPath`, and
`typescript.tsdk` at `../../.yarn/sdks`).

## 6. Reference other workspace packages

To depend on another workspace package (e.g. a Nest service), use the
`workspace:` protocol:

```bash
yarn workspace @example/<app-name> add @example/<other-package>@"workspace:*"
```

## Verify

```bash
yarn workspace @example/<app-name> run lint
yarn workspace @example/<app-name> run build
```

## What not to hand-write

Once aligned with `vue-app` per the version-drift check in step 2, don't
recreate `eslint.config.js`, `tsconfig*.json`, or the plugin wiring in
`vite.config.mts` by hand — only adjust them if the task specifically calls
for different lint/build behavior than [packages/vue-app](../../../packages/vue-app) uses.
