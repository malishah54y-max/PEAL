// PEAL Chat - Encryption Module (AES-256-GCM + SHA-256)

// SHA-256 Hashing with Salt
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate Salt
function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16)).toString();
}

// AES-256-GCM Encryption
async function encryptMessage(message, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );
    
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        cryptoKey,
        data
    );
    
    const encryptedArray = Array.from(new Uint8Array(encrypted));
    const ivArray = Array.from(iv);
    
    return JSON.stringify({
        iv: ivArray,
        data: encryptedArray
    });
}

// AES-256-GCM Decryption
async function decryptMessage(encryptedData, key) {
    const parsed = JSON.parse(encryptedData);
    const encoder = new TextEncoder();
    
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
        { 
            name: 'AES-GCM', 
            iv: new Uint8Array(parsed.iv) 
        },
        cryptoKey,
        new Uint8Array(parsed.data)
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// WebAuthn (Biometric/Passkeys)
async function registerBiometric() {
    try {
        const publicKeyCredentialCreationOptions = {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: 'PEAL Chat' },
            user: {
                id: crypto.getRandomValues(new Uint8Array(16)),
                name: 'peal_user',
                displayName: 'PEAL User'
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required'
            },
            timeout: 60000
        };
        
        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        });
        
        console.log('Biometric registered successfully');
        return true;
    } catch (error) {
        console.error('Biometric registration failed:', error);
        return false;
    }
}
