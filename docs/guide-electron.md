# Electron Integration Guide

[os-user-dirs](https://github.com/velocitylabo/os-user-dirs) integrates naturally with Electron apps for managing user and application directories. This guide covers how os-user-dirs maps to Electron's built-in `app.getPath()`, when to use each, and practical patterns for main and renderer processes.

## Why use os-user-dirs with Electron?

Electron's `app.getPath()` covers common paths but has limitations:

- **Only available after `app.ready`** — os-user-dirs works immediately at require/import time
- **No project-scoped directories** — os-user-dirs provides `projectDirs()` with vendor support
- **No user directories** — Electron doesn't provide `Downloads`, `Templates`, etc. as named getters
- **Renderer process restrictions** — `app.getPath()` requires IPC from the renderer; os-user-dirs works directly in any process

## API mapping: `app.getPath()` vs os-user-dirs

| Electron `app.getPath(name)` | os-user-dirs equivalent | Notes |
|---|---|---|
| `app.getPath('home')` | `homeDir()` | Identical |
| `app.getPath('appData')` | `configDir()` | Same on macOS/Windows; on Linux Electron uses `~/.config` |
| `app.getPath('userData')` | `projectDirs(app.name).config` | Electron scopes to app name automatically |
| `app.getPath('temp')` | `projectDirs(app.name).temp` | os-user-dirs scopes to app name |
| `app.getPath('desktop')` | `desktop()` | Identical |
| `app.getPath('documents')` | `documents()` | Identical |
| `app.getPath('downloads')` | `downloads()` | Identical |
| `app.getPath('music')` | `music()` | Identical |
| `app.getPath('pictures')` | `pictures()` | Identical |
| `app.getPath('videos')` | `videos()` | Identical |
| `app.getPath('logs')` | `projectDirs(app.name).log` | os-user-dirs scopes to app name |
| `app.getPath('cache')` | `projectDirs(app.name).cache` | os-user-dirs scopes to app name |
| *(not available)* | `dataDir()` | XDG data directory |
| *(not available)* | `stateDir()` | XDG state directory |
| *(not available)* | `runtimeDir()` | XDG runtime directory |
| *(not available)* | `fontsDir()` | User fonts directory |
| *(not available)* | `trashDir()` | User trash directory |

## Main process usage

In the main process, os-user-dirs can be used before `app.ready`:

```js
const { projectDirs, ensureDirSync } = require('os-user-dirs');

// Available immediately — no need to wait for app.ready
const dirs = projectDirs('my-electron-app', { vendor: 'My Company' });

// Ensure directories exist at startup
ensureDirSync(dirs.config);
ensureDirSync(dirs.data);
ensureDirSync(dirs.cache);
ensureDirSync(dirs.log);
```

### Configuration file management

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-electron-app');
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

### Log file management

```js
const path = require('node:path');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-electron-app');
const logPath = path.join(dirs.log, 'app.log');
ensureDirSync(dirs.log);

// Use with electron-log or any logger
// electronLog.transports.file.resolvePathFn = () => logPath;
```

## Renderer process usage (with preload)

In the renderer process, expose directory paths through the preload script:

### preload.js

```js
const { contextBridge } = require('electron');
const { projectDirs, downloads, documents } = require('os-user-dirs');

const dirs = projectDirs('my-electron-app');

contextBridge.exposeInMainWorld('appPaths', {
  config: dirs.config,
  data: dirs.data,
  cache: dirs.cache,
  downloads: downloads(),
  documents: documents(),
});
```

### renderer.js

```js
// Access paths without IPC
console.log(window.appPaths.config);
console.log(window.appPaths.downloads);
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

This is useful when your organization ships multiple Electron apps that share configuration or data.

## When to use `app.getPath()` vs os-user-dirs

| Scenario | Recommended |
|---|---|
| Standard Electron paths (userData, logs) | `app.getPath()` — Electron manages these |
| App-scoped directories with vendor support | `projectDirs()` — more flexible |
| User directories (Downloads, Desktop) | Either works; os-user-dirs available before `app.ready` |
| Before `app.ready` initialization | os-user-dirs — no timing dependency |
| Shared config across Electron + CLI tool | os-user-dirs — consistent paths in both contexts |
| Renderer process paths (no IPC) | os-user-dirs via preload |
