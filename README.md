# os-user-dirs [![CI](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml/badge.svg)](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml)

Get OS-specific user directories (Downloads, Desktop, Documents, etc.) and XDG base directories (config, data, cache, state, log, runtime) with zero dependencies. Also provides `projectDirs()` for app-scoped directories (similar to `env-paths`).

> **Note:** This package was previously published as [`os-downloads`](https://www.npmjs.com/package/os-downloads). The old package is deprecated — please use `os-user-dirs` instead.

## Supported platforms

- Windows
- macOS
- Linux (with XDG user-dirs.dirs support)

## Install

```console
$ npm install os-user-dirs
```

## Usage

### ESM (recommended)

```javascript
import { downloads, desktop, documents, music, pictures, videos, templates, publicshare, getPath } from "os-user-dirs";

downloads();
//=> '/home/user/Downloads'

desktop();
//=> '/home/user/Desktop'

templates();
//=> '/home/user/Templates'

publicshare();
//=> '/home/user/Public'

getPath("music");
//=> '/home/user/Music'
```

#### Base directories

```javascript
import { configDir, dataDir, cacheDir, stateDir, logDir, runtimeDir, getBasePath } from "os-user-dirs";

configDir();
//=> '/home/user/.config'

dataDir();
//=> '/home/user/.local/share'

cacheDir();
//=> '/home/user/.cache'

stateDir();
//=> '/home/user/.local/state'

logDir();
//=> '/home/user/.local/state' (Linux), '~/Library/Logs' (macOS)

runtimeDir();
//=> '/run/user/1000' (or null)

getBasePath("config");
//=> '/home/user/.config'
```

#### System search directories

```javascript
import { configDirs, dataDirs } from "os-user-dirs";

configDirs();
//=> ['/etc/xdg'] (Linux)
//=> ['/Library/Application Support', '/Library/Preferences'] (macOS)
//=> ['C:\\ProgramData'] (Windows)

dataDirs();
//=> ['/usr/local/share', '/usr/share'] (Linux)
//=> ['/Library/Application Support'] (macOS)
//=> ['C:\\ProgramData'] (Windows)
```

#### Project directories

```javascript
import { projectDirs } from "os-user-dirs";

const dirs = projectDirs("my-app");
dirs.config  //=> '/home/user/.config/my-app'
dirs.data    //=> '/home/user/.local/share/my-app'
dirs.cache   //=> '/home/user/.cache/my-app'
dirs.state   //=> '/home/user/.local/state/my-app'
dirs.log     //=> '/home/user/.local/state/my-app'
dirs.temp    //=> '/tmp/my-app'
dirs.runtime //=> '/run/user/1000/my-app' (or null)

// With suffix option
const dirs2 = projectDirs("my-app", { suffix: "-nodejs" });
dirs2.config //=> '/home/user/.config/my-app-nodejs'
```

### CommonJS

```javascript
const { downloads, desktop, documents, music, pictures, videos, templates, publicshare, getPath } = require("os-user-dirs");

downloads();
//=> '/home/user/Downloads'
```

### Default export (backward compatibility)

```javascript
// ESM
import downloads from "os-user-dirs";

// CommonJS
const downloads = require("os-user-dirs");

downloads();
//=> '/home/user/Downloads'
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

### `binDir()`
Returns the path to the user local bin directory (`~/.local/bin` on Linux/macOS), or `null` on Windows.

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

#### `getBasePath(name)`
Returns the path to the specified base directory. Valid names: `config`, `data`, `cache`, `state`, `log`, `runtime`.

### System Search Directories

#### `configDirs()`
Returns the system config directory search path list (`string[]`). On Linux, reads `$XDG_CONFIG_DIRS` (default: `["/etc/xdg"]`). On macOS: `["/Library/Application Support", "/Library/Preferences"]`. On Windows: `[%PROGRAMDATA%]`.

#### `dataDirs()`
Returns the system data directory search path list (`string[]`). On Linux, reads `$XDG_DATA_DIRS` (default: `["/usr/local/share", "/usr/share"]`). On macOS: `["/Library/Application Support"]`. On Windows: `[%PROGRAMDATA%]`.

### Project Directories

#### `projectDirs(name, options?)`
Returns an object with app-scoped directories for the given application name. This is a zero-dependency alternative to [`env-paths`](https://github.com/sindresorhus/env-paths).

**Parameters:**
- `name` (string) — Application name
- `options.suffix` (string, optional) — Suffix appended to the app name (e.g. `"-nodejs"`)

**Returns:** `{ config, data, cache, state, log, temp, runtime }`

On Windows, each directory uses a subdirectory structure (e.g. `%LOCALAPPDATA%/my-app/Config`, `%LOCALAPPDATA%/my-app/Data`).

## License

MIT
