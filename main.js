// _____     _____ _ _      ____  _   _      _ 
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| |
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| |
//   | | (_| |  _| | | |  __// __/| |_| | |  | |
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_|
//      |___/
//
// Version 1.5 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/21 18:09
//「 大家都知道地下的生活不是一帆风顺，但我们依然报以微笑。」

const { spawn } = require('child_process');
const chalk = require('chalk');
const figlet = require('figlet');

const title = 'TgFile2Url';
figlet(title, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
  console.log("\nVersion 1.5 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url>");
  console.log("----------------------------------------------------------------------");
});

const bot = spawn('node', ['bot.js']);
bot.stdout.on('data', (data) => {
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stdout.write(chalk.green(`[${currentTime}] [Bot] ${data}`));
});

const server = spawn('node', ['server.js']);
server.stdout.on('data', (data) => {
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stdout.write(chalk.blue(`[${currentTime}] [Server] ${data}`));
});
