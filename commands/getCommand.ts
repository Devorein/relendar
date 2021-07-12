import discord from "discord.js";
import { CommandModule } from "yargs";
import { getTasks } from "../api";
import { ITask } from "../types";

export function getCommand(msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>): CommandModule<any>{
  return {
    command: 'get',
    describe: 'Get tasks', 
    async handler (){
      await getTasks(msg, tasksCollection)
    },
    aliases: ['g']
  }
}