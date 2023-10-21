const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const chalk = require("chalk");

const db = new sqlite3.Database('sqlite.db');
db.run("CREATE TABLE IF NOT EXISTS files (ID INTEGER PRIMARY KEY AUTOINCREMENT, UserID INTEGER, OriginLink TEXT, FileName TEXT, Time DATETIME)");

const app = express();
const port = 3000;

app.get('/:UserID/:ID/:FileName', (req, res) => {
    const { UserID, ID, FileName } = req.params;
  
    db.get("SELECT OriginLink FROM files WHERE ID = ? AND UserID = ? AND FileName = ?", [ID, UserID, FileName], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (row) {
        const OriginLink = row.OriginLink;
        axios.get(OriginLink, { responseType: 'stream' })
          .then(response => {
            res.setHeader('Content-Disposition', `attachment; filename="${FileName}"`);
            response.data.pipe(res);
          })
          .catch(error => {
            console.error(error);
            res.status(500).send('Error proxying file');
          });
      } else {
        res.status(404).send('File not found');
      }
    });
  });

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

const { getFileLink } = require('./fetcher');

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (msg.document) {
    const fileId = msg.document.file_id;
    const UserID = msg.from.id;
    const FileName = msg.document.file_name;
    getFileLink(bot, db, chatId, fileId, UserID, FileName);
    console.log(chalk.green(`[${currentTime}] ${UserID} Sent ${FileName}`));

  } else if (msg.audio) {
    const fileId = msg.audio.file_id;
    const UserID = msg.from.id;
    const FileName = msg.audio.file_name;
    getFileLink(bot, db, chatId, fileId, UserID, FileName);
    console.log(chalk.green(`[${currentTime}] ${UserID} Sent ${FileName}`));

  } else if (msg.video) {
    const fileId = msg.video.file_id;
    const UserID = msg.from.id;
    const FileName = msg.video.file_name;
    getFileLink(bot, db, chatId, fileId, UserID, FileName);
    console.log(chalk.green(`[${currentTime}] ${UserID} Sent ${FileName}`));

  } else if (msg.photo) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const UserID = msg.from.id;
    const FileName = `photo_${msg.message_id}.jpg`;
    getFileLink(bot, db, chatId, fileId, UserID, FileName);
    console.log(chalk.green(`[${currentTime}] ${UserID} Sent ${FileName}`));

  } else if (msg.sticker) {
    const fileId = msg.sticker.file_id;
    const UserID = msg.from.id;
    const FileName = `sticker_${msg.message_id}.webp`;
    getFileLink(bot, db, chatId, fileId, UserID, FileName);
    console.log(chalk.green(`[${currentTime}] ${UserID} Sent ${FileName}`));

  } else {
    bot.sendMessage(chatId, "无效的文件类型");
  }
});

  app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
  });