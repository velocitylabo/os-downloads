type DirName = "desktop" | "downloads" | "documents" | "music" | "pictures" | "videos" | "templates" | "publicshare";

/** Returns the path to the Desktop directory. */
export function desktop(): string;

/** Returns the path to the Downloads directory. */
export function downloads(): string;

/** Returns the path to the Documents directory. */
export function documents(): string;

/** Returns the path to the Music directory. */
export function music(): string;

/** Returns the path to the Pictures directory. */
export function pictures(): string;

/** Returns the path to the Videos directory (Movies on macOS). */
export function videos(): string;

/** Returns the path to the Templates directory. */
export function templates(): string;

/** Returns the path to the Public Share directory. */
export function publicshare(): string;

/** Returns the path to the specified user directory. */
export function getPath(name: DirName): string;

/** Returns the path to the user local bin directory (~/.local/bin), or null on Windows. */
export function binDir(): string | null;

type BaseDirName = "config" | "data" | "cache" | "state" | "log" | "runtime";

/** Returns the path to the XDG config directory. */
export function configDir(): string;

/** Returns the path to the XDG data directory. */
export function dataDir(): string;

/** Returns the path to the XDG cache directory. */
export function cacheDir(): string;

/** Returns the path to the XDG state directory. */
export function stateDir(): string;

/** Returns the path to the log directory. */
export function logDir(): string;

/** Returns the path to the XDG runtime directory, or null if unavailable. */
export function runtimeDir(): string | null;

/**
 * Returns the system config directory search path list.
 * On Linux, reads `$XDG_CONFIG_DIRS` (default: `["/etc/xdg"]`).
 * On macOS: `["/Library/Application Support", "/Library/Preferences"]`.
 * On Windows: `[%PROGRAMDATA%]`.
 */
export function configDirs(): string[];

/**
 * Returns the system data directory search path list.
 * On Linux, reads `$XDG_DATA_DIRS` (default: `["/usr/local/share", "/usr/share"]`).
 * On macOS: `["/Library/Application Support"]`.
 * On Windows: `[%PROGRAMDATA%]`.
 */
export function dataDirs(): string[];

/** Returns the path to the specified base directory. */
export function getBasePath(name: "config"): string;
export function getBasePath(name: "data"): string;
export function getBasePath(name: "cache"): string;
export function getBasePath(name: "state"): string;
export function getBasePath(name: "log"): string;
export function getBasePath(name: "runtime"): string | null;
export function getBasePath(name: BaseDirName): string | null;

interface ProjectDirsOptions {
    /** Suffix appended to the app name (default: ""). */
    suffix?: string;
}

interface ProjectDirsResult {
    config: string;
    data: string;
    cache: string;
    state: string;
    log: string;
    temp: string;
    runtime: string | null;
}

/**
 * Returns application-scoped directories for the given app name.
 * @param name - Application name used to derive directory paths
 * @param options - Optional settings (e.g. suffix)
 */
export function projectDirs(name: string, options?: ProjectDirsOptions): ProjectDirsResult;

/**
 * Reads an XDG user-dirs.dirs config and returns the directory for the given key.
 * @param key - XDG key (e.g. "XDG_DOWNLOAD_DIR")
 * @param configPath - Optional path to user-dirs.dirs config file
 * @returns The resolved directory path, or null if not found
 */
export function getXDGUserDir(key: string, configPath?: string): string | null;

/**
 * @deprecated Use `getXDGUserDir("XDG_DOWNLOAD_DIR", configPath)` instead.
 */
export function getXDGDownloadDir(configPath?: string): string | null;

declare const osUserDirs: typeof downloads & {
    downloads: typeof downloads;
    desktop: typeof desktop;
    documents: typeof documents;
    music: typeof music;
    pictures: typeof pictures;
    videos: typeof videos;
    templates: typeof templates;
    publicshare: typeof publicshare;
    getPath: typeof getPath;
    binDir: typeof binDir;
    configDir: typeof configDir;
    dataDir: typeof dataDir;
    cacheDir: typeof cacheDir;
    stateDir: typeof stateDir;
    logDir: typeof logDir;
    runtimeDir: typeof runtimeDir;
    getBasePath: typeof getBasePath;
    configDirs: typeof configDirs;
    dataDirs: typeof dataDirs;
    projectDirs: typeof projectDirs;
    getXDGUserDir: typeof getXDGUserDir;
    getXDGDownloadDir: typeof getXDGDownloadDir;
};

export default osUserDirs;
