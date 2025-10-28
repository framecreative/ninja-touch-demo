import { animate } from "motion";

/**
 * Activity Tracking Module
 * Handles user activity monitoring and timeout functionality
 */
export class ActivityTracker {
    constructor() {
        this.timeoutTimer = null;
        this.countdownTimer = null;
        this.lastActivity = Date.now();
        this.activityListenersSetup = false;
        this.timeoutCallback = null;
        this.countdownCallback = null;
        this.config = {};
        this.countdownSeconds = this.config.countdownSeconds || 30;
        this.countdownPopupSeconds = this.config.countdownPopupSeconds || 15;
        this.proofpointerSeconds = this.config.proofpointerSeconds || 10;
        this.finalScreenSeconds = this.config.finalScreenSeconds || 20;
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

        // Set timeout for 30 seconds
        this.timeoutTimer = setTimeout(() => {
            if (this.timeoutCallback) {
                this.timeoutCallback();
            }
        }, 30000);
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
        }, (this.countdownSeconds) * 1000);
    }

    resetActivity() {
        this.lastActivity = Date.now();
        this.resetTimeout();
    }

    startCountdown() {
        let countdown = this.countdownPopupSeconds;
        document.getElementById('countdown-number').textContent = countdown;

        let spinner = document.querySelector('.countdown-progress-circle');

        if (spinner) {
            const circle = spinner.querySelector('#progress-indicator');

            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;

            const targetValue = 100;

            //Remove hidden class on gradient circle if applied
            circle.setAttribute('class', '');

            document.getElementById('countdown-number').textContent = countdown;


            let animation = animate(0, targetValue, {
                duration: this.countdownPopupSeconds,
                easing: "easeInOut",
                onUpdate(latest) {
                    const offset = circumference - (latest / 100) * circumference;
                    circle.style.strokeDashoffset = offset;

                    //Update timer based on current time of animation
                    const currentSecond = animation.duration - Math.floor(animation.time);
                    
                    if(currentSecond < countdown) {
                        countdown = currentSecond;
                        document.getElementById('countdown-number').textContent = countdown;

                    } 
                },
            });

            document.addEventListener('stopTimers', () => {
                circle.setAttribute('class', 'hidden');
                animation.stop();
            })

            animation.then(() => {
                circle.setAttribute('class', 'hidden');
                console.log('completed')
                this.hideTimeout();
                if(this.countdownCallback()){
                    this.countdownCallback();
                }
            });
            
        }

        

    }

    reduceTimer(el){
            
    }

    dismissTimeout() {
        this.hideTimeout();
        this.resetTimeout();
    }

    hideTimeout() {
        document.getElementById('timeout-screen').classList.add('opacity-0', 'pointer-events-none');
    }

    clearTimers() {
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }
}
