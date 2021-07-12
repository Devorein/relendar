import moment from "moment";

export function formatDate(dateStr: string){
  const dt = moment(new Date(dateStr));
  return `${dt.format("Do")} ${dt.format("MMMM")}, ${dt.format("dddd")}, ${dt.format("Y")}`
}