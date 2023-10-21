// _____     _____ _ _      ____  _   _      _   ____        _   
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| | | __ )  ___ | |_
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| | |  _ \ / _ \| __|
//   | | (_| |  _| | | |  __// __/| |_| | |  | | | |_) | (_) | |_
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_| |____/ \___/ \__|
//      |___/                                             
//
// Version 1.8 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/21 21:49
//「 结局是什么，我们自己决定！」

const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('sqlite.db');
db.run("CREATE TABLE IF NOT EXISTS files (ID INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, OriginLink TEXT, FileName TEXT, Time DATETIME)");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const { getFileLink } = require('./fetcher');

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/start') {
        bot.sendMessage(chatId, "*Hi，你好喵~*\n向我发送文件即可获取下载链接（支持文件、视频、音频、图片、贴纸）", { parse_mode: 'Markdown' });
    
    } else if (msg.text === '/about') {
        bot.sendMessage(chatId, "*TgFile2Url Bot* _v 1.8_\n© Copyright 2021-2023 NyaStudio, LLC.\n\n*Github 开源*\nhttps://github.com/BLxcwg666/TgFile2Url\n好用就点个 Star 吧 qwq\n\n*关注猫猫喵~ 关注猫猫谢谢喵~*\nTelegram Channel: @xcnyacn", { parse_mode: 'Markdown' });
    
    } else if (msg.document) {
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

    } else {}
});

console.log((`Bot Started.`));