import { QuerySnapshot } from "@google-cloud/firestore";
import { Command } from 'commander';
import discord from "discord.js";
import admin from 'firebase-admin';
import { ITask } from "./types";
require('dotenv').config()
const program = new Command();

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

async function setTasks(course: string, task: string, date: string, msg: discord.Message){
  await tasksCollection.doc(`${course}.${task}`).set({
    course, task, date
  });
  msg.reply(`Created ${course}.${task}`)
}

client.on('message', async (msg)=>{
  const authorized = msg.member?.roles.cache.has("774226395454373928");
  const isBot = msg.author.bot;

  if(authorized && !isBot){
    if(msg.content.startsWith("!")){
      program
        .command('get')
        .description("Get tasks")
        .action(()=>getTasks(msg))
        .command("set")
        .description("Set a new task")
        .argument('<course>', 'Name of the course')
        .argument('<task>', 'Task of the course')
        .argument('<date>', 'Last date of the task')
        .action((course, task, date)=>setTasks(course, task, date, msg))

      program.parse([msg.content.slice(1)], {
        from: 'user'
      });
    }
  } else if(!isBot){
    msg.reply(`You are not authorized. Get the Dev role first`)
  }
})

client.login(process.env.DISCORD_TOKEN);