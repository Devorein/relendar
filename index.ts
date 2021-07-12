import discord from "discord.js";
import admin from 'firebase-admin';
import { ITask } from "types";
import yargsParser from 'yargs-parser';
import Yargs from 'yargs/yargs';
import { getTasks, setTask } from "./api";
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

async function deleteTask(course: string, task: string, msg: discord.Message){
  await tasksCollection.doc(`${course}.${task}`).delete();
  msg.reply(`**\`\`\`yaml\nDeleted ${course}.${task}\n\`\`\`**`)
}

client.on('message', async (msg)=>{
  const authorized = msg.member?.roles.cache.has("774226395454373928");
  const isBot = msg.author.bot;

  if(msg.content.startsWith("!")){
    if(authorized && !isBot){
      const yargs = Yargs(yargsParser(msg.content.slice(1))._)

      yargs.strict()
      .strictCommands()
      .exitProcess(false)
      .command({
        command: 'get',
        describe: 'Get tasks', 
        async handler (){
          await getTasks(msg, tasksCollection)
        },
        aliases: ['g']
      })
      .command<{course: string, task: string, date: string}>({
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
        async handler(argv){
          await setTask(argv, msg, tasksCollection)
        }
      })
      .command<{course: string, task: string}>({
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
          await deleteTask(argv.course, argv.task, msg)
        }
      })
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