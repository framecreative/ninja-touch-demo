<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coffee Profile Quiz</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'sans': ['Manrope', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        'washed-black': '#1e1d1c',
                        'buff': '#f2e9db',
                        'tan': '#d1c6b5',
                        'gradient-from': '#f3e8d8',
                        'gradient-to': '#d7b792',
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>

<body class="bg-tan min-h-screen font-sans">
    <div id="app" class="min-h-screen flex flex-col">
        <!-- Waiting/Touch Screen -->
        <div id="waiting-screen" class="screen relative bg-buff min-h-screen">
            <div class="absolute inset-0 flex items-center justify-center bg-washed-black">
                <video
                    src="assets/video/homepage.mp4"
                    class="transition-all duration-200 opacity-0 absolute inset-0 w-full h-full object-cover object-right-top"
                    muted
                    loop
                    playsinline
                    preload="auto">
                </video>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-full mx-auto px-[11.85%]">
                    <div class="backdrop-blur-[75px] backdrop-filter bg-white bg-opacity-[0.02] h-[130px] rounded-xl flex items-center justify-center">
                        <button
                            id="touch-btn"
                            class="text-tan text-4xl font-extrabold tracking-[9px] hover:opacity-70 transition-opacity duration-200">
                            TOUCH ME
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Intro Screen -->
        <div id="intro-screen" class="screen hidden relative min-h-screen bg-gradient-to-b from-[#f3e8d8] to-[#d7b792]">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full mx-auto px-[11.85%] text-center">
                    <div class="font-semibold text-washed-black text-5xl leading-[52px] mb-16">
                        <p class="mb-4">You bring the personality,<br>we'll bring the crema.</p>
                        <p class="mb-4">&nbsp;</p>
                        <p class="mb-4">Four questions.<br>One brew identity.<br>Let's find your coffee match.</p>
                    </div>
                    <button
                        id="intro-next-btn"
                        class="bg-buff text-washed-black px-12 py-4 rounded-xl text-4xl font-extrabold tracking-[9px] hover:opacity-90 transition-opacity duration-200">
                        NEXT
                    </button>
                </div>
            </div>
        </div>

        <!-- Question Screens -->
        <div id="question-screen" class="screen hidden relative bg-tan min-h-screen">
            <div class="absolute inset-0 flex flex-col justify-center items-center">
                <div class="w-full mx-auto px-[11.85%]">
                    <!-- Question -->
                    <h2 id="question-text" class="text-5xl font-semibold text-washed-black mb-16 text-center leading-tight">
                        <!-- Question text will be dynamically generated -->
                    </h2>

                    <!-- Answer Options -->
                    <div id="answer-options" class="space-y-12 mb-36">
                        <!-- Options will be dynamically generated -->
                    </div>

                    <!-- Navigation -->
                    <div class="flex justify-between items-center space-x-12">
                        <button
                            id="back-btn"
                            class="block flex-grow py-[1.75vh] text-washed-black hover:opacity-70 transition-opacity duration-200 text-7xl font-semibold">
                            ←
                        </button>
                        <button
                            id="next-btn"
                            class="block w-[66%] py-[1.75vh] bg-washed-black text-buff rounded-xl font-extrabold text-7xl tracking-widest hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled>
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Proofpoint Display Screen -->
        <div id="proofpoint-screen" class="screen hidden relative bg-tan min-h-screen">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full mx-auto px-[11.85%] text-center">
                    <div class="mb-8">
                        <div class="w-full h-auto bg-buff flex items-center justify-center">
                            <img id="proofpoint-image" src="" alt="Proofpoint image" class="w-full h-full object-contain">
                        </div>
                    </div>
                    <h2 id="proofpoint-title" class="text-5xl font-bold text-washed-black mb-4">
                        <!-- Proofpoint title will be dynamically generated -->
                    </h2>
                    <p id="proofpoint-subtitle" class="text-3xl text-washed-black mb-8">
                        <!-- Proofpoint subtitle will be dynamically generated -->
                    </p>
                    <p id="proofpoint-description" class="text-xl text-washed-black mb-12 leading-relaxed">
                        <!-- Proofpoint description will be dynamically generated -->
                    </p>
                    <button
                        id="continue-btn"
                        class="bg-washed-black text-buff px-8 py-4 rounded-xl text-xl font-semibold hover:opacity-90 transition-opacity duration-200">
                        Continue
                    </button>
                </div>
            </div>
        </div>

        <!-- Profile Reveal Screen -->
        <div id="profile-reveal-screen" class="screen hidden relative bg-tan min-h-screen">
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="w-full mx-auto px-[11.85%] text-center">
                    <!-- Profile Icon -->
                    <div class="mb-8">
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

                    <!-- Navigation -->
                    <div class="flex justify-center items-center">
                        <!-- <button
                            id="profile-back-btn"
                            class="text-washed-black hover:opacity-70 transition-opacity duration-200 text-xl font-semibold">
                            ←
                        </button> -->
                        <button
                            id="profile-next-btn"
                            class="bg-washed-black text-buff px-12 py-4 rounded-xl text-4xl font-extrabold tracking-[9px] hover:opacity-90 transition-opacity duration-200">
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Details Screen -->
        <div id="profile-details-screen" class="screen hidden relative bg-tan min-h-screen">
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
                            class="text-washed-black hover:opacity-70 transition-opacity duration-200 text-xl font-semibold">
                            ←
                        </button>
                        <button
                            id="details-next-btn"
                            class="bg-washed-black text-buff px-12 py-4 rounded-xl text-4xl font-extrabold tracking-[9px] hover:opacity-90 transition-opacity duration-200">
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Thank You Screen -->
        <div id="thank-you-screen" class="screen hidden relative bg-tan min-h-screen">
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
                        class="bg-washed-black text-buff px-12 py-4 rounded-xl text-4xl font-extrabold tracking-[9px] hover:opacity-90 transition-opacity duration-200">
                        START OVER
                    </button>
                </div>
            </div>
        </div>

        <!-- Timeout Overlay -->
        <div id="timeout-screen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
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
                    class="bg-washed-black text-buff px-12 py-4 rounded-xl text-4xl font-extrabold tracking-[9px] hover:opacity-90 transition-opacity duration-200">
                    DISMISS
                </button>
            </div>
        </div>
    </div>

    <script>
        /**
         * ===== Scoring: =====
         * Tally the score weights of Q1-Q3 against the 4 core need states (Mastery, Stability, Independence Belonging) selecting the state with the highest score.
         * Pair this with selected style profile from Q4 (Minimalist, Futurist, Trendy, Classic) to create the final profile.
         * 
         * Example:
         * Q1-3 answers of A,D,D = 1.5 total points Stability, 2 total points Belonging = Belonging (highest score)
         * Q4 answer of D = Classic
         * Belonging + Classic = "The Brewmantic" profile.
         * 
         * ========= Profile matrix: =========
         * Mastery + Minimalist = "The Precisionist"
         * Mastery + Futurist = "The Optimiser"
         * Mastery + Trendy = "The Roastician"
         * Mastery + Classic = "The Baristocrat"
         * 
         * Stability + Minimalist = "The Classicist"
         * Stability + Futurist = "The Smooth Operator"
         * Stability + Trendy = "The Brewsmith"
         * Stability + Classic = "The Home Brewer"
         * 
         * Independence + Minimalist = "The Zen Brewer"
         * Independence + Futurist = "The Mood-Swinger"
         * Independence + Trendy = "The Blendsetter"
         * Independence + Classic = "The Ritualist"
         * 
         * Belonging + Minimalist = "The Everybuddy"
         * Belonging + Futurist = "The Percolator"
         * Belonging + Trendy = "The Beanfluencer"
         * Belonging + Classic = "The Brewmantic"
         * ================================
         */
        class CoffeeProfileQuiz {
            constructor() {
                this.currentQuestion = 0;
                this.answers = [];
                this.profile = null;
                this.timeoutTimer = null;
                this.countdownTimer = null;
                this.lastActivity = Date.now();
                this.activityListenersSetup = false;
                this.questions = [];
                this.profiles = {};

                // Video synchronization properties
                this.videoDuration = null; // Will be set when video loads
                this.syncEpoch = 1700000000000; // Fixed epoch start time for all devices (adjust if needed)
                this.playbackStartTime = null;

                this.loadData();
            }

            async loadData() {
                try {
                    // First try to fetch from GitHub Gist
                    console.log('Attempting to fetch data from GitHub Gist...');
                    const timestamp = new Date().getTime();
                    const gistResponse = await fetch(`https://gist.githubusercontent.com/leighgibbod/5e86fcca79b39f5e7216c8a55a101de2/raw/touchscreen-data.json?t=${timestamp}`);

                    if (gistResponse.ok) {
                        const gistData = await gistResponse.json();
                        this.questions = gistData.questions;
                        this.profiles = gistData.profiles;
                        this.proofpoints = gistData.proofpoints;
                        console.log('Successfully loaded data from GitHub Gist');
                    } else {
                        throw new Error(`Gist fetch failed with status: ${gistResponse.status}`);
                    }
                } catch (gistError) {
                    console.warn('Failed to load from GitHub Gist, falling back to local data:', gistError);

                    try {
                        // Fallback to local data.json
                        const localResponse = await fetch('data.json');
                        const localData = await localResponse.json();
                        this.questions = localData.questions;
                        this.profiles = localData.profiles;
                        this.proofpoints = localData.proofpoints;
                        console.log('Successfully loaded data from local file');
                    } catch (localError) {
                        console.error('Failed to load both Gist and local data:', localError);
                        // Do something else here?
                    }
                }
                this.init();
            }

            init() {
                this.bindEvents();
                this.startActivityTracking();
                this.initializeVideoSync();
                this.showScreen('waiting-screen');
            }

            bindEvents() {
                // Touch button - kicks off the quiz intro from the waiting screen
                document.getElementById('touch-btn').addEventListener('click', () => {
                    this.showIntro();
                });

                // Intro next button - starts the quiz from the intro screen
                document.getElementById('intro-next-btn').addEventListener('click', () => {
                    this.startQuiz();
                });

                // Standard back button - goes back to the previous question
                document.getElementById('back-btn').addEventListener('click', () => {
                    this.goBack();
                });

                // Standard next button - goes to the next question
                document.getElementById('next-btn').addEventListener('click', () => {
                    this.nextQuestion();
                });

                // Proofpoint confirmation button ('continue' button)
                document.getElementById('continue-btn').addEventListener('click', () => {
                    this.continueToNext();
                });

                // Profile back button - disabled so user can't go back and adjust their answers
                // document.getElementById('profile-back-btn').addEventListener('click', () => {
                //     this.goBack();
                // });

                // Profile next button - shows the profile details
                document.getElementById('profile-next-btn').addEventListener('click', () => {
                    console.log('showProfileDetails called, profile:', this.profile);
                    this.showProfileDetails();
                });

                // Profile details back button - goes back to the profile reveal
                document.getElementById('details-back-btn').addEventListener('click', () => {
                    this.showProfileReveal();
                });

                // Profile details next button - shows the thank you screen
                document.getElementById('details-next-btn').addEventListener('click', () => {
                    this.showThankYou();
                });

                // Start over button (shown on the final thank you screen) - resets the quiz to the waiting screen
                document.getElementById('start-over-btn').addEventListener('click', () => {
                    this.resetToWaiting();
                });

                // Dismiss button - dismisses the timeout overlay
                document.getElementById('dismiss-btn').addEventListener('click', () => {
                    this.dismissTimeout();
                });
            }

            showIntro() {
                this.showScreen('intro-screen');
            }

            startQuiz() {
                this.currentQuestion = 0;
                this.answers = [];
                this.showQuestion();
            }

            showQuestion() {
                const question = this.questions[this.currentQuestion];

                // Update question text
                document.getElementById('question-text').textContent = question.text;

                // Generate answer options
                const optionsContainer = document.getElementById('answer-options');
                optionsContainer.innerHTML = '';

                question.options.forEach((option, index) => {
                    const optionElement = document.createElement('button');
                    optionElement.className = 'w-full h-[200px] bg-buff rounded-xl hover:opacity-90 transition-opacity duration-200 text-washed-black font-semibold text-4xl leading-tight text-center flex items-center justify-center';
                    optionElement.innerHTML = option.text.replace('\n', '<br>');
                    optionElement.dataset.value = option.value;
                    optionElement.dataset.weight = question.weight || 1; // Store the question weight

                    optionElement.addEventListener('click', () => {
                        this.selectOption(optionElement, option, question.weight);
                    });
                    // Append the answer option button to the options container:
                    optionsContainer.appendChild(optionElement);
                });

                // Reset next button
                document.getElementById('next-btn').disabled = true;

                this.showScreen('question-screen');
            }

            selectOption(element, option, weight = 1) {
                // Remove previous selection
                document.querySelectorAll('#answer-options button').forEach(btn => {
                    btn.classList.remove('ring-4', 'ring-washed-black', 'ring-opacity-30');
                });

                // Highlight selected option
                element.classList.add('ring-4', 'ring-washed-black', 'ring-opacity-30');

                // Enable next button
                document.getElementById('next-btn').disabled = false;

                // Store selection with weight
                this.selectedOption = {
                    ...option,
                    weight: weight
                };
            }

            nextQuestion() {
                if (this.selectedOption) {
                    this.answers.push({
                        value: this.selectedOption.value,
                        weight: this.selectedOption.weight
                    });
                    this.showProofpointScreen();
                    // this.continueToNext();
                }
            }

            showProofpointScreen() {
                const selectedProofpoint = this.proofpoints.filter(proofpoint => proofpoint.id === this.selectedOption.proofpoint)[0];
                if (!selectedProofpoint) {
                    console.warn('No proofpoint found for selected option, skipping to next question...');
                    this.continueToNext();
                    return;
                }
                document.getElementById('proofpoint-image').src = `assets/images/${selectedProofpoint.image}`;
                document.getElementById('proofpoint-title').textContent = selectedProofpoint.title;
                document.getElementById('proofpoint-subtitle').textContent = selectedProofpoint.subtitle || '';
                document.getElementById('proofpoint-description').textContent = selectedProofpoint.description || '';
                this.showScreen('proofpoint-screen');
            }

            continueToNext() {
                this.currentQuestion++;

                if (this.currentQuestion < this.questions.length) {
                    this.showQuestion();
                } else {
                    this.calculateProfile();
                    this.showProfileReveal();
                }
            }

            goBack() {
                if (this.currentQuestion > 0) {
                    this.currentQuestion--;
                    this.answers.pop();
                    this.showQuestion();
                } else {
                    this.showScreen('intro-screen');
                }
            }

            calculateProfile() {
                // Score Q1-Q3 for core need states (Mastery, Stability, Independence, Belonging)
                const needStateScores = {
                    'mastery': 0,
                    'stability': 0,
                    'independence': 0,
                    'belonging': 0
                };

                // Score Q4 for style profile (Minimalist, Futurist, Trendy, Classic)
                let styleProfile = null;

                this.answers.forEach((answer, index) => {
                    if (index < 3) { // Q1-Q3
                        // Map answer values to need states
                        const needStateMapping = {
                            'mastery': 'mastery',
                            'stability': 'stability',
                            'independence': 'independence',
                            'belonging': 'belonging'
                        };

                        const needState = needStateMapping[answer.value];
                        if (needState) {
                            needStateScores[needState] += answer.weight;
                        }
                    } else if (index === 3) { // Q4
                        // Map answer values to style profiles
                        const styleMapping = {
                            'minimalist': 'minimalist',
                            'futurist': 'futurist',
                            'trendy': 'trendy',
                            'classic': 'classic'
                        };

                        styleProfile = styleMapping[answer.value] || 'classic';
                    }
                });

                // Find the highest scoring need state
                let maxScore = 0;
                let dominantNeedState = 'stability'; // default

                Object.entries(needStateScores).forEach(([state, score]) => {
                    if (score > maxScore) {
                        maxScore = score;
                        dominantNeedState = state;
                    }
                });

                console.log('Need state scores:', needStateScores);
                console.log('Dominant need state:', dominantNeedState);
                console.log('Style profile:', styleProfile);

                // Create profile key based on matrix
                const profileKey = this.getProfileKey(dominantNeedState, styleProfile);
                console.log('Final profile key:', profileKey);

                this.profile = this.profiles[profileKey];
            }

            getProfileKey(needState, styleProfile) {
                // Profile matrix implementation
                const profileMatrix = {
                    'mastery': {
                        'minimalist': 'precisionist',
                        'futurist': 'optimiser',
                        'trendy': 'roastician',
                        'classic': 'baristocrat'
                    },
                    'stability': {
                        'minimalist': 'classicist',
                        'futurist': 'smooth_operator',
                        'trendy': 'brewsmith',
                        'classic': 'home_brewer'
                    },
                    'independence': {
                        'minimalist': 'zen_brewer',
                        'futurist': 'mood_swinger',
                        'trendy': 'blendsetter',
                        'classic': 'ritualist'
                    },
                    'belonging': {
                        'minimalist': 'everybuddy',
                        'futurist': 'percolator',
                        'trendy': 'beanfluencer',
                        'classic': 'brewmantic'
                    }
                };

                return profileMatrix[needState]?.[styleProfile] || 'ritualist';
            }

            showProfileReveal() {
                document.querySelector('.profile-icon').src = `assets/images/${this.profile.icon}`;
                document.getElementById('profile-title').innerHTML = this.profile.title;
                document.getElementById('profile-tagline').textContent = this.profile.tagline;

                // Update profile icon dynamically
                const profileIcon = document.querySelector('#profile-reveal-screen img');
                if (profileIcon && this.profile.icon) {
                    profileIcon.src = `assets/images/${this.profile.icon}`;
                    profileIcon.alt = `${this.profile.title.replace('<br>', ' ')} icon`;
                }

                this.showScreen('profile-reveal-screen');
            }

            showProfileDetails() {
                document.getElementById('profile-description-1').textContent = this.profile.description1;
                // document.getElementById('profile-proof-point').textContent = this.profile.proofpoint;

                this.showScreen('profile-details-screen');
            }

            showThankYou() {
                this.showScreen('thank-you-screen');
            }

            showTimeout() {
                // Only show timeout if not on the waiting screen
                const currentScreen = document.querySelector('.screen:not(.hidden)');
                if (currentScreen && currentScreen.id === 'waiting-screen') {
                    // Don't show timeout on waiting screen, just reset
                    this.resetToWaiting();
                    return;
                }

                // Show timeout overlay
                document.getElementById('timeout-screen').classList.remove('hidden');
                this.startCountdown();
            }

            startCountdown() {
                let countdown = 15;
                document.getElementById('countdown-number').textContent = countdown;

                this.countdownTimer = setInterval(() => {
                    countdown--;
                    document.getElementById('countdown-number').textContent = countdown;

                    if (countdown <= 0) {
                        clearInterval(this.countdownTimer);
                        this.hideTimeout();
                        this.resetToWaiting();
                    }
                }, 1000);
            }

            dismissTimeout() {
                if (this.countdownTimer) {
                    clearInterval(this.countdownTimer);
                }
                this.hideTimeout();
                this.resetActivity();
            }

            hideTimeout() {
                document.getElementById('timeout-screen').classList.add('hidden');
            }

            resetToWaiting() {
                this.currentQuestion = 0;
                this.answers = [];
                this.profile = null;
                this.hideTimeout(); // Hide timeout overlay if visible
                this.showScreen('waiting-screen');
                this.lastActivity = Date.now();
                this.startActivityTracking();
            }

            shareProfile() {
                const profileTitle = this.profile.title.replace('<br>', ' ');
                const shareText = `I'm a ${profileTitle}! ${this.profile.description1}`;

                if (navigator.share) {
                    navigator.share({
                        title: 'My Coffee Profile',
                        text: shareText,
                        url: window.location.href
                    });
                } else {
                    // Fallback - copy to clipboard
                    navigator.clipboard.writeText(shareText).then(() => {
                        alert('Profile copied to clipboard!');
                    });
                }
            }

            startActivityTracking() {
                // Clear any existing timeout
                if (this.timeoutTimer) {
                    clearTimeout(this.timeoutTimer);
                }

                // Only set up listeners once
                if (!this.activityListenersSetup) {
                    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
                    const resetActivity = (event) => {
                        // Ensure mouse movement resets the timer
                        this.lastActivity = Date.now();
                        this.resetTimeout();
                    };

                    // Add listeners with passive: false to ensure they work properly
                    activityEvents.forEach(event => {
                        document.addEventListener(event, resetActivity, {
                            passive: false,
                            capture: true
                        });
                    });

                    // Also add mouse move specifically to the window for better coverage
                    window.addEventListener('mousemove', resetActivity, {
                        passive: false,
                        capture: true
                    });

                    this.activityListenersSetup = true;
                }

                // Set timeout for 30 seconds
                this.timeoutTimer = setTimeout(() => {
                    this.showTimeout();
                }, 30000);
            }

            resetTimeout() {
                // Clear existing timeout and set a new one
                if (this.timeoutTimer) {
                    clearTimeout(this.timeoutTimer);
                }

                this.timeoutTimer = setTimeout(() => {
                    this.showTimeout();
                }, 30000);
            }

            showScreen(screenId) {
                // Hide all screens
                document.querySelectorAll('.screen').forEach(screen => {
                    screen.classList.add('hidden');
                });

                // Show target screen
                document.getElementById(screenId).classList.remove('hidden');

                // Handle video synchronization & fading in/out for waiting screen
                if (screenId === 'waiting-screen') {
                    this.syncVideoPlayback();
                    document.querySelector('#waiting-screen video').classList.add('opacity-100');
                    document.querySelector('#waiting-screen video').classList.remove('opacity-0');
                } else {
                    document.querySelector('#waiting-screen video').classList.add('opacity-0');
                    document.querySelector('#waiting-screen video').classList.remove('opacity-100');
                }

                // Update activity tracking
                this.lastActivity = Date.now();
            }

            syncVideoPlayback() {
                const video = document.querySelector('#waiting-screen video');
                if (!video) return;

                // Set video duration if not already set
                if (!this.videoDuration && video.duration) {
                    this.videoDuration = video.duration;
                    console.log('Video duration set to:', this.videoDuration, 'seconds');
                }

                // Calculate synchronized playback time
                const currentTime = Date.now();
                const timeSinceEpoch = currentTime - this.syncEpoch;

                // Convert to seconds and modulo by video duration to get loop position
                const synchronizedTime = (timeSinceEpoch / 1000) % this.videoDuration;

                // Set video to synchronized time
                video.currentTime = synchronizedTime;

                console.log('Video synced to time:', synchronizedTime.toFixed(2), 'seconds');

                // Ensure video is playing
                if (video.paused) {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            }

            initializeVideoSync() {
                const video = document.querySelector('#waiting-screen video');
                if (!video) return;

                // Wait for video metadata to load
                video.addEventListener('loadedmetadata', () => {
                    this.videoDuration = video.duration;
                    console.log('Video metadata loaded. Duration:', this.videoDuration, 'seconds');

                    // Initial sync
                    this.syncVideoPlayback();
                });

                // Handle video load errors
                video.addEventListener('error', (e) => {
                    console.error('Video load error:', e);
                });
            }
        }

        // Initialize the quiz when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new CoffeeProfileQuiz();
        });
    </script>
</body>

</html>