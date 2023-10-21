//  _____     _____ _ _      ____  _   _      _   _____    _       _
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| | |  ___|__| |_ ___| |__   ___ _ __
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| | | |_ / _ \ __/ __| '_ \ / _ \ '__|
//   | | (_| |  _| | | |  __// __/| |_| | |  | | |  _|  __/ || (__| | | |  __/ |
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_| |_|  \___|\__\___|_| |_|\___|_|
//      |___/
//
// Version 1.6 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/21 20:48
//「 你怕不怕，这辈子就是上辈子所说的下辈子？」

async function getFileLink(bot, db, chatId, fileId, UserID, FileName) {
  try {
    const fileLink = await bot.getFileLink(fileId);
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.run("INSERT INTO files (UserID, OriginLink, FileName, Time) VALUES (?, ?, ?, ?)", [UserID, fileLink, FileName, currentTime], function(err) {
      if (err) {
        console.error(err);
        bot.sendMessage(chatId, 'Error storing file information.');
      } else {
        const ID = this.lastID;
        if (process.env.SERVER_SSL === 'true' && process.env.SERVER_PORT === '443') {
            const customLink = `https://${process.env.SERVER_NAME}/${UserID}/${ID}/${FileName}`;
            bot.sendMessage(chatId, `下载链接： ${customLink}`);

        } else if (process.env.SERVER_SSL === 'true' && process.env.SERVER_PORT !== '443') {
            const customLink = `https://${process.env.SERVER_NAME}:${process.env.SERVER_PORT}/${UserID}/${ID}/${FileName}`;
            bot.sendMessage(chatId, `下载链接： ${customLink}`);

        } else if (process.env.SERVER_SSL !== 'true' && process.env.SERVER_PORT === '80') {
            const customLink = `http://${process.env.SERVER_NAME}/${UserID}/${ID}/${FileName}`;
            bot.sendMessage(chatId, `下载链接： ${customLink}`);

        }else {
            const customLink = `http://${process.env.SERVER_NAME}:${process.env.SERVER_PORT}/${UserID}/${ID}/${FileName}`;
            bot.sendMessage(chatId, `下载链接： ${customLink}`);
        }
      }
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '获取文件下载链接时出现问题。');
  }
}

module.exports = { getFileLink };
