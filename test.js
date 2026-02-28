const assert = require("assert");
const path = require("path");
const os = require("os");
const fs = require("fs");
const downloads = require("./");
const {
    getXDGDownloadDir,
    getXDGUserDir,
    getPath,
    desktop,
    documents,
    music,
    pictures,
    videos,
    templates,
    publicshare,
    configDir,
    dataDir,
    cacheDir,
    runtimeDir,
    getBasePath,
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

    describe("base directories", () => {
        const envKeys = ["XDG_CONFIG_HOME", "XDG_DATA_HOME", "XDG_CACHE_HOME", "XDG_RUNTIME_DIR"];
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
                assert.strictEqual(getBasePath("runtime"), runtimeDir());
            });

            it("throws for unknown base directory names", () => {
                assert.throws(() => getBasePath("unknown"), /Unknown base directory/);
            });
        });
    });

    describe("getXDGDownloadDir (backward compatibility)", () => {
        const tmpDir = path.join(os.tmpdir(), "os-user-dirs-test");

        beforeEach(() => {
            fs.mkdirSync(tmpDir, { recursive: true });
        });

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it("parses XDG_DOWNLOAD_DIR with $HOME", () => {
            const configPath = path.join(tmpDir, "user-dirs.dirs");
            fs.writeFileSync(configPath, 'XDG_DOWNLOAD_DIR="$HOME/Downloads"\n');
            const result = getXDGDownloadDir(configPath);
            assert.strictEqual(result, path.join(os.homedir(), "Downloads"));
        });

        it("returns null when config file does not exist", () => {
            const configPath = path.join(tmpDir, "nonexistent");
            const result = getXDGDownloadDir(configPath);
            assert.strictEqual(result, null);
        });
    });
});
