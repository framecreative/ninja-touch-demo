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

        this.timeoutTimer = setTimeout(() => {
            if (this.timeoutCallback) {
                this.timeoutCallback();
            }
        }, 30000);
    }

    resetActivity() {
        this.lastActivity = Date.now();
        this.resetTimeout();
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
                if (this.countdownCallback) {
                    this.countdownCallback();
                }
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
