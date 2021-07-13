import discord from 'discord.js';
import { ICreateTaskInput, ITask } from 'types';
import { fillDate, formatDate } from '../utils';

export async function setTask(
  data: ICreateTaskInput,
  msg: discord.Message,
  tasksCollection: FirebaseFirestore.CollectionReference<ITask>
) {
  const { course, date, task } = data;
  const filledDate = fillDate(date);
  await tasksCollection.doc(`${course}.${task}`).set({
    course,
    task,
    date: new Date(filledDate).getTime()
  });
  msg.reply(
    `**\`\`\`yaml\nCreated ${course} ${task}\nDeadline: ${formatDate(
      filledDate
    )}\n\`\`\`**`
  );
}
