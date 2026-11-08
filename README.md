# VecArc Portfolio

A static, responsive personal portfolio built with HTML, CSS, and vanilla JavaScript.

## Run locally

No build step or package installation is required. Open `index.html` in a browser, or serve the repository root with any static file server.

For example, with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## External assets

The page loads Google Fonts, Lucide icons, and Iconify from their public CDNs. The portfolio layout and navigation are implemented locally in `styles.css` and `script.js`.

## Accessibility and motion

- The mobile navigation is a real button with an expanded state and an associated navigation list.
- The menu can be closed with Escape, by selecting a navigation link, or by clicking outside it.
- Scroll-reveal animation is enabled only when `IntersectionObserver` is supported.
- Content remains visible when the API is unavailable or the visitor requests reduced motion.
- Reduced-motion preferences also disable smooth scrolling and the blinking status cursor.

## Tests

The project uses Node.js's built-in test runner; no third-party test dependencies are needed.

```bash
node --test
```
