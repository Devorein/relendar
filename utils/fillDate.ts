import { addRelativeDates } from './';

export function fillDate(dateStr: string) {
  if (dateStr.includes('-')) {
    const [dateChunk, timeChunk] = dateStr.split('T');
    const [date, month, year] = dateChunk.split('-');
    const [hour, minute, second] = timeChunk.split(':');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1,
      currentYear = currentDate.getFullYear(),
      currentHour = currentDate.getHours(),
      currentMinute = currentDate.getMinutes(),
      currentSecond = currentDate.getSeconds();
    return `${year ?? currentYear}-${month ?? currentMonth}-${date}T${
      hour ?? currentHour
    }:${minute ?? currentMinute}:${second ?? currentSecond}`;
  } else return addRelativeDates(dateStr);
}
