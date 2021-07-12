import { QuerySnapshot } from "@google-cloud/firestore";
import discord from "discord.js";
import moment from "moment";
import { ITask } from "../types";
import { formatDate } from "../utils";

export async function getTasks( msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>){
  const docs = await tasksCollection.get() as QuerySnapshot<ITask>;
  const messages = docs.docs.length !== 0 ? docs.docs.map((doc, index)=>{
    const data = doc.data();
    return `**\`\`\`yaml\n${index + 1}. ${data.course} ${data.task}\n${moment(new Date(data.date)).fromNow()}\n${formatDate((new Date(data.date)).toISOString())}\n\`\`\`**`
  }) : ['**\`\`\`diff\n- No tasks added\n\`\`\`**'];
  msg.reply("\n"+messages.join("\n"))
}
