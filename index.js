const discord = require("discord.js");
require('dotenv').config()

const client = new discord.Client()

client.on('ready', async ()=>{
  console.log(`Logged in as ${client.user.tag}`)
});

client.on('message', async (msg)=>{
  if(msg.content === 'ping'){
    msg.reply("pong")
  }
})

client.login(process.env.TOKEN);