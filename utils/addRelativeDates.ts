import moment, { DurationInputArg2 } from 'moment';

export function addRelativeDates(dateStr: string) {
  const relativeChunks = dateStr.split('+');
  let startDate = moment(new Date());
  const format = 'YYYY-MM-DDTHH:mm:ss';
  for (let index = 0; index < relativeChunks.length; index++) {
    const relativeChunk = relativeChunks[index];
    const regex = /(\d+)(\w)/;
    const matches = relativeChunk.match(regex);
    if (matches) {
      const [, timeToAdd, timeUnit] = matches;
      startDate = moment(startDate.format(format), format).add(
        timeToAdd,
        timeUnit as DurationInputArg2
      );
    }
  }
  return startDate.format(format);
}
