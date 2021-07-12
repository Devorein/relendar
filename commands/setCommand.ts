import discord from "discord.js";
import yargs, { CommandModule } from "yargs";
import { setTask } from "../api";
import { ITask, ITaskCreateTaskInput } from "../types";

export function setCommand(msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>): CommandModule<any, ITaskCreateTaskInput>{
  return {
    command: 'set <course> <task> <date>',
    describe: 'Set a new task',
    builder: {
      'course': {
        describe: 'Name of the course',
        type: 'string',
      },
      'task': {
        describe: 'Task of the course',
        type: 'string',
      },
      'date': {
        describe: 'Date of the course',
        type: 'string',
      }
    },
    aliases: ['s'],
    async handler(argv: yargs.Arguments<ITask>){
      await setTask(argv, msg, tasksCollection)
    }
  }
}