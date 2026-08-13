// PEAL Chat - Gun.js Database Setup (Decentralized)

// Gun.js Configuration
const GUN_CONFIG = {
    peers: [], // P2P peers will be added here
    localStorage: true,
    radisk: true
};

// Initialize Gun
const gun = Gun(GUN_CONFIG);

// User Database Structure
const usersDB = gun.get('peal_users');
const postsDB = gun.get('peal_posts');
const chatsDB = gun.get('peal_chats');
const adminDB = gun.get('peal_admin');

// Create User
function createUserInDB(username, name, passwordHash) {
    usersDB.get(username).put({
        name: name,
        username: username,
        passwordHash: passwordHash,
        followers: [],
        following: [],
        createdAt: Date.now()
    });
}

// Get User
function getUser(username) {
    return usersDB.get(username);
}

// Follow User
function followUser(currentUser, targetUser) {
    usersDB.get(currentUser).get('following').set(targetUser);
    usersDB.get(targetUser).get('followers').set(currentUser);
}

// Unfollow User
function unfollowUser(currentUser, targetUser) {
    usersDB.get(currentUser).get('following').get(targetUser).put(null);
    usersDB.get(targetUser).get('followers').get(currentUser).put(null);
}

// Create Post
function createPost(username, text) {
    const postId = Date.now().toString();
    postsDB.get(postId).put({
        author: username,
        text: text,
        likes: 0,
        dislikes: 0,
        comments: [],
        timestamp: Date.now()
    });
    return postId;
}

// Like Post
function likePost(postId, username) {
    postsDB.get(postId).get('likes').put((likes || 0) + 1);
}

// Dislike Post
function dislikePost(postId, username) {
    postsDB.get(postId).get('dislikes').put((dislikes || 0) + 1);
}

// Send Message
function sendMessage(from, to, encryptedMessage) {
    const chatId = [from, to].sort().join('_');
    const messageId = Date.now().toString();
    
    chatsDB.get(chatId).get(messageId).put({
        from: from,
        to: to,
        message: encryptedMessage,
        timestamp: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days auto-delete
    });
}

// Admin Announcement
function adminAnnouncement(text) {
    adminDB.get('announcements').get(Date.now().toString()).put({
        text: text,
        timestamp: Date.now(),
        active: true
    });
}

// Get Admin Stats
function getAdminStats() {
    let totalUsers = 0;
    usersDB.map().once((data, key) => {
        if (data && key !== '_') totalUsers++;
    });
    
    return {
        totalUsers: totalUsers
    };
}

console.log('PEAL Gun.js database initialized');
