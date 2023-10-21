const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const chalk = require("chalk");

const db = new sqlite3.Database('sqlite.db');
db.run("CREATE TABLE IF NOT EXISTS files (ID INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, OriginLink TEXT, FileName TEXT, Time DATETIME)");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const { getFileLink } = require('./fetcher');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.document) {
        const fileId = msg.document.file_id;
        const UserID = msg.from.id;
        const FileName = msg.document.file_name;
        getFileLink(bot, db, chatId, fileId, UserID, FileName);
        console.log(`${UserID} Sent ${FileName}`);

    } else if (msg.audio) {
        const fileId = msg.audio.file_id;
        const UserID = msg.from.id;
        const FileName = msg.audio.file_name;
        getFileLink(bot, db, chatId, fileId, UserID, FileName);
        console.log(`${UserID} Sent ${FileName}`);

    } else if (msg.video) {
        const fileId = msg.video.file_id;
        const UserID = msg.from.id;
        const FileName = msg.video.file_name;
        getFileLink(bot, db, chatId, fileId, UserID, FileName);
        console.log(`${UserID} Sent ${FileName}`);

    } else if (msg.photo) {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const UserID = msg.from.id;
        const FileName = `photo_${msg.message_id}.jpg`;
        getFileLink(bot, db, chatId, fileId, UserID, FileName);
        console.log(`${UserID} Sent ${FileName}`);

    } else if (msg.sticker) {
        const fileId = msg.sticker.file_id;
        const UserID = msg.from.id;
        const FileName = `sticker_${msg.message_id}.webp`;
        getFileLink(bot, db, chatId, fileId, UserID, FileName);
        console.log(`${UserID} Sent ${FileName}`);

    } else {
        bot.sendMessage(chatId, "无效的文件类型");
    }
});

console.log((`Bot Started.`));