# os-user-dirs [![CI](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml/badge.svg)](https://github.com/velocitylabo/os-user-dirs/actions/workflows/ci.yml)

Get OS-specific user directories (Downloads, Desktop, Documents, Music, Pictures, Videos) with zero dependencies.

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

```javascript
const { downloads, desktop, documents, music, pictures, videos, getPath } = require("os-user-dirs");

downloads();
//=> '/home/user/Downloads'

desktop();
//=> '/home/user/Desktop'

documents();
//=> '/home/user/Documents'

getPath("music");
//=> '/home/user/Music'
```

### Default export (backward compatibility)

```javascript
const downloads = require("os-user-dirs");

downloads();
//=> '/home/user/Downloads'
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

### `getPath(name)`
Returns the path to the specified directory. Valid names: `desktop`, `downloads`, `documents`, `music`, `pictures`, `videos`.

## License

MIT
