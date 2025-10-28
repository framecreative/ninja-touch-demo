import { VideoSync } from './VideoSync.js';
import { ActivityTracker } from './ActivityTracker.js';

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

        // Initialize video synchronization
        this.videoSync = new VideoSync();

        // Initialize activity tracking
        this.activityTracker = new ActivityTracker();
        this.activityTracker.setCallbacks(
            () => this.showTimeout(),
            () => this.resetToWaiting()
        );

        this.screens = {
            introScreen: document.getElementById('intro-screen'),
            questionScreen: document.getElementById('question-screen'),
            proofpointScreen: document.getElementById('proofpoint-screen'),
            proofpointContent: document.querySelector('.proofpoint-content'),
            profileCalculationScreen: document.getElementById('profile-calculation-screen'),
            profileRevealScreen: document.getElementById('profile-reveal-screen'),
            profileDetailsScreen: document.getElementById('profile-details-screen'),
            thankYouScreen: document.getElementById('thank-you-screen'),
            waitingScreen: document.getElementById('waiting-screen'),
            timeoutScreen: document.getElementById('timeout-screen'),
        };

        this.loadData();
    }

    async loadData() {
        try {
            // First try to fetch from GitHub Gist
            console.log('Attempting to fetch data from GitHub Gist...');
            const timestamp = new Date().getTime();
            const gistResponse = await fetch(`https://gist.githubusercontent.com/leighgibbo/5e86fcca79b39f5e7216c8a55a101de2/raw/touchscreen-data.json?t=${timestamp}`);

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
        this.activityTracker.startActivityTracking();
        this.videoSync.initializeVideoSync();
        this.showScreen('waiting-screen');

        // Motion animation declarations:
        // Spinners:
        // const spinners = document.querySelectorAll(".spinner");
        // if (spinners.length > 0) {
        //     spinners.forEach(spinner => {
        //         Motion.animate(
        //             spinner, {
        //                 rotate: 360
        //             }, {
        //                 duration: 1.5,
        //                 repeat: Infinity,
        //                 ease: "linear",
        //             }
        //         )
        //     });
        // }

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
        document.getElementById('back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // Standard next button - goes to the next question
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Proofpoint confirmation button ('continue' button)
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.continueToNextQuestion();
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
            this.activityTracker.dismissTimeout();
        });
    }

    showIntro() {
        console.log('showIntro called', this.screens);
        this.slideScreen(this.screens.introScreen, this.screens.waitingScreen, 'up');
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.populateQuestionScreen();
        this.slideScreen(this.screens.questionScreen, this.screens.introScreen, 'up');
    }

    populateQuestionScreen() {
        const question = this.questions[this.currentQuestion];

        // Update question text
        document.getElementById('question-text').textContent = question.text;

        // Generate answer options
        const optionsContainer = document.getElementById('answer-options');
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
        document.getElementById('next-btn').disabled = true;

        // this.showScreen('question-screen');

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
        document.querySelectorAll('#answer-options button').forEach(btn => {
            btn.classList.remove('bg-gradient-to-b', 'from-[#f3e8d8]', 'to-[#d7b792]');
        });

        // Highlight selected option
        element.classList.add('bg-gradient-to-b', 'from-[#f3e8d8]', 'to-[#d7b792]');

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
            // this.continueToNextQuestion();
        }
    }

    showProofpointScreen() {
        // populate the proofpoint data first:
        const selectedProofpoint = this.proofpoints.filter(proofpoint => proofpoint.id === this.selectedOption.proofpoint)[0];
        if (!selectedProofpoint) {
            console.warn('No proofpoint found for selected option, skipping to next question...');
            this.continueToNextQuestion();
            return;
        }
        document.getElementById('proofpoint-image').src = `assets/images/${selectedProofpoint.image}`;
        document.getElementById('proofpoint-title').textContent = selectedProofpoint.title;
        document.getElementById('proofpoint-subtitle').textContent = selectedProofpoint.subtitle || '';
        document.getElementById('proofpoint-description').textContent = selectedProofpoint.description || '';

        this.screens.proofpointScreen.classList.add('active');
        this.screens.proofpointContent.classList.remove('hidden');

        // this.showScreen('proofpoint-screen', 'question-screen');
        // fade in the proofpoint screen and then animate in the content.
        Motion.animate([
            // fade in the screen
            [ this.screens.proofpointScreen, {
                opacity: [0, 1]
            }, {
                ease: "easeInOut",
                delay: 0,
                duration: 0.3
            }],
            // animate in the content
            [ this.screens.proofpointContent, {
                y: ["150%", "0%"]
            }, {
                ease: "easeInOut",
                delay: 0.35,
                duration: 0.7
            }]
        ])
    }

    continueToNextQuestion() {
        if ((this.currentQuestion + 1) < this.questions.length) {
            console.log(`going to question number: ${this.currentQuestion + 2} of ${this.questions.length}`);
            // Slide out the proofpoint content, and recalc the next question:
            Motion.animate(this.screens.proofpointContent, {
                y: ["0%", "150%"]
            }, {
                ease: "easeInOut",
                delay: 0.15,
                duration: 0.7
            }).then(() => {
                this.screens.proofpointContent.classList.add('hidden');
            }).then(() => {
                this.currentQuestion++;
                this.populateQuestionScreen();
                this.slideScreen(this.screens.questionScreen, this.screens.proofpointScreen, 'up');
            })
        } else {
            console.log('All questions done. calculating profile and showing profile calculation screen');
            // Calculate the profile and show the profile calculation screen:
            this.calculateProfile();
            this.showProfileCalculationScreen();
        }
    }

    goBack() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.answers.pop();
            this.populateQuestionScreen();
        } else {
            this.showScreen('intro-screen', 'question-screen');
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

    showProfileCalculationScreen() {
        // this.showScreen('profile-calculation-screen', 'question-screen');
        this.populateProfileReveal();

        this.screens.questionScreen.classList.remove('active');
        this.slideScreen(this.screens.profileCalculationScreen, this.screens.proofpointScreen, 'down', true);

        const calcContent = document.querySelector('.profile-calculate-content');
        Motion.animate(calcContent, {
            opacity: 1,
            scale: [0.9, 1]
        }, {
            delay: 0.3,
            duration: 0.8
        }).then(() => {
            // animate back out after a 2s delay, before changing to the next page:
            Motion.animate(calcContent, {
                opacity: 0,
                scale: [1, 0.9]
            }, {
                delay: 2,
                duration: 0.8
            }).then(() => {
                setTimeout(() => {
                    this.showProfileReveal();
                }, 200);
            })
        })
    }

    populateProfileReveal() {
        document.querySelector('.profile-icon').src = `assets/images/${this.profile.icon}`;
        document.getElementById('profile-title').innerHTML = this.profile.title;
        document.getElementById('profile-tagline').textContent = this.profile.tagline;

        // Update profile icon dynamically
        const profileIcon = document.querySelector('#profile-reveal-screen img');
        if (profileIcon && this.profile.icon) {
            profileIcon.src = `assets/images/${this.profile.icon}`;
            profileIcon.alt = `${this.profile.title.replace('<br>', ' ')} icon`;
        }
    }

    showProfileReveal() {
        this.showScreen('profile-reveal-screen', 'profile-calculation-screen');
    }

    showProfileDetails() {
        document.getElementById('profile-details-description').textContent = this.profile.description1;
        this.showScreen('profile-details-screen', 'profile-reveal-screen');
    }

    showThankYou() {
        this.showScreen('thank-you-screen', 'profile-details-screen');
    }

    showTimeout() {
        // Only show timeout if not on the waiting screen
        const currentScreen = document.querySelector('.screen:not(.opacity-0)');
        if (currentScreen && currentScreen.id === 'waiting-screen') {
            // Don't show timeout on waiting screen, just reset
            this.resetToWaiting();
            return;
        }

        // Show timeout overlay
        document.getElementById('timeout-screen').classList.remove('opacity-0', 'pointer-events-none');
        this.activityTracker.startCountdown();
    }


    resetToWaiting() {
        // this.currentQuestion = 0;
        // this.answers = [];
        // this.profile = null;
        // this.activityTracker.hideTimeout(); // Hide timeout overlay if visible
        // this.showScreen('waiting-screen', 'thank-you-screen');
        // this.activityTracker.startActivityTracking();
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

    setActiveScreen(screenId) {
        const others = document.querySelectorAll('.screen');
        others.forEach(screen => {
            screen.classList.remove('active');
        });
        console.log('setting active screen state for:', screenId);
        const activeScreen = document.getElementById(screenId);
        activeScreen.classList.add('active');
    }

    resetOtherScreens(screenId) {
        const otherScreens = document.querySelectorAll('.screen:not(#' + screenId + ')');
        otherScreens.forEach(screen => {
            screen.classList.remove('active', 'z-20');
        });
    }

    slideScreen(nextScreenEl, prevScreenEl, direction = 'up', reverse = false) {
        console.log('slideScreen', {
            "prev": prevScreenEl.id, 
            "next": nextScreenEl.id,
            "direction": direction,
            "reverse": reverse,
        });
        let movementScheme, elementToSlide;

        if (reverse) {
            elementToSlide = prevScreenEl;
            movementScheme = ['0%', (direction === 'up' ? '-100%' : '100%')]
            prevScreenEl.classList.add('active', 'z-20');
            nextScreenEl.classList.add('active', 'z-10');
        } else {
            elementToSlide = nextScreenEl;
            movementScheme = [(direction === 'up' ? '100%' : '-100%'), '0%']
            // make sure the next screen is off-page before applying the 'active' and animating (prevents flickering)
            nextScreenEl.style.transform = (direction === 'up')? 'translateY(100%)' : 'translateY(-100%)';
            nextScreenEl.classList.add('active', 'z-20');
        }

        // This will either:
        // - slide the 'next screen' element IN as the foreground screen, or; 
        // - slide the 'previous screen' element OUT as the foreground screen, revealing the 'next screen' element behind.
        Motion.animate(elementToSlide, {
            y: movementScheme
        }, {
            ease: "easeInOut",
            delay: 0.1,
            duration: 0.5
        }).then(() => {
            if (reverse) {
                prevScreenEl.classList.remove('active', 'z-20');
                nextScreenEl.classList.remove('z-10');
            } else {
                nextScreenEl.classList.remove('z-20');
                prevScreenEl.classList.remove('active', 'z-20');
            }
        })
    }

    // TODO: likely delete this function
    showScreen(screenId, previousScreenId = false) {

        const nextScreen = document.getElementById(screenId);
        // apply 'active' class to the next screen before doing anything else
        this.setActiveScreen(screenId);

        // if (!previousScreenId) {
        //     // Hide all other screens
        //     document.querySelectorAll('.screen').forEach(screen => {
        //         screen.classList.add('opacity-0', 'pointer-events-none');
        //     });
        //     // Show the next screen
        //     nextScreen.classList.remove('opacity-0', 'pointer-events-none');
        // } else {
        //     // Animate the two screens in a sequence
        //     const previousScreen = document.getElementById(previousScreenId);
        //     const sequence = [
        //         [previousScreen, {opacity: 0}, {duration: 0.2}],
        //         [nextScreen, {opacity: 1}, {duration: 0.2}]
        //     ]
        //     Motion.animate(sequence);
        //     console.log('Animating screens in sequence:', previousScreenId, '->', screenId);
        // }

        // Handle video synchronization & fading in/out for waiting screen
        if (screenId === 'waiting-screen') {
            this.videoSync.syncVideoPlayback();
            document.querySelector('#waiting-screen video').classList.add('opacity-100');
            document.querySelector('#waiting-screen video').classList.remove('opacity-0');
        } else {
            document.querySelector('#waiting-screen video').classList.add('opacity-0');
            document.querySelector('#waiting-screen video').classList.remove('opacity-100');
        }

        // Update activity tracking
        this.activityTracker.resetActivity();
    }

}

