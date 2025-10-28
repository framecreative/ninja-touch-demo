<?php
// Vite helper function
function vite_assets()
{
    // Fetch environment variable from .env file
    $envFile = __DIR__ . '/.env';
    if (file_exists($envFile)) {
        $env = parse_ini_file($envFile);
        $isDev = $env['ENVIRONMENT'] === 'development';
    } else {
        $isDev = false;
    }

    // Check if Vite dev server is running by testing the connection
    $devServerRunning = false;
    if ($isDev) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 1, // 1 second timeout
                'method' => 'GET'
            ]
        ]);
        $result = @file_get_contents('http://localhost:5173/@vite/client', false, $context);
        $devServerRunning = ($result !== false);
    }

    if ($isDev && $devServerRunning) {
        // Development mode - use Vite dev server
        return <<<HTML
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173/src/main.js"></script>
        <script>
        console.info('Vite dev server is running');
        </script>
        HTML;
    } else {
        // Production mode - use built assets
        $manifestPath = __DIR__ . '/dist/.vite/manifest.json';
        if (!file_exists($manifestPath)) {
            return '<!-- Vite manifest not found. Run "npm run build" first. -->';
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        $mainJs = $manifest['src/main.js']['file'] ?? '';
        $mainCss = $manifest['src/main.js']['css'][0] ?? '';

        $html = '';
        if ($mainCss) {
            $html .= '<link rel="stylesheet" href="/dist/' . $mainCss . '">';
        }
        if ($mainJs) {
            $html .= '<script type="module" src="/dist/' . $mainJs . '"></script>';
        }
        return $html;
    }
}
