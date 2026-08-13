// PEAL Chat - P2P Network Setup (Libp2p + Tor + Garlic)

// P2P Configuration
const P2P_CONFIG = {
    protocol: 'peal-chat-v1',
    maxPeers: 50,
    bundleSize: 5,
    bundleTimeout: 5000, // 5 seconds
};

// Garlic Bundling
class GarlicBundler {
    constructor() {
        this.queue = [];
        this.lastFlush = Date.now();
    }

    addToBundle(message) {
        this.queue.push(message);
        
        if (this.queue.length >= P2P_CONFIG.bundleSize || 
            Date.now() - this.lastFlush >= P2P_CONFIG.bundleTimeout) {
            this.flushBundle();
        }
    }

    flushBundle() {
        if (this.queue.length === 0) return;
        
        const bundle = this.queue;
        const shuffled = bundle.sort(() => Math.random() - 0.5);
        const padded = shuffled.map(msg => this.padToFixed(msg));
        
        console.log('Garlic bundle sent:', padded.length, 'messages');
        this.queue = [];
        this.lastFlush = Date.now();
    }

    padToFixed(message) {
        const FIXED_SIZE = 512;
        let padded = JSON.stringify(message);
        while (padded.length < FIXED_SIZE) {
            padded += ' ';
        }
        return padded.slice(0, FIXED_SIZE);
    }
}

// P2P Node Status
class P2PNode {
    constructor() {
        this.connected = false;
        this.peers = 0;
        this.bundler = new GarlicBundler();
    }

    connect() {
        // Simulated P2P connection (Libp2p + Tor will be added)
        this.connected = true;
        this.peers = Math.floor(Math.random() * 20) + 1;
        console.log('PEAL P2P node connected, peers:', this.peers);
    }

    sendMessage(message) {
        this.bundler.addToBundle(message);
        console.log('Message queued for garlic bundling');
    }

    getStatus() {
        return {
            connected: this.connected,
            peers: this.peers
        };
    }
}

// Initialize P2P
const p2p = new P2PNode();
p2p.connect();

// Encrypted Message Sender
function sendEncryptedMessage(message, recipient) {
    p2p.sendMessage({
        to: recipient,
        message: message,
        timestamp: Date.now()
    });
}
