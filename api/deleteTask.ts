import discord from 'discord.js';
import { Collection } from 'mongodb';
import { CONFIG_INFO } from '../constants';
import { IDeleteTaskInput, ITask } from '../types';

export async function deleteTask(
  data: IDeleteTaskInput,
  msg: discord.Message,
  tasksCollection: Collection<ITask>
) {
  const { course, task } = data;
  await tasksCollection.deleteOne({ course, task });
  msg.reply(
    `${CONFIG_INFO}\n**\`\`\`yaml\nDeleted ${course}.${task}\n\`\`\`**`
  );
}
