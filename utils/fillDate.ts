export function fillDate(dateStr: string){
  const [date, month, year] = dateStr.split("-");
  const current = new Date();
  const currentMonth = current.getMonth() + 1, currentYear = current.getFullYear();
  return `${year ?? currentYear}-${month ?? currentMonth}-${date}`;
}