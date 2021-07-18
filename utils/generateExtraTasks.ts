import { ITask } from 'types';
import { fillDate, formatDate } from './';

export function generateExtraTasks(extraTasksArray: string[]) {
  const extraTasks: ITask[] = [],
    extraMessages: string[] = [];
  if (extraTasksArray.length % 3 !== 0) {
    throw new Error('All tasks must have 3 arguments');
  } else {
    let currentTask: ITask = {} as any;
    let arrayIndex = 0;
    for (let index = 0; index < extraTasksArray.length; index++) {
      const extraTasksArrayChunk = extraTasksArray[index];
      if (arrayIndex === 0) {
        currentTask.course = extraTasksArrayChunk;
        arrayIndex++;
      } else if (arrayIndex === 1) {
        currentTask.task = extraTasksArrayChunk;
        arrayIndex++;
      } else if (arrayIndex === 2) {
        const filledDate = fillDate(extraTasksArrayChunk);
        currentTask.date = new Date(filledDate).getTime();
        arrayIndex = 0;
        extraMessages.push(
          `\`\`\`yaml\nCreated ${currentTask.course} ${
            currentTask.task
          }\nDeadline: ${formatDate(filledDate)}\n\`\`\``
        );
      }
    }
  }

  return [extraTasks, extraMessages] as const;
}
