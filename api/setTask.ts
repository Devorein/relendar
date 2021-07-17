import discord from 'discord.js';
import { Collection } from 'mongodb';
import { ICreateTaskInput, ITask } from 'types';
import { fillDate, formatDate } from '../utils';

export async function setTask(
  data: ICreateTaskInput,
  msg: discord.Message,
  tasksCollection: Collection<ITask>
) {
  const { course, date, task } = data;
  const filledDate = fillDate(date);
  await tasksCollection.insertOne({
    course,
    task,
    date: new Date(filledDate).getTime()
  });
  msg.reply(
    `Server: Heroku, Database: Mongodb\n**\`\`\`yaml\nCreated ${course} ${task}\nDeadline: ${formatDate(
      filledDate
    )}\n\`\`\`**`
  );
}
