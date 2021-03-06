import discord from 'discord.js';
import { Collection } from 'mongodb';
import { ICreateTaskInput, ITask } from 'types';
import { CONFIG_INFO } from '../constants';
import {
  fillDate,
  formatDate,
  generateErrorMessage,
  generateExtraTasks
} from '../utils';

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

  try {
    const [extraTasks, extraMessages] = extra
      ? generateExtraTasks(extra)
      : [[], []];
    const messages: string[] = [
      `\`\`\`yaml\nCreated ${course} ${task}\nDeadline: ${formatDate(
        filledDate
      )}\n\`\`\``
    ];
    await tasksCollection.insertMany([...tasks, ...extraTasks]);
    msg.reply(
      `${CONFIG_INFO}\n**${messages.concat(extraMessages).join('\n')}**`
    );
  } catch (err) {
    msg.reply(generateErrorMessage(err.message));
  }
}
