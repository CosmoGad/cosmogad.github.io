require('dotenv').config();
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
console.log('WEBAPP_URL:', process.env.WEBAPP_URL);

const express = require('express');
const connectDB = require('./database');
const telegramBot = require('./telegramBot');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 3001;
const app = express();

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

const server = app.listen(port, async () => {
    console.log(`Сервер запущен на порту ${port}`);
    try {
        await connectDB();
        if (telegramBot.launch) {
            await telegramBot.launch();
            console.log('Telegram бот успешно запущен');
        } else {
            console.log('Telegram бот не сконфигурирован');
        }
    } catch (error) {
        console.error('Ошибка при запуске:', error);
        server.close(() => {
            process.exit(1);
        });
    }
});

// Остальной код остается без изменений
