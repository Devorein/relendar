import moment, { DurationInputArg2 } from "moment";

function addDate(date: string, char: string, unit: DurationInputArg2){
  const startDate = new Date()
  const daysToAdd = parseInt(date.replace(char,""))
  const newDate = moment(startDate, "YYYY-MM-DD").add(daysToAdd, unit);
  return newDate.format("YYYY-MM-DD")
}

export function fillDate(dateStr: string){
  const [date, month, year] = dateStr.split("-");
  if(date.includes("d")){
    return addDate(date, "d", "days")
  } else if(date.includes("m")){
    return addDate(date, "m", "months")
  } else if(date.includes("w")){
    return addDate(date, "w", "weeks")
  } else {
    const current = new Date();
    const currentMonth = current.getMonth() + 1, currentYear = current.getFullYear();
    return `${year ?? currentYear}-${month ?? currentMonth}-${date}`;
  }
}