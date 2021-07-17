import discord from 'discord.js';
import moment from 'moment';
import { Collection, Filter, FindOptions, SortDirection } from 'mongodb';
import yargs from 'yargs';
import { IGetTaskInput, ITask } from '../types';
import { addRelativeDates, formatDate } from '../utils';

export async function getTasks(
  data: yargs.Arguments<IGetTaskInput>,
  msg: discord.Message,
  tasksCollection: Collection<ITask>
) {
  const { limit = null, sort = 'date.1', filter = 'date.>=.today' } = data;
  const [sortField = 'date', sortOrder = '1'] = sort.split('.');
  const [leftOperand = 'date', operator = '>=', rightOperand = 'today'] =
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

  if (leftOperand === 'date' && operator && rightOperand) {
    let comparator: string | number = rightOperand;
    if (rightOperand === 'today') {
      comparator = Date.now();
    } else if (rightOperand === 'tomorrow') {
      comparator = moment(new Date(), 'YYYY-MM-DD').add(1, 'days').valueOf();
    } else {
      comparator = addRelativeDates(rightOperand).valueOf();
    }
    let queryFilterOperator = '$gte';
    if (operator === '>=') {
      queryFilterOperator = '$gte';
    } else if (operator === '<=') {
      queryFilterOperator = '$lte';
    } else if (operator === '<') {
      queryFilterOperator = '$lt';
    } else if (operator === '>') {
      queryFilterOperator = '$gt';
    } else if (operator === '==') {
      queryFilterOperator = '$eq';
    }
    queryFilter[leftOperand] = { [queryFilterOperator]: comparator };
  }

  try {
    const docs = await tasksCollection
      .find(queryFilter, queryOptions)
      .toArray();

    const messages =
      docs.length !== 0
        ? docs.map((doc, index) => {
            return `**\`\`\`yaml\n${index + 1}. ${doc.course} ${
              doc.task
            }\n${moment(new Date(doc.date)).fromNow()}\n${formatDate(
              new Date(doc.date).toISOString()
            )}\n\`\`\`**`;
          })
        : [
            'Server: Heroku, Database: Mongodb\n**```diff\n- No tasks added\n```**'
          ];
    msg.reply('Server: Heroku, Database: Mongodb\n' + messages.join('\n'));
  } catch (err) {
    msg.reply([
      `Server: Heroku, Database: Mongodb\n**\`\`\`diff\n- ${err.message}\n\`\`\`**`
    ]);
  }
}
