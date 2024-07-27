const { Telegraf, Markup } = require('telegraf');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const publicImage = (fileName) => path.join(__dirname, "images", fileName);

const register = async (userId, username, affiliator = "") => {
    try {
        const response = await axios.post("http://localhost:4040/api/register", { 
            userId,
            username,
            affiliator
        });
        return response.data;
    } catch (error) {
        console.log("Error registering user: ", error);
        throw error;
    }
};

bot.start(async (ctx) => {
    const userId = ctx.from.id; 
    const username = ctx.from.username || "there";
    const affiliator = ctx.startPayload || "";

    console.log(`Starting bot for user: ${username} with ID: ${userId}`);

    try {
        await register(userId, username, affiliator);
        console.log('User registered successfully');
        ctx.replyWithPhoto(
            { source: publicImage("crystal.webp") },
            {
                caption: `Welcome to our community, ${username}!`,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [ 
                        [
                            {
                                text: "Play",
                                web_app: { url: "https://google.com" }, 
                            },
                            { text: "Join Community", callback_data: "join_community" },
                        ],
                    ],
                },
            },
        );
    } catch (error) {
        console.error("Error during registration:", error);
        ctx.reply("registration failed. Welcome back");
    }
});

// bot.command('play', (ctx) => {
//     ctx.reply(
//         'Click the button below to open the mini app:',
//         Markup.inlineKeyboard([
//             Markup.button.webApp('Open Mini App', 'https://aramco.vercel.app/')
//         ])
//     );
// });

bot.launch();
