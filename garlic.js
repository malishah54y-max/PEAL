// PEAL Chat - Custom Garlic Routing Module

class GarlicRouting {
    constructor() {
        this.layers = 4;
        this.bundleQueue = [];
        this.coverTrafficEnabled = true;
        this.coverInterval = null;
        this.startCoverTraffic();
    }

    // Garlic Clove Creation
    createClove(messages) {
        const clove = messages.map(msg => this.wrapLayers(msg));
        return clove;
    }

    // Wrap message in multiple encryption layers
    wrapLayers(message) {
        let wrapped = message;
        for (let i = 0; i < this.layers; i++) {
            wrapped = {
                layer: i + 1,
                payload: wrapped,
                timestamp: Date.now() + (Math.random() * 1000)
            };
        }
        return wrapped;
    }

    // Bundle messages into garlic clove
    bundleMessages(messages) {
        const shuffled = messages.sort(() => Math.random() - 0.5);
        const garlicClove = this.createClove(shuffled);
        this.bundleQueue.push(garlicClove);
        return garlicClove;
    }

    // Random delay to prevent timing analysis
    randomDelay() {
        return Math.random() * 4000 + 1000; // 1-5 seconds
    }

    // Cover traffic - dummy packets
    startCoverTraffic() {
        if (this.coverTrafficEnabled && !this.coverInterval) {
            this.coverInterval = setInterval(() => {
                const dummyMessages = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < dummyMessages; i++) {
                    this.createClove([{ dummy: true, data: Math.random() }]);
                }
                console.log('Cover traffic sent');
            }, 5000); // Every 5 seconds
        }
    }

    // Stop cover traffic
    stopCoverTraffic() {
        if (this.coverInterval) {
            clearInterval(this.coverInterval);
            this.coverInterval = null;
        }
    }

    // Process incoming garlic clove
    processIncomingClove(clove) {
        const unwrapped = clove.map(msg => this.unwrapLayers(msg));
        return unwrapped.filter(msg => !msg.dummy);
    }

    // Unwrap layers
    unwrapLayers(message) {
        let current = message;
        for (let i = 0; i < this.layers; i++) {
            current = current.payload;
        }
        return current;
    }

    // Get routing stats
    getStats() {
        return {
            layers: this.layers,
            queueSize: this.bundleQueue.length,
            coverTraffic: this.coverTrafficEnabled,
            nextDelay: this.randomDelay()
        };
    }
}

// Initialize Garlic Routing
const garlic = new GarlicRouting();

// Export for use in other modules
window.garlicRouting = garlic;
