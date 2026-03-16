# VS Code Extension Integration Guide

[os-user-dirs](https://github.com/velocitylabo/os-user-dirs) provides cross-platform directory paths for [VS Code](https://code.visualstudio.com/) extension development. This guide covers how os-user-dirs complements VS Code's built-in storage APIs and when to use each approach.

## Why use os-user-dirs with VS Code extensions?

VS Code provides `ExtensionContext` storage APIs, but they have limitations:

- **Scoped to VS Code** — `globalStorageUri` and `storageUri` point to VS Code's internal directories, not standard OS locations
- **Not shareable** — other tools (CLI, Electron apps) cannot easily locate VS Code's extension storage
- **No user directories** — VS Code has no API for Downloads, Documents, Desktop, etc.
- **Requires activation context** — storage URIs are only available after extension activation

os-user-dirs fills these gaps by providing standard OS directory paths that work alongside VS Code's storage.

## API mapping: VS Code storage vs os-user-dirs

| VS Code API | os-user-dirs equivalent | Use case |
|---|---|---|
| `context.globalStorageUri` | `projectDirs(extName).data` | Extension data (VS Code-managed vs OS-standard) |
| `context.storageUri` | *(no equivalent)* | Workspace-scoped storage (VS Code-specific) |
| `context.logUri` | `projectDirs(extName).log` | Extension logs |
| `context.extensionUri` | *(no equivalent)* | Extension install path (VS Code-specific) |
| *(not available)* | `downloads()` | User's Downloads directory |
| *(not available)* | `documents()` | User's Documents directory |
| *(not available)* | `desktop()` | User's Desktop directory |
| *(not available)* | `configDir()` | System config directory |
| *(not available)* | `cacheDir()` | System cache directory |
| *(not available)* | `homeDir()` | User's home directory |

### When to use `globalStorageUri` vs os-user-dirs

| Scenario | Recommended | Reason |
|---|---|---|
| Extension-internal database | `globalStorageUri` | VS Code manages lifecycle and cleanup |
| User-facing file export | os-user-dirs (`downloads()`, `documents()`) | Files should go to standard OS locations |
| Shared config with CLI tool | os-user-dirs (`projectDirs()`) | CLI tools cannot access VS Code storage |
| Cache that survives VS Code uninstall | os-user-dirs (`projectDirs(name).cache`) | `globalStorageUri` is cleaned up on uninstall |
| Temporary files | os-user-dirs (`projectDirs(name).temp`) | Standard temp directory |

## Common patterns

### Exporting files to user directories

```js
const vscode = require('vscode');
const path = require('node:path');
const fs = require('node:fs');
const { downloads, documents, ensureDirSync } = require('os-user-dirs');

async function exportToDownloads(content, filename) {
  const dir = downloads();
  ensureDirSync(dir);
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content);
  const uri = vscode.Uri.file(filePath);
  vscode.window.showInformationMessage(`Exported to ${filePath}`);
  return uri;
}

async function exportToDocuments(content, filename) {
  const dir = documents();
  ensureDirSync(dir);
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}
```

### Shared configuration with CLI companion

When your extension has a companion CLI tool, both should use the same config location:

```js
// shared/paths.js — used by both VS Code extension and CLI tool
const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('my-tool');
module.exports = { dirs };
```

**VS Code extension:**

```js
const vscode = require('vscode');
const path = require('node:path');
const fs = require('node:fs');
const { dirs } = require('./shared/paths');
const { ensureDirSync } = require('os-user-dirs');

function activate(context) {
  const configPath = path.join(dirs.config, 'settings.json');

  const cmd = vscode.commands.registerCommand('my-tool.showConfig', () => {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      vscode.window.showInformationMessage(JSON.stringify(config));
    } catch {
      vscode.window.showWarningMessage('No config found');
    }
  });

  const saveCmd = vscode.commands.registerCommand('my-tool.saveConfig', async () => {
    ensureDirSync(dirs.config);
    fs.writeFileSync(configPath, JSON.stringify({ initialized: true }, null, 2));
    vscode.window.showInformationMessage(`Config saved to ${configPath}`);
  });

  context.subscriptions.push(cmd, saveCmd);
}

module.exports = { activate };
```

**CLI tool:**

```js
// Reads the same config as the VS Code extension
const path = require('node:path');
const fs = require('node:fs');
const { dirs } = require('./shared/paths');

const configPath = path.join(dirs.config, 'settings.json');
try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('Config:', config);
} catch {
  console.log('No config found. Run the VS Code extension to initialize.');
}
```

### Cache management

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-extension');

function getCached(key) {
  try {
    const file = path.join(dirs.cache, `${key}.json`);
    const stat = fs.statSync(file);
    // Invalidate after 1 hour
    if (Date.now() - stat.mtimeMs > 3600000) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function setCache(key, data) {
  ensureDirSync(dirs.cache);
  const file = path.join(dirs.cache, `${key}.json`);
  fs.writeFileSync(file, JSON.stringify(data));
}
```

### Log files outside VS Code

VS Code's `context.logUri` stores logs in VS Code's internal directory. For logs that should be accessible by other tools:

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-extension');

function log(message) {
  ensureDirSync(dirs.log);
  const logFile = path.join(dirs.log, 'debug.log');
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, line);
}
```

## Vendor-scoped directories

For extensions published under an organization:

```js
const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('my-extension', { vendor: 'my-org' });

dirs.config;
//=> '~/.config/my-org/my-extension'                      (Linux)
//=> '~/Library/Application Support/my-org/my-extension'   (macOS)
//=> '%APPDATA%/my-org/my-extension/Config'                (Windows)
```

## Best practices

1. **Use `globalStorageUri` for extension-internal state** — VS Code manages its lifecycle and cleanup on uninstall
2. **Use os-user-dirs for user-facing files** — exports, downloads, and shared config belong in standard OS locations
3. **Use `projectDirs()` for shared CLI/extension config** — ensures both tools resolve to the same directories
4. **Call `ensureDirSync()` before writing** — directories may not exist on first use
5. **Avoid hardcoding paths** — let os-user-dirs handle platform differences
