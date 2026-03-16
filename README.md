# os-user-dirs

[![npm version](https://img.shields.io/npm/v/os-user-dirs.svg)](https://www.npmjs.com/package/os-user-dirs)
[![npm downloads](https://img.shields.io/npm/dw/os-user-dirs.svg)](https://www.npmjs.com/package/os-user-dirs)
[![CI](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml/badge.svg)](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/velocitylabo/os-user-dirs/graph/badge.svg)](https://codecov.io/gh/velocitylabo/os-user-dirs)
[![bundle size](https://img.shields.io/bundlephobia/minzip/os-user-dirs)](https://bundlephobia.com/package/os-user-dirs)
[![Node.js](https://img.shields.io/node/v/os-user-dirs.svg)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/os-user-dirs.svg)](https://github.com/velocitylabo/os-user-dirs/blob/master/LICENSE)

> All-in-one OS directory paths — user directories, XDG base directories, and app-scoped project directories — with zero dependencies.

- Node.js 20 or later

Replaces [`env-paths`](https://github.com/sindresorhus/env-paths), [`xdg-basedir`](https://github.com/sindresorhus/xdg-basedir), and [`platform-folders`](https://github.com/nicbarker/platform-folders) in a single package. CJS + ESM dual support, TypeScript included.

> **Note:** This package was previously published as [`os-downloads`](https://www.npmjs.com/package/os-downloads). The old package is deprecated — please use `os-user-dirs` instead.

## Why os-user-dirs?

| Feature | os-user-dirs | env-paths | xdg-basedir | platform-folders |
|---|:---:|:---:|:---:|:---:|
| Weekly downloads | Growing | ~30M | ~7M | ~642 |
| Last updated | **Active** | 4 years ago | 4 years ago | Low activity |
| Dependencies | **0** | 0 | 0 | C++ native |
| Platforms | **All** | All | Linux only | All |
| User directories (8) | **Yes** | - | - | Partial |
| XDG base directories (6) | **Yes** | Partial | **Yes** | Partial |
| XDG search paths | **Yes** | - | **Yes** | - |
| Project directories | **Yes** | **Yes** | - | - |
| CJS + ESM | **Both** | ESM only (v3) | ESM only (v5) | CJS |
| TypeScript | **Included** | Included | Included | - |

## Install

```console
$ npm install os-user-dirs
```

Requires Node.js 20 or later. Works on Windows, macOS, and Linux.

## Quick Start

```javascript
import { downloads, configDir, projectDirs, ensureDir } from "os-user-dirs";

// User directories
downloads();
//=> '/home/user/Downloads'

// XDG base directories
configDir();
//=> '/home/user/.config'

// App-scoped project directories (env-paths alternative)
const dirs = projectDirs("my-app");
dirs.config  //=> '/home/user/.config/my-app'
dirs.data    //=> '/home/user/.local/share/my-app'
dirs.cache   //=> '/home/user/.cache/my-app'

// Ensure directory exists before use
await ensureDir(dirs.config);
```

CommonJS is also supported:

```javascript
const { downloads, configDir, projectDirs } = require("os-user-dirs");
```

### TypeScript

Full type definitions are included. `getPath()` accepts a union type for auto-completion:

```typescript
import { getPath } from "os-user-dirs";

getPath("downloads");  // OK
getPath("desktop");    // OK
getPath("templates");  // OK
getPath("unknown");    // Type error
```

## API

> For detailed API documentation with platform-specific behavior, environment variables, and edge cases, see the **[API Reference](docs/api.md)**.

### `downloads()`
Returns the path to the Downloads directory.

### `desktop()`
Returns the path to the Desktop directory.

### `documents()`
Returns the path to the Documents directory.

### `music()`
Returns the path to the Music directory.

### `pictures()`
Returns the path to the Pictures directory.

### `videos()`
Returns the path to the Videos directory (Movies on macOS).

### `templates()`
Returns the path to the Templates directory.

### `publicshare()`
Returns the path to the Public Share directory.

### `getPath(name)`
Returns the path to the specified user directory. Valid names: `desktop`, `downloads`, `documents`, `music`, `pictures`, `videos`, `templates`, `publicshare`.

### `homeDir()`
Returns the path to the user's home directory. Uses `os.homedir()` internally.

### `binDir()`
Returns the path to the user local bin directory (`~/.local/bin` on Linux/macOS), or `null` on Windows.

### `trashDir()`
Returns the path to the user trash directory, or `null` on Windows.
- Linux: `$XDG_DATA_HOME/Trash` (default `~/.local/share/Trash`) — FreeDesktop Trash spec
- macOS: `~/.Trash`
- Windows: `null` (Recycle Bin requires Shell API)

### `applicationsDir()`
Returns the path to the user applications directory.
- Linux: `$XDG_DATA_HOME/applications` (default `~/.local/share/applications`)
- macOS: `~/Applications`
- Windows: `%APPDATA%\Microsoft\Windows\Start Menu\Programs`

### Base Directories

#### `configDir()`
Returns the path to the config directory (`~/.config` on Linux, `~/Library/Application Support` on macOS, `%APPDATA%` on Windows).

#### `dataDir()`
Returns the path to the data directory (`~/.local/share` on Linux, `~/Library/Application Support` on macOS, `%LOCALAPPDATA%` on Windows).

#### `cacheDir()`
Returns the path to the cache directory (`~/.cache` on Linux, `~/Library/Caches` on macOS, `%LOCALAPPDATA%` on Windows).

#### `stateDir()`
Returns the path to the state directory (`~/.local/state` on Linux, `~/Library/Application Support` on macOS, `%LOCALAPPDATA%` on Windows).

#### `logDir()`
Returns the path to the log directory (`~/.local/state` on Linux, `~/Library/Logs` on macOS, `%LOCALAPPDATA%` on Windows).

#### `runtimeDir()`
Returns the path to the runtime directory (`$XDG_RUNTIME_DIR` on Linux), or `null` if unavailable.

#### `fontsDir()`
Returns the path to the user fonts directory (`~/.local/share/fonts` on Linux, `~/Library/Fonts` on macOS, `%LOCALAPPDATA%/Microsoft/Windows/Fonts` on Windows). On Linux, respects `$XDG_DATA_HOME`.

#### `getBasePath(name)`
Returns the path to the specified base directory. Valid names: `config`, `data`, `cache`, `state`, `log`, `runtime`.

## Which function should I use?

| Use case | Function |
|---|---|
| Store app config files | `configDir()` or `projectDirs("my-app").config` |
| Store app data / databases | `dataDir()` or `projectDirs("my-app").data` |
| Store app cache | `cacheDir()` or `projectDirs("my-app").cache` |
| Store app logs | `logDir()` or `projectDirs("my-app").log` |
| Get user's Downloads folder | `downloads()` |
| Get user's Documents folder | `documents()` |
| Get all app-scoped dirs at once | `projectDirs("my-app")` |
| Find system-wide config locations | `configDirs()` |
| Ensure a directory exists | `ensureDir(path)` / `ensureDirSync(path)` |
| Get user's home directory | `homeDir()` |

> For the full API with platform-specific details, see the **[API Reference](docs/api.md)**.

## API Overview

### User Directories

| Function | Description |
|---|---|
| `downloads()` | Downloads directory |
| `desktop()` | Desktop directory |
| `documents()` | Documents directory |
| `music()` | Music directory |
| `pictures()` | Pictures directory |
| `videos()` | Videos directory (Movies on macOS) |
| `templates()` | Templates directory |
| `publicshare()` | Public Share directory |
| `homeDir()` | Home directory |
| `getPath(name)` | Get user directory by name |

### Base Directories (XDG)

| Function | Linux | macOS | Windows |
|---|---|---|---|
| `configDir()` | `~/.config` | `~/Library/Application Support` | `%APPDATA%` |
| `dataDir()` | `~/.local/share` | `~/Library/Application Support` | `%LOCALAPPDATA%` |
| `cacheDir()` | `~/.cache` | `~/Library/Caches` | `%LOCALAPPDATA%` |
| `stateDir()` | `~/.local/state` | `~/Library/Application Support` | `%LOCALAPPDATA%` |
| `logDir()` | `~/.local/state` | `~/Library/Logs` | `%LOCALAPPDATA%` |
| `runtimeDir()` | `$XDG_RUNTIME_DIR` | `null` | `null` |
| `getBasePath(name)` | Get base directory by name | | |

### System Search Directories

| Function | Linux | macOS | Windows |
|---|---|---|---|
| `configDirs()` | `$XDG_CONFIG_DIRS` | `["/Library/Application Support", "/Library/Preferences"]` | `[%PROGRAMDATA%]` |
| `dataDirs()` | `$XDG_DATA_DIRS` | `["/Library/Application Support"]` | `[%PROGRAMDATA%]` |

### Additional Directories

| Function | Linux | macOS | Windows |
|---|---|---|---|
| `fontsDir()` | `~/.local/share/fonts` | `~/Library/Fonts` | `%LOCALAPPDATA%/Microsoft/Windows/Fonts` |
| `binDir()` | `~/.local/bin` | `~/.local/bin` | `null` |
| `applicationsDir()` | `~/.local/share/applications` | `~/Applications` | Start Menu |
| `trashDir()` | `~/.local/share/Trash` | `~/.Trash` | `null` |

### Project Directories

```javascript
import { projectDirs } from "os-user-dirs";

// Basic usage
const dirs = projectDirs("my-app");
// => { config, data, cache, state, log, temp, runtime }

// With vendor (organization) prefix
const dirs2 = projectDirs("my-app", { vendor: "My Org" });
dirs2.config //=> '~/.config/my-org/my-app' (Linux)

// With suffix
const dirs3 = projectDirs("my-app", { suffix: "-nodejs" });
dirs3.config //=> '~/.config/my-app-nodejs'
```

### Project User Directories

```javascript
import { projectUserDirs } from "os-user-dirs";

const dirs = projectUserDirs("my-app");
// => { desktop, downloads, documents, music, pictures, videos, templates, publicshare }
dirs.downloads //=> '/home/user/Downloads/my-app'
```

### Utilities

| Function | Description |
|---|---|
| `ensureDirSync(dirPath)` | Creates directory recursively if needed (sync) |
| `ensureDir(dirPath)` | Creates directory recursively if needed (async) |
| `getXDGUserDir(key)` | Parse XDG user-dirs.dirs config |

## TypeScript

Full type definitions are included. `getPath()` and `getBasePath()` accept union types for auto-completion:

```typescript
import { getPath, getBasePath } from "os-user-dirs";

getPath("downloads");   // OK — type: string
getPath("unknown");     // Type error

getBasePath("config");  // OK — type: string
getBasePath("unknown"); // Type error
```

## Integration guides

- **[Electron Guide](docs/guide-electron.md)** — Using os-user-dirs in Electron apps: `app.getPath()` mapping, main/renderer process patterns, vendor-scoped directories
- **[Tauri Guide](docs/guide-tauri.md)** — Using os-user-dirs in Tauri apps: path API mapping, sidecar patterns, shared config with CLI companions
- **[VS Code Extension Guide](docs/guide-vscode-extension.md)** — Using os-user-dirs in VS Code extensions: `globalStorageUri` comparison, file export patterns, shared config with CLI tools
- **[CLI Tools Guide](docs/guide-cli-tools.md)** — Using `projectDirs()` with commander, yargs, and oclif for config, cache, and log management

## Migration Guides

Switching from another library? We have you covered:

- **[From xdg-basedir](docs/migration-from-xdg-basedir.md)** — API mapping, code examples (v4 CJS and v5 ESM), cross-platform benefits
- **[From env-paths](docs/migration-from-env-paths.md)** — API mapping, code examples, additional features summary

## Documentation

- [API Reference](docs/api.md) — Detailed documentation for all functions
- [Migration from xdg-basedir](docs/migration-from-xdg-basedir.md)
- [Migration from env-paths](docs/migration-from-env-paths.md)

## Migration from v2.x

### `getXDGDownloadDir()` removed

`getXDGDownloadDir()` was deprecated in v2.3.0 and has been removed in v3.0.0.

**Before (v2.x):**
```javascript
const { getXDGDownloadDir } = require("os-user-dirs");
getXDGDownloadDir(); // reads XDG user-dirs.dirs for download path
```

**After (v3.x):**
```javascript
const { downloads, getXDGUserDir } = require("os-user-dirs");
downloads();                              // recommended: cross-platform Downloads path
getXDGUserDir("XDG_DOWNLOAD_DIR");        // direct replacement if you need XDG config parsing
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, coding conventions, and pull request guidelines.

## Security

See [SECURITY.md](SECURITY.md) for the security policy and vulnerability reporting instructions.

## License

MIT
