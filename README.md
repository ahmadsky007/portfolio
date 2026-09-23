# Ahmadjon Ortuqov — Systems Engineering Terminal Portfolio

> "The strongest flex isn't: 'Look at this crazy 3D animation.' It's: 'This website is extremely well engineered.'"

An SWE and quant systems portfolio designed as an authentic engineering terminal built with zero runtime bloat, minimal bundle weight, and instant 0ms latency.

Combines:
1. The Engineering Terminal: Interactive prompt (`whoami`, `ls projects/`, `cat currently.txt`, `open polycop`), tab autocompletion, command history, and mobile-friendly links.
2. The Build Log: Real engineering dossiers detailing systems architecture, design trade-offs, and failure postmortems.
3. Interactive Architecture: Hierarchical ASCII systems topology graph with expandable subsystem nodes.
4. Systems Lab: Transparent repository of empirical experiments (Microstructure backtests, Polymarket trader alpha modeling, steganography statistical detection).

---

## Quick Start

### Development
```bash
cd /Users/ahmadjon/portfolio
npm run dev
```
Open http://localhost:5173 in your browser.

### Production Build
```bash
npm run build
```
Generates an ultra-optimized static bundle in `dist/` ready to deploy to any static host.

### Local Preview
```bash
npm run preview
```
Serves the production build on http://localhost:4173.

---

## Features

* Authentic CRT Simulation: Dynamic CRT scanlines, glass curvature, and phosphor bloom (toggleable via `crt` command or header button).
* Cyan Palette: High-contrast cyan and black terminal theme.
* Keyboard and Touch Accessibility:
  * Tab: Auto-completes commands and project arguments.
  * Up / Down: Command history navigation.
  * Ctrl+L or `clear`: Clears output buffer.
  * Every command and project link in the terminal output is clickable.

---

## Project Structure

```text
portfolio/
├── index.html
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── data/
│   │   ├── projects.ts
│   │   ├── lab.ts
│   │   ├── architecture.ts
│   │   ├── about.ts
│   │   └── now.ts
│   ├── terminal/
│   │   ├── emulator.ts
│   │   └── commands.ts
│   └── styles/
│       └── terminal.css
```

---

## Deployment Options

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

### Vercel / Cloudflare Pages
Link repository and set:
- Build Command: `npm run build`
- Output Directory: `dist`

---

## License
MIT 2026 Ahmadjon Ortuqov
