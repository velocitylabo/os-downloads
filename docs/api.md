# API Reference

Full API reference for **os-user-dirs**. For quick start examples, see the [README](../README.md).

## Table of Contents

- [Default Export](#default-export)
- [User Directory Functions](#user-directory-functions)
- [XDG Base Directory Functions](#xdg-base-directory-functions)
- [XDG Search Path Functions](#xdg-search-path-functions)
- [Additional Directory Functions](#additional-directory-functions)
- [Project Directory Functions](#project-directory-functions)
- [Utility Functions](#utility-functions)
- [Functions That May Return `null`](#functions-that-may-return-null)
- [Edge Cases](#edge-cases)

---

## Default Export

The default export is the `downloads` function, providing backward compatibility with the original `os-downloads` package.

**Signature:**

```typescript
declare const osUserDirs: typeof downloads & { /* all named exports */ };
export default osUserDirs;
```

**Usage:**

```javascript
// CJS — calling the default export returns the Downloads path
const osUserDirs = require("os-user-dirs");
osUserDirs(); //=> '/home/user/Downloads'

// All named exports are also available on the default export
osUserDirs.desktop();   //=> '/home/user/Desktop'
osUserDirs.configDir(); //=> '/home/user/.config'

// ESM — named imports recommended
import { downloads, configDir } from "os-user-dirs";
```

> **Note:** For new projects, prefer named imports (`import { downloads } from "os-user-dirs"`) for clarity.

---

## User Directory Functions

Functions that return standard user directories (Desktop, Downloads, Documents, etc.).

On Linux, these functions first check `~/.config/user-dirs.dirs` for XDG user directory overrides. On all platforms, they fall back to OS-specific defaults.

### `desktop()`

Returns the path to the Desktop directory.

**Signature:**

```typescript
function desktop(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Desktop` (or XDG override) |
| macOS | `~/Desktop` |
| Windows | `~\Desktop` |

**Example:**

```javascript
// ESM
import { desktop } from "os-user-dirs";
desktop(); //=> '/home/user/Desktop'

// CJS
const { desktop } = require("os-user-dirs");
desktop(); //=> '/home/user/Desktop'
```

### `downloads()`

Returns the path to the Downloads directory.

**Signature:**

```typescript
function downloads(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Downloads` (or XDG override) |
| macOS | `~/Downloads` |
| Windows | `~\Downloads` |

**Example:**

```javascript
import { downloads } from "os-user-dirs";
downloads(); //=> '/home/user/Downloads'
```

### `documents()`

Returns the path to the Documents directory.

**Signature:**

```typescript
function documents(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Documents` (or XDG override) |
| macOS | `~/Documents` |
| Windows | `~\Documents` |

**Example:**

```javascript
import { documents } from "os-user-dirs";
documents(); //=> '/home/user/Documents'
```

### `music()`

Returns the path to the Music directory.

**Signature:**

```typescript
function music(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Music` (or XDG override) |
| macOS | `~/Music` |
| Windows | `~\Music` |

**Example:**

```javascript
import { music } from "os-user-dirs";
music(); //=> '/home/user/Music'
```

### `pictures()`

Returns the path to the Pictures directory.

**Signature:**

```typescript
function pictures(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Pictures` (or XDG override) |
| macOS | `~/Pictures` |
| Windows | `~\Pictures` |

**Example:**

```javascript
import { pictures } from "os-user-dirs";
pictures(); //=> '/home/user/Pictures'
```

### `videos()`

Returns the path to the Videos directory (Movies on macOS).

**Signature:**

```typescript
function videos(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Videos` (or XDG override) |
| macOS | `~/Movies` |
| Windows | `~\Videos` |

**Example:**

```javascript
import { videos } from "os-user-dirs";
videos(); //=> '/home/user/Videos'
```

### `templates()`

Returns the path to the Templates directory.

**Signature:**

```typescript
function templates(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Templates` (or XDG override) |
| macOS | `~/Templates` |
| Windows | `~\Templates` |

**Example:**

```javascript
import { templates } from "os-user-dirs";
templates(); //=> '/home/user/Templates'
```

### `publicshare()`

Returns the path to the Public Share directory.

**Signature:**

```typescript
function publicshare(): string
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/Public` (or XDG override) |
| macOS | `~/Public` |
| Windows | `~\Public` |

**Example:**

```javascript
import { publicshare } from "os-user-dirs";
publicshare(); //=> '/home/user/Public'
```

### `getPath(name)`

Returns the path to the specified user directory.

**Signature:**

```typescript
type DirName = "desktop" | "downloads" | "documents" | "music" | "pictures" | "videos" | "templates" | "publicshare";

function getPath(name: DirName): string
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `DirName` | User directory name |

**Throws:** `Error` if `name` is not a valid directory name.

**Example:**

```javascript
import { getPath } from "os-user-dirs";
getPath("downloads"); //=> '/home/user/Downloads'
getPath("desktop");   //=> '/home/user/Desktop'
```

---

## XDG Base Directory Functions

Functions that return XDG Base Directory Specification paths. On Linux, these respect `$XDG_*` environment variables. On macOS and Windows, they return platform-appropriate equivalents.

### `configDir()`

Returns the path to the user config directory.

**Signature:**

```typescript
function configDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_CONFIG_HOME` | `~/.config` |
| macOS | — | `~/Library/Application Support` |
| Windows | `%APPDATA%` | `~\AppData\Roaming` |

**Example:**

```javascript
import { configDir } from "os-user-dirs";
configDir(); //=> '/home/user/.config'
```

### `dataDir()`

Returns the path to the user data directory.

**Signature:**

```typescript
function dataDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_DATA_HOME` | `~/.local/share` |
| macOS | — | `~/Library/Application Support` |
| Windows | `%LOCALAPPDATA%` | `~\AppData\Local` |

**Example:**

```javascript
import { dataDir } from "os-user-dirs";
dataDir(); //=> '/home/user/.local/share'
```

### `cacheDir()`

Returns the path to the user cache directory.

**Signature:**

```typescript
function cacheDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_CACHE_HOME` | `~/.cache` |
| macOS | — | `~/Library/Caches` |
| Windows | `%LOCALAPPDATA%` | `~\AppData\Local` |

**Example:**

```javascript
import { cacheDir } from "os-user-dirs";
cacheDir(); //=> '/home/user/.cache'
```

### `stateDir()`

Returns the path to the user state directory.

**Signature:**

```typescript
function stateDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_STATE_HOME` | `~/.local/state` |
| macOS | — | `~/Library/Application Support` |
| Windows | `%LOCALAPPDATA%` | `~\AppData\Local` |

**Example:**

```javascript
import { stateDir } from "os-user-dirs";
stateDir(); //=> '/home/user/.local/state'
```

### `logDir()`

Returns the path to the log directory.

**Signature:**

```typescript
function logDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_STATE_HOME` | `~/.local/state` |
| macOS | — | `~/Library/Logs` |
| Windows | `%LOCALAPPDATA%` | `~\AppData\Local` |

> **Note:** On Linux, `logDir()` uses the same path as `stateDir()` following XDG conventions. On macOS, it uses the dedicated `~/Library/Logs` directory.

**Example:**

```javascript
import { logDir } from "os-user-dirs";
logDir(); //=> '/home/user/.local/state'  (Linux)
logDir(); //=> '/Users/user/Library/Logs' (macOS)
```

### `runtimeDir()`

Returns the path to the XDG runtime directory, or `null` if unavailable.

**Signature:**

```typescript
function runtimeDir(): string | null
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_RUNTIME_DIR` | `null` (no default) |
| macOS | — | `null` |
| Windows | — | `null` |

> **Note:** On Linux, the runtime directory is typically set by the login manager (e.g. `/run/user/1000`). If `$XDG_RUNTIME_DIR` is not set, this function returns `null`.

**Example:**

```javascript
import { runtimeDir } from "os-user-dirs";
runtimeDir(); //=> '/run/user/1000' (or null)
```

### `getBasePath(name)`

Returns the path to the specified base directory.

**Signature:**

```typescript
type BaseDirName = "config" | "data" | "cache" | "state" | "log" | "runtime";

function getBasePath(name: "config"): string;
function getBasePath(name: "data"): string;
function getBasePath(name: "cache"): string;
function getBasePath(name: "state"): string;
function getBasePath(name: "log"): string;
function getBasePath(name: "runtime"): string | null;
function getBasePath(name: BaseDirName): string | null;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `BaseDirName` | Base directory name |

**Throws:** `Error` if `name` is not a valid base directory name.

**Example:**

```javascript
import { getBasePath } from "os-user-dirs";
getBasePath("config"); //=> '/home/user/.config'
getBasePath("runtime"); //=> '/run/user/1000' (or null)
```

---

## XDG Search Path Functions

Functions that return system-wide directory search paths (arrays of paths).

### `configDirs()`

Returns the system config directory search path list.

**Signature:**

```typescript
function configDirs(): string[]
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_CONFIG_DIRS` | `["/etc/xdg"]` |
| macOS | — | `["/Library/Application Support", "/Library/Preferences"]` |
| Windows | `%PROGRAMDATA%` | `["C:\ProgramData"]` |

**Example:**

```javascript
import { configDirs } from "os-user-dirs";
configDirs(); //=> ['/etc/xdg']
```

### `dataDirs()`

Returns the system data directory search path list.

**Signature:**

```typescript
function dataDirs(): string[]
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_DATA_DIRS` | `["/usr/local/share", "/usr/share"]` |
| macOS | — | `["/Library/Application Support"]` |
| Windows | `%PROGRAMDATA%` | `["C:\ProgramData"]` |

**Example:**

```javascript
import { dataDirs } from "os-user-dirs";
dataDirs(); //=> ['/usr/local/share', '/usr/share']
```

---

## Additional Directory Functions

### `homeDir()`

Returns the path to the user's home directory. Uses `os.homedir()` internally.

**Signature:**

```typescript
function homeDir(): string
```

**Example:**

```javascript
import { homeDir } from "os-user-dirs";
homeDir(); //=> '/home/user'
```

### `binDir()`

Returns the path to the user local bin directory, or `null` on Windows.

**Signature:**

```typescript
function binDir(): string | null
```

**Platform behavior:**

| Platform | Default path |
|----------|-------------|
| Linux | `~/.local/bin` |
| macOS | `~/.local/bin` |
| Windows | `null` |

**Example:**

```javascript
import { binDir } from "os-user-dirs";
binDir(); //=> '/home/user/.local/bin' (Linux/macOS)
binDir(); //=> null (Windows)
```

### `fontsDir()`

Returns the path to the user fonts directory.

**Signature:**

```typescript
function fontsDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_DATA_HOME` | `~/.local/share/fonts` |
| macOS | — | `~/Library/Fonts` |
| Windows | `%LOCALAPPDATA%` | `~\AppData\Local\Microsoft\Windows\Fonts` |

**Example:**

```javascript
import { fontsDir } from "os-user-dirs";
fontsDir(); //=> '/home/user/.local/share/fonts'
```

### `trashDir()`

Returns the path to the user trash directory, or `null` on Windows.

**Signature:**

```typescript
function trashDir(): string | null
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_DATA_HOME` | `~/.local/share/Trash` |
| macOS | — | `~/.Trash` |
| Windows | — | `null` (Recycle Bin requires Shell API) |

**Example:**

```javascript
import { trashDir } from "os-user-dirs";
trashDir(); //=> '/home/user/.local/share/Trash' (Linux)
trashDir(); //=> '/Users/user/.Trash' (macOS)
trashDir(); //=> null (Windows)
```

### `applicationsDir()`

Returns the path to the user applications directory.

**Signature:**

```typescript
function applicationsDir(): string
```

**Platform behavior:**

| Platform | Environment variable | Default path |
|----------|---------------------|-------------|
| Linux | `$XDG_DATA_HOME` | `~/.local/share/applications` |
| macOS | — | `~/Applications` |
| Windows | `%APPDATA%` | `~\AppData\Roaming\Microsoft\Windows\Start Menu\Programs` |

**Example:**

```javascript
import { applicationsDir } from "os-user-dirs";
applicationsDir(); //=> '/home/user/.local/share/applications'
```

---

## Project Directory Functions

### `projectDirs(name, options?)`

Returns an object with application-scoped directories for the given app name. This is a zero-dependency alternative to [`env-paths`](https://github.com/sindresorhus/env-paths).

**Signature:**

```typescript
interface ProjectDirsOptions {
    suffix?: string;
    vendor?: string;
}

interface ProjectDirsResult {
    config: string;
    data: string;
    cache: string;
    state: string;
    log: string;
    temp: string;
    runtime: string | null;
}

function projectDirs(name: string, options?: ProjectDirsOptions): ProjectDirsResult
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | (required) | Application name |
| `options.suffix` | `string` | `""` | Suffix appended to the app name (e.g. `"-nodejs"`) |
| `options.vendor` | `string` | `""` | Vendor/organization name used as a parent directory |

**Throws:** `Error` if `name` is empty or not a string.

**Vendor normalization:**
- **Linux:** Converted to lowercase with spaces replaced by hyphens (e.g. `"My Org"` → `"my-org"`)
- **macOS / Windows:** Used as-is

**Platform behavior (Linux example):**

| Key | Path |
|-----|------|
| `config` | `~/.config/<vendor>/<name>` |
| `data` | `~/.local/share/<vendor>/<name>` |
| `cache` | `~/.cache/<vendor>/<name>` |
| `state` | `~/.local/state/<vendor>/<name>` |
| `log` | `~/.local/state/<vendor>/<name>` |
| `temp` | `/tmp/<vendor>/<name>` |
| `runtime` | `$XDG_RUNTIME_DIR/<vendor>/<name>` (or `null`) |

**Platform behavior (Windows):**

On Windows, each directory uses a subdirectory structure:

| Key | Path |
|-----|------|
| `config` | `%APPDATA%\<vendor>\<name>\Config` |
| `data` | `%LOCALAPPDATA%\<vendor>\<name>\Data` |
| `cache` | `%LOCALAPPDATA%\<vendor>\<name>\Cache` |
| `state` | `%LOCALAPPDATA%\<vendor>\<name>\State` |
| `log` | `%LOCALAPPDATA%\<vendor>\<name>\Log` |
| `temp` | `%LOCALAPPDATA%\<vendor>\Temp\<name>` |
| `runtime` | `null` |

**Example:**

```javascript
import { projectDirs } from "os-user-dirs";

// Basic usage
const dirs = projectDirs("my-app");
dirs.config  //=> '/home/user/.config/my-app'
dirs.data    //=> '/home/user/.local/share/my-app'
dirs.cache   //=> '/home/user/.cache/my-app'

// With suffix
const dirs2 = projectDirs("my-app", { suffix: "-nodejs" });
dirs2.config //=> '/home/user/.config/my-app-nodejs'

// With vendor
const dirs3 = projectDirs("my-app", { vendor: "My Org" });
dirs3.config //=> '/home/user/.config/my-org/my-app' (Linux)
dirs3.config //=> '~/Library/Application Support/My Org/my-app' (macOS)
```

### `projectUserDirs(name)`

Returns an object with project-scoped user directories. Each value is the corresponding user directory with the app name appended as a subdirectory.

**Signature:**

```typescript
interface ProjectUserDirsResult {
    desktop: string;
    downloads: string;
    documents: string;
    music: string;
    pictures: string;
    videos: string;
    templates: string;
    publicshare: string;
}

function projectUserDirs(name: string): ProjectUserDirsResult
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Application name |

**Throws:** `Error` if `name` is empty or not a string.

**Example:**

```javascript
import { projectUserDirs } from "os-user-dirs";

const dirs = projectUserDirs("my-app");
dirs.desktop     //=> '/home/user/Desktop/my-app'
dirs.downloads   //=> '/home/user/Downloads/my-app'
dirs.documents   //=> '/home/user/Documents/my-app'
dirs.music       //=> '/home/user/Music/my-app'
dirs.pictures    //=> '/home/user/Pictures/my-app'
dirs.videos      //=> '/home/user/Videos/my-app'
dirs.templates   //=> '/home/user/Templates/my-app'
dirs.publicshare //=> '/home/user/Public/my-app'
```

---

## Utility Functions

### `getXDGUserDir(key, configPath?)`

Reads an XDG `user-dirs.dirs` config file and returns the directory for the given key.

**Signature:**

```typescript
function getXDGUserDir(key: string, configPath?: string): string | null
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `string` | (required) | XDG key (e.g. `"XDG_DOWNLOAD_DIR"`) |
| `configPath` | `string` | `~/.config/user-dirs.dirs` | Path to the config file |

**Returns:** The resolved directory path, or `null` if the key is not found or the config file is unreadable.

**Example:**

```javascript
import { getXDGUserDir } from "os-user-dirs";
getXDGUserDir("XDG_DOWNLOAD_DIR"); //=> '/home/user/Downloads' (or null)
getXDGUserDir("XDG_DESKTOP_DIR");  //=> '/home/user/Desktop' (or null)
```

### `ensureDirSync(dirPath)`

Ensures the specified directory exists, creating it recursively if necessary.

**Signature:**

```typescript
function ensureDirSync(dirPath: string): string
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `dirPath` | `string` | The directory path to ensure exists |

**Returns:** The directory path.

**Throws:** `Error` if `dirPath` is empty or not a string.

**Example:**

```javascript
import { projectDirs, ensureDirSync } from "os-user-dirs";

const dirs = projectDirs("my-app");
ensureDirSync(dirs.config); //=> '/home/user/.config/my-app' (directory created if needed)
```

### `ensureDir(dirPath)`

Async version of `ensureDirSync`. Ensures the specified directory exists, creating it recursively if necessary.

**Signature:**

```typescript
function ensureDir(dirPath: string): Promise<string>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `dirPath` | `string` | The directory path to ensure exists |

**Returns:** A promise that resolves with the directory path.

**Throws (rejects):** `Error` if `dirPath` is empty or not a string.

**Example:**

```javascript
import { projectDirs, ensureDir } from "os-user-dirs";

const dirs = projectDirs("my-app");
await ensureDir(dirs.data); //=> '/home/user/.local/share/my-app' (directory created if needed)
```

---

## Functions That May Return `null`

The following functions may return `null` under certain conditions. Always check the return value before using it as a path.

| Function | Returns `null` when |
|----------|-------------------|
| `runtimeDir()` | `$XDG_RUNTIME_DIR` is not set (Linux), always on macOS/Windows |
| `binDir()` | Always on Windows |
| `trashDir()` | Always on Windows (Recycle Bin requires Shell API) |
| `getBasePath("runtime")` | Same as `runtimeDir()` |
| `projectDirs(name).runtime` | Same as `runtimeDir()` |
| `getXDGUserDir(key)` | Key not found in config file, or config file unreadable |

---

## Edge Cases

### Unknown Platforms

On platforms other than Linux, macOS, and Windows (e.g. FreeBSD, Android), functions fall back to XDG-style Linux defaults:

| Function category | Behavior |
|---|---|
| User directories (`downloads()`, etc.) | `~/Downloads`, `~/Desktop`, etc. |
| Base directories (`configDir()`, etc.) | `~/.config`, `~/.local/share`, etc. |
| Search path directories (`configDirs()`, etc.) | `["/etc/xdg"]`, `["/usr/local/share", "/usr/share"]` |
| `fontsDir()` | `~/.local/share/fonts` |
| `trashDir()` | `~/.local/share/Trash` |
| `applicationsDir()` | `~/.local/share/applications` |
| `binDir()` | `~/.local/bin` |
| `runtimeDir()` | `null` (no default) |

### Error Conditions

The following functions throw an `Error` for invalid input:

| Function | Throws when |
|---|---|
| `getPath(name)` | `name` is not a valid `DirName` |
| `getBasePath(name)` | `name` is not a valid `BaseDirName` |
| `projectDirs(name)` | `name` is empty, falsy, or not a string |
| `projectUserDirs(name)` | `name` is empty, falsy, or not a string |
| `ensureDirSync(dirPath)` | `dirPath` is empty, falsy, or not a string |
| `ensureDir(dirPath)` | `dirPath` is empty, falsy, or not a string (rejects) |

### XDG User Directory Override (Linux)

On Linux, user directory functions (`desktop()`, `downloads()`, etc.) check `~/.config/user-dirs.dirs` before falling back to defaults. This file is typically managed by `xdg-user-dirs-update` and may contain custom paths:

```
XDG_DOWNLOAD_DIR="$HOME/my-downloads"
XDG_DESKTOP_DIR="$HOME/my-desktop"
```

If the file is missing or a key is not found, the function returns the default path (e.g. `~/Downloads`). This override does **not** apply on macOS or Windows.

### `logDir()` and `stateDir()` Shared Path on Linux

On Linux, both `logDir()` and `stateDir()` use `$XDG_STATE_HOME` (default `~/.local/state`). Applications typically use subdirectories to separate log and state data:

```javascript
import { projectDirs } from "os-user-dirs";
const dirs = projectDirs("my-app");
dirs.state //=> '/home/user/.local/state/my-app'
dirs.log   //=> '/home/user/.local/state/my-app'
```

On macOS, `logDir()` returns `~/Library/Logs` (separate from `stateDir()`).
