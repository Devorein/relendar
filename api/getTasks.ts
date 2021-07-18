import discord from 'discord.js';
import moment from 'moment';
import { Collection, Filter, FindOptions, SortDirection } from 'mongodb';
import yargs from 'yargs';
import { CONFIG_INFO } from '../constants';
import { IGetTaskInput, ITask } from '../types';
import {
  addRelativeDates,
  formatDate,
  generateErrorMessage,
  generateQueryFieldOperator
} from '../utils';

export async function getTasks(
  data: yargs.Arguments<IGetTaskInput>,
  msg: discord.Message,
  tasksCollection: Collection<ITask>
) {
  const { limit = null, sort = 'date.1', filter = 'date.>=.td' } = data;
  const [sortField = 'date', sortOrder = '1'] = sort.split('.');
  const [leftOperand = 'date', operator = '>=', rightOperand = 'td'] =
    filter.split('.');

  const queryOptions: FindOptions<ITask> = {
    sort: {
      [sortField]: parseInt(sortOrder) as SortDirection
    }
  };
  if (limit) {
    queryOptions.limit = parseInt(limit);
  }

  const queryFilter: Filter<ITask> = {};

  let comparator: string | number = rightOperand;

  if (leftOperand === 'date' && rightOperand) {
    if (rightOperand === 'td') {
      comparator = Date.now();
    } else if (rightOperand === 'tm') {
      comparator = moment(new Date(), 'YYYY-MM-DD').add(1, 'days').valueOf();
    } else if (rightOperand === 'ys') {
      comparator = moment(new Date(), 'YYYY-MM-DD')
        .subtract(1, 'days')
        .valueOf();
    } else {
      comparator = addRelativeDates(rightOperand).valueOf();
    }
  }

  try {
    queryFilter[leftOperand] = {
      [generateQueryFieldOperator(operator)]: new Date(comparator).getTime()
    };
    const docs = await tasksCollection
      .find(queryFilter, queryOptions)
      .toArray();

    const messages =
      docs.length !== 0
        ? [
            CONFIG_INFO,
            ...docs.map((doc, index) => {
              return `**\`\`\`yaml\n${index + 1}. ${doc.course} ${
                doc.task
              }\n${moment(new Date(doc.date)).fromNow()}\n${formatDate(
                new Date(doc.date).toISOString()
              )}\n\`\`\`**`;
            })
          ]
        : [generateErrorMessage('No tasks returned')];
    msg.reply(messages.join('\n'));
  } catch (err) {
    msg.reply(generateErrorMessage(err.message));
  }
}
