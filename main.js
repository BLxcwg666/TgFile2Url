const { spawn } = require('child_process');
const chalk = require('chalk');

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
