import discord from "discord.js";
import admin from 'firebase-admin';
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
  if(msg.content.startsWith("!")){
    const content = msg.content.slice(1);
    const [course, task, date] = content.split(" ");
    await tasksCollection.doc(`${course}.${task}`).set({
      course, task, date
    });
    msg.reply(`Created ${course}.${task}`)
  }
})

client.login(process.env.DISCORD_TOKEN);