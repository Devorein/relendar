import { QuerySnapshot } from "@google-cloud/firestore";
import discord from "discord.js";
import moment from "moment";
import yargs from "yargs";
import { IGetTaskInput, ITask } from "../types";
import { formatDate } from "../utils";

export async function getTasks(data: yargs.Arguments<IGetTaskInput>,  msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>){
  const {limit = null, sort = 'date.0'} = data;
  console.log(data)
  const [sortField, sortOrder = '0'] = sort.split(".");
  let query: FirebaseFirestore.Query<ITask> = tasksCollection.orderBy(sortField, sortOrder === "0" ? "asc" : "desc" as FirebaseFirestore.OrderByDirection);
  if(limit){
    query = query.limit(parseInt(limit))
  }
  const docs = await query.get() as QuerySnapshot<ITask>;
  const messages = docs.docs.length !== 0 ? docs.docs.map((doc, index)=>{
    const data = doc.data();
    return `**\`\`\`yaml\n${index + 1}. ${data.course} ${data.task}\n${moment(new Date(data.date)).fromNow()}\n${formatDate((new Date(data.date)).toISOString())}\n\`\`\`**`
  }) : ['**\`\`\`diff\n- No tasks added\n\`\`\`**'];
  msg.reply("\n"+messages.join("\n"))
}
