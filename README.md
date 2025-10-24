# Ninja Touch Demo

Coffee profile quiz with Vite, Tailwind CSS V4, and Motion.dev

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the Vite dev server:

```bash
npm run dev
```

The dev server runs on `http://localhost:5173`. Your PHP app will automatically detect and use the dev server when it's running.

## Production Build

Build optimized assets:

```bash
npm run build
```

This creates production-ready assets in `public/dist/`. The PHP app automatically uses built assets when the dev server isn't running.

## Project Structure

```
├── src/
│   ├── main.js          # Main JS entry point
│   ├── main.css         # Main CSS with Tailwind imports
│   ├── styles/          # CSS custom app styles
│   │   └── app.css
│   └── modules/         # ES modules for your app logic
│       └── (your modules here)
├── public/
│   ├── index.php        # Main application file
│   ├── dist/            # Built assets (generated)
│   └── assets/          # Static assets (images, videos)
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Adding Custom Styles

Add your custom CSS in `src/styles/` and import them in `src/main.css`.

## Using Motion.dev

Motion utilities are globally available via `window.Motion`:

```javascript
const { animate, stagger, scroll, press } = Motion;

animate('.element', { opacity: [0, 1] });
```

## Creating ES Modules

Create new modules in `src/modules/` and import them in `src/main.js`:

```javascript
// src/modules/quiz.js
export class CoffeeQuiz {
  // Your code here
}

// src/main.js
import { CoffeeQuiz } from './modules/quiz.js';
```

## Tailwind Theme

Custom colors and fonts are defined in `src/main.css` using Tailwind V4's `@theme` directive:

- `washed-black` - #1e1d1c
- `buff` - #f2e9db
- `tan` - #d1c6b5
- `gradient-from` - #f3e8d8
- `gradient-to` - #d7b792

Font: Manrope (loaded from Google Fonts)
