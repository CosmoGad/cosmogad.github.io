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

const allowedOrigins = ['http://localhost:3000', 'https://cosmogad.github.io'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('ngrok-skip-browser-warning', 'true');
next();
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  console.log('Origin:', req.headers.origin);
  console.log('CORS headers:', res.getHeaders());
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

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
