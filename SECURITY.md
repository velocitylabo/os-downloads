# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 3.x     | Yes       |
| < 3.0   | No        |

Only the latest major version receives security updates. If you are using an older version, please upgrade to v3.x.

## Reporting a Vulnerability

Please report security vulnerabilities through [GitHub Security Advisories](https://github.com/velocitylabo/os-user-dirs/security/advisories/new).

**Do not open a public issue for security vulnerabilities.**

After submitting a report, you can expect:

- **Acknowledgment** within 48 hours
- **Assessment** of severity and impact within 1 week
- **Fix or mitigation** depending on severity — critical issues will be prioritized

## Security Considerations

### `ensureDir()` / `ensureDirSync()`

These functions create directories using `fs.mkdirSync(path, { recursive: true })` and `fs.promises.mkdir(path, { recursive: true })`. Callers should be aware of the following:

- **Path validation**: These functions accept any string path. If the path comes from user input, callers are responsible for validating and sanitizing it to prevent path traversal attacks (e.g., `../../etc/malicious`).
- **Permissions**: Directories are created with the default permissions of the Node.js process. No special permission hardening is applied.
- **Symlink following**: The underlying `fs.mkdirSync` follows symlinks. If a symlink exists along the path, the directory will be created at the symlink target.

**Recommendation**: When using `ensureDir()` with paths derived from user input, validate that the resolved path is within an expected base directory:

```javascript
const path = require("node:path");
const { ensureDir, configDir } = require("os-user-dirs");

const base = configDir();
const userInput = "my-app"; // from user
const resolved = path.resolve(base, userInput);

// Ensure the resolved path is within the base directory
if (!resolved.startsWith(base + path.sep) && resolved !== base) {
  throw new Error("Invalid path");
}

await ensureDir(resolved);
```

### General Security Model

- **No network access**: This library makes no network requests. All paths are resolved locally using environment variables, OS APIs, and filesystem reads.
- **Filesystem reads**: On Linux, `getXDGUserDir()` reads `~/.config/user-dirs.dirs`. This file is user-owned and typically not writable by other users.
- **Environment variables**: Several functions read environment variables (`XDG_*`, `APPDATA`, `LOCALAPPDATA`, etc.). If an attacker can control these variables, they can influence the returned paths. This is consistent with the XDG Base Directory Specification and is expected behavior.
- **Zero dependencies**: This library has no runtime dependencies, reducing supply chain risk.
