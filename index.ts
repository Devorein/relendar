import { QuerySnapshot } from "@google-cloud/firestore";
import discord from "discord.js";
import admin from 'firebase-admin';
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

client.on('message', async (msg)=>{
  const authorized = msg.member?.roles.cache.has("774226395454373928");
  const isBot = msg.author.bot;

  if(authorized && !isBot){
    if(msg.content.startsWith("!")){
      const content = msg.content.slice(1);
      const [command, ...chunks] = content.split(" ");
      if(command === "set"){
        const [course, task, date] = chunks;
        await tasksCollection.doc(`${course}.${task}`).set({
          course, task, date
        });
        msg.reply(`Created ${course}.${task}`)
      } else if(command === "get"){
        const docs = await tasksCollection.get() as QuerySnapshot<ITask>;
        msg.reply(docs.docs.map((doc, index)=>{
          const data = doc.data();
          return `${index + 1}. ${data.course} - ${data.task} - ${data.date}\n`
        }))
      }
    }
  } else if(!isBot){
    msg.reply(`You are not authorized. Get the Dev role first`)
  }
})

client.login(process.env.DISCORD_TOKEN);