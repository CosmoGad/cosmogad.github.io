require('dotenv').config();
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
console.log('WEBAPP_URL:', process.env.WEBAPP_URL);

const express = require('express');
const connectDB = require('./database');
const telegramBot = require('./telegramBot');
const mongoose = require('mongoose');
const cors = require('cors');
const commentsRouter = require('./routes/comments');

const port = process.env.PORT || 3001;
const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use(express.json());
app.use('/api/comments', commentsRouter);

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

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
