import moment from 'moment';
import { addRelativeDates } from './';

export function fillDate(dateStr: string) {
  if (dateStr.includes('-')) {
    const [date, month, year] = dateStr.split('-');
    const current = new Date();
    const currentMonth = current.getMonth() + 1,
      currentYear = current.getFullYear();
    return `${year ?? currentYear}-${month ?? currentMonth}-${date}`;
  } else {
    return moment(addRelativeDates(dateStr)).format('YYYY-MM-DD');
  }
}
