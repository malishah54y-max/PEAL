// PEAL Chat - Admin Panel Module

// Admin Credentials (5 Super Admins)
const SUPER_ADMINS = [
    'admin1',
    'admin2',
    'admin3',
    'admin4',
    'admin5'
];

// Admin Types
const ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin'
};

// Current Admin Session
let currentAdmin = null;
let currentRole = null;

// Admin Login
function adminLogin(username, password) {
    const isSuperAdmin = SUPER_ADMINS.includes(username);
    
    if (isSuperAdmin) {
        currentAdmin = username;
        currentRole = ADMIN_ROLES.SUPER_ADMIN;
        return true;
    }
    
    // Check regular admins (10 max)
    const admins = JSON.parse(localStorage.getItem('peal_admins') || '[]');
    const admin = admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
        currentAdmin = username;
        currentRole = ADMIN_ROLES.ADMIN;
        return true;
    }
    
    return false;
}

// Admin Logout
function adminLogout() {
    currentAdmin = null;
    currentRole = null;
}

// Get Global Stats
function getGlobalStats() {
    return {
        totalUsers: localStorage.getItem('peal_total_users') || 0,
        totalPosts: localStorage.getItem('peal_total_posts') || 0,
        totalMessages: localStorage.getItem('peal_total_messages') || 0
    };
}

// Get Country-wise Stats (Simulated)
function getCountryStats() {
    return {
        'India': 312000,
        'Brazil': 287000,
        'EU': 198000,
        'USA': 145000,
        'Pakistan': 98000,
        'Argentina': 76000,
        'Others': 132000
    };
}

// Admin Announcement
function broadcastAnnouncement(text) {
    if (currentRole !== ADMIN_ROLES.SUPER_ADMIN) {
        console.error('Only Super Admin can broadcast');
        return false;
    }
    
    const announcement = {
        text: text,
        timestamp: Date.now(),
        active: true,
        by: currentAdmin
    };
    
    const announcements = JSON.parse(localStorage.getItem('peal_announcements') || '[]');
    announcements.push(announcement);
    localStorage.setItem('peal_announcements', JSON.stringify(announcements));
    
    return true;
}

// Banner Management
function setBanner(bannerData) {
    if (currentRole !== ADMIN_ROLES.SUPER_ADMIN) {
        console.error('Only Super Admin can manage banners');
        return false;
    }
    
    localStorage.setItem('peal_banner', JSON.stringify({
        type: bannerData.type || 'text',
        content: bannerData.content,
        active: true,
        setBy: currentAdmin,
        timestamp: Date.now()
    }));
    
    return true;
}

// Remove Banner
function removeBanner() {
    if (currentRole !== ADMIN_ROLES.SUPER_ADMIN) {
        return false;
    }
    
    localStorage.removeItem('peal_banner');
    return true;
}

// Add Admin (Super Admin only)
function addAdmin(username, password) {
    if (currentRole !== ADMIN_ROLES.SUPER_ADMIN) {
        console.error('Only Super Admin can add admins');
        return false;
    }
    
    const admins = JSON.parse(localStorage.getItem('peal_admins') || '[]');
    
    if (admins.length >= 10) {
        console.error('Max 10 admins reached');
        return false;
    }
    
    admins.push({ username, password });
    localStorage.setItem('peal_admins', JSON.stringify(admins));
    return true;
}

// Remove Admin (Super Admin only)
function removeAdmin(username) {
    if (currentRole !== ADMIN_ROLES.SUPER_ADMIN) {
        return false;
    }
    
    const admins = JSON.parse(localStorage.getItem('peal_admins') || '[]');
    const filtered = admins.filter(a => a.username !== username);
    localStorage.setItem('peal_admins', JSON.stringify(filtered));
    return true;
}

// Update Global Stats
function updateGlobalStats(type) {
    const key = 'peal_total_' + type;
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, current + 1);
}

// Initialize Admin Panel
if (typeof gun !== 'undefined') {
    console.log('PEAL Admin Panel initialized');
}
