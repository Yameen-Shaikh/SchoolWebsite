# AYK Project

A premium, modern FastAPI-based web application designed for school patterns and information, optimized for all devices.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Templating:** Jinja2
- **Frontend:** Vanilla CSS (Modern Keyframes & Gradients), Static Files, Vanilla JS
- **Environment:** Arch Linux (WSL)

## Architecture & Styling Conventions
- **UI/UX:** Kid-friendly yet sophisticated branding using Burgundy (#57212e) and Gold (#ae9966) gradients.
- **Responsiveness:**
  - The navigation utilizes a hidden sliding sidebar on mobile (screens < 900px) controlled by a hamburger toggle, and a horizontal navigation bar on desktop.
  - Sidebar and overlays are positioned at the bottom of the `<body>` tag with high z-indexes (10000+) to prevent CSS stacking context issues from blur filters.
  - Mobile headers only display the logo and toggle button to maximize vertical screen real estate.
  - Ensure paddings and typography are dynamically scaled using relative units (`rem`, `vw`) and media queries for small devices.
