import { QuerySnapshot } from "@google-cloud/firestore";
import discord from "discord.js";
import { ITask } from "../types";
import { formatDate } from "../utils";

export async function getTasks(msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>){
  
  const docs = await tasksCollection.get() as QuerySnapshot<ITask>;
  const messages = docs.docs.length !== 0 ? docs.docs.map((doc, index)=>{
    const data = doc.data();
    return `**\`\`\`yaml\n${index + 1}. ${data.course} ${data.task}\n${formatDate(data.date)}\n\`\`\`**`
  }) : ['No tasks added'];
  msg.reply("\n"+messages.join("\n"))
}
