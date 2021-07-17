import moment from 'moment';

export function formatDate(dateStr: string) {
  return moment(new Date(dateStr)).format('hh:mm A, Do MMMM, dddd, Y');
}
