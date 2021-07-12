import moment from "moment";

export function fillDate(dateStr: string){
  const [date, month, year] = dateStr.split("-");
  if(date.includes("d")){
    const startDate = new Date()
    const daysToAdd = parseInt(date.replace("d",""))
    const newDate = moment(startDate, "YYYY-MM-DD").add(daysToAdd, 'days');
    return newDate.format("YYYY-MM-DD");
  } else {
    const current = new Date();
    const currentMonth = current.getMonth() + 1, currentYear = current.getFullYear();
    return `${year ?? currentYear}-${month ?? currentMonth}-${date}`;
  }
}