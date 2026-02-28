# os-user-dirs [![CI](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml/badge.svg)](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml)

Get OS-specific user directories (Downloads, Desktop, Documents, etc.) and XDG base directories (config, data, cache, runtime) with zero dependencies.

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
import { configDir, dataDir, cacheDir, runtimeDir, getBasePath } from "os-user-dirs";

configDir();
//=> '/home/user/.config'

dataDir();
//=> '/home/user/.local/share'

cacheDir();
//=> '/home/user/.cache'

runtimeDir();
//=> '/run/user/1000' (or null)

getBasePath("config");
//=> '/home/user/.config'
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

### Base Directories

#### `configDir()`
Returns the path to the config directory (`~/.config` on Linux, `~/Library/Application Support` on macOS, `%APPDATA%` on Windows).

#### `dataDir()`
Returns the path to the data directory (`~/.local/share` on Linux, `~/Library/Application Support` on macOS, `%LOCALAPPDATA%` on Windows).

#### `cacheDir()`
Returns the path to the cache directory (`~/.cache` on Linux, `~/Library/Caches` on macOS, `%LOCALAPPDATA%` on Windows).

#### `runtimeDir()`
Returns the path to the runtime directory (`$XDG_RUNTIME_DIR` on Linux), or `null` if unavailable.

#### `getBasePath(name)`
Returns the path to the specified base directory. Valid names: `config`, `data`, `cache`, `runtime`.

## License

MIT
