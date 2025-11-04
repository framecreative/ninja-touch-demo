<?php
    require_once __DIR__ . '/_viteHelper.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Coffee Profile Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <?php echo vite_assets(); ?>
</head>
<style>
    /* Prevent pinch-zoom!!!! */
    :root {
        touch-action: pan-x pan-y;
        height: 100%
    }
</style>

<body class="bg-tan min-h-screen font-sans">
    <div id="app" class="h-screen w-screen relative overflow-hidden">

        <!-- Waiting/Touch Screen -->
        <div id="waiting-screen" class="screen active bg-buff">
            <div class="absolute inset-0  flex items-center justify-center bg-washed-black">
                <video
                    id="home-video-bg"
                    src="/dist/assets/videos/homepage1.mp4"
                    class="transition-all duration-200 absolute inset-0 w-full h-full object-cover object-top-right"
                    autoplay
                    muted
                    loop
                    playsinline
                    preload="auto">
                </video>
            </div>
            <div class="absolute inset-0  flex items-center justify-center">
                <div class="w-full grid grid-cols-8 translate-y-1/5 gap-5">
                    <div class="col-span-4 col-start-3">
                        <button
                            id="touch-btn"
                            class="t-button text-tan hover:opacity-70 transition-opacity duration-200 backdrop-blur-[75px] backdrop-filter bg-white/2 h-[260px] w-full rounded-xl flex items-center justify-center">
                            TOUCH TO START
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Intro Screen -->
        <div id="intro-screen" class="screen bg-gradient-to-b from-[#f3e8d8] to-[#d7b792]">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full grid grid-cols-6 gap-x-4 text-center">

                    <div class="col-span-4 col-start-2 flex flex-col items-center gap-44 font-semibold text-washed-black text-5xl mb-34">
                        <img src='/dist/assets/images/image_ninja_luxe_logo.png' width="895" height="358" class="max-w-[41.1vw]">

                        <div>
                            <p class=" t-copy-lg">You bring the personality,<br>we'll bring the crema.</p>
                            <p class=" t-copy-lg">&nbsp;</p>
                            <p class=" t-copy-lg">Four questions.<br>One brew identity.<br>Let's find your coffee match.</p>
                        </div>

                    </div>
                    <button
                        id="intro-next-btn"
                        class="t-button col-span-2 col-start-3 bg-buff text-washed-black rounded-xl h-[260px] hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                        BEGIN
                    </button>
                </div>
            </div>
        </div>

        <!-- Temporary Question Screen -->
        <div id="temp-question-screen" class="screen bg-tan"><!-- content gets injected here when we need to perform a question-to-question transition--></div>

        <!-- Current Question Screen -->
        <div id="question-screen" class="screen bg-tan">
            <div class="absolute bottom-base w-full flex flex-col justify-center items-center">
                <div class="w-full grid grid-cols-6 gap-x-4 will-change-contents">
                    <!-- Question -->
                    <h2 data-question-text class="col-span-4 col-start-2 text-5xl font-semibold text-washed-black mb-42 text-center leading-tight">
                        <!-- Question text will be dynamically generated -->
                    </h2>

                    <!-- Answer Options -->
                    <div data-answer-options class="col-span-4 col-start-2 space-y-7.5 mb-36">
                        <!-- Options will be dynamically generated -->
                    </div>

                    <!-- Navigation -->
                    <div class="col-span-4 col-start-2 grid grid-cols-4 gap-5">
                        <button
                            data-back-button
                            class="bg-buff col-span-1 rounded-xl grow h-[260px] text-washed-black hover:opacity-70 transition-opacity duration-200 will-change-opacity flex flex-row items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-[64px] h-auto" width="32" height="20" viewBox="0 0 32 20" fill="none">
                                <path d="M31.1016 8.34875L31.1016 11.8348L6.92781 11.8347L12.9038 17.8107L10.7873 19.9687L0.889558 10.071L10.7873 0.17325L12.9038 2.33125L6.88631 8.34875L31.1016 8.34875Z" fill="#1E1D1C" />
                            </svg>
                        </button>
                        <button
                            data-next-btn
                            class="t-button col-span-3 block  h-[260px] bg-washed-black text-buff rounded-xl tracking-widest hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed will-change-opacity"
                            disabled>
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Proofpoint Display Screens -->
        <div id="proofpoint-screen" class="screen bg-gradient-to-b from-[#f3e8d8] to-[#d7b792]">
            <div class="absolute flex flex-col items-center justify-center h-full w-full will-change-contents">
                <div class="proofpoint-content hidden w-full text-center h-full will-change-transform">
                    <div class="grid grid-cols-6 grid-rows-[auto_1fr_auto] h-full pb-base">
                        <div class="col-span-full px-7.5 pt-7.5">
                            <div id="proofpoint-image-container" class="w-full h-auto bg-buff flex items-center justify-center rounded-xl overflow-hidden">
                                <img id="proofpoint-image" width="2024" height="1904" src="" alt="Proofpoint image" class="w-full h-full object-contain ">
                            </div>
                        </div>
                        <div class="col-span-4 col-start-2 flex flex-col justify-center">
                            <span id="proofpoint-feature" class="text-2xl font-extrabold tracking-[0.45rem] uppercase text-center mb-9">
                                <!-- Proofpoint feature will be dynamically generated -->
                            </span>
                            <h2 id="proofpoint-title" class="text-5xl font-bold text-washed-black mb-9">
                                <!-- Proofpoint title will be dynamically generated -->
                            </h2>
                            <p id="proofpoint-subtitle" class="text-3xl text-washed-black">
                                <!-- Proofpoint subtitle will be dynamically generatedproo -->
                            </p>
                            <p id="proofpoint-description" class="text-3xl font-extrabold leading-[2.68rem] text-center text-washed-black">
                                <!-- Proofpoint description will be dynamically generated -->
                            </p>
                        </div>`
                        <button
                            data-continue-btn
                            class="flex flex-row justify-between items-center col-span-4 col-start-2 t-button mt-auto w-full bg-washed-black text-buff px-10 py-4 h-[260px] rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                            <span class="m-auto" id="continue-btn-text">
                                NEXT
                            </span>

                            <div class="timer-progress-circle relative flex items-center justify-center w-[120px] h-[120px]">
                                <svg
                                    class="-rotate-90 w-full h-full" width="120" height="120">
                                    <defs>
                                        <linearGradient id="globalGradient" x1="18.7588" y1="56.2744" x2="56.2725" y2="18.7607" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#F3E8D8" />
                                            <stop offset="1" stop-color="#D7B792" />
                                        </linearGradient>
                                    </defs>
                                    <!-- background track -->
                                    <circle cx="60" cy="60" r="50" stroke="#d1c6b520" stroke-width="12" fill="transparent"></circle>

                                    <!-- animated progress stroke -->
                                    <circle id="progress-indicator" cx="60" cy="60" r="50" stroke="url(#globalGradient)" stroke-width="12" fill="transparent" stroke-linecap="round"></circle>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Calculation Screen -->
        <div id="profile-calculation-screen" class="screen bg-washed-black">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="profile-calculate-content translate-y-1/5 w-full grid grid-cols-6 mx-auto text-center opacity-0">
                    <div class="col-span-4 col-start-2 rounded-xl flex justify-center items-center px-8 backdrop-blur-[75px] h-[260px] backdrop-filter bg-[#292928]">
                        <span class="t-button text-tan mx-auto">CALCULATING</span>
                        <div class="timer-progress-circle relative flex items-center justify-center w-[120px] h-[120px]">
                            <svg
                                class="-rotate-90 w-full h-full" width="120" height="120">
                                <defs>
                                    <linearGradient id="globalGradient" x1="18.7588" y1="56.2744" x2="56.2725" y2="18.7607" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F3E8D8" />
                                        <stop offset="1" stop-color="#D7B792" />
                                    </linearGradient>
                                </defs>
                                <!-- background track -->
                                <circle cx="60" cy="60" r="50" stroke="#d1c6b520" stroke-width="12" fill="transparent"></circle>

                                <!-- animated progress stroke -->
                                <circle id="progress-indicator" cx="60" cy="60" r="50" stroke="url(#globalGradient)" stroke-width="12" fill="transparent" stroke-linecap="round" class="hidden"></circle>
                            </svg>
                        </div>
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
                                width="1000"
                                height="1000"
                                alt="Profile icon"
                                class="profile-icon w-[204px] h-[204px] mx-auto">
                        </div>

                        <!-- Profile Title -->
                        <h1 id="profile-title" class="text-[1.9rem] font-extrabold text-washed-black mb-19 text-center leading-[2.63rem] tracking-[0.56rem] uppercase">
                            The<br>...
                        </h1>

                        <!-- Profile Tagline -->
                        <p id="profile-tagline" class="t-copy text-washed-black text-center mb-10">
                            Your coffee profile tagline will load here..
                        </p>

                        <p id="profile-description" class="t-copy-md text-washed-black text-center">
                            Your coffee description will load here..
                        </p>
                    </div>

                    <div class="col-span-4 col-start-2 bg-caramel p-20 flex flex-row justify-between items-center rounded-xl h-74">
                        <div>
                            <img src=""
                                width="270"
                                height="270"
                                alt="QR Code"
                                class="profile-qr w-[270px] h-[270px]" />
                        </div>
                        <span class="t-button">DISCOVER MORE</span>
                    </div>


                    <!-- Navigation -->
                    <div class="col-span-4 col-start-2 flex justify-center items-center">
                        <!-- <button
                            id="profile-back-btn"
                            class="text-washed-black hover:opacity-70 transition-opacity duration-200 text-xl font-semibold">
                            ←
                        </button> -->
                        <button
                            id="start-over-btn"
                            class="flex items-center t-button w-full bg-washed-black h-[260px] text-buff px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                            <span class="t-button text-tan mx-auto">
                                RESTART
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Timeout Overlay -->
        <div id="timeout-screen" class="timeout-screen opacity-0 pointer-events-none">
            <div class="absolute grid grid-cols-6 gap-y-6 w-full">
                <div class="col-span-2 col-start-3 flex flex-col items-center gap-6 pb-20">
                    <div class="countdown-timer-progress-circle relative flex items-center justify-center w-[60px] h-[60px] ">
                        <svg
                            class="-rotate-90 w-full h-full" width="120" height="120">
                            <defs>
                                <linearGradient id="timeout" x1="18.7588" y1="56.2744" x2="56.2725" y2="18.7607" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#F3E8D8" />
                                    <stop offset="1" stop-color="#D7B792" />
                                </linearGradient>
                            </defs>
                            <!-- background track -->
                            <circle cx="60" cy="60" r="50" stroke="#d1c6b520" stroke-width="12" fill="transparent"></circle>
                            <!-- animated progress stroke -->
                            <circle id="progress-indicator" cx="60" cy="60" r="50" stroke="url(#timeout)" stroke-width="12" fill="transparent" stroke-linecap="round" class="hidden"></circle>
                        </svg>
                    </div>

                    <!-- Countdown Text -->
                    <p id="countdown-text" class="text-[1.9rem] font-extrabold text-center leading-[2.63rem] tracking-[0.56rem] uppercase text-tan">
                        Restarting<br>in <span id="countdown-number">15</span>
                    </p>
                </div>

                <!-- Dismiss Button -->
                <button
                    id="timeout-dismiss-btn"
                    class="t-button col-span-4 col-start-2 h-[260px] bg-tan text-washed-black px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                    DISMISS
                </button>

                <!-- Restart Button -->
                <button
                    id="timeout-restart-btn"
                    class="t-button col-span-4 col-start-2 h-[260px] bg-[#292928] text-buff px-12 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 will-change-opacity">
                    RESTART
                </button>
            </div>
        </div>
    </div>

</body>

</html>