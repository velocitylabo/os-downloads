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
    configDir,
    dataDir,
    cacheDir,
    runtimeDir,
    getBasePath,
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

// Base directory exports
console.log('\nbase directory exports:');
const baseFns = { configDir, dataDir, cacheDir };
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
test('getBasePath("runtime") === runtimeDir()', () => {
    assert.equal(getBasePath('runtime'), runtimeDir());
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
