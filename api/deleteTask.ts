import discord from "discord.js";
import { IDeleteTaskInput, ITask } from "../types";

export async function deleteTask(data: IDeleteTaskInput, msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>){
  const {course, task} = data;
  await tasksCollection.doc(`${course}.${task}`).delete();
  msg.reply(`**\`\`\`yaml\nDeleted ${course}.${task}\n\`\`\`**`)
}