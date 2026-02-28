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

type BaseDirName = "config" | "data" | "cache" | "runtime";

/** Returns the path to the XDG config directory. */
export function configDir(): string;

/** Returns the path to the XDG data directory. */
export function dataDir(): string;

/** Returns the path to the XDG cache directory. */
export function cacheDir(): string;

/** Returns the path to the XDG runtime directory, or null if unavailable. */
export function runtimeDir(): string | null;

/** Returns the path to the specified base directory. */
export function getBasePath(name: "config"): string;
export function getBasePath(name: "data"): string;
export function getBasePath(name: "cache"): string;
export function getBasePath(name: "runtime"): string | null;
export function getBasePath(name: BaseDirName): string | null;

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
    configDir: typeof configDir;
    dataDir: typeof dataDir;
    cacheDir: typeof cacheDir;
    runtimeDir: typeof runtimeDir;
    getBasePath: typeof getBasePath;
    getXDGUserDir: typeof getXDGUserDir;
    getXDGDownloadDir: typeof getXDGDownloadDir;
};

export default osUserDirs;
