// C:\Users\13dan\crypto-clipsX2\backend\middleware\auth.js

const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const telegramId = req.headers['x-telegram-id'];
        if (!telegramId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};