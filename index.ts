require('dotenv').config();
import discord from 'discord.js';
import Yargs from 'yargs/yargs';
import { deleteCommand, getCommand, setCommand } from './commands';
import { ITask } from './types';
import {
  createMongodbClient,
  generateErrorMessage,
  generateSplitInput
} from './utils';

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
    const isBot = msg.author.bot;

    if (msg.content.startsWith('!rl')) {
      if (!isBot) {
        const authorizedRoles = process.env.DISCORD_AUTHORIZED_ROLE!.split(',');
        const isAuthorized = msg.member!.roles.cache.find((role) =>
          authorizedRoles.includes(role.name)
        );
        if (isAuthorized) {
          const yargs = Yargs(generateSplitInput(msg.content.slice(4)));
          yargs
            .strict()
            .strictCommands()
            .exitProcess(false)
            .command(getCommand(msg, tasksCollection))
            .command(setCommand(msg, tasksCollection))
            .command(deleteCommand(msg, tasksCollection))
            .fail((errorMsg) => {
              msg.reply(generateErrorMessage(errorMsg));
              yargs.exit(1, new Error(errorMsg));
            }).argv;
        } else {
          msg.reply(
            generateErrorMessage(
              `You are not authorized. Get the ${process.env.DISCORD_AUTHORIZED_ROLE} role first`
            )
          );
        }
      }
    }
  });

  discordClient.login(process.env.DISCORD_TOKEN);
}

main();
