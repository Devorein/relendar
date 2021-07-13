import moment from 'moment';

export function addRelativeDates(dateStr: string) {
  const relativeChunks = dateStr.split('+');
  let startDate = moment(new Date());
  for (let index = 0; index < relativeChunks.length; index++) {
    const relativeChunk = relativeChunks[index];
    if (relativeChunk.includes('d')) {
      const daysToAdd = parseInt(relativeChunk.replace('d', ''));
      startDate = moment(startDate, 'YYYY-MM-DD').add(daysToAdd, 'days');
    } else if (relativeChunk.includes('w')) {
      const daysToAdd = parseInt(relativeChunk.replace('w', ''));
      startDate = moment(startDate, 'YYYY-MM-DD').add(daysToAdd, 'weeks');
    } else if (relativeChunk.includes('m')) {
      const daysToAdd = parseInt(relativeChunk.replace('m', ''));
      startDate = moment(startDate, 'YYYY-MM-DD').add(daysToAdd, 'months');
    }
  }
  return startDate;
}
