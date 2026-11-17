# Jie Chu's personal website

Jekyll site published by GitHub Pages from the `main` branch.

- `/`: personal introduction and photography gallery; edit `index.html` for the introduction.
- `/photography/`: standalone photography sharing page with its own non-academic metadata. It has no homepage/blog links, is excluded from the sitemap, and requests no indexing. This is an unlisted public page, not access control.
- `_includes/photo-gallery.html` and `_includes/photo-viewer.html`: shared gallery and viewer markup for both pages.
- `_data/photography.yml`: curated reading order, row pairings, dimensions, and image descriptions.
  Each row preserves natural image ratios; the gallery and viewer use the same left-to-right, top-to-bottom order.
- `assets/photography/`: responsive 480 / 960 px previews and larger images for the viewer.
- `assets/img/JieChu.webp` and `assets/img/favicon/jie-chu*`: portrait and site icons, shared with the blog.
- `/blog/`: blog archive; posts in `_posts/` retain their original URLs.
- `assets/css/home.css` and `assets/js/gallery.js`: homepage styling and accessible photo viewer.

`jekyll-sitemap` generates the sitemap automatically. The gallery uses web-optimized
copies of the photographs. The source Photography/Personal folder is excluded from
the gallery; only the explicitly selected portrait is used for the profile and icons.
