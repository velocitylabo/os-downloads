type DirName = "desktop" | "downloads" | "documents" | "music" | "pictures" | "videos" | "templates" | "publicshare";

/**
 * Returns the path to the Desktop directory.
 * @example
 * ```ts
 * import { desktop } from 'os-user-dirs';
 * const dir = desktop();
 * // Linux:   '/home/user/Desktop'
 * // macOS:   '/Users/user/Desktop'
 * // Windows: 'C:\\Users\\user\\Desktop'
 * ```
 */
export function desktop(): string;

/**
 * Returns the path to the Downloads directory.
 * @example
 * ```ts
 * import { downloads } from 'os-user-dirs';
 * const dir = downloads();
 * // Linux:   '/home/user/Downloads'
 * // macOS:   '/Users/user/Downloads'
 * // Windows: 'C:\\Users\\user\\Downloads'
 * ```
 */
export function downloads(): string;

/**
 * Returns the path to the Documents directory.
 * @example
 * ```ts
 * import { documents } from 'os-user-dirs';
 * const dir = documents();
 * // Linux:   '/home/user/Documents'
 * // macOS:   '/Users/user/Documents'
 * // Windows: 'C:\\Users\\user\\Documents'
 * ```
 */
export function documents(): string;

/**
 * Returns the path to the Music directory.
 * @example
 * ```ts
 * import { music } from 'os-user-dirs';
 * const dir = music();
 * // Linux:   '/home/user/Music'
 * // macOS:   '/Users/user/Music'
 * // Windows: 'C:\\Users\\user\\Music'
 * ```
 */
export function music(): string;

/**
 * Returns the path to the Pictures directory.
 * @example
 * ```ts
 * import { pictures } from 'os-user-dirs';
 * const dir = pictures();
 * // Linux:   '/home/user/Pictures'
 * // macOS:   '/Users/user/Pictures'
 * // Windows: 'C:\\Users\\user\\Pictures'
 * ```
 */
export function pictures(): string;

/**
 * Returns the path to the Videos directory (Movies on macOS).
 * @example
 * ```ts
 * import { videos } from 'os-user-dirs';
 * const dir = videos();
 * // Linux:   '/home/user/Videos'
 * // macOS:   '/Users/user/Movies'
 * // Windows: 'C:\\Users\\user\\Videos'
 * ```
 */
export function videos(): string;

/**
 * Returns the path to the Templates directory.
 * @example
 * ```ts
 * import { templates } from 'os-user-dirs';
 * const dir = templates();
 * // Linux:   '/home/user/Templates'
 * // macOS:   '/Users/user/Templates'
 * // Windows: 'C:\\Users\\user\\Templates'
 * ```
 */
export function templates(): string;

/**
 * Returns the path to the Public Share directory.
 * @example
 * ```ts
 * import { publicshare } from 'os-user-dirs';
 * const dir = publicshare();
 * // Linux:   '/home/user/Public'
 * // macOS:   '/Users/user/Public'
 * // Windows: 'C:\\Users\\user\\Public'
 * ```
 */
export function publicshare(): string;

/**
 * Returns the path to the specified user directory.
 * @param name - Directory name to resolve
 * @example
 * ```ts
 * import { getPath } from 'os-user-dirs';
 * const dir = getPath('downloads'); // '/home/user/Downloads'
 * const dir2 = getPath('desktop');  // '/home/user/Desktop'
 * ```
 */
export function getPath(name: DirName): string;

/**
 * Returns the path to the user's home directory.
 * @example
 * ```ts
 * import { homeDir } from 'os-user-dirs';
 * const dir = homeDir();
 * // Linux:   '/home/user'
 * // macOS:   '/Users/user'
 * // Windows: 'C:\\Users\\user'
 * ```
 */
export function homeDir(): string;

/**
 * Returns the path to the user local bin directory (~/.local/bin), or null on Windows.
 * @example
 * ```ts
 * import { binDir } from 'os-user-dirs';
 * const dir = binDir();
 * // Linux/macOS: '/home/user/.local/bin'
 * // Windows:     null
 * ```
 */
export function binDir(): string | null;

type BaseDirName = "config" | "data" | "cache" | "state" | "log" | "runtime";

/**
 * Returns the path to the XDG config directory.
 * @example
 * ```ts
 * import { configDir } from 'os-user-dirs';
 * const dir = configDir();
 * // Linux:   '/home/user/.config'
 * // macOS:   '/Users/user/Library/Application Support'
 * // Windows: 'C:\\Users\\user\\AppData\\Roaming'
 * ```
 */
export function configDir(): string;

/**
 * Returns the path to the XDG data directory.
 * @example
 * ```ts
 * import { dataDir } from 'os-user-dirs';
 * const dir = dataDir();
 * // Linux:   '/home/user/.local/share'
 * // macOS:   '/Users/user/Library/Application Support'
 * // Windows: 'C:\\Users\\user\\AppData\\Local'
 * ```
 */
export function dataDir(): string;

/**
 * Returns the path to the XDG cache directory.
 * @example
 * ```ts
 * import { cacheDir } from 'os-user-dirs';
 * const dir = cacheDir();
 * // Linux:   '/home/user/.cache'
 * // macOS:   '/Users/user/Library/Caches'
 * // Windows: 'C:\\Users\\user\\AppData\\Local'
 * ```
 */
export function cacheDir(): string;

/**
 * Returns the path to the XDG state directory.
 * @example
 * ```ts
 * import { stateDir } from 'os-user-dirs';
 * const dir = stateDir();
 * // Linux:   '/home/user/.local/state'
 * // macOS:   '/Users/user/Library/Application Support'
 * // Windows: 'C:\\Users\\user\\AppData\\Local'
 * ```
 */
export function stateDir(): string;

/**
 * Returns the path to the log directory.
 * @example
 * ```ts
 * import { logDir } from 'os-user-dirs';
 * const dir = logDir();
 * // Linux:   '/home/user/.local/state'
 * // macOS:   '/Users/user/Library/Logs'
 * // Windows: 'C:\\Users\\user\\AppData\\Local'
 * ```
 */
export function logDir(): string;

/**
 * Returns the path to the XDG runtime directory, or null if unavailable.
 * @example
 * ```ts
 * import { runtimeDir } from 'os-user-dirs';
 * const dir = runtimeDir();
 * // Linux:   '/run/user/1000' (if $XDG_RUNTIME_DIR is set)
 * // macOS:   null
 * // Windows: null
 * ```
 */
export function runtimeDir(): string | null;

/**
 * Returns the path to the user fonts directory.
 * @example
 * ```ts
 * import { fontsDir } from 'os-user-dirs';
 * const dir = fontsDir();
 * // Linux:   '/home/user/.local/share/fonts'
 * // macOS:   '/Users/user/Library/Fonts'
 * // Windows: 'C:\\Users\\user\\AppData\\Local\\Microsoft\\Windows\\Fonts'
 * ```
 */
export function fontsDir(): string;

/**
 * Returns the system config directory search path list.
 * On Linux, reads `$XDG_CONFIG_DIRS` (default: `["/etc/xdg"]`).
 * On macOS: `["/Library/Application Support", "/Library/Preferences"]`.
 * On Windows: `[%PROGRAMDATA%]`.
 * @example
 * ```ts
 * import { configDirs } from 'os-user-dirs';
 * const dirs = configDirs();
 * // Linux:   ['/etc/xdg']
 * // macOS:   ['/Library/Application Support', '/Library/Preferences']
 * // Windows: ['C:\\ProgramData']
 * ```
 */
export function configDirs(): string[];

/**
 * Returns the system data directory search path list.
 * On Linux, reads `$XDG_DATA_DIRS` (default: `["/usr/local/share", "/usr/share"]`).
 * On macOS: `["/Library/Application Support"]`.
 * On Windows: `[%PROGRAMDATA%]`.
 * @example
 * ```ts
 * import { dataDirs } from 'os-user-dirs';
 * const dirs = dataDirs();
 * // Linux:   ['/usr/local/share', '/usr/share']
 * // macOS:   ['/Library/Application Support']
 * // Windows: ['C:\\ProgramData']
 * ```
 */
export function dataDirs(): string[];

/**
 * Returns the path to the specified base directory.
 * @param name - Base directory name to resolve
 * @example
 * ```ts
 * import { getBasePath } from 'os-user-dirs';
 * const config = getBasePath('config');  // '/home/user/.config'
 * const data = getBasePath('data');      // '/home/user/.local/share'
 * const runtime = getBasePath('runtime'); // '/run/user/1000' or null
 * ```
 */
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
    /** Vendor/organization name used as a parent directory (e.g. "My Org"). On Linux, normalized to lowercase with hyphens. */
    vendor?: string;
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
 * @param options - Optional settings (e.g. vendor, suffix)
 * @example
 * ```ts
 * import { projectDirs } from 'os-user-dirs';
 * const dirs = projectDirs('my-app');
 * // Linux:   dirs.config => '/home/user/.config/my-app'
 * // macOS:   dirs.config => '/Users/user/Library/Application Support/my-app'
 * // Windows: dirs.config => 'C:\\Users\\user\\AppData\\Local\\my-app\\Config'
 * ```
 * @example
 * ```ts
 * // With vendor option
 * const dirs = projectDirs('my-app', { vendor: 'My Org' });
 * // Linux:   dirs.config => '/home/user/.config/my-org/my-app'
 * // macOS:   dirs.config => '/Users/user/Library/Application Support/My Org/my-app'
 * // Windows: dirs.config => 'C:\\Users\\user\\AppData\\Local\\My Org\\my-app\\Config'
 * ```
 * @example
 * ```ts
 * // With suffix option
 * const dirs = projectDirs('my-app', { suffix: '-beta' });
 * // Linux:   dirs.config => '/home/user/.config/my-app-beta'
 * ```
 */
export function projectDirs(name: string, options?: ProjectDirsOptions): ProjectDirsResult;

interface ProjectUserDirsResult {
    desktop: string;
    downloads: string;
    documents: string;
    music: string;
    pictures: string;
    videos: string;
    templates: string;
    publicshare: string;
}

/**
 * Returns project-scoped user directories for the given app name.
 * Each value is the user directory path with the app name appended as a subdirectory.
 * @param name - Application name used to derive directory paths
 * @example
 * ```ts
 * import { projectUserDirs } from 'os-user-dirs';
 * const dirs = projectUserDirs('my-app');
 * // dirs.downloads => '/home/user/Downloads/my-app'
 * // dirs.documents => '/home/user/Documents/my-app'
 * // dirs.desktop   => '/home/user/Desktop/my-app'
 * ```
 */
export function projectUserDirs(name: string): ProjectUserDirsResult;

/**
 * Returns the path to the user trash directory, or null on Windows.
 * Linux: `$XDG_DATA_HOME/Trash` (default `~/.local/share/Trash`)
 * macOS: `~/.Trash`
 * Windows: `null` (Recycle Bin requires Shell API)
 * @example
 * ```ts
 * import { trashDir } from 'os-user-dirs';
 * const dir = trashDir();
 * // Linux:   '/home/user/.local/share/Trash'
 * // macOS:   '/Users/user/.Trash'
 * // Windows: null
 * ```
 */
export function trashDir(): string | null;

/**
 * Returns the path to the user applications directory.
 * Linux: `$XDG_DATA_HOME/applications` (default `~/.local/share/applications`)
 * macOS: `~/Applications`
 * Windows: `%APPDATA%/Microsoft/Windows/Start Menu/Programs`
 * @example
 * ```ts
 * import { applicationsDir } from 'os-user-dirs';
 * const dir = applicationsDir();
 * // Linux:   '/home/user/.local/share/applications'
 * // macOS:   '/Users/user/Applications'
 * // Windows: 'C:\\Users\\user\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs'
 * ```
 */
export function applicationsDir(): string;

/**
 * Reads an XDG user-dirs.dirs config and returns the directory for the given key.
 * @param key - XDG key (e.g. "XDG_DOWNLOAD_DIR")
 * @param configPath - Optional path to user-dirs.dirs config file
 * @returns The resolved directory path, or null if not found
 * @example
 * ```ts
 * import { getXDGUserDir } from 'os-user-dirs';
 * const dir = getXDGUserDir('XDG_DOWNLOAD_DIR'); // '/home/user/Downloads'
 * const dir2 = getXDGUserDir('XDG_DESKTOP_DIR'); // '/home/user/Desktop'
 * ```
 */
export function getXDGUserDir(key: string, configPath?: string): string | null;

/**
 * Ensures the specified directory exists, creating it recursively if necessary.
 * @param dirPath - The directory path to ensure exists
 * @returns The directory path
 * @example
 * ```ts
 * import { ensureDirSync, configDir } from 'os-user-dirs';
 * const dir = ensureDirSync(configDir() + '/my-app');
 * // Creates the directory if it doesn't exist and returns the path
 * ```
 */
export function ensureDirSync(dirPath: string): string;

/**
 * Ensures the specified directory exists, creating it recursively if necessary (async version).
 * @param dirPath - The directory path to ensure exists
 * @returns A promise that resolves with the directory path
 * @example
 * ```ts
 * import { ensureDir, cacheDir } from 'os-user-dirs';
 * const dir = await ensureDir(cacheDir() + '/my-app');
 * // Creates the directory if it doesn't exist and returns the path
 * ```
 */
export function ensureDir(dirPath: string): Promise<string>;

interface GetAllDirsResult {
    downloads: string;
    desktop: string;
    documents: string;
    music: string;
    pictures: string;
    videos: string;
    templates: string;
    publicshare: string;
    configDir: string;
    dataDir: string;
    cacheDir: string;
    stateDir: string;
    logDir: string;
    runtimeDir: string | null;
    fontsDir: string;
    binDir: string | null;
    applicationsDir: string;
    trashDir: string | null;
    homeDir: string;
}

/**
 * Returns all directory paths as a single object.
 * Useful for debugging, configuration dumps, or diagnostics.
 * Does not include array-returning functions (`configDirs`, `dataDirs`)
 * or functions requiring arguments (`projectDirs`, `projectUserDirs`).
 * @example
 * ```ts
 * import { getAllDirs } from 'os-user-dirs';
 * const dirs = getAllDirs();
 * console.log(dirs.downloads);  // '/home/user/Downloads'
 * console.log(dirs.configDir);  // '/home/user/.config'
 * console.log(dirs.homeDir);    // '/home/user'
 * ```
 */
export function getAllDirs(): GetAllDirsResult;

/**
 * Namespace grouping user directory functions.
 * Provides organized access to user-specific directory functions.
 * @example
 * ```ts
 * import { user } from 'os-user-dirs';
 * user.downloads();   // '/home/user/Downloads'
 * user.desktop();     // '/home/user/Desktop'
 * user.homeDir();     // '/home/user'
 * ```
 */
export const user: {
    desktop: typeof desktop;
    downloads: typeof downloads;
    documents: typeof documents;
    music: typeof music;
    pictures: typeof pictures;
    videos: typeof videos;
    templates: typeof templates;
    publicshare: typeof publicshare;
    homeDir: typeof homeDir;
    binDir: typeof binDir;
    fontsDir: typeof fontsDir;
    trashDir: typeof trashDir;
    applicationsDir: typeof applicationsDir;
};

/**
 * Namespace grouping XDG base directory functions.
 * Provides organized access to base directory and search path functions.
 * @example
 * ```ts
 * import { base } from 'os-user-dirs';
 * base.configDir();   // '/home/user/.config'
 * base.dataDir();     // '/home/user/.local/share'
 * base.configDirs();  // ['/etc/xdg']
 * ```
 */
export const base: {
    configDir: typeof configDir;
    dataDir: typeof dataDir;
    cacheDir: typeof cacheDir;
    stateDir: typeof stateDir;
    logDir: typeof logDir;
    runtimeDir: typeof runtimeDir;
    configDirs: typeof configDirs;
    dataDirs: typeof dataDirs;
};

/**
 * Namespace grouping project-scoped directory functions.
 * Provides organized access to application-scoped directory functions.
 * @example
 * ```ts
 * import { project } from 'os-user-dirs';
 * const dirs = project.dirs('my-app');
 * dirs.config;  // '/home/user/.config/my-app'
 * const userDirs = project.userDirs('my-app');
 * userDirs.downloads;  // '/home/user/Downloads/my-app'
 * ```
 */
export const project: {
    dirs: typeof projectDirs;
    userDirs: typeof projectUserDirs;
};

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
    fontsDir: typeof fontsDir;
    getBasePath: typeof getBasePath;
    configDirs: typeof configDirs;
    dataDirs: typeof dataDirs;
    projectDirs: typeof projectDirs;
    trashDir: typeof trashDir;
    applicationsDir: typeof applicationsDir;
    projectUserDirs: typeof projectUserDirs;
    homeDir: typeof homeDir;
    getXDGUserDir: typeof getXDGUserDir;
    ensureDirSync: typeof ensureDirSync;
    ensureDir: typeof ensureDir;
    getAllDirs: typeof getAllDirs;
    user: typeof user;
    base: typeof base;
    project: typeof project;
};

export default osUserDirs;
