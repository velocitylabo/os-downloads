const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");

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
    config:  { env: "XDG_CONFIG_HOME",  linux: ".config",        darwin: "Library/Application Support", win32: "APPDATA" },
    data:    { env: "XDG_DATA_HOME",    linux: ".local/share",   darwin: "Library/Application Support", win32: "LOCALAPPDATA" },
    cache:   { env: "XDG_CACHE_HOME",   linux: ".cache",         darwin: "Library/Caches",              win32: "LOCALAPPDATA" },
    state:   { env: "XDG_STATE_HOME",   linux: ".local/state",   darwin: "Library/Application Support", win32: "LOCALAPPDATA" },
    log:     { env: "XDG_STATE_HOME",   linux: ".local/state",   darwin: "Library/Logs",                win32: "LOCALAPPDATA" },
    runtime: { env: "XDG_RUNTIME_DIR",  linux: null,             darwin: null,                          win32: null },
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

function binDir() {
    if (process.platform === "win32") {
        return null;
    }
    return path.join(os.homedir(), ".local", "bin");
}

function configDir() { return resolveBase("config"); }
function dataDir() { return resolveBase("data"); }
function cacheDir() { return resolveBase("cache"); }
function stateDir() { return resolveBase("state"); }
function logDir() { return resolveBase("log"); }
function runtimeDir() { return resolveBase("runtime"); }

function fontsDir() {
    const platform = process.platform;
    const homedir = os.homedir();

    if (platform === "linux") {
        const envVal = process.env.XDG_DATA_HOME;
        if (envVal) {
            return path.join(path.resolve(envVal), "fonts");
        }
        return path.join(homedir, ".local", "share", "fonts");
    }

    if (platform === "darwin") {
        return path.join(homedir, "Library", "Fonts");
    }

    if (platform === "win32") {
        const localAppData = process.env.LOCALAPPDATA || path.join(homedir, "AppData", "Local");
        return path.join(localAppData, "Microsoft", "Windows", "Fonts");
    }

    // Unknown platform: use XDG-style default
    return path.join(homedir, ".local", "share", "fonts");
}

const SEARCH_DIRS_CONFIG = {
    config: {
        env: "XDG_CONFIG_DIRS",
        linux: ["/etc/xdg"],
        darwin: ["/Library/Application Support", "/Library/Preferences"],
        win32: "PROGRAMDATA",
    },
    data: {
        env: "XDG_DATA_DIRS",
        linux: ["/usr/local/share", "/usr/share"],
        darwin: ["/Library/Application Support"],
        win32: "PROGRAMDATA",
    },
};

function resolveSearchDirs(name) {
    const cfg = SEARCH_DIRS_CONFIG[name];
    if (!cfg) {
        throw new Error("Unknown search directory: " + name + ". Valid names: " + Object.keys(SEARCH_DIRS_CONFIG).join(", "));
    }

    const platform = process.platform;

    if (platform === "linux") {
        const envVal = process.env[cfg.env];
        if (envVal) {
            const dirs = envVal.split(":").filter(Boolean);
            if (dirs.length > 0) {
                return dirs.map(function (d) { return path.resolve(d); });
            }
        }
        return cfg.linux.slice();
    }

    if (platform === "darwin") {
        return cfg.darwin.slice();
    }

    if (platform === "win32") {
        const winVal = process.env[cfg.win32];
        if (winVal) {
            return [path.resolve(winVal)];
        }
        return [path.join(process.env.SYSTEMDRIVE || "C:", "ProgramData")];
    }

    // Unknown platform: use Linux defaults
    return cfg.linux.slice();
}

function configDirs() { return resolveSearchDirs("config"); }
function dataDirs() { return resolveSearchDirs("data"); }

function getBasePath(name) {
    return resolveBase(name);
}

const PROJECT_DIR_WIN32_SUB = {
    config: "Config",
    data:   "Data",
    cache:  "Cache",
    state:  "State",
    log:    "Log",
};

function normalizeVendor(vendor, platform) {
    if (platform === "linux") {
        return vendor.toLowerCase().replace(/\s+/g, "-");
    }
    return vendor;
}

function projectDirs(name, options) {
    if (!name || typeof name !== "string") {
        throw new Error("projectDirs requires a non-empty string name");
    }

    const suffix = (options && options.suffix != null) ? options.suffix : "";
    const vendor = (options && options.vendor) ? options.vendor : "";
    const appName = name + suffix;

    const homedir = os.homedir();
    const platform = process.platform;
    const vendorDir = vendor ? normalizeVendor(vendor, platform) : "";

    function joinWithVendor() {
        const segments = Array.prototype.slice.call(arguments);
        if (vendorDir) {
            segments.splice(1, 0, vendorDir);
        }
        return path.join.apply(path, segments);
    }

    function resolveProject(kind) {
        if (kind === "temp") {
            if (platform === "win32") {
                const localAppData = process.env.LOCALAPPDATA || path.join(homedir, "AppData", "Local");
                return joinWithVendor(localAppData, "Temp", appName);
            }
            return joinWithVendor(os.tmpdir(), appName);
        }

        if (kind === "runtime") {
            if (platform === "linux") {
                const envVal = process.env.XDG_RUNTIME_DIR;
                if (envVal) {
                    return joinWithVendor(path.resolve(envVal), appName);
                }
            }
            return null;
        }

        const base = resolveBase(kind);
        if (!base) { return null; }

        const sub = PROJECT_DIR_WIN32_SUB[kind];
        if (platform === "win32" && sub) {
            return joinWithVendor(base, appName, sub);
        }

        return joinWithVendor(base, appName);
    }

    return {
        config:  resolveProject("config"),
        data:    resolveProject("data"),
        cache:   resolveProject("cache"),
        state:   resolveProject("state"),
        log:     resolveProject("log"),
        temp:    resolveProject("temp"),
        runtime: resolveProject("runtime"),
    };
}

function projectUserDirs(name) {
    if (!name || typeof name !== "string") {
        throw new Error("projectUserDirs requires a non-empty string name");
    }

    const result = {};
    const keys = Object.keys(XDG_KEYS);
    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = path.join(resolve(keys[i]), name);
    }
    return result;
}

function trashDir() {
    const platform = process.platform;
    const homedir = os.homedir();

    if (platform === "linux") {
        const envVal = process.env.XDG_DATA_HOME;
        const base = envVal ? path.resolve(envVal) : path.join(homedir, ".local", "share");
        return path.join(base, "Trash");
    }

    if (platform === "darwin") {
        return path.join(homedir, ".Trash");
    }

    if (platform === "win32") {
        return null;
    }

    // Unknown platform: use XDG-style default
    const envVal = process.env.XDG_DATA_HOME;
    const base = envVal ? path.resolve(envVal) : path.join(homedir, ".local", "share");
    return path.join(base, "Trash");
}

function applicationsDir() {
    const homedir = os.homedir();
    const platform = process.platform;

    if (platform === "linux") {
        const envVal = process.env.XDG_DATA_HOME;
        const base = envVal ? path.resolve(envVal) : path.join(homedir, ".local", "share");
        return path.join(base, "applications");
    }

    if (platform === "darwin") {
        return path.join(homedir, "Applications");
    }

    if (platform === "win32") {
        const appdata = process.env.APPDATA || path.join(homedir, "AppData", "Roaming");
        return path.join(appdata, "Microsoft", "Windows", "Start Menu", "Programs");
    }

    // Unknown platform: use XDG-style default
    return path.join(homedir, ".local", "share", "applications");
}

function homeDir() {
    return os.homedir();
}

function getAllDirs() {
    return {
        downloads: downloads(),
        desktop: desktop(),
        documents: documents(),
        music: music(),
        pictures: pictures(),
        videos: videos(),
        templates: templates(),
        publicshare: publicshare(),
        configDir: configDir(),
        dataDir: dataDir(),
        cacheDir: cacheDir(),
        stateDir: stateDir(),
        logDir: logDir(),
        runtimeDir: runtimeDir(),
        fontsDir: fontsDir(),
        binDir: binDir(),
        applicationsDir: applicationsDir(),
        trashDir: trashDir(),
        homeDir: homeDir(),
    };
}

function ensureDirSync(dirPath) {
    if (!dirPath || typeof dirPath !== "string") {
        throw new Error("ensureDirSync requires a non-empty string path");
    }
    fs.mkdirSync(dirPath, { recursive: true });
    return dirPath;
}

function ensureDir(dirPath) {
    if (!dirPath || typeof dirPath !== "string") {
        return Promise.reject(new Error("ensureDir requires a non-empty string path"));
    }
    return fs.promises.mkdir(dirPath, { recursive: true }).then(function () {
        return dirPath;
    });
}

// Namespace exports
const user = {
    desktop: desktop,
    downloads: downloads,
    documents: documents,
    music: music,
    pictures: pictures,
    videos: videos,
    templates: templates,
    publicshare: publicshare,
    homeDir: homeDir,
    binDir: binDir,
    fontsDir: fontsDir,
    trashDir: trashDir,
    applicationsDir: applicationsDir,
};

const base = {
    configDir: configDir,
    dataDir: dataDir,
    cacheDir: cacheDir,
    stateDir: stateDir,
    logDir: logDir,
    runtimeDir: runtimeDir,
    configDirs: configDirs,
    dataDirs: dataDirs,
};

const project = {
    dirs: projectDirs,
    userDirs: projectUserDirs,
};

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
module.exports.binDir = binDir;
module.exports.configDir = configDir;
module.exports.dataDir = dataDir;
module.exports.cacheDir = cacheDir;
module.exports.stateDir = stateDir;
module.exports.logDir = logDir;
module.exports.runtimeDir = runtimeDir;
module.exports.fontsDir = fontsDir;
module.exports.getBasePath = getBasePath;
module.exports.configDirs = configDirs;
module.exports.dataDirs = dataDirs;
module.exports.projectDirs = projectDirs;
module.exports.applicationsDir = applicationsDir;
module.exports.projectUserDirs = projectUserDirs;
module.exports.homeDir = homeDir;
module.exports.getXDGUserDir = getXDGUserDir;
module.exports.ensureDirSync = ensureDirSync;
module.exports.trashDir = trashDir;
module.exports.ensureDir = ensureDir;
module.exports.getAllDirs = getAllDirs;
module.exports.user = user;
module.exports.base = base;
module.exports.project = project;
