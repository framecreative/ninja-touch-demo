# Ninja Touch Demo

A coffee profile quiz SPA with HTML, Tailwind CSS V4, and Motion.dev

# Project Development
## Codebase Setup

Install dependencies & ENV:

```bash
cp .env.example .env
npm install
```

## Development

Start the Vite dev server:

```bash
npm run dev
```

The dev server runs on `http://localhost:5173`. The PHP app will read the value of `ENVIRONMENT` in the `.env` file, to serve assets either via the `dist/` directory, or the Vite dev server.

When we run a build, the assets in `src/assets` are copied over to `dist/assets` for quick testing of the final compiled package, but these are not committed to version control, as we instead pull these assets remotely via a bash script when the touchscreens boot up (see 'Touchscreen Builds' below)


## Staging

Any commits made to the `staging` branch will automatically get pushed to the [Staging environment on Frame's Laravel Forge account](https://forge.laravel.com/frame-creative/frame-staging/2898440).

Upon deployment, the staging server automatically syncs the image/video assets into the staging app, from the luxe-cafe production Dropbox app (again, see 'Touchscreen Builds' below).


## Production Build

Build optimized assets:

```bash
npm run build
```

This creates production-ready CSS/JS assets in `public/dist/`. These should be auto-created via a pre-commit hook.

## Project Structure

```
├── src/
│   └── assets/          # Static assets (images, videos)
│   ├── main.js          # Main JS entry point
│   ├── main.css         # Main CSS with Tailwind imports
│   ├── styles/          # CSS custom app styles & components
|   |   └── (any other CSS modules here)
│   └── modules/         # ES modules for various app logic
│       └── (any other JS modules here)
├── public/
│   ├── index.php        # Main application file
│   └── dist/            # Built assets (generated)
│       └── assets/      # empty images directory (populated via bash/powershell script on system boot)
│       └── videos/      # empty videos directory (populated via bash/powershell script on system boot)
├── vite.config.js       # Vite configuration
├── .env.example         # Initial ENV file, to be copied over to `.env`
└── package.json         # Dependencies
```

## Adding Custom Styles

Add your custom CSS in `src/styles/` and import them in `src/main.css`.


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


## Page/Screen Transitions

These are primarily managed via the View Transition API.  
We have created a global `transitionToScreen()` function that handles screen changes within the quiz:
```javascript
// transitionToScreen(nextScreenEl, prevScreenEl, transitionType)
this.transitionToScreen(this.screens.questionScreen, this.screens.introScreen, 'slideup');
```
See Google's [very handy guide on how this works](https://developer.chrome.com/docs/web-platform/view-transitions).

## Using Motion.dev

Other small animations are also handled via the [motion.dev JS library](https://motion.dev/docs/quick-start).
Motion utilities are globally available via `window.Motion`:

```javascript
const { animate, stagger, scroll, press } = Motion;

animate('.element', { opacity: [0, 1] });
```


# Touchscreeen Builds & Deployment
We are hosting this app on each touchscreen's PC/machine, via a local installation of Laravel Herd. 
For this reason, we pre-compile all JS/CSS to minified packages, and commit these to github, so that we can simply run `git pull` on each machine and we have all required files locally.  This can even be set up as a script that can run on machine boot, if required.

Each touchscreen boots into a Windows 11 kiosk-mode, loading up Microsoft Edge (also in fullscreen kiosk-mode) with the local app URL pre-set.

For content and assets, we are treating the touchscreens as if they have zero/limited internet, so the focus is local-first for data, with some options to sync content/assets from remote resources wherever possible.  

The following methods are utilised for content-synchronisation:

## Assets Sync

Images and videos are synced from a remote (public) dropbox URL.  The Dropbox prohect can be found at:
https://www.dropbox.com/home/sharkninja_luxe-cafe_touchscreens

The files are synced from Dropbox down to the app via local bash/powershell scripts that:
1. Download the dropbox assets as an `assets.zip` file in the local app.
2. Uncompresses the archive into a temporary `/temp/assets` directory.

A separate script can then be run, which copies all files in `temp/assets/{images|videos}` over the top of the existing files in `public/dist/assets/{images|videos}`

The direct-download URL for the production assets (Dropbox account owned by _digital@framecreative.com.au_):
```
https://www.dropbox.com/scl/fo/ssb5t8k6kka9xo9s7t5ui/AFV24EQJtQhA4wEr9pWrulE?rlkey=8th2vhwphgi2zr3r3hhvtr5fa&st=aa3gt86w&dl=1
```

#### Bash Sync Scripts
To run the bash version, open a terminal and execute the following scripts to pull the files down, and then copy the assets over:
```
./pull_assets.sh && ./update_assets.sh
```

#### Powershell Sync Scripts
To Run the Powershell version, open a Powershell terminal and execute the following:
```
Set-ExecutionPolicy Bypass -Scope Process -Force
.\pull_assets.ps1; .\update_assets.ps1
```

## Content Sync

Content for the app (text, configs etc) is stored locally in a `data.json` file.  The app currently pings a remote github Gist to see if there's a more updated version to use for content, however we may switch over to pulling the `data.json` file down with the rest of the assets in the future.