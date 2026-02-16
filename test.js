const assert = require("assert");
const fs = require("fs");
const path = require("path");
const os = require("os");
const downloads = require("./");

describe("os-downloads", () => {
    describe("downloads", () => {
        it("directory exists", () => {
            assert.ok(fs.existsSync(downloads()));
        });

        it("returns an absolute path", () => {
            assert.ok(path.isAbsolute(downloads()));
        });

        it("path starts with home directory", () => {
            assert.ok(downloads().startsWith(os.homedir()));
        });
    });
});
