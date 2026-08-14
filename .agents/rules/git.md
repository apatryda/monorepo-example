# Git Version Control Rules

## Commits

Commits should follow the rules of [Conventional Commits](../../docs/conventional-commits.md).

### Commit Type

Must be one of the following:

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

### Scope

is defined by the package name (in kebab case), so changes should be grouped by package. Package-less changes (like these in the root of the repository) should have no scope.
