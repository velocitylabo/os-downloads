# Tauri Integration Guide

[os-user-dirs](https://github.com/velocitylabo/os-user-dirs) provides cross-platform directory paths for [Tauri](https://tauri.app/) applications. This guide covers how os-user-dirs maps to Tauri v2's path API and when to use each approach in your frontend JavaScript code.

## Why use os-user-dirs with Tauri?

Tauri v2 provides a `@tauri-apps/api/path` module for resolving platform directories, but it has limitations from the frontend perspective:

- **Async-only API** — all Tauri path functions return Promises; os-user-dirs provides synchronous access
- **Requires Tauri runtime** — paths are unavailable during SSR, testing, or in non-Tauri contexts; os-user-dirs works anywhere Node.js runs
- **No project-scoped directories** — Tauri resolves base directories but doesn't scope them per-app with a single call; os-user-dirs provides `projectDirs()` with vendor support
- **IPC overhead** — each Tauri path call crosses the IPC bridge; os-user-dirs resolves paths directly in the Node.js process

## API mapping: Tauri v2 path API vs os-user-dirs

| Tauri v2 (`@tauri-apps/api/path`) | os-user-dirs equivalent | Notes |
|---|---|---|
| `homeDir()` | `homeDir()` | Identical |
| `desktopDir()` | `desktop()` | Identical |
| `downloadDir()` | `downloads()` | Identical |
| `documentDir()` | `documents()` | Identical |
| `audioDir()` | `music()` | Same directory, different name |
| `pictureDir()` | `pictures()` | Identical |
| `videoDir()` | `videos()` | Identical |
| `templateDir()` | `templates()` | Identical |
| `publicDir()` | `publicshare()` | Identical |
| `appConfigDir()` | `projectDirs(appName).config` | os-user-dirs requires explicit app name |
| `appDataDir()` | `projectDirs(appName).data` | os-user-dirs requires explicit app name |
| `appCacheDir()` | `projectDirs(appName).cache` | os-user-dirs requires explicit app name |
| `appLogDir()` | `projectDirs(appName).log` | os-user-dirs requires explicit app name |
| `appLocalDataDir()` | `dataDir()` | Base data directory without app scope |
| `tempDir()` | `projectDirs(appName).temp` | os-user-dirs scopes to app name |
| `fontDir()` | `fontsDir()` | Identical |
| `runtimeDir()` | `runtimeDir()` | Identical |
| *(not available)* | `stateDir()` | XDG state directory |
| *(not available)* | `binDir()` | User local bin directory |
| *(not available)* | `trashDir()` | User trash directory |
| *(not available)* | `applicationsDir()` | User applications directory |
| *(not available)* | `configDirs()` / `dataDirs()` | System-wide search paths |
| *(not available)* | `projectUserDirs(name)` | App-scoped user directories |

## Sidecar and CLI companion usage

Tauri's sidecar feature lets you bundle a Node.js process alongside your app. os-user-dirs is ideal for this scenario:

```js
const { projectDirs, ensureDirSync } = require('os-user-dirs');

// Sidecar process — no Tauri runtime needed
const dirs = projectDirs('my-tauri-app');

ensureDirSync(dirs.config);
ensureDirSync(dirs.data);
ensureDirSync(dirs.cache);
```

### Configuration management in sidecar

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-tauri-app');
const configPath = path.join(dirs.config, 'settings.json');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return {};
  }
}

function saveConfig(config) {
  ensureDirSync(dirs.config);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
```

## Preload scripts and build tools

When using Tauri with a Node.js-based build tool (Vite, webpack), os-user-dirs can resolve paths at build time:

```js
// vite.config.js
import { defineConfig } from 'vite';
import { projectDirs } from 'os-user-dirs';

const dirs = projectDirs('my-tauri-app');

export default defineConfig({
  define: {
    __APP_CONFIG_DIR__: JSON.stringify(dirs.config),
    __APP_DATA_DIR__: JSON.stringify(dirs.data),
  },
});
```

> **Note:** Build-time resolved paths are static and reflect the build machine's platform. This pattern is best suited for development tooling, not for production path resolution in cross-platform apps.

## Shared config between Tauri app and CLI tool

If you ship both a Tauri desktop app and a CLI tool, os-user-dirs ensures consistent paths:

```js
// shared/paths.js — used by both Tauri sidecar and CLI
const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('my-app', { vendor: 'My Company' });

module.exports = { dirs };

// CLI tool reads the same config as the Tauri app
// Tauri sidecar reads the same config as the CLI tool
```

## Vendor-scoped directories

For organization-scoped apps, use the `vendor` option:

```js
const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('my-app', { vendor: 'My Company' });

dirs.config;
//=> '~/.config/my-company/my-app'           (Linux)
//=> '~/Library/Application Support/My Company/my-app'  (macOS)
//=> '%APPDATA%/My Company/my-app/Config'               (Windows)
```

## When to use Tauri path API vs os-user-dirs

| Scenario | Recommended |
|---|---|
| Frontend (webview) path resolution | Tauri path API — designed for IPC |
| Sidecar / background Node.js process | os-user-dirs — no Tauri runtime needed |
| Build-time path resolution | os-user-dirs — works in Node.js tooling |
| Shared config with CLI companion | os-user-dirs — consistent paths across contexts |
| Testing without Tauri runtime | os-user-dirs — no IPC dependency |
| App-scoped directories with vendor | os-user-dirs — `projectDirs()` is more flexible |
| User directories in frontend | Tauri path API — already integrated |
