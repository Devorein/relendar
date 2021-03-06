import discord from 'discord.js';
import { Collection } from 'mongodb';
import yargs, { CommandModule } from 'yargs';
import { setTask } from '../api';
import { ICreateTaskInput, ITask } from '../types';

export function setCommand(
  msg: discord.Message,
  tasksCollection: Collection<ITask>
): CommandModule<any, ICreateTaskInput> {
  return {
    command: 'set <course> <task> <date> [extra..]',
    describe: 'Set a new task',
    builder: {
      course: {
        describe: 'Name of the course',
        type: 'string'
      },
      task: {
        describe: 'Task of the course',
        type: 'string'
      },
      date: {
        describe: 'Date of the course',
        type: 'string'
      }
    },
    aliases: ['s'],
    async handler(argv: yargs.Arguments<ICreateTaskInput>) {
      await setTask(argv, msg, tasksCollection);
    }
  };
}
