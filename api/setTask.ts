import discord from "discord.js";
import { ITask } from "types";
import { fillDate, formatDate } from "../utils";

export async function setTask(data: ITask, msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>){
  const {course, date, task} = data;
  const filledDate = fillDate(date);
  await tasksCollection.doc(`${course}.${task}`).set({
    course, task, date: filledDate
  });
  msg.reply(`**\`\`\`yaml\nCreated ${course} ${task}\nDeadline: ${formatDate(filledDate)}\n\`\`\`**`)
}