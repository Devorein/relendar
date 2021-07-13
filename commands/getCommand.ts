import discord from 'discord.js';
import { CommandModule } from 'yargs';
import { getTasks } from '../api';
import { IGetTaskInput, ITask } from '../types';

export function getCommand(
  msg: discord.Message,
  tasksCollection: FirebaseFirestore.CollectionReference<ITask>
): CommandModule<any, IGetTaskInput> {
  return {
    command: 'get',
    describe: 'Get tasks',
    async handler(yargs) {
      await getTasks(yargs, msg, tasksCollection);
    },
    builder: {
      f: {
        alias: 'filter',
        demandOption: false,
        default: 'date.>=.today',
        describe: 'Filter the tasks',
        type: 'string'
      },
      s: {
        alias: 'sort',
        demandOption: false,
        default: 'date.0',
        describe: 'Sort the tasks',
        type: 'string'
      },
      l: {
        alias: 'limit',
        demandOption: false,
        default: null,
        describe: 'Limit the returned tasks',
        type: 'string'
      }
    },
    aliases: ['g']
  };
}
