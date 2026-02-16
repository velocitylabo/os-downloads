const path = require("path");
const os = require("os");

function downloads() {
    return path.join(os.homedir(), "Downloads");
}

module.exports = downloads;