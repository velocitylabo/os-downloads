const path = require("path");
const os = require("os");
const fs = require("fs");

const XDG_KEYS = {
    desktop: "XDG_DESKTOP_DIR",
    downloads: "XDG_DOWNLOAD_DIR",
    documents: "XDG_DOCUMENTS_DIR",
    music: "XDG_MUSIC_DIR",
    pictures: "XDG_PICTURES_DIR",
    videos: "XDG_VIDEOS_DIR",
};

const MACOS_DEFAULTS = {
    desktop: "Desktop",
    downloads: "Downloads",
    documents: "Documents",
    music: "Music",
    pictures: "Pictures",
    videos: "Movies",
};

const DEFAULT_DIRS = {
    desktop: "Desktop",
    downloads: "Downloads",
    documents: "Documents",
    music: "Music",
    pictures: "Pictures",
    videos: "Videos",
};

function getXDGUserDir(key, configPath) {
    configPath = configPath || path.join(os.homedir(), ".config", "user-dirs.dirs");
    try {
        const content = fs.readFileSync(configPath, "utf8");
        const regex = new RegExp('^' + key + '="(.+)"$', "m");
        const match = content.match(regex);
        if (match) {
            return path.normalize(match[1].replace("$HOME", os.homedir()));
        }
    } catch (e) {
        // file not found or unreadable, fall through to default
    }
    return null;
}

function resolve(name) {
    const xdgKey = XDG_KEYS[name];
    if (!xdgKey) {
        throw new Error("Unknown directory: " + name + ". Valid names: " + Object.keys(XDG_KEYS).join(", "));
    }

    if (process.platform === "linux") {
        const xdgDir = getXDGUserDir(xdgKey);
        if (xdgDir) {
            return xdgDir;
        }
    }

    const dirName = process.platform === "darwin"
        ? MACOS_DEFAULTS[name]
        : DEFAULT_DIRS[name];

    return path.join(os.homedir(), dirName);
}

function getPath(name) {
    return resolve(name);
}

function desktop() { return resolve("desktop"); }
function downloads() { return resolve("downloads"); }
function documents() { return resolve("documents"); }
function music() { return resolve("music"); }
function pictures() { return resolve("pictures"); }
function videos() { return resolve("videos"); }

// Backward compatibility: require("os-user-dirs")() returns Downloads path
module.exports = downloads;
module.exports.getPath = getPath;
module.exports.desktop = desktop;
module.exports.downloads = downloads;
module.exports.documents = documents;
module.exports.music = music;
module.exports.pictures = pictures;
module.exports.videos = videos;
module.exports.getXDGUserDir = getXDGUserDir;

// Deprecated: kept for backward compatibility
module.exports.getXDGDownloadDir = function (configPath) {
    return getXDGUserDir("XDG_DOWNLOAD_DIR", configPath);
};
