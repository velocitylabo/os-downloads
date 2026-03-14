# Migration from env-paths

[env-paths](https://github.com/sindresorhus/env-paths) is a popular package for getting OS-specific app directories. **os-user-dirs** provides the same functionality via `projectDirs()`, plus much more — with zero dependencies and CJS/ESM dual support.

## Why migrate?

- **env-paths v3 is ESM-only** — os-user-dirs supports both CJS and ESM
- **env-paths has not been updated in 4+ years** — os-user-dirs is actively maintained
- **More features** — user directories, base directories, system search directories, vendor support, `ensureDir()` utility, and more

## API mapping

| env-paths property | os-user-dirs equivalent | Notes |
|---|---|---|
| `paths.data` | `dirs.data` | Same on Linux/Windows. macOS: env-paths uses `~/Library/Application Support`, os-user-dirs also uses `~/Library/Application Support` |
| `paths.config` | `dirs.config` | Same on Linux/Windows. macOS: env-paths uses `~/Library/Preferences`, os-user-dirs uses `~/Library/Application Support` |
| `paths.cache` | `dirs.cache` | Same on all platforms |
| `paths.log` | `dirs.log` | Same on all platforms |
| `paths.temp` | `dirs.temp` | Same on all platforms |
| *(not available)* | `dirs.state` | Additional: XDG state directory |
| *(not available)* | `dirs.runtime` | Additional: XDG runtime directory (or `null`) |

> **Note:** On macOS, env-paths uses `~/Library/Preferences` for `config`, while os-user-dirs uses `~/Library/Application Support`. If your application depends on the `~/Library/Preferences` path, be aware of this difference when migrating.

## Default suffix

env-paths appends `"-nodejs"` to the app name by default. os-user-dirs does **not** append any suffix by default.

| | env-paths | os-user-dirs |
|---|---|---|
| Default suffix | `"-nodejs"` | `""` (none) |
| Disable suffix | `envPaths('MyApp', {suffix: ''})` | `projectDirs('MyApp')` (default) |
| Custom suffix | `envPaths('MyApp', {suffix: '-node'})` | `projectDirs('MyApp', {suffix: '-node'})` |

To match the env-paths default behavior, pass `{suffix: '-nodejs'}`:

```js
projectDirs('MyApp', { suffix: '-nodejs' });
```

## Code examples

### Before (env-paths)

```js
// ESM only (v3)
import envPaths from 'env-paths';

const paths = envPaths('MyApp');

paths.data;    //=> '~/.local/share/MyApp-nodejs' (Linux)
paths.config;  //=> '~/.config/MyApp-nodejs' (Linux)
paths.cache;   //=> '~/.cache/MyApp-nodejs' (Linux)
paths.log;     //=> '~/.local/state/MyApp-nodejs' (Linux)
paths.temp;    //=> '/tmp/MyApp-nodejs' (Linux)
```

### After (os-user-dirs)

```js
// ESM
import { projectDirs } from 'os-user-dirs';

// CommonJS — also works!
// const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('MyApp', { suffix: '-nodejs' });

dirs.data;     //=> '~/.local/share/MyApp-nodejs' (Linux)
dirs.config;   //=> '~/.config/MyApp-nodejs' (Linux)
dirs.cache;    //=> '~/.cache/MyApp-nodejs' (Linux)
dirs.log;      //=> '~/.local/state/MyApp-nodejs' (Linux)
dirs.temp;     //=> '/tmp/MyApp-nodejs' (Linux)

// Additional directories not available in env-paths:
dirs.state;    //=> '~/.local/state/MyApp-nodejs' (Linux)
dirs.runtime;  //=> '/run/user/1000/MyApp-nodejs' (Linux, or null)
```

### Without suffix (recommended for new projects)

```js
import { projectDirs } from 'os-user-dirs';

const dirs = projectDirs('MyApp');

dirs.data;     //=> '~/.local/share/MyApp' (Linux)
dirs.config;   //=> '~/.config/MyApp' (Linux)
dirs.cache;    //=> '~/.cache/MyApp' (Linux)
```

## Additional features

os-user-dirs provides features not available in env-paths:

### Vendor option

Group your app under an organization directory:

```js
import { projectDirs } from 'os-user-dirs';

const dirs = projectDirs('MyApp', { vendor: 'My Org' });
dirs.config;  //=> '~/.config/my-org/MyApp' (Linux)
dirs.config;  //=> '~/Library/Application Support/My Org/MyApp' (macOS)
```

### User directories

Get platform-specific user directories (Downloads, Desktop, Documents, etc.):

```js
import { downloads, desktop, documents } from 'os-user-dirs';

downloads();   //=> '~/Downloads'
desktop();     //=> '~/Desktop'
documents();   //=> '~/Documents'
```

### Base directories (without app name)

Access raw XDG base directories:

```js
import { configDir, dataDir, cacheDir } from 'os-user-dirs';

configDir();   //=> '~/.config' (Linux)
dataDir();     //=> '~/.local/share' (Linux)
cacheDir();    //=> '~/.cache' (Linux)
```

### Directory creation utility

```js
import { projectDirs, ensureDirSync, ensureDir } from 'os-user-dirs';

const dirs = projectDirs('MyApp');

// Sync
ensureDirSync(dirs.config);

// Async
await ensureDir(dirs.data);
```

## Quick reference

| Task | env-paths | os-user-dirs |
|---|---|---|
| Install | `npm install env-paths` | `npm install os-user-dirs` |
| Import (ESM) | `import envPaths from 'env-paths'` | `import { projectDirs } from 'os-user-dirs'` |
| Import (CJS) | *(not supported in v3)* | `const { projectDirs } = require('os-user-dirs')` |
| Get paths | `envPaths('MyApp')` | `projectDirs('MyApp')` |
| With suffix | `envPaths('MyApp', {suffix: '-nodejs'})` | `projectDirs('MyApp', {suffix: '-nodejs'})` |
| No suffix | `envPaths('MyApp', {suffix: ''})` | `projectDirs('MyApp')` |
