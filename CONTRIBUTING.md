# Contributing to os-user-dirs

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm

### Getting Started

```bash
git clone https://github.com/velocitylabo/os-user-dirs.git
cd os-user-dirs
npm install
```

### Project Structure

| File | Description |
|------|-------------|
| `index.js` | Main source code (CJS) |
| `index.mjs` | ESM wrapper |
| `index.d.ts` | TypeScript type definitions |
| `test.js` | Mocha test suite |
| `test-esm.mjs` | ESM smoke test |

## Running Tests

```bash
# Run the test suite
npm test

# Run tests with coverage
npm run coverage

# Run ESM smoke test
node test-esm.mjs
```

All tests must pass before submitting a pull request.

## Pull Request Guidelines

### Before Submitting

1. Fork the repository and create a feature branch from `master`
2. Make your changes following the coding conventions below
3. Add or update tests for any new functionality
4. Update `index.d.ts` if you change the public API
5. Update `index.mjs` if you add new exports
6. Run `npm test` and `node test-esm.mjs` to verify all tests pass

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Releases are automated with release-please based on commit messages.

| Prefix | Use for | Version bump |
|--------|---------|-------------|
| `feat:` | New features | Minor |
| `fix:` | Bug fixes | Patch |
| `feat!:` / `fix!:` | Breaking changes | Major |
| `docs:` | Documentation only | None |
| `test:` | Adding or updating tests | None |
| `refactor:` | Code restructuring | None |
| `chore:` | Maintenance tasks | None |

### PR Scope

- Keep pull requests focused on a single change
- If your change requires updating multiple files (`index.js`, `index.d.ts`, `index.mjs`, `test.js`), include all of them in the same PR

## Coding Conventions

- Use `const` and `let` (no `var`)
- Use `require("node:path")` style imports (with `node:` prefix)
- Follow the existing naming patterns:
  - User directories: bare names (`downloads()`, `desktop()`)
  - Base directories: `Dir` suffix (`configDir()`, `dataDir()`)
  - Search paths: `Dirs` suffix, returns array (`configDirs()`, `dataDirs()`)
- Keep zero runtime dependencies — do not add `dependencies` to `package.json`
- Support all three platforms: Linux, macOS, and Windows

## Adding a New Directory Function

When adding a new function, update all of these files:

1. **`index.js`** — Implement the function and add `module.exports`
2. **`index.d.ts`** — Add the TypeScript type declaration with JSDoc `@example`
3. **`index.mjs`** — Re-export the function for ESM consumers
4. **`test.js`** — Add test cases covering all platforms
5. **`README.md`** — Document the function in the appropriate section

## Reporting Bugs

Please open an issue on [GitHub Issues](https://github.com/velocitylabo/os-user-dirs/issues) with:

- Node.js version and OS
- Steps to reproduce
- Expected vs actual behavior

## Security Issues

For security vulnerabilities, please see [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
