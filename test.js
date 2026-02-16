const assert = require("assert");
const fs = require("fs");
const downloads = require("./");

describe("os-downloads", () => {
    describe("downloads", () => {
        it("directory exists", () => {
            assert.ok(fs.existsSync(downloads()));
        });
    });
});