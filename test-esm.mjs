import { strict as assert } from 'node:assert';
import path from 'node:path';
import os from 'node:os';
import osUserDirs, {
    downloads,
    desktop,
    documents,
    music,
    pictures,
    videos,
    templates,
    publicshare,
    getPath,
    binDir,
    configDir,
    dataDir,
    cacheDir,
    stateDir,
    logDir,
    runtimeDir,
    getBasePath,
    configDirs,
    dataDirs,
    projectDirs,
    fontsDir,
    applicationsDir,
    projectUserDirs,
    getXDGUserDir,
    getXDGDownloadDir,
} from './index.mjs';

const home = os.homedir();
let passed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        console.error(`  ✗ ${name}`);
        console.error(`    ${e.message}`);
        process.exitCode = 1;
    }
}

console.log('ESM smoke tests\n');

// Default export
console.log('default export:');
test('default export is callable', () => {
    assert.equal(typeof osUserDirs, 'function');
});
test('default export returns Downloads path', () => {
    const result = osUserDirs();
    assert.ok(path.isAbsolute(result));
    assert.ok(result.startsWith(home));
});

// Named exports
console.log('\nnamed exports:');
const namedExports = { downloads, desktop, documents, music, pictures, videos, templates, publicshare };
for (const [name, fn] of Object.entries(namedExports)) {
    test(`${name}() returns absolute path under home`, () => {
        const result = fn();
        assert.ok(path.isAbsolute(result), `${name}() should be absolute`);
        assert.ok(result.startsWith(home), `${name}() should start with home`);
    });
}

// getPath matches named exports
console.log('\ngetPath consistency:');
for (const [name, fn] of Object.entries(namedExports)) {
    test(`getPath("${name}") === ${name}()`, () => {
        assert.equal(getPath(name), fn());
    });
}

// binDir
console.log('\nbinDir:');
test('binDir() returns string or null', () => {
    const result = binDir();
    assert.ok(result === null || typeof result === 'string');
});
if (process.platform !== 'win32') {
    test('binDir() returns ~/.local/bin', () => {
        assert.equal(binDir(), path.join(home, '.local', 'bin'));
    });
}

// Base directory exports
console.log('\nbase directory exports:');
const baseFns = { configDir, dataDir, cacheDir, stateDir, logDir };
for (const [name, fn] of Object.entries(baseFns)) {
    test(`${name}() returns absolute path`, () => {
        const result = fn();
        assert.ok(path.isAbsolute(result), `${name}() should be absolute`);
    });
}
test('runtimeDir() returns string or null', () => {
    const result = runtimeDir();
    assert.ok(result === null || typeof result === 'string');
});

// getBasePath consistency
console.log('\ngetBasePath consistency:');
test('getBasePath("config") === configDir()', () => {
    assert.equal(getBasePath('config'), configDir());
});
test('getBasePath("data") === dataDir()', () => {
    assert.equal(getBasePath('data'), dataDir());
});
test('getBasePath("cache") === cacheDir()', () => {
    assert.equal(getBasePath('cache'), cacheDir());
});
test('getBasePath("state") === stateDir()', () => {
    assert.equal(getBasePath('state'), stateDir());
});
test('getBasePath("log") === logDir()', () => {
    assert.equal(getBasePath('log'), logDir());
});
test('getBasePath("runtime") === runtimeDir()', () => {
    assert.equal(getBasePath('runtime'), runtimeDir());
});

// configDirs / dataDirs
console.log('\nsearch directory exports:');
test('configDirs() returns an array', () => {
    const result = configDirs();
    assert.ok(Array.isArray(result), 'configDirs() should return an array');
    assert.ok(result.length > 0, 'configDirs() should return non-empty array');
});
test('configDirs() entries are absolute paths', () => {
    configDirs().forEach((dir) => {
        assert.ok(path.isAbsolute(dir), `expected absolute path: ${dir}`);
    });
});
test('dataDirs() returns an array', () => {
    const result = dataDirs();
    assert.ok(Array.isArray(result), 'dataDirs() should return an array');
    assert.ok(result.length > 0, 'dataDirs() should return non-empty array');
});
test('dataDirs() entries are absolute paths', () => {
    dataDirs().forEach((dir) => {
        assert.ok(path.isAbsolute(dir), `expected absolute path: ${dir}`);
    });
});

// projectDirs
console.log('\nprojectDirs:');
test('projectDirs is a function', () => {
    assert.equal(typeof projectDirs, 'function');
});
test('projectDirs returns object with all keys', () => {
    const dirs = projectDirs('test-app');
    assert.ok(dirs.config);
    assert.ok(dirs.data);
    assert.ok(dirs.cache);
    assert.ok(dirs.state);
    assert.ok(dirs.log);
    assert.ok(dirs.temp);
});
test('projectDirs paths contain app name', () => {
    const dirs = projectDirs('esm-test-app');
    for (const [key, val] of Object.entries(dirs)) {
        if (val !== null) {
            assert.ok(val.includes('esm-test-app'), `${key} should contain app name`);
        }
    }
});
test('projectDirs suffix option works', () => {
    const dirs = projectDirs('my-app', { suffix: '-nodejs' });
    assert.ok(dirs.config.includes('my-app-nodejs'));
});
test('projectDirs vendor option works', () => {
    const dirs = projectDirs('my-app', { vendor: 'TestVendor' });
    for (const [key, val] of Object.entries(dirs)) {
        if (val !== null) {
            assert.ok(val.includes('my-app'), `${key} should contain app name`);
        }
    }
});
test('projectDirs vendor + suffix works', () => {
    const dirs = projectDirs('my-app', { vendor: 'TestOrg', suffix: '-nodejs' });
    assert.ok(dirs.config.includes('my-app-nodejs'));
});

// projectUserDirs
console.log('\nprojectUserDirs:');
test('projectUserDirs is a function', () => {
    assert.equal(typeof projectUserDirs, 'function');
});
test('projectUserDirs returns object with all 8 keys', () => {
    const dirs = projectUserDirs('test-app');
    const expectedKeys = ['desktop', 'downloads', 'documents', 'music', 'pictures', 'videos', 'templates', 'publicshare'];
    assert.deepEqual(Object.keys(dirs).sort(), expectedKeys.sort());
});
test('projectUserDirs paths contain app name', () => {
    const dirs = projectUserDirs('esm-test-app');
    for (const [key, val] of Object.entries(dirs)) {
        assert.ok(val.includes('esm-test-app'), `${key} should contain app name`);
    }
});
test('projectUserDirs paths match getPath + app name', () => {
    const dirs = projectUserDirs('test-app');
    assert.equal(dirs.downloads, path.join(getPath('downloads'), 'test-app'));
    assert.equal(dirs.desktop, path.join(getPath('desktop'), 'test-app'));
});

// fontsDir
console.log('\nfontsDir:');
test('fontsDir() returns absolute path', () => {
    const result = fontsDir();
    assert.ok(path.isAbsolute(result), 'fontsDir() should be absolute');
});
test('fontsDir() path ends with fonts or Fonts', () => {
    const result = fontsDir();
    assert.ok(path.basename(result).match(/fonts/i), 'should end with fonts');
});

// applicationsDir
console.log('\napplicationsDir:');
test('applicationsDir() returns absolute path', () => {
    const result = applicationsDir();
    assert.ok(path.isAbsolute(result), 'applicationsDir() should be absolute');
});
test('applicationsDir() returns a string', () => {
    assert.equal(typeof applicationsDir(), 'string');
});

// Utility exports exist
console.log('\nutility exports:');
test('getXDGUserDir is a function', () => {
    assert.equal(typeof getXDGUserDir, 'function');
});
test('getXDGDownloadDir is a function', () => {
    assert.equal(typeof getXDGDownloadDir, 'function');
});

console.log(`\n${passed} tests passed`);
