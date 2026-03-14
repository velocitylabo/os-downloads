const assert = require("node:assert");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");
const downloads = require("./");
const {
    getXDGUserDir,
    getPath,
    desktop,
    documents,
    music,
    pictures,
    videos,
    templates,
    publicshare,
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
    homeDir,
    trashDir,
    ensureDirSync,
    ensureDir,
} = require("./");

describe("os-user-dirs", () => {
    describe("downloads (default export / backward compatibility)", () => {
        it("returns a path ending with Downloads", () => {
            assert.ok(path.basename(downloads()).match(/downloads/i));
        });

        it("returns an absolute path", () => {
            assert.ok(path.isAbsolute(downloads()));
        });

        it("path starts with home directory", () => {
            assert.ok(downloads().startsWith(os.homedir()));
        });
    });

    describe("named directory functions", () => {
        const cases = [
            { fn: desktop, name: "desktop" },
            { fn: downloads, name: "downloads" },
            { fn: documents, name: "documents" },
            { fn: music, name: "music" },
            { fn: pictures, name: "pictures" },
            { fn: videos, name: "videos" },
            { fn: templates, name: "templates" },
            { fn: publicshare, name: "publicshare" },
        ];

        cases.forEach(({ fn, name }) => {
            it(`${name}() returns an absolute path`, () => {
                assert.ok(path.isAbsolute(fn()));
            });

            it(`${name}() starts with home directory`, () => {
                assert.ok(fn().startsWith(os.homedir()));
            });
        });
    });

    describe("getPath", () => {
        it("returns the same result as named functions", () => {
            assert.strictEqual(getPath("desktop"), desktop());
            assert.strictEqual(getPath("downloads"), downloads());
            assert.strictEqual(getPath("documents"), documents());
            assert.strictEqual(getPath("music"), music());
            assert.strictEqual(getPath("pictures"), pictures());
            assert.strictEqual(getPath("videos"), videos());
            assert.strictEqual(getPath("templates"), templates());
            assert.strictEqual(getPath("publicshare"), publicshare());
        });

        it("throws for unknown directory names", () => {
            assert.throws(() => getPath("unknown"), /Unknown directory/);
        });
    });

    describe("getXDGUserDir", () => {
        const tmpDir = path.join(os.tmpdir(), "os-user-dirs-test");

        beforeEach(() => {
            fs.mkdirSync(tmpDir, { recursive: true });
        });

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        const xdgEntries = [
            { key: "XDG_DESKTOP_DIR", value: "Desktop" },
            { key: "XDG_DOWNLOAD_DIR", value: "Downloads" },
            { key: "XDG_DOCUMENTS_DIR", value: "Documents" },
            { key: "XDG_MUSIC_DIR", value: "Music" },
            { key: "XDG_PICTURES_DIR", value: "Pictures" },
            { key: "XDG_VIDEOS_DIR", value: "Videos" },
            { key: "XDG_TEMPLATES_DIR", value: "Templates" },
            { key: "XDG_PUBLICSHARE_DIR", value: "Public" },
        ];

        xdgEntries.forEach(({ key, value }) => {
            it(`parses ${key} with $HOME`, () => {
                const configPath = path.join(tmpDir, "user-dirs.dirs");
                fs.writeFileSync(configPath, `${key}="$HOME/${value}"\n`);
                const result = getXDGUserDir(key, configPath);
                assert.strictEqual(result, path.join(os.homedir(), value));
            });
        });

        it("parses entry with absolute path", () => {
            const configPath = path.join(tmpDir, "user-dirs.dirs");
            fs.writeFileSync(configPath, 'XDG_DOWNLOAD_DIR="/custom/downloads"\n');
            const result = getXDGUserDir("XDG_DOWNLOAD_DIR", configPath);
            assert.strictEqual(result, path.normalize("/custom/downloads"));
        });

        it("parses correct entry among multiple entries", () => {
            const configPath = path.join(tmpDir, "user-dirs.dirs");
            const content = [
                'XDG_DESKTOP_DIR="$HOME/Desktop"',
                'XDG_DOWNLOAD_DIR="$HOME/MyDownloads"',
                'XDG_DOCUMENTS_DIR="$HOME/Documents"',
                'XDG_MUSIC_DIR="$HOME/Musik"',
                'XDG_PICTURES_DIR="$HOME/Bilder"',
                'XDG_VIDEOS_DIR="$HOME/Videos"',
            ].join("\n");
            fs.writeFileSync(configPath, content);

            assert.strictEqual(
                getXDGUserDir("XDG_DOWNLOAD_DIR", configPath),
                path.join(os.homedir(), "MyDownloads")
            );
            assert.strictEqual(
                getXDGUserDir("XDG_MUSIC_DIR", configPath),
                path.join(os.homedir(), "Musik")
            );
            assert.strictEqual(
                getXDGUserDir("XDG_PICTURES_DIR", configPath),
                path.join(os.homedir(), "Bilder")
            );
        });

        it("returns null when key is not present", () => {
            const configPath = path.join(tmpDir, "user-dirs.dirs");
            fs.writeFileSync(configPath, 'XDG_DESKTOP_DIR="$HOME/Desktop"\n');
            const result = getXDGUserDir("XDG_DOWNLOAD_DIR", configPath);
            assert.strictEqual(result, null);
        });

        it("returns null when config file does not exist", () => {
            const configPath = path.join(tmpDir, "nonexistent");
            const result = getXDGUserDir("XDG_DOWNLOAD_DIR", configPath);
            assert.strictEqual(result, null);
        });
    });

    describe("homeDir", () => {
        it("returns an absolute path", () => {
            assert.ok(path.isAbsolute(homeDir()));
        });

        it("returns the same value as os.homedir()", () => {
            assert.strictEqual(homeDir(), os.homedir());
        });

        it("returns a string", () => {
            assert.strictEqual(typeof homeDir(), "string");
        });
    });

    describe("binDir", () => {
        if (process.platform === "win32") {
            it("returns null on Windows", () => {
                assert.strictEqual(binDir(), null);
            });
        } else {
            it("returns ~/.local/bin", () => {
                assert.strictEqual(binDir(), path.join(os.homedir(), ".local", "bin"));
            });

            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(binDir()));
            });
        }
    });

    describe("base directories", () => {
        const envKeys = ["XDG_CONFIG_HOME", "XDG_DATA_HOME", "XDG_CACHE_HOME", "XDG_STATE_HOME", "XDG_RUNTIME_DIR"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        describe("configDir", () => {
            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(configDir()));
            });

            if (process.platform === "linux") {
                it("respects XDG_CONFIG_HOME", () => {
                    process.env.XDG_CONFIG_HOME = "/tmp/custom-config";
                    assert.strictEqual(configDir(), "/tmp/custom-config");
                });

                it("defaults to ~/.config when env is unset", () => {
                    delete process.env.XDG_CONFIG_HOME;
                    assert.strictEqual(configDir(), path.join(os.homedir(), ".config"));
                });

                it("ignores empty XDG_CONFIG_HOME", () => {
                    process.env.XDG_CONFIG_HOME = "";
                    assert.strictEqual(configDir(), path.join(os.homedir(), ".config"));
                });
            }
        });

        describe("dataDir", () => {
            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(dataDir()));
            });

            if (process.platform === "linux") {
                it("respects XDG_DATA_HOME", () => {
                    process.env.XDG_DATA_HOME = "/tmp/custom-data";
                    assert.strictEqual(dataDir(), "/tmp/custom-data");
                });

                it("defaults to ~/.local/share when env is unset", () => {
                    delete process.env.XDG_DATA_HOME;
                    assert.strictEqual(dataDir(), path.join(os.homedir(), ".local/share"));
                });
            }
        });

        describe("cacheDir", () => {
            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(cacheDir()));
            });

            if (process.platform === "linux") {
                it("respects XDG_CACHE_HOME", () => {
                    process.env.XDG_CACHE_HOME = "/tmp/custom-cache";
                    assert.strictEqual(cacheDir(), "/tmp/custom-cache");
                });

                it("defaults to ~/.cache when env is unset", () => {
                    delete process.env.XDG_CACHE_HOME;
                    assert.strictEqual(cacheDir(), path.join(os.homedir(), ".cache"));
                });
            }
        });

        describe("stateDir", () => {
            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(stateDir()));
            });

            if (process.platform === "linux") {
                it("respects XDG_STATE_HOME", () => {
                    process.env.XDG_STATE_HOME = "/tmp/custom-state";
                    assert.strictEqual(stateDir(), "/tmp/custom-state");
                });

                it("defaults to ~/.local/state when env is unset", () => {
                    delete process.env.XDG_STATE_HOME;
                    assert.strictEqual(stateDir(), path.join(os.homedir(), ".local/state"));
                });

                it("ignores empty XDG_STATE_HOME", () => {
                    process.env.XDG_STATE_HOME = "";
                    assert.strictEqual(stateDir(), path.join(os.homedir(), ".local/state"));
                });
            }
        });

        describe("logDir", () => {
            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(logDir()));
            });

            if (process.platform === "linux") {
                it("respects XDG_STATE_HOME", () => {
                    process.env.XDG_STATE_HOME = "/tmp/custom-state";
                    assert.strictEqual(logDir(), "/tmp/custom-state");
                });

                it("defaults to ~/.local/state when env is unset", () => {
                    delete process.env.XDG_STATE_HOME;
                    assert.strictEqual(logDir(), path.join(os.homedir(), ".local/state"));
                });
            }
        });

        describe("runtimeDir", () => {
            if (process.platform === "linux") {
                it("returns null when XDG_RUNTIME_DIR is unset", () => {
                    delete process.env.XDG_RUNTIME_DIR;
                    assert.strictEqual(runtimeDir(), null);
                });

                it("respects XDG_RUNTIME_DIR", () => {
                    process.env.XDG_RUNTIME_DIR = "/run/user/1000";
                    assert.strictEqual(runtimeDir(), "/run/user/1000");
                });

                it("ignores empty XDG_RUNTIME_DIR", () => {
                    process.env.XDG_RUNTIME_DIR = "";
                    assert.strictEqual(runtimeDir(), null);
                });
            } else {
                it("returns null on non-Linux platforms", () => {
                    assert.strictEqual(runtimeDir(), null);
                });
            }
        });

        describe("getBasePath", () => {
            it("returns same result as named functions", () => {
                assert.strictEqual(getBasePath("config"), configDir());
                assert.strictEqual(getBasePath("data"), dataDir());
                assert.strictEqual(getBasePath("cache"), cacheDir());
                assert.strictEqual(getBasePath("state"), stateDir());
                assert.strictEqual(getBasePath("log"), logDir());
                assert.strictEqual(getBasePath("runtime"), runtimeDir());
            });

            it("throws for unknown base directory names", () => {
                assert.throws(() => getBasePath("unknown"), /Unknown base directory/);
            });
        });
    });

    describe("configDirs", () => {
        const envKeys = ["XDG_CONFIG_DIRS"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        it("returns an array", () => {
            assert.ok(Array.isArray(configDirs()));
        });

        it("returns non-empty array", () => {
            assert.ok(configDirs().length > 0);
        });

        it("all entries are absolute paths", () => {
            configDirs().forEach((dir) => {
                assert.ok(path.isAbsolute(dir), `expected absolute path: ${dir}`);
            });
        });

        if (process.platform === "linux") {
            it("respects XDG_CONFIG_DIRS", () => {
                process.env.XDG_CONFIG_DIRS = "/tmp/conf1:/tmp/conf2";
                const result = configDirs();
                assert.deepStrictEqual(result, ["/tmp/conf1", "/tmp/conf2"]);
            });

            it("defaults to ['/etc/xdg'] when env is unset", () => {
                delete process.env.XDG_CONFIG_DIRS;
                assert.deepStrictEqual(configDirs(), ["/etc/xdg"]);
            });

            it("ignores empty XDG_CONFIG_DIRS", () => {
                process.env.XDG_CONFIG_DIRS = "";
                assert.deepStrictEqual(configDirs(), ["/etc/xdg"]);
            });

            it("filters empty segments from XDG_CONFIG_DIRS", () => {
                process.env.XDG_CONFIG_DIRS = "/tmp/conf1::/tmp/conf2:";
                const result = configDirs();
                assert.deepStrictEqual(result, ["/tmp/conf1", "/tmp/conf2"]);
            });
        }
    });

    describe("dataDirs", () => {
        const envKeys = ["XDG_DATA_DIRS"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        it("returns an array", () => {
            assert.ok(Array.isArray(dataDirs()));
        });

        it("returns non-empty array", () => {
            assert.ok(dataDirs().length > 0);
        });

        it("all entries are absolute paths", () => {
            dataDirs().forEach((dir) => {
                assert.ok(path.isAbsolute(dir), `expected absolute path: ${dir}`);
            });
        });

        if (process.platform === "linux") {
            it("respects XDG_DATA_DIRS", () => {
                process.env.XDG_DATA_DIRS = "/tmp/data1:/tmp/data2";
                const result = dataDirs();
                assert.deepStrictEqual(result, ["/tmp/data1", "/tmp/data2"]);
            });

            it("defaults to ['/usr/local/share', '/usr/share'] when env is unset", () => {
                delete process.env.XDG_DATA_DIRS;
                assert.deepStrictEqual(dataDirs(), ["/usr/local/share", "/usr/share"]);
            });

            it("ignores empty XDG_DATA_DIRS", () => {
                process.env.XDG_DATA_DIRS = "";
                assert.deepStrictEqual(dataDirs(), ["/usr/local/share", "/usr/share"]);
            });
        }
    });

    describe("projectDirs", () => {
        const envKeys = ["XDG_CONFIG_HOME", "XDG_DATA_HOME", "XDG_CACHE_HOME", "XDG_STATE_HOME", "XDG_RUNTIME_DIR"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        it("throws when name is not provided", () => {
            assert.throws(() => projectDirs(), /non-empty string/);
            assert.throws(() => projectDirs(""), /non-empty string/);
        });

        it("returns an object with all expected keys", () => {
            const dirs = projectDirs("test-app");
            assert.ok(dirs.config);
            assert.ok(dirs.data);
            assert.ok(dirs.cache);
            assert.ok(dirs.state);
            assert.ok(dirs.log);
            assert.ok(dirs.temp);
            // runtime may be null
            assert.ok(dirs.runtime === null || typeof dirs.runtime === "string");
        });

        it("all non-null paths are absolute", () => {
            const dirs = projectDirs("test-app");
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(path.isAbsolute(val), `${key} should be absolute: ${val}`);
                }
            }
        });

        it("paths contain the app name", () => {
            const dirs = projectDirs("my-cool-app");
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(val.includes("my-cool-app"), `${key} should contain app name: ${val}`);
                }
            }
        });

        it("suffix option is appended to app name", () => {
            const dirs = projectDirs("my-app", { suffix: "-nodejs" });
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(val.includes("my-app-nodejs"), `${key} should contain suffixed name: ${val}`);
                }
            }
        });

        it("suffix defaults to empty string", () => {
            const dirs = projectDirs("my-app");
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(!val.includes("my-app-"), `${key} should not have suffix: ${val}`);
                }
            }
        });

        it("vendor option adds parent directory", () => {
            const dirs = projectDirs("my-app", { vendor: "My Org" });
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(val.includes("my-app"), `${key} should contain app name: ${val}`);
                    if (process.platform === "linux") {
                        assert.ok(val.includes("my-org"), `${key} should contain normalized vendor: ${val}`);
                    } else {
                        assert.ok(val.includes("My Org"), `${key} should contain vendor: ${val}`);
                    }
                }
            }
        });

        it("vendor with suffix combines correctly", () => {
            const dirs = projectDirs("my-app", { vendor: "My Org", suffix: "-nodejs" });
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(val.includes("my-app-nodejs"), `${key} should contain suffixed name: ${val}`);
                    if (process.platform === "linux") {
                        assert.ok(val.includes("my-org"), `${key} should contain normalized vendor: ${val}`);
                    } else {
                        assert.ok(val.includes("My Org"), `${key} should contain vendor: ${val}`);
                    }
                }
            }
        });

        it("vendor is not used when not provided", () => {
            const dirs = projectDirs("my-app");
            const dirsWithVendor = projectDirs("my-app", { vendor: "TestVendor" });
            for (const [key, val] of Object.entries(dirs)) {
                if (val !== null) {
                    assert.ok(!val.includes("TestVendor"), `${key} should not contain vendor when not set: ${val}`);
                    assert.ok(!val.includes("testvendor"), `${key} should not contain vendor when not set: ${val}`);
                }
            }
        });

        if (process.platform === "linux") {
            it("vendor is normalized on Linux (lowercase, spaces to hyphens)", () => {
                const dirs = projectDirs("my-app", { vendor: "My Cool Org" });
                assert.ok(dirs.config.includes("my-cool-org"));
                assert.ok(!dirs.config.includes("My Cool Org"));
            });

            it("vendor creates correct path structure on Linux", () => {
                delete process.env.XDG_CONFIG_HOME;
                const dirs = projectDirs("my-app", { vendor: "My Org" });
                assert.strictEqual(dirs.config, path.join(os.homedir(), ".config", "my-org", "my-app"));
            });

            it("config is under XDG_CONFIG_HOME", () => {
                delete process.env.XDG_CONFIG_HOME;
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.config, path.join(os.homedir(), ".config", "test-app"));
            });

            it("data is under XDG_DATA_HOME", () => {
                delete process.env.XDG_DATA_HOME;
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.data, path.join(os.homedir(), ".local/share", "test-app"));
            });

            it("cache is under XDG_CACHE_HOME", () => {
                delete process.env.XDG_CACHE_HOME;
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.cache, path.join(os.homedir(), ".cache", "test-app"));
            });

            it("state is under XDG_STATE_HOME", () => {
                delete process.env.XDG_STATE_HOME;
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.state, path.join(os.homedir(), ".local/state", "test-app"));
            });

            it("log is under XDG_STATE_HOME", () => {
                delete process.env.XDG_STATE_HOME;
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.log, path.join(os.homedir(), ".local/state", "test-app"));
            });

            it("temp is under os.tmpdir()", () => {
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.temp, path.join(os.tmpdir(), "test-app"));
            });

            it("runtime appends to XDG_RUNTIME_DIR when set", () => {
                process.env.XDG_RUNTIME_DIR = "/run/user/1000";
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.runtime, "/run/user/1000/test-app");
            });

            it("runtime is null when XDG_RUNTIME_DIR is unset", () => {
                delete process.env.XDG_RUNTIME_DIR;
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.runtime, null);
            });

            it("respects custom XDG env vars", () => {
                process.env.XDG_CONFIG_HOME = "/tmp/custom-config";
                process.env.XDG_DATA_HOME = "/tmp/custom-data";
                process.env.XDG_CACHE_HOME = "/tmp/custom-cache";
                process.env.XDG_STATE_HOME = "/tmp/custom-state";
                const dirs = projectDirs("test-app");
                assert.strictEqual(dirs.config, "/tmp/custom-config/test-app");
                assert.strictEqual(dirs.data, "/tmp/custom-data/test-app");
                assert.strictEqual(dirs.cache, "/tmp/custom-cache/test-app");
                assert.strictEqual(dirs.state, "/tmp/custom-state/test-app");
                assert.strictEqual(dirs.log, "/tmp/custom-state/test-app");
            });
        }
    });

    describe("projectUserDirs", () => {
        it("throws when name is not provided", () => {
            assert.throws(() => projectUserDirs(), /non-empty string/);
            assert.throws(() => projectUserDirs(""), /non-empty string/);
        });

        it("returns an object with all 8 user directory keys", () => {
            const dirs = projectUserDirs("test-app");
            const expectedKeys = ["desktop", "downloads", "documents", "music", "pictures", "videos", "templates", "publicshare"];
            assert.deepStrictEqual(Object.keys(dirs).sort(), expectedKeys.sort());
        });

        it("all paths are absolute", () => {
            const dirs = projectUserDirs("test-app");
            for (const [key, val] of Object.entries(dirs)) {
                assert.ok(path.isAbsolute(val), `${key} should be absolute: ${val}`);
            }
        });

        it("all paths contain the app name", () => {
            const dirs = projectUserDirs("my-cool-app");
            for (const [key, val] of Object.entries(dirs)) {
                assert.ok(val.includes("my-cool-app"), `${key} should contain app name: ${val}`);
            }
        });

        it("each path ends with app name as last segment", () => {
            const dirs = projectUserDirs("test-app");
            for (const [key, val] of Object.entries(dirs)) {
                assert.strictEqual(path.basename(val), "test-app", `${key} should end with app name`);
            }
        });

        it("each path is the corresponding user dir + app name", () => {
            const dirs = projectUserDirs("test-app");
            assert.strictEqual(dirs.downloads, path.join(getPath("downloads"), "test-app"));
            assert.strictEqual(dirs.desktop, path.join(getPath("desktop"), "test-app"));
            assert.strictEqual(dirs.documents, path.join(getPath("documents"), "test-app"));
            assert.strictEqual(dirs.music, path.join(getPath("music"), "test-app"));
            assert.strictEqual(dirs.pictures, path.join(getPath("pictures"), "test-app"));
            assert.strictEqual(dirs.videos, path.join(getPath("videos"), "test-app"));
            assert.strictEqual(dirs.templates, path.join(getPath("templates"), "test-app"));
            assert.strictEqual(dirs.publicshare, path.join(getPath("publicshare"), "test-app"));
        });
    });

    describe("fontsDir", () => {
        const envKeys = ["XDG_DATA_HOME"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        it("returns an absolute path", () => {
            assert.ok(path.isAbsolute(fontsDir()));
        });

        it("path ends with 'fonts' or 'Fonts'", () => {
            assert.ok(path.basename(fontsDir()).match(/fonts/i));
        });

        if (process.platform === "linux") {
            it("defaults to ~/.local/share/fonts when XDG_DATA_HOME is unset", () => {
                delete process.env.XDG_DATA_HOME;
                assert.strictEqual(fontsDir(), path.join(os.homedir(), ".local", "share", "fonts"));
            });

            it("respects XDG_DATA_HOME", () => {
                process.env.XDG_DATA_HOME = "/tmp/custom-data";
                assert.strictEqual(fontsDir(), "/tmp/custom-data/fonts");
            });

            it("ignores empty XDG_DATA_HOME", () => {
                process.env.XDG_DATA_HOME = "";
                assert.strictEqual(fontsDir(), path.join(os.homedir(), ".local", "share", "fonts"));
            });
        }
    });

    describe("trashDir", () => {
        const envKeys = ["XDG_DATA_HOME"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        it("returns string or null", () => {
            const result = trashDir();
            assert.ok(result === null || typeof result === "string");
        });

        if (process.platform === "win32") {
            it("returns null on Windows", () => {
                assert.strictEqual(trashDir(), null);
            });
        }

        if (process.platform === "linux") {
            it("defaults to ~/.local/share/Trash when XDG_DATA_HOME is unset", () => {
                delete process.env.XDG_DATA_HOME;
                assert.strictEqual(trashDir(), path.join(os.homedir(), ".local", "share", "Trash"));
            });

            it("respects XDG_DATA_HOME", () => {
                process.env.XDG_DATA_HOME = "/tmp/custom-data";
                assert.strictEqual(trashDir(), "/tmp/custom-data/Trash");
            });

            it("ignores empty XDG_DATA_HOME", () => {
                process.env.XDG_DATA_HOME = "";
                assert.strictEqual(trashDir(), path.join(os.homedir(), ".local", "share", "Trash"));
            });

            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(trashDir()));
            });

            it("path ends with Trash", () => {
                assert.strictEqual(path.basename(trashDir()), "Trash");
            });
        }

        if (process.platform === "darwin") {
            it("returns ~/.Trash on macOS", () => {
                assert.strictEqual(trashDir(), path.join(os.homedir(), ".Trash"));
            });

            it("returns an absolute path", () => {
                assert.ok(path.isAbsolute(trashDir()));
            });
        }
    });

    describe("applicationsDir", () => {
        const envKeys = ["XDG_DATA_HOME"];
        const savedEnv = {};

        beforeEach(() => {
            envKeys.forEach((key) => {
                savedEnv[key] = process.env[key];
            });
        });

        afterEach(() => {
            envKeys.forEach((key) => {
                if (savedEnv[key] === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = savedEnv[key];
                }
            });
        });

        it("returns an absolute path", () => {
            assert.ok(path.isAbsolute(applicationsDir()));
        });

        it("returns a string", () => {
            assert.strictEqual(typeof applicationsDir(), "string");
        });

        if (process.platform === "linux") {
            it("defaults to ~/.local/share/applications when XDG_DATA_HOME is unset", () => {
                delete process.env.XDG_DATA_HOME;
                assert.strictEqual(applicationsDir(), path.join(os.homedir(), ".local", "share", "applications"));
            });

            it("respects XDG_DATA_HOME", () => {
                process.env.XDG_DATA_HOME = "/tmp/custom-data";
                assert.strictEqual(applicationsDir(), "/tmp/custom-data/applications");
            });

            it("ignores empty XDG_DATA_HOME", () => {
                process.env.XDG_DATA_HOME = "";
                assert.strictEqual(applicationsDir(), path.join(os.homedir(), ".local", "share", "applications"));
            });
        }

        if (process.platform === "darwin") {
            it("returns ~/Applications on macOS", () => {
                assert.strictEqual(applicationsDir(), path.join(os.homedir(), "Applications"));
            });
        }
    });

    describe("ensureDirSync", () => {
        const tmpDir = path.join(os.tmpdir(), "os-user-dirs-ensure-test");

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it("creates a new directory", () => {
            const dirPath = path.join(tmpDir, "new-dir");
            const result = ensureDirSync(dirPath);
            assert.strictEqual(result, dirPath);
            assert.ok(fs.existsSync(dirPath));
            assert.ok(fs.statSync(dirPath).isDirectory());
        });

        it("creates nested directories recursively", () => {
            const dirPath = path.join(tmpDir, "a", "b", "c");
            const result = ensureDirSync(dirPath);
            assert.strictEqual(result, dirPath);
            assert.ok(fs.existsSync(dirPath));
        });

        it("succeeds when directory already exists", () => {
            const dirPath = path.join(tmpDir, "existing");
            fs.mkdirSync(dirPath, { recursive: true });
            const result = ensureDirSync(dirPath);
            assert.strictEqual(result, dirPath);
            assert.ok(fs.existsSync(dirPath));
        });

        it("throws when path is not provided", () => {
            assert.throws(() => ensureDirSync(), /non-empty string/);
            assert.throws(() => ensureDirSync(""), /non-empty string/);
        });
    });

    describe("ensureDir", () => {
        const tmpDir = path.join(os.tmpdir(), "os-user-dirs-ensure-async-test");

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it("creates a new directory", async () => {
            const dirPath = path.join(tmpDir, "new-dir");
            const result = await ensureDir(dirPath);
            assert.strictEqual(result, dirPath);
            assert.ok(fs.existsSync(dirPath));
            assert.ok(fs.statSync(dirPath).isDirectory());
        });

        it("creates nested directories recursively", async () => {
            const dirPath = path.join(tmpDir, "a", "b", "c");
            const result = await ensureDir(dirPath);
            assert.strictEqual(result, dirPath);
            assert.ok(fs.existsSync(dirPath));
        });

        it("succeeds when directory already exists", async () => {
            const dirPath = path.join(tmpDir, "existing");
            fs.mkdirSync(dirPath, { recursive: true });
            const result = await ensureDir(dirPath);
            assert.strictEqual(result, dirPath);
            assert.ok(fs.existsSync(dirPath));
        });

        it("rejects when path is not provided", async () => {
            await assert.rejects(() => ensureDir(), /non-empty string/);
            await assert.rejects(() => ensureDir(""), /non-empty string/);
        });
    });

    describe("getXDGDownloadDir removal", () => {
        it("getXDGDownloadDir is no longer exported", () => {
            const mod = require("./");
            assert.strictEqual(mod.getXDGDownloadDir, undefined);
        });
    });
});
