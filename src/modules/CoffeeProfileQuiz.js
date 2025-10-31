import { VideoSync } from './VideoSync.js';
import { ActivityTracker } from './ActivityTracker.js';
import { animate } from 'motion';

/**
 * Coffee Profile Quiz
 * 
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
export class CoffeeProfileQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.profile = null;
        this.questions = [];
        this.profiles = {};
        this.timerAnimation = null;

        this.activityTracker = new ActivityTracker();

        // Initialize video synchronization
        this.videoSync = new VideoSync();

        // Configs placeholder
        this.config = {};

        this.appWrapper = document.getElementById('app');

        this.screens = {
            waitingScreen: document.getElementById('waiting-screen'),
            introScreen: document.getElementById('intro-screen'),
            questionScreen: document.getElementById('question-screen'),
            tempQuestionScreen: document.getElementById('temp-question-screen'),
            proofpointScreen: document.getElementById('proofpoint-screen'),
            proofpointContent: document.querySelector('.proofpoint-content'),
            profileCalculationScreen: document.getElementById('profile-calculation-screen'),
            profileRevealScreen: document.getElementById('profile-reveal-screen'),
            // hidden screens:
            timeoutScreen: document.getElementById('timeout-screen'),
        };

        // Load data and initialize activity tracking with the fetched configs
        this.loadData().then(() => {
            this.activityTracker.setConfig(this.config);
            this.activityTracker.setCallbacks(
                () => this.showTimeout(),
                () => this.resetToWaiting()
            );

            this.init();
        });

    }

    async loadData() {
        let localData = null;
        // Always load local data first, and ping remote data for updates:
        try {
            const localResponse = await fetch('data.json?t=' + new Date().getTime());
            localData = await localResponse.json();
            this.config = localData.config || {};
            this.questions = localData.questions;
            this.profiles = localData.profiles;
            this.proofpoints = localData.proofpoints;
            console.log('Successfully loaded data from local file');
        } catch (localError) {
            console.error('Failed to load local data:', localError);
            throw localError; // Can't proceed without local data
        }

        // Check internet connectivity and attempt to fetch remote data
        if (this.checkInternetConnection()) {
            let connectionTimeout;
            try {
                console.log('Internet connection detected, checking for remote updates...');
                const timestamp = new Date().getTime();
                
                // Create abort controller for timeout (with fallback for older browsers)
                const controller = new AbortController();
                connectionTimeout = setTimeout(() => controller.abort(), 5000);
                
                const remoteResponse = await fetch(`https://gist.githubusercontent.com/FrameShared/0ee640b463dc2a21910800afa14f5162/raw/touchscreen-data.json?t=${timestamp}`, {
                    signal: controller.signal
                });
                
                clearTimeout(connectionTimeout);

                if (remoteResponse.ok) {
                    const jsonData = await remoteResponse.json();
                    
                    // Compare local and remote data
                    if (this.shouldUseRemoteData(localData, jsonData)) {
                        console.log('Remote data differs from local, using remote data');
                        this.config = jsonData.config || {};
                        this.questions = jsonData.questions;
                        this.profiles = jsonData.profiles;
                        this.proofpoints = jsonData.proofpoints;
                    } else {
                        console.log('Remote data matches local, continuing with local data');
                    }
                } else {
                    console.warn(`Remote fetch failed with status: ${remoteResponse.status}, continuing with local data`);
                }
            } catch (error) {
                clearTimeout(connectionTimeout); // Ensure timeout is cleared on error
                // Network errors are expected (offline, timeout, etc.)
                if (error.name === 'AbortError' || error.name === 'TypeError') {
                    console.warn('Remote fetch failed (likely no internet), continuing with local data:', error.message);
                } else {
                    console.warn('Remote fetch error, continuing with local data:', error);
                }
            }
        } else {
            console.log('No internet connection detected, using local data only');
        }
    }

    init() {
        this.bindEvents();
        this.activityTracker.startActivityTracking();
        // this.videoSync.initializeVideoSync();
        this.setHomeVideo();
        this.resetAllScreenVisibility(this.screens.waitingScreen);

        // Global button press state:
        Motion.press("button", (element) => {
            Motion.animate(element, {
                scale: 0.95
            })

            return () => Motion.animate(element, {
                scale: 1
            })
        })
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
        this.screens.questionScreen.querySelector('[data-back-button]').addEventListener('click', () => {
            this.goBack();
        });

        // Standard next button - goes to the next question
        this.screens.questionScreen.querySelector('[data-next-btn]').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Proofpoint confirmation button ('continue' button)
        this.screens.proofpointScreen.querySelector('[data-continue-btn]').addEventListener('click', () => {
            this.continueToNextQuestion();
        });

        // Profile back button - disabled so user can't go back and adjust their answers
        // document.getElementById('profile-back-btn').addEventListener('click', () => {
        //     this.goBack();
        // });

        // Start over button (shown on the final thank you screen) - resets the quiz to the waiting screen
        document.getElementById('start-over-btn').addEventListener('click', () => {
            this.resetToWaiting();
        });

        document.getElementById('timeout-restart-btn').addEventListener('click', () => {
            this.resetToWaiting();
        });

        // Dismiss button - dismisses the timeout overlay
        document.getElementById('timeout-dismiss-btn').addEventListener('click', () => {
            this.activityTracker.dismissTimeout();
        });
    }

    setHomeVideo() {
        // Check for querystring 'video' number value (2 or 3) and swap homepage video to match:
        let qsParams = new URLSearchParams(window.location.search);
        const vidQS = qsParams.get('video');
        if (vidQS) {
            const videoEl = document.getElementById('home-video-bg');
            if (videoEl && (vidQS == 2 || vidQS == 3)) {
                videoEl.src = `dist/assets/videos/homepage${vidQS}.mp4`;
            } else {
                console.warn('Invalid video number, skipping video swap');
            }
        }

    }

    /**
     * Resets the quiz to the initial waiting screen.
     * This will also clear any existing timeout timers, and start the activity tracking again.
     */
    resetToWaiting() {
        this.currentQuestion = 0;
        this.answers = [];
        this.profile = null;
        this.activityTracker.hideTimeoutScreen(); // Hide timeout overlay if visible
        this.activityTracker.startActivityTracking();
        this.screens.proofpointContent.classList.add('hidden');
        this.resetAllScreenVisibility(this.screens.waitingScreen);
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.populateQuestionScreen();
        this.transitionToScreen(this.screens.questionScreen, this.screens.introScreen, 'slideup');
    }

    showIntro() {
        this.transitionToScreen(this.screens.introScreen, this.screens.waitingScreen, 'slideup');
    }

    populateQuestionScreen(screenName = 'questionScreen', questionIndex = null) {
        const screen = this.screens[screenName];
        const question = this.questions[questionIndex || this.currentQuestion];

        // Update question text
        screen.querySelector('[data-question-text]').textContent = question.text;

        // Generate answer options
        const optionsContainer = screen.querySelector('[data-answer-options]');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'answer-btn';
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
        screen.querySelector('[data-next-btn]').disabled = true;

        // stagger-animate the answer options buttons in:
        // Motion.animate("#answer-options button", {
        //     opacity: [0, 1],
        //     y: [50, 0]
        // }, {
        //     delay: stagger(0.05)
        // })
    }

    selectOption(element, option, weight = 1) {
        // Remove previous selection
        document.querySelectorAll('div[data-answer-options] button').forEach(btn => {
            btn.classList.remove('bg-gradient-to-b', 'from-[#f3e8d8]', 'to-[#d7b792]');
        });

        // Highlight selected option
        element.classList.add('bg-gradient-to-b', 'from-[#f3e8d8]', 'to-[#d7b792]');

        // Enable next button
        this.screens.questionScreen.querySelector('[data-next-btn]').disabled = false;

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

            const isLastQuestion = (this.currentQuestion + 1) == this.questions.length;
            let hasProofpoint = false;

            // *** NOTE: Oct 29, 2025 -LG ***
            // We are running this calc earlier now, as the client has assigned proof points to final archetypes, rather than to specific questions.
            // (This calc used to be run after the last proofpoint was shown, right before we displayed the 'calculating' screen)
            // This means: 
            // 1. We are only showing a proof point card after the very last question, not after each.
            // 2. We therefore need to calculate the profile as soon as we have the last answer, so we can load the appropriate proofpoint for the archetype.
            // 3. This also means we are also adding a temporary proofpoint relationship to each of the archetypes in the data.json file, ignoring those assigned to the questions.
            // 4. Once we have more proofpoints created to assign back to the questions, we can remove the temporary proofpoint relationships from the data.json file, and switch back to showing a proofpoint card after each question.

            if (isLastQuestion) {
                // TEMPORARY: After the last question, calculate the profile and get the proofpoint from the resulting archetype:
                const profile = this.calculateProfile();
                hasProofpoint = this.populateProofpointContent(profile.proofpoint);
            } else {
                // The standard question-by-question proofpoint display (if defined on a question):
                hasProofpoint = this.populateProofpointContent();
            }

            if (hasProofpoint) {
                // Clear any existing timeout timers, as everything is now automated from here:
                this.activityTracker.clearTimeoutTimers();

                this.transitionToScreen(this.screens.proofpointScreen, this.screens.questionScreen, 'fade', null, () => {
                    this.showProofpointContent();
                    this.startProgressionTimer(this.screens.proofpointScreen, this.config.proofpointerSeconds, (() => { this.continueToNextQuestion() }));
                });
            } else {
                this.continueToNextQuestion(hasProofpoint);
            }
        }
    }

    startProgressionTimer(parent, duration, callback) {
        let spinner = parent.querySelector('.timer-progress-circle');

        if (spinner) {
            const circle = spinner.querySelector('#progress-indicator');
            const circumference = 2 * Math.PI * (circle.r.baseVal.value);
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;

            //Remove hidden class on gradient circle if applied
            circle.setAttribute('class', '');

            let timerAnimation = animate(0, 100, {
                duration,
                ease: "linear",
                onUpdate(latest) {
                    const offset = circumference - (latest / 100) * circumference;
                    circle.style.strokeDashoffset = offset;
                },
            });

            document.addEventListener('stopTimers', () => {
                timerAnimation.stop();
                setTimeout(() => {
                    circle.setAttribute('class', 'hidden');
                }, 1000);
            })

            timerAnimation.then(() => {
                callback();

                setTimeout(() => {
                    circle.setAttribute('class', 'hidden');
                }, 1000);
            });
            
        }
    }

    /**
     * Populates the proofpoint content.
     * @param {string} proofpointId - The ID of the proofpoint to populate. If null, the selected quiz option's proofpoint will be used.
     * @returns {boolean} - True if a proofpoint was found and populated, false if not.
     */
    populateProofpointContent(proofpointId = null) {
        const pp = proofpointId || this.selectedOption.proofpoint;
        const selectedProofpoint = this.proofpoints.filter(proofpoint => proofpoint.id === pp)[0];

        if (!selectedProofpoint || typeof selectedProofpoint === 'undefined') {
            console.warn('No proofpoint found for selected option, skipping to next question...');
            // this.continueToNextQuestion();
            return false;
        }
        document.getElementById('proofpoint-image').src = `dist/assets/images/${selectedProofpoint.image}`;
        document.getElementById('proofpoint-feature').textContent = selectedProofpoint.feature;
        document.getElementById('proofpoint-title').textContent = selectedProofpoint.title;
        document.getElementById('proofpoint-subtitle').textContent = selectedProofpoint.subtitle || '';
        document.getElementById('proofpoint-description').textContent = selectedProofpoint.description || '';
        document.getElementById('continue-btn-text').textContent = (this.currentQuestion + 1 == this.questions.length) ? 'REVEAL' : 'NEXT';
        return true;
    }

    /**
     * Animates in the proofpoint content.
     */
    showProofpointContent() {
        this.screens.proofpointContent.classList.remove('hidden');
        // fade in the proofpoint screen and then animate in the content.
        Motion.animate([
            // animate in the content
            [ this.screens.proofpointContent, {
                y: ["100%", "0%"]
            }, {
                ease: "easeInOut",
                delay: 0.35,
                duration: 0.7
            }]
        ])
    }

    /**
     * Animates out the proofpoint content.
     */
    hideProofpointContent() {
        return Motion.animate(this.screens.proofpointContent, {
            y: ["0%", "100%"]
        }, {
            ease: "easeInOut",
            delay: 0.15,
            duration: 0.7
        }).then(() => {
            this.screens.proofpointContent.classList.add('hidden');
        });
    }

    /**
     * Continue after viewing a proofpoint.
     */
    continueToNextQuestion(fromProofpoint = true) {

        const stopTimers = new CustomEvent("stopTimers");
        document.dispatchEvent(stopTimers);

        if ((this.currentQuestion + 1) < this.questions.length) {

            if (fromProofpoint) {
                // Slide out the proofpoint content, and recalc the next question:
                this.hideProofpointContent().then(() => {
                    this.currentQuestion++;
                    this.populateQuestionScreen();
                    this.transitionToScreen(
                        this.screens.questionScreen, 
                        this.screens.proofpointScreen, 
                        'slideup', 
                        // the updateCallback:
                        () => {
                            // console.log('updateCallback called');
                        },
                        // the postTransitionCallback:
                        () => {
                            // console.log('postTransitionCallback called');
                        }
                    );
                })
            } else {
                // No proofpoint for the last question, so create an imposter question screen and transition to it:
                this.createImposterQuestionScreen();
                this.currentQuestion++;
                this.populateQuestionScreen();
                this.transitionToScreen(
                    this.screens.questionScreen, 
                    this.screens.tempQuestionScreen, 
                    'slideup', 
                );
            }

        } else {
            console.log('All questions done. calculating profile and showing profile calculation screen');
            this.screens.proofpointScreen.classList.remove('z-20');
            this.showProfileCalculationScreen();
        }
    }

    /*
     * Go back to the previous question, or back to the intro screen if on Q1.
     */
    goBack() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.answers.pop();

            if (this.questionHasProofpoint(this.currentQuestion)) {
                this.transitionToScreen(this.screens.proofpointScreen, this.screens.questionScreen, 'slidedown', null, () => {
                    this.showProofpointContent();
                    this.startProgressionTimer(this.screens.proofpointScreen, this.config.proofpointerSeconds, (() => { this.continueToNextQuestion() }));
                });
            } else {
                this.createImposterQuestionScreen();
                this.populateQuestionScreen();
                this.transitionToScreen(this.screens.questionScreen, this.screens.tempQuestionScreen, 'slidedown');
            }
        } else {
            this.transitionToScreen(this.screens.introScreen, this.screens.questionScreen, 'slidedown');
        }
    }

    /**
     * Calculates the profile based on the answers.
     * @returns {Object} - The calculated profile object.
     */
    calculateProfile() {
        console.log('🧪 Calculating profile...');
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

        return this.profile;
    }

    showProfileCalculationScreen() {
        // Populate the users profile reveal content:
        this.populateProfileReveal();
        this.transitionToScreen(this.screens.profileCalculationScreen, this.screens.proofpointScreen, 'dramaticfade');

        const calcContent = document.querySelector('.profile-calculate-content');
        Motion.animate(calcContent, {
            opacity: 1,
            scale: [0.9, 1]
        }, {
            delay: 0.3,
            duration: 0.8
        }).then(() => {
            //Start countdown timer 
            this.startProgressionTimer(this.screens.profileCalculationScreen, 2, (() => {
                Motion.animate(calcContent, {
                    opacity: 0,
                    scale: [1, 0.9]
                }, {
                    delay: 0,
                    duration: 0.8
                }).then(() => {
                    setTimeout(() => {
                        this.showProfileReveal();
                    }, 200);
                })
            }));
            // animate back out after a 2s delay, before changing to the next page:
        });

        
    }

    populateProfileReveal() {
        document.querySelector('.profile-icon').src = `dist/assets/images/${this.profile.icon}`;
        document.getElementById('profile-title').innerHTML = this.profile.title;
        document.getElementById('profile-tagline').textContent = this.profile.tagline;
        document.querySelector('.profile-qr').src = `dist/assets/images/${this.profile.qr_img}`;
        document.getElementById('profile-description').innerHTML = this.profile.description1.replace('\n', '<br>');

        // Update profile icon dynamically
        const profileIcon = document.querySelector('#profile-reveal-screen img');
        if (profileIcon && this.profile.icon) {
            profileIcon.src = `dist/assets/images/${this.profile.icon}`;
            profileIcon.alt = `${this.profile.title.replace('<br>', ' ')} icon`;
        }
    }

    showProfileReveal() {
        // We re-enable the timeout overlay just for this final screen:
        this.activityTracker.startActivityTracking();
        this.transitionToScreen(this.screens.profileRevealScreen, this.screens.profileCalculationScreen, 'fade');
    }

    showTimeout() {
        // Only show timeout if not on the waiting screen 
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen && (currentScreen.id === 'waiting-screen')) {
            // Don't show timeout on waiting screen, just reset the timer over and over again.
            // this.resetToWaiting();
            this.activityTracker.startCountdown();
            return;
        }

        // Show timeout overlay
        this.screens.timeoutScreen.classList.remove('opacity-0', 'pointer-events-none');
        this.activityTracker.startCountdown(); // teh final countdown timer
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

    /**
     * Transition between screens using the View Transition API
     * @param {HTMLElement} nextScreen - The screen to transition to
     * @param {HTMLElement} prevScreen - The screen to transition from
     * @param {string} transitionType - Type of transition: 'slideup', 'slidedown', 'dramaticfade', or 'fade'
     * @param {Function} updateCallback - Optional callback to run during the transition
     * @param {Function} postTransitionCallback - Optional callback to run after the transition completes
     */
    transitionToScreen(nextScreen, prevScreen, transitionType = 'slideup', updateCallback = null, postTransitionCallback = null) {
        console.log('transitionToScreen', {
            prev: prevScreen?.id,
            next: nextScreen.id,
            type: transitionType
        });

        // Set view-transition-name on next screen BEFORE the transition starts
        // This ensures the browser can capture both old and new states properly
        if (prevScreen) {
            prevScreen.style.viewTransitionName = `${transitionType}_old`;
        }

        // Use View Transition API if available
        const viewTransition = document.startViewTransition(() => {
            // The assignment of the VT name to the new element INSIDE this function 
            // is critical, to avoid a flash of content once the transition completes.
            nextScreen.style.viewTransitionName = `${transitionType}_new`;
            // Reset the DOM state to what it should be next:
            this.resetAllScreenVisibility(nextScreen);

            // Run optional callback
            if (updateCallback) {
                updateCallback();
            }
        });

        // Clean up after transition completes
        viewTransition.finished.then(() => {
            // Remove view-transition-name from next screen
            prevScreen.style.viewTransitionName = 'none';
            nextScreen.style.viewTransitionName = 'none';
            if (postTransitionCallback) {
                console.info('Post transition callback was supplied, executing...');
                postTransitionCallback();
            }
        });

        return viewTransition;
    }

    /**
     * ================================
     * Utility functions (stuff to make life easier)
     * ================================
     */

    /**
     * Checks if an internet connection is available
     * @returns {boolean} - True if internet connection appears to be available
     */
    checkInternetConnection() {
        // Check navigator.onLine (basic check, not always reliable)
        if (navigator.onLine === false) {
            return false;
        }
        // navigator.onLine can be true even when offline, so we'll attempt the fetch
        // and handle errors gracefully
        return true;
    }

    /**
     * Compares local and remote data to determine if remote should be used
     * @param {Object} localData - The locally loaded data
     * @param {Object} remoteData - The remotely fetched data
     * @returns {boolean} - True if remote data should override local data
     */
    shouldUseRemoteData(localData, remoteData) {
        // Simple JSON string comparison (fastest method)
        // This will catch any differences in structure or content
        const localJson = JSON.stringify(localData);
        const remoteJson = JSON.stringify(remoteData);

        if (localJson !== remoteJson) {
            // Files differ - use remote
            return true;
        }

        // Files are identical - keep local
        return false;
    }

    /**
     * Creates a copy of the current question, and flips it in place of the real one (which becomes inactive/hidden), so that we can then 
     * run a standard viewTransition from this old question to the new one (which can be populated with new questions after the imposter is created)
     */
    createImposterQuestionScreen() {
        // copy the real question screen content into the imposter screen:
        this.screens.tempQuestionScreen.innerHTML = this.screens.questionScreen.innerHTML;

        // sneakily flip the real question screen and temp screen visibility before we animate it all back again:
        this.screens.questionScreen.classList.remove('active');
        this.screens.tempQuestionScreen.classList.add('active');
    }

    /**
     * Resets all screens to hidden, and if a screen element is provided, makes it active
     * @param {HTMLElement} activeScreen - The screen to make active.
     */
    resetAllScreenVisibility(activeScreen = null) {
        Object.values(this.screens).forEach(screen => {
            if (typeof screen !== 'undefined' && screen !== null) {
                screen.classList.remove('active');
            }
        });
        if (activeScreen) {
            activeScreen.classList.add('active');
        }
    }

    /**
     * Checks if the question has a proofpoint assigned to it.
     * @param {number} questionIndex - The index of the question to check.
     * @returns {boolean} - True if the question has a proofpoint assigned to it, false if not.
     */
    questionHasProofpoint(questionIndex) {
        return this.questions[questionIndex].proofpoint !== null && typeof this.questions[questionIndex].proofpoint !== 'undefined';
    }

    /**
     * Resolves the profile key based on the need state and style profile from the data.json file.
     * @param {string} needState - The need state.
     * @param {string} styleProfile - The style profile.
     * @returns {string} - The profile key.
     */
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

}

