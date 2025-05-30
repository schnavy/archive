# (Astro-based) (Markdown-driven) (Wiki-style) Setup for general Archiving

- Dynamically mirroring folder structure from /content
- Infinite nesting, with optinal index pages for folders
- Enabling Hosting and Editing on Github
- Fully staticaly generated on each change

🐸

### File Structure

All content files go in the `/src/content/` directory. The navigation is automatically generated based on your file
structure.

```
src/content/
├── about.md                    # Top-level page
├── research/
│   ├── index.md               # Folder landing page (optional)
│   ├── project-1.md           # Sub-page
│   └── project-2.md           # Sub-page
└── projects/
    ├── art-project.md         # Sub-page (no index.md = folder header only)
    └── web-project.md         # Sub-page
```

### Frontmatter Options

Each markdown file supports these frontmatter attributes:

```yaml
---
title: "Page Title"           # Display name in navigation
order: 2                      # Sort order (lower = earlier, optional)
draft: true                   # Hide from navigation (optional)
isPage: true                  # Make index files clickable (optional)
external: "https://..."       # External URL (optional)
date: "2024-03-15"           # Publication/creation date (optional, YYYY-MM-DD format)
description: "Page desc"      # Not used by navigation (optional)
---
```

### Notes

- Standalone Pages cannot be named "index.md". This name is reserved for the configurations and content of the folder node
- Keep folder names lowercase with hyphens (e.g., `research-projects`)
- Use `order` values with gaps (1, 5, 10) to make reordering easier
- External links work at any level (top-level, nested, or as index files)
- When adding a base layer folder to the content directory, make sure to add it to th config file inside src/content/
