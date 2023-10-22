// _____     _____ _ _      ____  _   _      _ 
// |_   _|_ _|  ___(_) | ___|___ \| | | |_ __| |
//   | |/ _` | |_  | | |/ _ \ __) | | | | '__| |
//   | | (_| |  _| | | |  __// __/| |_| | |  | |
//   |_|\__, |_|   |_|_|\___|_____|\___/|_|  |_|
//      |___/
//
// Version 1.9 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url> | @xcnya / @xcnyacn
// Lastest Update at 2023/10/22 13:01
//「 死并非再生的对立面，而是作为生的一部分永存于生中。」

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
  console.log("\nVersion 1.9 | By BLxcwg666 <https://github.com/BLxcwg666/TgFile2Url>");
  console.log("----------------------------------------------------------------------");
});

const bot = spawn('node', ['bot.js']);
bot.stdout.on('data', (data) => {
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stdout.write(chalk.green(`[${currentTime}] [Bot] ${data}`));
});

bot.stderr.on('data', (data) => {
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stderr.write(chalk.red(`[${currentTime}] [Bot] ${data}`));
});

const server = spawn('node', ['server.js']);
server.stdout.on('data', (data) => {
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stdout.write(chalk.blue(`[${currentTime}] [Server] ${data}`));
});

server.stderr.on('data', (data) => {
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  process.stderr.write(chalk.red(`[${currentTime}] [Server] ${data}`));
});