// C:\Users\13dan\crypto-clipsX2\backend\routes\auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { telegramId, username, firstName, lastName } = req.body;

    try {
        let user = await User.findOne({ telegramId });

        if (!user) {
            user = new User({
                telegramId,
                username,
                firstName,
                lastName,
            });

            await user.save();
        }

        // В реальном приложении здесь нужно создать и отправить JWT токен
        res.json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;