<?php
// Vite helper function
function vite_assets() {
    $isDev = file_exists(__DIR__ . '/../node_modules');
    
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
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coffee Profile Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <?php echo vite_assets(); ?>
</head>

<body class="bg-tan min-h-screen font-sans">
    <div id="app" class="h-screen w-screen relative overflow-hidden">

        <!-- Waiting/Touch Screen -->
        <div id="waiting-screen" class="screen active bg-buff">
            <div class="absolute inset-0  flex items-center justify-center bg-washed-black">
                <video
                    src="assets/video/homepage.mp4"
                    class="transition-all duration-200 opacity-0 absolute inset-0 w-full h-full object-cover object-top-right"
                    muted
                    loop
                    playsinline
                    preload="auto">
                </video>
            </div>
            <div class="absolute inset-0  flex items-center justify-center">
                <div class="w-full grid grid-cols-6 translate-y-1/5 gap-5">
                    <div class="col-span-2 col-start-3">
                        <button
                            id="touch-btn"
                            class="t-button text-tan hover:opacity-70 transition-opacity duration-200 backdrop-blur-[75px] backdrop-filter bg-white/2 h-[130px] w-full rounded-xl flex items-center justify-center">
                            TOUCH ME
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Intro Screen -->
        <div id="intro-screen" class="screen bg-gradient-to-b from-[#f3e8d8] to-[#d7b792]">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full grid grid-cols-6 gap-x-4 text-center">
                    
                    <div class="col-span-4 col-start-2 flex flex-col items-center gap-44 font-semibold text-washed-black text-5xl leading-[52px] mb-34">
                        <img src='/assets/images/image_ninja_luxe_logo.png' class="max-w-112">

                        <div>
                            <p class="mb-4 t-copy-lg">You bring the personality,<br>we'll bring the crema.</p>
                            <p class="mb-4 t-copy-lg">&nbsp;</p>
                            <p class="mb-4 t-copy-lg">Four questions.<br>One brew identity.<br>Let's find your coffee match.</p>
                        </div>

                    </div>
                    <button
                        id="intro-next-btn"
                        class="t-button col-span-2 col-start-3 bg-buff text-washed-black rounded-xl h-[130px] hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                        BEGIN
                    </button>
                </div>
            </div>
        </div>

        <!-- Question Screens -->
        <div id="question-screen" class="screen bg-tan">
            <div class="absolute bottom-base w-full flex flex-col justify-center items-center">
                <div class="w-full grid grid-cols-6 gap-x-4 will-change-contents">
                    <!-- Question -->
                    <h2 id="question-text" class="col-span-4 col-start-2 text-5xl font-semibold text-washed-black mb-42 text-center leading-tight">
                        <!-- Question text will be dynamically generated -->
                    </h2>

                    <!-- Answer Options -->
                    <div id="answer-options" class="col-span-4 col-start-2 space-y-7.5 mb-36">
                        <!-- Options will be dynamically generated -->
                    </div>

                    <!-- Navigation -->
                    <div class="col-span-4 col-start-2 grid grid-cols-4 gap-5">
                        <button
                            id="back-btn"
                            class="bg-buff col-span-1 rounded-xl grow h-[130px] text-washed-black hover:opacity-70 transition-opacity duration-200 will-change-opacity flex flex-row items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="20" viewBox="0 0 32 20" fill="none">
                                <path d="M31.1016 8.34875L31.1016 11.8348L6.92781 11.8347L12.9038 17.8107L10.7873 19.9687L0.889558 10.071L10.7873 0.17325L12.9038 2.33125L6.88631 8.34875L31.1016 8.34875Z" fill="#1E1D1C"/>
                            </svg>
                        </button>
                        <button
                            id="next-btn"
                            class="t-button col-span-3 block  h-[130px] bg-washed-black text-buff rounded-xl tracking-widest hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed will-change-opacity"
                            disabled>
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Proofpoint Display Screens -->
        <div id="proofpoint-screen" class="screen bg-gradient-to-b from-[#f3e8d8] to-[#d7b792]">
            <div class="absolute flex flex-col items-center justify-center h-full will-change-contents">
                <div class="proofpoint-content hidden w-full text-center h-full will-change-transform">
                    <div class="grid grid-cols-6 grid-rows-[auto_1fr_auto] h-full pb-base">
                        <div class="col-span-full px-7.5 pt-7.5">
                            <div class="w-full h-auto bg-buff flex items-center justify-center">
                                <img id="proofpoint-image" src="" alt="Proofpoint image" class="w-full h-full object-contain rounded-xl">
                            </div>
                        </div>
                        <div class="col-span-4 col-start-2 flex flex-col justify-center">
                            <h2 id="proofpoint-title" class="text-5xl font-bold text-washed-black mb-9">
                                <!-- Proofpoint title will be dynamically generated -->
                            </h2>
                            <p id="proofpoint-subtitle" class="text-3xl text-washed-black">
                                <!-- Proofpoint subtitle will be dynamically generated -->
                            </p>
                            <p id="proofpoint-description" class="t-copy text-center text-washed-black">
                                <!-- Proofpoint description will be dynamically generated -->
                            </p>
                        </div>
                        <button
                            id="continue-btn"
                            class="flex flex-row justify-between items-center col-span-4 col-start-2 t-button mt-auto w-full bg-washed-black text-buff px-10 py-4 h-[130px] rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                            <span class="m-auto">
                                NEXT
                            </span>

                            <div>
                                <div class="spinner"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Calculation Screen -->
        <div id="profile-calculation-screen" class="screen bg-black">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="profile-calculate-content w-full mx-auto px-[11.85%] text-center opacity-0">
                    <div class="rounded-xl flex justify-center items-center">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Reveal Screen -->
        <div id="profile-reveal-screen" class="screen bg-tan">
            <div class="absolute bottom-base w-full flex flex-col items-center justify-center">
                <div class="w-full grid grid-cols-6 gap-x-5 gap-y-16 text-center">
                    <div class="col-span-4 col-start-2 bg-buff px-23 pb-39 pt-44 rounded-xl">
                        <!-- Profile Icon -->
                        <div class="mb-9">
                            <img src=""
                                alt="Profile icon"
                                class="profile-icon w-[68px] h-[102px] mx-auto">
                        </div>
    
                        <!-- Profile Title -->
                        <h1 id="profile-title" class="text-[56px] font-extrabold text-washed-black mb-4 text-center leading-[72px] tracking-[9px] uppercase">
                            The<br>...
                        </h1>

                        <!-- Profile Tagline -->
                        <p id="profile-tagline" class="text-[44px] font-extrabold text-washed-black mb-16 text-center leading-[72px]">
                            Your coffee profile tagline will load here..
                        </p>
                    </div>


                    <div class="col-span-4 col-start-2 bg-caramel p-20 flex flex-row justify-between rounded-xl">
                        <div>
                            QR
                        </div>
                        <span class="t-button">SCAN & SHARE </span>
                    </div>


                    <!-- Navigation -->
                    <div class="col-span-4 col-start-2 flex justify-center items-center">
                        <!-- <button
                            id="profile-back-btn"
                            class="text-washed-black hover:opacity-70 transition-opacity duration-200 text-xl font-semibold">
                            ←
                        </button> -->
                        <button
                            id="profile-next-btn"
                            class="t-button w-full bg-washed-black h-[130px] text-buff px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                            RESTART
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Details Screen -->
        <div id="profile-details-screen" class="screen bg-tan">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full mx-auto px-[11.85%] text-center">
                    <div class="mb-16">
                        <p id="profile-description-1" class="text-[44px] font-extrabold text-washed-black mb-8 leading-[72px]">
                            Your coffee profile description will load here..
                        </p>
                        <!-- Proof Point (do we need to show this?) -->
                        <!-- <p id="profile-proof-point" class="text-[44px] font-extrabold text-washed-black mb-8 leading-[72px]">
                            Weight-based dosing and active temperature control keep every variable locked, so the details stay as dialled as you are.
                        </p> -->
                    </div>

                    
                    <!-- Navigation -->
                    <div class="flex justify-between items-center">
                        <button
                            id="details-back-btn"
                            class="text-washed-black hover:opacity-70 transition-opacity duration-200 text-xl font-semibold will-change-opacity">
                            ←
                        </button>
                        <button
                            id="details-next-btn"
                            class="t-button bg-washed-black text-buff px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Thank You Screen -->
        <div id="thank-you-screen" class="screen bg-tan">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full mx-auto px-[11.85%] text-center">
                    <div class="mb-16">
                        <h1 class="text-[56px] font-extrabold text-washed-black mb-8 text-center leading-[72px] tracking-[9px] uppercase">
                            Thank You
                        </h1>
                        <p class="text-[44px] font-extrabold text-washed-black mb-8 text-center leading-[72px]">
                            We hope you enjoyed<br>discovering your coffee profile!
                        </p>
                    </div>

                    <!-- Start Over Button -->
                    <button
                        id="start-over-btn"
                        class="t-button bg-washed-black text-buff px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                        START OVER
                    </button>
                </div>
            </div>
        </div>

        <!-- Timeout Overlay -->
        <div id="timeout-screen" class="timeout-screen">
            <div class="bg-tan rounded-xl p-12 w-[80vw] h-[80vh] mx-4 text-center">
                <!-- Timeout Icon -->
                <div class="mb-8">
                    <img src="/Users/leighgibson/Sites/test/ninja-touch/4a8d527f94fdd11281a715ff2df93e015c6d253c.svg"
                        alt="Timeout icon"
                        class="w-[99px] h-[99px] mx-auto">
                </div>

                <!-- Countdown Text -->
                <p id="countdown-text" class="text-[56px] font-extrabold text-washed-black mb-16 text-center leading-[72px] tracking-[9px] uppercase">
                    Restarting<br>in <span id="countdown-number">15</span>
                </p>

                <!-- Dismiss Button -->
                <button
                    id="dismiss-btn"
                    class="t-button bg-washed-black text-buff px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                    DISMISS
                </button>
            </div>
        </div>
    </div>

</body>

</html>