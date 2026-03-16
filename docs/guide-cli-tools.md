# CLI Tools Integration Guide

[os-user-dirs](https://github.com/velocitylabo/os-user-dirs) provides cross-platform directory management for CLI tools and applications. This guide shows how to use `projectDirs()` for configuration, caching, and logging in CLI tools built with popular frameworks like [commander](https://github.com/tj/commander.js), [yargs](https://github.com/yargs/yargs), and [oclif](https://oclif.io/).

## Why use os-user-dirs for CLI tools?

- **Zero dependencies** — no additional install overhead for your CLI
- **Cross-platform** — correct paths on Linux, macOS, and Windows out of the box
- **XDG compliant** — respects `$XDG_CONFIG_HOME`, `$XDG_DATA_HOME`, etc. on Linux
- **Project-scoped** — `projectDirs()` gives your app its own config, data, cache, and log directories
- **CJS + ESM** — works with any module format

## Quick start

```js
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-cli');

dirs.config;   //=> '~/.config/my-cli'           (Linux)
dirs.data;     //=> '~/.local/share/my-cli'       (Linux)
dirs.cache;    //=> '~/.cache/my-cli'             (Linux)
dirs.state;    //=> '~/.local/state/my-cli'       (Linux)
dirs.log;      //=> '~/.local/state/my-cli'       (Linux)
dirs.temp;     //=> '/tmp/my-cli'                 (Linux)
```

## Common patterns

### Configuration file management

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-cli');
const configPath = path.join(dirs.config, 'config.json');

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

### Cache management

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-cli');

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

### Log file output

```js
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-cli');

function log(message) {
  ensureDirSync(dirs.log);
  const logFile = path.join(dirs.log, 'debug.log');
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, line);
}
```

## Framework integration

### commander

```js
const { Command } = require('commander');
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-cli');
const configPath = path.join(dirs.config, 'config.json');

const program = new Command();

program
  .name('my-cli')
  .version('1.0.0');

program
  .command('config')
  .description('Show config file path')
  .action(() => {
    console.log(`Config: ${configPath}`);
  });

program
  .command('config:set <key> <value>')
  .description('Set a config value')
  .action((key, value) => {
    ensureDirSync(dirs.config);
    let config = {};
    try { config = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch {}
    config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Set ${key} = ${value}`);
  });

program.parse();
```

### yargs

```js
const yargs = require('yargs');
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

const dirs = projectDirs('my-cli');
const configPath = path.join(dirs.config, 'config.json');

yargs
  .command('config', 'Show config file path', {}, () => {
    console.log(`Config: ${configPath}`);
    console.log(`Data:   ${dirs.data}`);
    console.log(`Cache:  ${dirs.cache}`);
    console.log(`Log:    ${dirs.log}`);
  })
  .command('init', 'Initialize config', {}, () => {
    ensureDirSync(dirs.config);
    fs.writeFileSync(configPath, JSON.stringify({}, null, 2));
    console.log(`Created ${configPath}`);
  })
  .demandCommand(1)
  .parse();
```

### oclif

```js
const { Command } = require('@oclif/core');
const path = require('node:path');
const fs = require('node:fs');
const { projectDirs, ensureDirSync } = require('os-user-dirs');

class ConfigCommand extends Command {
  static description = 'Show config paths';

  async run() {
    const dirs = projectDirs('my-cli');
    this.log(`Config: ${dirs.config}`);
    this.log(`Data:   ${dirs.data}`);
    this.log(`Cache:  ${dirs.cache}`);
  }
}

module.exports = ConfigCommand;
```

## Vendor-scoped directories

For CLI tools published under an organization:

```js
const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('deploy', { vendor: 'acme' });

dirs.config;
//=> '~/.config/acme/deploy'                        (Linux)
//=> '~/Library/Application Support/acme/deploy'     (macOS)
//=> '%APPDATA%/acme/deploy/Config'                  (Windows)
```

This keeps multiple CLI tools from the same organization grouped together.

## Comparison: manual paths vs os-user-dirs

**Before (manual, Linux-only):**

```js
const path = require('node:path');
const os = require('node:os');

const configDir = path.join(os.homedir(), '.my-cli');
// Only works correctly on Linux
// Doesn't respect XDG_CONFIG_HOME
// Mixes config and data in one directory
```

**After (os-user-dirs, cross-platform):**

```js
const { projectDirs } = require('os-user-dirs');

const dirs = projectDirs('my-cli');
// Works on Linux, macOS, and Windows
// Respects XDG environment variables
// Separates config, data, cache, state, and log
```

## Best practices

1. **Use `projectDirs()` instead of individual functions** — it gives your CLI app properly scoped directories with a single call
2. **Call `ensureDirSync()` before writing** — directories may not exist on first run
3. **Respect XDG conventions** — avoid storing config in `~/.my-app` on Linux; `projectDirs()` handles this automatically
4. **Separate config from data** — config is user-editable settings, data is application-managed state
5. **Use `dirs.cache` for regeneratable data** — users expect to be able to delete `~/.cache` safely
