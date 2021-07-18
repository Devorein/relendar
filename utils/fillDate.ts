import moment from 'moment';
import { addRelativeDates } from './';

export function fillDate(dateStr: string) {
  if (dateStr.match(/(T|-|:)/)) {
    const [dateChunk, timeChunk] = dateStr.split('T');
    const [date, month, year] = dateChunk.split('-');
    const [hour, minute, second] = timeChunk.split(':');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1,
      currentYear = currentDate.getFullYear(),
      currentHour = currentDate.getHours(),
      currentMinute = currentDate.getMinutes(),
      currentSecond = currentDate.getSeconds();
    return moment(
      `${year ?? currentYear}/${month ?? currentMonth}/${date} ${
        hour ?? currentHour
      }:${minute ?? currentMinute}:${second ?? currentSecond}`,
      'YYYY/M/D h:m:s'
    ).format('YYYY-MM-DDTHH:mm:ss');
  } else return addRelativeDates(dateStr);
}
