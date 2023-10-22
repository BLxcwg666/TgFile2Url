//  _____     _____ _ _      ____  _   _      _   _____    _       _
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| | |  ___|__| |_ ___| |__   ___ _ __
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| | | |_ / _ \ __/ __| '_ \ / _ \ '__|
//   | | (_| |  _| | | |  __// __/| |_| | |  | | |  _|  __/ || (__| | | |  __/ |
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_| |_|  \___|\__\___|_| |_|\___|_|
//      |___/
//
// Version 1.7 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/22 11:25
//「 没有BUG的代码是不完美的！」

async function getFileLink(bot, db, chatId, fileId, UserID, FileName) {
  try {
    const fileLink = await bot.getFileLink(fileId);
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.run("INSERT INTO files (UserID, OriginLink, FileName, Time) VALUES (?, ?, ?, ?)", [UserID, fileLink, FileName, currentTime], function(err) {
      if (err) {
        console.error(err);
        bot.sendMessage(chatId, '获取文件信息失败呜呜呜~ 请检查控制台输出喵~');
      } else {
        const ID = this.lastID;
        const isSSL = process.env.SERVER_SSL === 'true';
        const isPort443 = process.env.SERVER_PORT === '443';
        const serverName = process.env.SERVER_NAME;
        const serverPort = isPort443 ? '' : `:${process.env.SERVER_PORT}`;
        const protocol = isSSL ? 'https' : 'http';

        const customLink = `${protocol}://${serverName}${serverPort}/${UserID}/${ID}/${FileName}`;
        bot.sendMessage(chatId, `<strong>这是文件信息呐~</strong>\n名称：${FileName}\nUser ID：${UserID}\n在数据库中的 ID：${ID}\n\n<strong>下载链接喵~</strong>\n<pre>${customLink}</pre>`, { parse_mode: 'HTML' });
      }
    });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '获取文件下载链接时出现问题。');
  }
}

module.exports = { getFileLink };
