// Import styles
import './main.css';

// Import Motion.dev
import { animate, stagger, scroll, press } from 'motion';

// Export Motion utilities globally for easier access
window.Motion = { animate, stagger, scroll, press };

// Import app modules
import { CoffeeProfileQuiz } from './modules/CoffeeProfileQuiz.js';

// Initialize the quiz when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CoffeeProfileQuiz();
});

