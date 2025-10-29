import { animate } from "motion";

/**
 * Activity Tracking Module
 * Handles user activity monitoring and timeout functionality
 */
export class ActivityTracker {
    constructor() {
        this.timeoutTimer = null; // the timeout before showing the timeout screen
        this.countdownTimer = null; // the countdown timer that is started when the timeout screen is shown
        this.lastActivity = Date.now();
        this.activityListenersSetup = false;
        this.timeoutCallback = null;
        this.countdownCallback = null;
        this.config = {};
    }

    setConfig(config) {
        this.config = config;
    }

    setCallbacks(timeoutCallback, countdownCallback) {
        this.timeoutCallback = timeoutCallback;
        this.countdownCallback = countdownCallback;
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

        // Set timeout for the countdown seconds
        this.timeoutTimer = setTimeout(() => {
            if (this.timeoutCallback) {
                this.timeoutCallback();
            }
        }, (this.config.countdownSeconds || 30) * 1000);
    }

    resetTimeout() {
        // Clear existing timeout and set a new one
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }

        // Clear any running countdown timer
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }

        this.timeoutTimer = setTimeout(() => {
            if (this.timeoutCallback) {
                this.timeoutCallback();
            }
        }, (this.config.countdownSeconds || 30) * 1000);
    }

    resetActivity() {
        this.lastActivity = Date.now();
        this.resetTimeout();
    }

    // This is the countdown timer inside the global timeout overlay
    startCountdown() {
        let countdown = this.config.countdownPopupSeconds || 15;
        const countdownNumber = document.getElementById('countdown-number');
        const spinner = document.getElementById('timeout-screen').querySelector('.countdown-progress-circle');
        countdownNumber.textContent = countdown;

        this.countdownTimer = setInterval(() => {
            countdown--;
            countdownNumber.textContent = countdown;

            if (countdown <= 0) {
                this.resetTimeout();

                this.hideTimeoutScreen();
                if (this.countdownCallback) {
                    this.countdownCallback();
                }
            }
        }, 1000);

        if (spinner) {
            const circle = spinner.querySelector('#progress-indicator');
            const circumference = 2 * Math.PI * (circle.r.baseVal.value);
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;

            //Remove hidden class on gradient circle if applied
            circle.setAttribute('class', '');

            let animation = animate(0, 100, {
                duration: (this.config.countdownPopupSeconds || 15) * 1000,
                ease: "linear",
                onUpdate(latest) {
                    const offset = circumference - ((latest / 100) * circumference);
                    circle.style.strokeDashoffset = offset;

                    //Update timer based on current time of animation
                    const currentSecond = animation.duration - Math.floor(animation.time);

                    if(currentSecond < countdown) {
                        countdown = currentSecond;
                        countdownNumber.textContent = countdown;
                    } 
                },
            });

            animation.then(() => {
                circle.setAttribute('class', 'hidden');
            });
        }
    }

    dismissTimeout() {
        this.hideTimeoutScreen();
        this.resetTimeout();
    }

    hideTimeoutScreen() {
        document.getElementById('timeout-screen').classList.add('opacity-0', 'pointer-events-none');
    }

    clearTimeoutTimers() {
        console.log('clearing timeout timers');
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }
}
