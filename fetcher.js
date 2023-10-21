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
        const customLink = `http://127.0.0.1:3000/${UserID}/${ID}/${FileName}`;
        bot.sendMessage(chatId, `下载链接： ${customLink}`);
      }
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '获取文件下载链接时出现问题。');
  }
}

module.exports = { getFileLink };
