### Astro Base for Markdown-based Wiki

- Dynamically mirroring folder structure from /content
- Enabling Hosting and Editing on Github
- Fully staticaly generated on each change

🐸

## File Structure

All content files go in the /src/content/ directory. The navigation is automatically generated based on your file
structure.
src/content/
├── about.md # Top-level page
├── research/
│ ├── index.md # Folder landing page (optional)
│ ├── project-1.md # Sub-page
│ └── project-2.md # Sub-page
└── projects/
├── art-project.md # Sub-page (no index.md = folder header only)
└── web-project.md # Sub-page
Frontmatter Options
Each markdown file supports these frontmatter attributes:
yaml---
title: "Page Title"           # Display name in navigation
order: 2 # Sort order (lower = earlier, optional)
draft: true # Hide from navigation (optional)
isPage: true # Make index files clickable (optional)
external: "https://..."       # External URL (optional)
description: "Page desc"      # Not used by navigation (optional)
---