import discord from "discord.js";
import admin from 'firebase-admin';
import Yargs from 'yargs/yargs';
import { deleteCommand, getCommand, setCommand } from "./commands";
import { ITask } from "./types";
import { initFirebaseAdminApp } from "./utils";
require('dotenv').config()
initFirebaseAdminApp();

const db = admin.firestore();
const tasksCollection = db.collection('tasks') as FirebaseFirestore.CollectionReference<ITask>;

const client = new discord.Client()

client.on('ready', async ()=>{
  if(client.user)
    console.log(`Logged in as ${client.user.tag}`)
});

client.on('message', async (msg)=>{
  const authorized = msg.member?.roles.cache.has("774226395454373928");
  const isBot = msg.author.bot;

  if(msg.content.startsWith("!")){
    if(authorized && !isBot){
      const yargs = Yargs(msg.content.slice(1).split(" "))
      yargs.strict()
      .strictCommands()
      .exitProcess(false)
      .command(getCommand(msg, tasksCollection))
      .command(setCommand(msg, tasksCollection))
      .command(deleteCommand(msg, tasksCollection))
      .fail((errorMsg)=>{
        msg.reply(`**\n\`\`\`diff\n- ${errorMsg}\n\`\`\`**`)
        yargs.exit(1, new Error(errorMsg))
      })
      .argv
    } else if(!isBot){
      msg.reply(`You are not authorized. Get the Dev role first`)
    }
  }
})

client.login(process.env.DISCORD_TOKEN);