// middleware/authenticate.js

const User = require('../model/user');
const { encryptApiKey,decryptApiKey} = require("../security/encryption.js");

const checkAccessLevel = (requiredAccess) => {
    return async (req, res, next) => {
      const apiKey = req.header('x-api-key');
  
      if (!apiKey) {
        return res.status(401).json({ message: 'API key is required' });
      }
      myapiKeyEncry = encryptApiKey(apiKey);
  
      try {
        const users = await User.find();
        const user = users.find(user => decryptApiKey(user.apiKey) === apiKey);
  
        if (!user) {
          return res.status(401).json({ message: 'Invalid API key' });
        }
  
        if (!requiredAccess.includes(user.accessLevel)) {
          return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
  
        // User is authorized
        next();
      } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  };
  
  module.exports = checkAccessLevel;