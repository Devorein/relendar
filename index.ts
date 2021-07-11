import { QuerySnapshot } from "@google-cloud/firestore";
import discord from "discord.js";
import admin from 'firebase-admin';
import yargsParser from 'yargs-parser';
import Yargs from 'yargs/yargs';
import { ITask } from "./types";
require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
});

const db = admin.firestore();
const tasksCollection = db.collection('tasks');

const client = new discord.Client()

client.on('ready', async ()=>{
  if(client.user)
    console.log(`Logged in as ${client.user.tag}`)
});

async function getTasks(msg: discord.Message){
  const docs = await tasksCollection.get() as QuerySnapshot<ITask>;
  const messages = docs.docs.map((doc, index)=>{
    const data = doc.data();
    return `${index + 1}. **${data.course}** - ${data.task} - ${data.date}`
  })
  msg.reply("\n"+messages.join("\n"))
}

async function setTask(course: string, task: string, date: string, msg: discord.Message){
  await tasksCollection.doc(`${course}.${task}`).set({
    course, task, date
  });
  msg.reply(`Created ${course}.${task}`)
}

async function deleteTask(course: string, task: string, msg: discord.Message){
  await tasksCollection.doc(`${course}.${task}`).delete();
  msg.reply(`Deleted ${course}.${task}`)
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
      .command('get', 'Get tasks', (yargs) => yargs, async () => {
        await getTasks(msg)
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
        async handler(argv){
          await setTask(argv.course, argv.task, argv.date as string, msg)
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
        async handler(argv){
          await deleteTask(argv.course, argv.task, msg)
        }
      })
      .fail((errorMsg)=>{
        msg.reply(`**Error: ${errorMsg}**`)
        yargs.exit(1, new Error(errorMsg))
      })
      .argv
    } else if(!isBot){
      msg.reply(`You are not authorized. Get the Dev role first`)
    }
  }
})

client.login(process.env.DISCORD_TOKEN);