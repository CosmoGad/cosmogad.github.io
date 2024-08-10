require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const telegramBot = require('./telegramBot');

const app = express();
const port = process.env.PORT || 3001;

console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
console.log('WEBAPP_URL:', process.env.WEBAPP_URL);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'max-age=31536000, immutable');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  next();
});

app.use('/api/comments', (req, res, next) => {
  commentRoutes(req, res, (err) => {
    if (err) {
      console.error('Error in comments route:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      next();
    }
  });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

const corsOptions = {
  origin: ['http://localhost:3000', 'https://cosmogad.github.io'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const server = app.listen(port, async () => {
    console.log(`Сервер запущен на порту ${port}`);
    try {
        await connectDB();
        console.log('MongoDB connected successfully');
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

process.on('unhandledRejection', (err) => {
    console.log('Необработанное отклонение обещания:', err);
    server.close(() => process.exit(1));
});
