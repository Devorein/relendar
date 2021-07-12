import discord from "discord.js";
import { CommandModule } from "yargs";
import { deleteTask } from "../api";
import { IDeleteTaskInput, ITask } from "../types";

export function deleteCommand(msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>): CommandModule<any, IDeleteTaskInput>{
  return {
    command: 'del <course> <task>',
    describe: 'Delete a task of a course',
    builder: {
      course: {
        describe: 'Name of the course',
        type: 'string'
      },
      task: {
        describe: 'Name of the task',
        type: 'string'
      }
    },
    aliases: ['d'],
    async handler(argv){
      await deleteTask(argv, msg, tasksCollection)
    }
  }
}