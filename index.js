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
    templates: "XDG_TEMPLATES_DIR",
    publicshare: "XDG_PUBLICSHARE_DIR",
};

const MACOS_DEFAULTS = {
    desktop: "Desktop",
    downloads: "Downloads",
    documents: "Documents",
    music: "Music",
    pictures: "Pictures",
    videos: "Movies",
    templates: "Templates",
    publicshare: "Public",
};

const DEFAULT_DIRS = {
    desktop: "Desktop",
    downloads: "Downloads",
    documents: "Documents",
    music: "Music",
    pictures: "Pictures",
    videos: "Videos",
    templates: "Templates",
    publicshare: "Public",
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
function templates() { return resolve("templates"); }
function publicshare() { return resolve("publicshare"); }

const BASE_DIR_CONFIG = {
    config:  { env: "XDG_CONFIG_HOME",  linux: ".config",      darwin: "Library/Application Support", win32: "APPDATA" },
    data:    { env: "XDG_DATA_HOME",    linux: ".local/share",  darwin: "Library/Application Support", win32: "LOCALAPPDATA" },
    cache:   { env: "XDG_CACHE_HOME",   linux: ".cache",        darwin: "Library/Caches",              win32: "LOCALAPPDATA" },
    runtime: { env: "XDG_RUNTIME_DIR",  linux: null,            darwin: null,                          win32: null },
};

function resolveBase(name) {
    const cfg = BASE_DIR_CONFIG[name];
    if (!cfg) {
        throw new Error("Unknown base directory: " + name + ". Valid names: " + Object.keys(BASE_DIR_CONFIG).join(", "));
    }

    const homedir = os.homedir();
    const platform = process.platform;

    // On Linux, check the XDG environment variable first
    if (platform === "linux") {
        const envVal = process.env[cfg.env];
        if (envVal) {
            return path.resolve(envVal);
        }
        // Fall back to default suffix, or null for runtime
        return cfg.linux ? path.join(homedir, cfg.linux) : null;
    }

    if (platform === "darwin") {
        return cfg.darwin ? path.join(homedir, cfg.darwin) : null;
    }

    // Windows: read from environment variable, with hardcoded fallback
    if (platform === "win32") {
        if (cfg.win32) {
            const winVal = process.env[cfg.win32];
            if (winVal) {
                return path.resolve(winVal);
            }
            // Fallback when env var is missing
            if (cfg.win32 === "APPDATA") {
                return path.join(homedir, "AppData", "Roaming");
            }
            if (cfg.win32 === "LOCALAPPDATA") {
                return path.join(homedir, "AppData", "Local");
            }
        }
        return null;
    }

    // Unknown platform: use XDG-style defaults (same as Linux without env var)
    return cfg.linux ? path.join(homedir, cfg.linux) : null;
}

function configDir() { return resolveBase("config"); }
function dataDir() { return resolveBase("data"); }
function cacheDir() { return resolveBase("cache"); }
function runtimeDir() { return resolveBase("runtime"); }

function getBasePath(name) {
    return resolveBase(name);
}

// Backward compatibility: require("os-user-dirs")() returns Downloads path
module.exports = downloads;
module.exports.getPath = getPath;
module.exports.desktop = desktop;
module.exports.downloads = downloads;
module.exports.documents = documents;
module.exports.music = music;
module.exports.pictures = pictures;
module.exports.videos = videos;
module.exports.templates = templates;
module.exports.publicshare = publicshare;
module.exports.configDir = configDir;
module.exports.dataDir = dataDir;
module.exports.cacheDir = cacheDir;
module.exports.runtimeDir = runtimeDir;
module.exports.getBasePath = getBasePath;
module.exports.getXDGUserDir = getXDGUserDir;

// Deprecated: kept for backward compatibility
module.exports.getXDGDownloadDir = function (configPath) {
    return getXDGUserDir("XDG_DOWNLOAD_DIR", configPath);
};
