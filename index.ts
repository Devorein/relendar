import discord from 'discord.js';
import Yargs from 'yargs/yargs';
import { deleteCommand, getCommand, setCommand } from './commands';
import { ITask } from './types';
import { createMongodbClient } from './utils';
require('dotenv').config();

const discordClient = new discord.Client();
let mongoClient = createMongodbClient();

async function main() {
  mongoClient = await mongoClient.connect();
  const database = mongoClient.db(process.env.MONGODB_DATABASE);
  const tasksCollection = database.collection<ITask>('tasks');

  discordClient.on('ready', async () => {
    if (discordClient.user)
      console.log(`Logged in as ${discordClient.user.tag}`);
  });

  discordClient.on('message', async (msg) => {
    const authorized = msg.member?.roles.cache.has('774226395454373928');
    const isBot = msg.author.bot;

    if (msg.content.startsWith('!rl')) {
      if (authorized && !isBot) {
        const yargs = Yargs(msg.content.slice(4).split(' '));
        yargs
          .strict()
          .strictCommands()
          .exitProcess(false)
          .command(getCommand(msg, tasksCollection))
          .command(setCommand(msg, tasksCollection))
          .command(deleteCommand(msg, tasksCollection))
          .fail((errorMsg) => {
            msg.reply(`**\n\`\`\`diff\n- ${errorMsg}\n\`\`\`**`);
            yargs.exit(1, new Error(errorMsg));
          }).argv;
      } else if (!isBot) {
        msg.reply(`You are not authorized. Get the Dev role first`);
      }
    }
  });

  discordClient.login(process.env.DISCORD_TOKEN);
}

main();
