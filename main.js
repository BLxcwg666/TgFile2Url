const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");
const sqlite3 = require('sqlite3').verbose();

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

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
  
    if (msg.document) {
      const fileId = msg.document.file_id;
      const UserID = msg.from.id;
      const FileName = msg.document.file_name;
  
      bot.getFileLink(fileId)
        .then((fileLink) => {
          const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
          db.run("INSERT INTO files (UserID, OriginLink, FileName, Time) VALUES (?, ?, ?, ?)", [UserID, fileLink, FileName, currentTime], function(err) {
            if (err) {
              console.error(err);
              bot.sendMessage(chatId, 'Error storing file information.');
            } else {
              const insertedID = this.lastID;
              const customLink = `http://127.0.0.1:3000/${UserID}/${insertedID}/${FileName}`;
              bot.sendMessage(chatId, `下载链接： ${customLink}`);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          bot.sendMessage(chatId, '获取文件下载链接时出现问题。');
        });
    }
  });
  
  app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
  });
