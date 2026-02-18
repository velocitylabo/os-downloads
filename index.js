const path = require("path");
const os = require("os");
const fs = require("fs");

function getXDGDownloadDir(configPath) {
    configPath = configPath || path.join(os.homedir(), ".config", "user-dirs.dirs");
    try {
        const content = fs.readFileSync(configPath, "utf8");
        const match = content.match(/^XDG_DOWNLOAD_DIR="(.+)"$/m);
        if (match) {
            return path.normalize(match[1].replace("$HOME", os.homedir()));
        }
    } catch (e) {
        // file not found or unreadable, fall through to default
    }
    return null;
}

function downloads() {
    if (process.platform === "linux") {
        const xdgDir = getXDGDownloadDir();
        if (xdgDir) {
            return xdgDir;
        }
    }
    return path.join(os.homedir(), "Downloads");
}

module.exports = downloads;
module.exports.getXDGDownloadDir = getXDGDownloadDir;
