const crypto = require('crypto');

// Define a secret key (use a secure method in production)
const secret = process.env.BASEKEY;
const algorithm = 'aes-256-cbc';
const ivLength = 16; // 16 bytes for AES

// Ensure the secret key is exactly 32 bytes (for aes-256)
const secretKey = crypto.createHash('sha256').update(secret).digest('base64').substr(0, 32);

// Function to encrypt an API key
function encryptApiKey(apiKey) {
  const iv = crypto.randomBytes(ivLength); // Create a random IV
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Return in `iv:encrypted` format
}

// Function to decrypt an API key
function decryptApiKey(encryptedApiKey) {
  try {
    // Ensure the format is correct
    const [ivHex, encrypted] = encryptedApiKey.split(':');
    if (!ivHex || ivHex.length !== ivLength * 2 || !encrypted) {
      throw new Error('Invalid encrypted API key format');
    }
    
    const iv = Buffer.from(ivHex, 'hex'); // Convert IV back to Buffer
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Failed to decrypt API key');
  }
}

module.exports = {
  encryptApiKey,
  decryptApiKey,
};