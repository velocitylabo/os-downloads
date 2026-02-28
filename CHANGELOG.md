# Changelog

## [2.2.0](https://github.com/velocitylabo/os-user-dirs/compare/os-user-dirs-v2.1.0...os-user-dirs-v2.2.0) (2026-02-28)


### Features

* add ESM and TypeScript support (v2.1.0) ([19511b3](https://github.com/velocitylabo/os-user-dirs/commit/19511b3e6912c97ca4afb94707de2ddbc51123ac))
* add ESM and TypeScript support (v2.1.0) ([14fa7a3](https://github.com/velocitylabo/os-user-dirs/commit/14fa7a308feabedd20c8613940d6c380d3d12a6f))
* support multiple user directories (desktop, documents, music, p… ([19013de](https://github.com/velocitylabo/os-user-dirs/commit/19013de5ce989d51b517e2f15f0c869f72ace1ea))
* support multiple user directories (desktop, documents, music, pictures, videos) ([30bd631](https://github.com/velocitylabo/os-user-dirs/commit/30bd63114476d06c8c74a1ea3b0126c3eacae473))


### Bug Fixes

* **ci:** fix OIDC trusted publishing and reuse CI matrix for publish ([8fcc4b7](https://github.com/velocitylabo/os-user-dirs/commit/8fcc4b702b750d4512b8cb24bf344c4d4b0447b7))
* **ci:** fix OIDC trusted publishing workflow ([a5b3fde](https://github.com/velocitylabo/os-user-dirs/commit/a5b3fded6a10ce78955bef604013279bf7420764))
* **ci:** remove unnecessary permissions block ([cca7cf3](https://github.com/velocitylabo/os-user-dirs/commit/cca7cf3dc2dcf1e8dd967a4000fb991d20a829e6))
* **ci:** use PAT for release-please PR creation ([3c8075d](https://github.com/velocitylabo/os-user-dirs/commit/3c8075da28e9d6b943f3eb748aa44238a57c45ac))
* **ci:** use PAT for release-please to allow PR creation ([af7401f](https://github.com/velocitylabo/os-user-dirs/commit/af7401f38a28de78edf8161cd19110058343af50))

## [2.1.0] - 2026-02-28

### Added
- ESM support via `index.mjs` — `import { downloads } from "os-user-dirs"` now works
- TypeScript type definitions (`index.d.ts`) with `DirName` union type for `getPath()` auto-completion
- `exports` field in `package.json` for dual CJS/ESM resolution
- ESM smoke test (`test-esm.mjs`) and CI step

### Deprecated
- `getXDGDownloadDir()` — use `getXDGUserDir("XDG_DOWNLOAD_DIR")` instead

## [2.0.0] - 2025-05-15

### Added
- Multiple user directory functions: `desktop()`, `documents()`, `music()`, `pictures()`, `videos()`
- `getPath(name)` for dynamic directory lookup
- `getXDGUserDir(key, configPath)` for generic XDG directory resolution

### Changed
- Package renamed from `os-downloads` to `os-user-dirs`

### Deprecated
- `getXDGDownloadDir()` — kept for backward compatibility

## [1.x] - os-downloads

Previous versions were published as [`os-downloads`](https://www.npmjs.com/package/os-downloads).
