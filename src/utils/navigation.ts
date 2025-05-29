interface NavItem {
    title: string;
    url: string;
    children: NavItem[];
    order?: number;
    type: 'page' | 'section' | 'external';
    external?: boolean;
}

interface ContentModule {
    frontmatter: {
        title: string;
        order?: number;
        draft?: boolean;
        isPage?: boolean;
        external?: string;
        [key: string]: any;
    };
    default?: any;
    content?: string;
}

export async function buildNavigation(): Promise<NavItem[]> {
    const contentModules = import.meta.glob('/src/content/**/*.{md,mdx}', {
        eager: true
    }) as Record<string, ContentModule>;

    const navTree: NavItem[] = [];
    const allFiles = new Map<string, ContentModule>();
    const folderIndexes = new Map<string, ContentModule>();

    // Collect and categorize all files
    Object.entries(contentModules).forEach(([filePath, module]) => {
        if (module.frontmatter?.draft) return;

        const relativePath = filePath
            .replace('/src/content/', '')
            .replace(/\.(md|mdx)$/, '');

        allFiles.set(relativePath, module);

        if (relativePath.endsWith('/index')) {
            const folderPath = relativePath.replace(/\/index$/, '');
            folderIndexes.set(folderPath, module);
        }
    });

    // Helper functions
    function getDefaultTitle(path: string): string {
        const lastPart = path.split('/').pop() || '';
        return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ');
    }

    function ensurePathExists(pathParts: string[]): NavItem[] {
        let currentLevel = navTree;

        for (let i = 0; i < pathParts.length - 1; i++) {
            const folderPath = pathParts.slice(0, i + 1).join('/');
            const folderUrl = '/' + folderPath;

            let folderItem = currentLevel.find(item => item.url === folderUrl || item.url.startsWith('http'));

            if (!folderItem) {
                const indexData = folderIndexes.get(folderPath);
                const isExternal = !!indexData?.frontmatter.external;

                folderItem = {
                    title: indexData?.frontmatter.title || getDefaultTitle(folderPath),
                    url: isExternal ? indexData!.frontmatter.external! : folderUrl,
                    children: [],
                    order: indexData?.frontmatter.order ?? -1,
                    type: isExternal ? 'external' : (indexData?.frontmatter.isPage ? 'page' : 'section'),
                    external: isExternal
                };

                currentLevel.push(folderItem);
            }

            currentLevel = folderItem.children;
        }

        return currentLevel;
    }

    // Process all files
    allFiles.forEach((module, relativePath) => {
        if (relativePath.endsWith('/index')) return;

        const pathParts = relativePath.split('/');
        const isExternal = !!module.frontmatter.external;

        const navItem: NavItem = {
            title: module.frontmatter.title || getDefaultTitle(pathParts[pathParts.length - 1]),
            url: isExternal ? module.frontmatter.external! : '/' + relativePath,
            children: [],
            order: module.frontmatter.order,
            type: isExternal ? 'external' : 'page',
            external: isExternal
        };

        if (pathParts.length === 1) {
            navTree.push(navItem);
        } else {
            const targetLevel = ensurePathExists(pathParts);
            targetLevel.push(navItem);
        }
    });

    // Sort function
    function sortNavItems(items: NavItem[]): void {
        items.sort((a, b) => {
            if (a.order === b.order) {
                if (a.type === 'page' && b.type === 'section') return -1;
                if (a.type === 'section' && b.type === 'page') return 1;
            }

            const aOrder = a.order ?? 999;
            const bOrder = b.order ?? 999;
            if (aOrder !== bOrder) return aOrder - bOrder;

            return a.title.localeCompare(b.title);
        });

        items.forEach(item => {
            if (item.children.length > 0) {
                sortNavItems(item.children);
            }
        });
    }

    sortNavItems(navTree);
    return navTree;
}

export function isClickable(item: NavItem): boolean {
    return item.type === 'page' || item.type === 'external';
}

export function getBreadcrumbs(currentPath: string, navTree: NavItem[]): NavItem[] {
    const breadcrumbs: NavItem[] = [];

    const findPath = (items: NavItem[], path: string): boolean => {
        for (const item of items) {
            if (item.url === path || (path.startsWith(item.url + '/') && item.url !== '/')) {
                breadcrumbs.push(item);

                if (item.url === path) return true;
                if (item.children.length > 0 && findPath(item.children, path)) return true;
            }
        }
        return false;
    };

    findPath(navTree, currentPath);
    return breadcrumbs;
}

export function isActiveNavItem(itemUrl: string, currentPath: string): boolean {
    const cleanItemUrl = itemUrl.replace(/\/$/, '') || '/';
    const cleanCurrentPath = currentPath.replace(/\/$/, '') || '/';

    if (cleanItemUrl === cleanCurrentPath) return true;
    return cleanCurrentPath.startsWith(cleanItemUrl + '/') && cleanItemUrl !== '/';
}