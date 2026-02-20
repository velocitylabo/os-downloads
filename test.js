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
