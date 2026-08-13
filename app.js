// PEAL Chat - Main App Logic

// Splash Screen Timer (2.5 seconds)
setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}, 2500);

// Auto-generated Anonymous Username
function generateUsername() {
    const words = ['silent', 'crypto', 'privacy', 'ghost', 'shadow', 'ninja', 'cyber', 'stealth', 'mystic', 'hidden'];
    const word = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(Math.random() * 900 + 100);
    return word + '_' + number;
}

// Create Account
function createAccount() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!name) {
        alert('Please enter your name');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const username = generateUsername();
    alert('Your username: ' + username + '\nSave this to login again!');
    
    // Store user data locally
    const userData = {
        name: name,
        username: username,
        password: password
    };
    
    localStorage.setItem('peal_user', JSON.stringify(userData));
    alert('Account created successfully! Welcome to PEAL, ' + username);
}

// Show Login
function showLogin() {
    alert('Login feature coming soon!');
}
