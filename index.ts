import discord from "discord.js";
import firebase from 'firebase/app';
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const client = new discord.Client()
const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log(firebaseApp);

client.on('ready', async ()=>{
  if(client.user)
    console.log(`Logged in as ${client.user.tag}`)
});

client.on('message', async (msg)=>{
  if(msg.content === 'ping'){
    msg.reply("pong")
  }
})

client.login(process.env.DISCORD_TOKEN);