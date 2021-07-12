import discord from "discord.js";
import { CommandModule } from "yargs";
import { getTasks } from "../api";
import { IGetTaskInput, ITask } from "../types";

export function getCommand(msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>): CommandModule<any, IGetTaskInput>{
  return {
    command: 'get',
    describe: 'Get tasks', 
    async handler (){
      await getTasks(msg, tasksCollection)
    },
    builder(yargs){
      return yargs.option('filter', {
        alias: 'f',
        demandOption: false,
        default: 'date>=today',
        describe: 'Filter the tasks',
        type: 'string'
      })
    },
    aliases: ['g']
  }
}