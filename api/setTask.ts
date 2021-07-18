import discord from 'discord.js';
import { Collection } from 'mongodb';
import { ICreateTaskInput, ITask } from 'types';
import { fillDate, formatDate } from '../utils';

export async function setTask(
  data: ICreateTaskInput,
  msg: discord.Message,
  tasksCollection: Collection<ITask>
) {
  const { course, date, task, extra } = data;
  const filledDate = fillDate(date);
  const tasks: ITask[] = [
    {
      course,
      date: new Date(filledDate).getTime(),
      task
    }
  ];
  const messages: string[] = [
    `\`\`\`yaml\nCreated ${course} ${task}\nDeadline: ${formatDate(
      filledDate
    )}\n\`\`\``
  ];

  try {
    await tasksCollection.insertMany(tasks);
    msg.reply(`Server: Heroku, Database: Mongodb\n**${messages.join('\n')}**`);
  } catch (err) {
    msg.reply(`\`\`\`diff\n- ${err.message}\n\`\`\``);
  }
}
