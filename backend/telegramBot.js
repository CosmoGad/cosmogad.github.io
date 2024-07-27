const { Telegraf } = require('telegraf');
require('dotenv').config();
const User = require('./models/User');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

if (!process.env.WEBAPP_URL) {
    console.error('WEBAPP_URL не установлен в файле .env');
    process.exit(1);
}

bot.command('start', async (ctx) => {
    try {
        const chatId = ctx.from.id;
        let user = await User.findOne({ telegramId: chatId });
        if (!user) {
            user = new User({
                telegramId: chatId,
                username: ctx.from.username,
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
                authDate: new Date()
            });
            await user.save();
        }
        const timestamp = Date.now();
        const webAppUrl = `${process.env.WEBAPP_URL}?v=${timestamp}`;
        return ctx.reply('Добро пожаловать в CryptoClips! Нажмите кнопку ниже, чтобы открыть приложение.', {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Открыть CryptoClips',
                        web_app: { url: webAppUrl }
                    }
                ]]
            }
        });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return ctx.reply('Произошла ошибка при авторизации. Попробуйте позже.');
    }
});

bot.on('message', (ctx) => {
    const timestamp = Date.now();
    const webAppUrl = `${process.env.WEBAPP_URL}?v=${timestamp}`;
    return ctx.reply('Нажмите кнопку ниже, чтобы открыть CryptoClips:', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: 'Открыть CryptoClips',
                    web_app: { url: webAppUrl }
                }
            ]]
        }
    });
});

module.exports = bot;
