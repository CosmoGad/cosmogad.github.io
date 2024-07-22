require('dotenv').config({ path: 'C:/Users/13dan/crypto-clipsX2/backend/.env' });
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
console.log('WEBAPP_URL:', process.env.WEBAPP_URL);

const express = require('express');
const connectDB = require('./database');
const telegramBot = require('./telegramBot');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const app = express();

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const cors = require('cors');
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
        await telegramBot.launch();
        console.log('Telegram бот успешно запущен');
    } catch (error) {
        console.error('Ошибка при запуске:', error);
        server.close(() => {
            process.exit(1);
        });
    }
});

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// Добавьте обработку завершения работы
process.on('SIGINT', () => {
    console.log('Получен сигнал SIGINT. Закрытие сервера...');
    server.close(() => {
        console.log('Сервер закрыт.');
        telegramBot.stop('SIGINT');
        mongoose.connection.close(false, () => {
            console.log('Соединение с MongoDB закрыто.');
            process.exit(0);
        });
    });
});

process.on('SIGTERM', () => {
    console.log('Получен сигнал SIGTERM. Закрытие сервера...');
    server.close(() => {
        console.log('Сервер закрыт.');
        telegramBot.stop('SIGTERM');
        mongoose.connection.close(false, () => {
            console.log('Соединение с MongoDB закрыто.');
            process.exit(0);
        });
    });
});