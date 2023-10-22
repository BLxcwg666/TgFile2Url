// _____     _____ _ _      ____  _   _      _   ____        _   
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| | | __ )  ___ | |_
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| | |  _ \ / _ \| __|
//   | | (_| |  _| | | |  __// __/| |_| | |  | | | |_) | (_) | |_
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_| |____/ \___/ \__|
//      |___/                                             
//
// Version 1.9 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/29 12:36
//「 人最强大的武器，是习惯和信赖。」

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

    } else if (msg.document || msg.audio || msg.video || msg.photo || msg.sticker) {
        let fileId, FileName;

        if (msg.document) {
            fileId = msg.document.file_id;
            FileName = msg.document.file_name;
        } else if (msg.audio) {
            fileId = msg.audio.file_id;
            FileName = msg.audio.file_name;
        } else if (msg.video) {
            fileId = msg.video.file_id;
            FileName = msg.video.file_name;
        } else if (msg.photo) {
            fileId = msg.photo[msg.photo.length - 1].file_id;
            FileName = `photo_${msg.message_id}.jpg`;
        } else if (msg.sticker) {
            fileId = msg.sticker.file_id;
            FileName = `sticker_${msg.message_id}.webp`;
        }

        const UserID = msg.from.id;
        getFileLink(bot, db, chatId, fileId, UserID, FileName);
        console.log(`${UserID} Sent ${FileName}`);

    } else {}
});

console.log((`Bot Started.`));