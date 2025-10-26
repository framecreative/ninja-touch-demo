/**
 * Video Synchronization Module
 * Handles synchronized video playback across multiple devices
 */
export class VideoSync {
    constructor() {
        this.videoDuration = null;
        this.syncEpoch = 1700000000000; // Fixed epoch start time for all devices
        this.playbackStartTime = null;
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

    syncVideoPlayback() {
        const video = document.querySelector('#waiting-screen video');
        if (!video) return;

        // Ensure video duration is valid and finite
        if (!this.videoDuration || !isFinite(this.videoDuration) || this.videoDuration <= 0) {
            console.log('Video duration not ready yet, skipping sync');
            return;
        }

        // Calculate synchronized playback time
        const currentTime = Date.now();
        const timeSinceEpoch = currentTime - this.syncEpoch;

        // Convert to seconds and modulo by video duration to get loop position
        const synchronizedTime = (timeSinceEpoch / 1000) % this.videoDuration;

        // Ensure synchronized time is finite and valid
        if (!isFinite(synchronizedTime) || synchronizedTime < 0) {
            console.log('Invalid synchronized time, skipping sync');
            return;
        }

        // Set video to synchronized time
        video.currentTime = synchronizedTime;

        console.log('Video synced to time:', synchronizedTime.toFixed(2), 'seconds');

        // Ensure video is playing
        if (video.paused) {
            video.play().catch(e => console.log('Video play failed:', e));
        }
    }
}
