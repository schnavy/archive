// src/utils/navigation.ts
interface NavItem {
    title: string;
    url: string;
    children: NavItem[];
    order?: number;
    hasIndex?: boolean;
  }
  
  interface ContentModule {
    frontmatter: {
      title: string;
      order?: number;
      draft?: boolean;
      [key: string]: any;
    };
    default?: any;
  }
  
  export async function buildNavigation(): Promise<NavItem[]> {
    // Get all markdown/mdx files from content directory
    const contentModules = import.meta.glob('/src/content/**/*.{md,mdx}', { 
      eager: true 
    }) as Record<string, ContentModule>;
  
    const navTree: NavItem[] = [];
    const indexFiles = new Map<string, ContentModule>();
    
    // First pass: collect all index files
    Object.entries(contentModules).forEach(([filePath, module]) => {
      if (module.frontmatter?.draft) return;
      
      const relativePath = filePath
        .replace('/src/content/', '')
        .replace(/\.(md|mdx)$/, '');
        
      if (relativePath.endsWith('/index')) {
        const folderPath = relativePath.replace(/\/index$/, '');
        indexFiles.set(folderPath, module);
      }
    });
    
    // Helper function to find or create nav item at specific path
    function findOrCreateNavItem(pathParts: string[], level: NavItem[]): NavItem {
      const currentPath = pathParts.join('/');
      const currentPart = pathParts[pathParts.length - 1];
      
      let existingItem = level.find(item => {
        const itemPath = item.url.replace(/^\//, '').replace(/\/$/, '');
        return itemPath === currentPath;
      });
      
      if (!existingItem) {
        const hasIndex = indexFiles.has(currentPath);
        const indexData = indexFiles.get(currentPath);
        
        existingItem = {
          title: hasIndex && indexData ? 
            indexData.frontmatter.title : 
            currentPart.charAt(0).toUpperCase() + currentPart.slice(1).replace(/-/g, ' '),
          url: '/' + currentPath,
          children: [],
          order: hasIndex && indexData ? indexData.frontmatter.order : undefined,
          hasIndex: hasIndex
        };
        
        level.push(existingItem);
      }
      
      return existingItem;
    }
    
    // Second pass: process all files
    Object.entries(contentModules).forEach(([filePath, module]) => {
      if (module.frontmatter?.draft) return;
      
      const relativePath = filePath
        .replace('/src/content/', '')
        .replace(/\.(md|mdx)$/, '');
      
      // Skip index files (they're handled by findOrCreateNavItem)
      if (relativePath.endsWith('/index')) {
        return;
      }
      
      const pathParts = relativePath.split('/');
      
      // Handle top-level pages (no folder structure)
      if (pathParts.length === 1) {
        navTree.push({
          title: module.frontmatter.title || pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1),
          url: '/' + relativePath,
          children: [],
          order: module.frontmatter.order,
          hasIndex: false
        });
        return;
      }
      
      // Handle nested files
      let currentLevel = navTree;
      
      // Create/navigate through all folder levels
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderParts = pathParts.slice(0, i + 1);
        const folderItem = findOrCreateNavItem(folderParts, currentLevel);
        currentLevel = folderItem.children;
      }
      
      // Add the actual file
      currentLevel.push({
        title: module.frontmatter.title || pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1),
        url: '/' + relativePath,
        children: [],
        order: module.frontmatter.order,
        hasIndex: false
      });
    });
    
    // Sort function
    const sortNavItems = (items: NavItem[]): void => {
      items.sort((a, b) => {
        // Items with index pages first
        if (a.hasIndex && !b.hasIndex) return -1;
        if (!a.hasIndex && b.hasIndex) return 1;
        
        // Then sort by order
        const aOrder = a.order ?? 999;
        const bOrder = b.order ?? 999;
        if (aOrder !== bOrder) return aOrder - bOrder;
        
        // Finally sort alphabetically
        return a.title.localeCompare(b.title);
      });
      
      // Sort children recursively
      items.forEach(item => {
        if (item.children.length > 0) {
          sortNavItems(item.children);
        }
      });
    };
    
    // Sort the entire tree
    sortNavItems(navTree);
    
    return navTree;
  }
  
  // Helper function to get breadcrumbs for current page
  export function getBreadcrumbs(currentPath: string, navTree: NavItem[]): NavItem[] {
    const breadcrumbs: NavItem[] = [];
    
    const findPath = (items: NavItem[], path: string): boolean => {
      for (const item of items) {
        // Check for exact match or if current path starts with item path
        if (item.url === path || (path.startsWith(item.url) && item.url !== '/')) {
          breadcrumbs.push(item);
          
          if (item.url === path) {
            return true;
          }
          
          if (item.children.length > 0 && findPath(item.children, path)) {
            return true;
          }
        }
      }
      return false;
    };
    
    findPath(navTree, currentPath);
    return breadcrumbs;
  }
  
  // Helper function to check if a nav item is active
  export function isActiveNavItem(itemUrl: string, currentPath: string): boolean {
    // Remove trailing slashes for comparison
    const cleanItemUrl = itemUrl.replace(/\/$/, '') || '/';
    const cleanCurrentPath = currentPath.replace(/\/$/, '') || '/';
    
    // Exact match
    if (cleanItemUrl === cleanCurrentPath) return true;
    
    // Parent path match (for folders)
    if (cleanCurrentPath.startsWith(cleanItemUrl + '/') && cleanItemUrl !== '/') return true;
    
    return false;
  }