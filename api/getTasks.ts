import { QuerySnapshot, WhereFilterOp } from "@google-cloud/firestore";
import discord from "discord.js";
import moment from "moment";
import yargs from "yargs";
import { IGetTaskInput, ITask } from "../types";
import { addRelativeDates, formatDate } from "../utils";

export async function getTasks(data: yargs.Arguments<IGetTaskInput>,  msg: discord.Message, tasksCollection: FirebaseFirestore.CollectionReference<ITask>){
  const {limit = null, sort = 'date.0', filter = 'date.>=.today'} = data;
  const [sortField, sortOrder = '0'] = sort.split(".");
  const [leftOperand, operator, rightOperand] = filter.split(".");
  let query: FirebaseFirestore.Query<ITask> = tasksCollection.orderBy(sortField, sortOrder === "0" ? "asc" : "desc" as FirebaseFirestore.OrderByDirection);
  if(leftOperand === 'date' && operator && rightOperand){
    let comparator: string | number = rightOperand;
    if(rightOperand === "today"){
      comparator = Date.now()
    }else if(rightOperand === "tomorrow"){
      comparator = moment(new Date(), "YYYY-MM-DD").add(1, "days").valueOf();
    } else {
      comparator = addRelativeDates(rightOperand).valueOf();
    }
    query = query.where(leftOperand, operator as WhereFilterOp, comparator)
  }
  if(limit){
    query = query.limit(parseInt(limit))
  }
  try{
    const docs = await query.get() as QuerySnapshot<ITask>;
    const messages = docs.docs.length !== 0 ? docs.docs.map((doc, index)=>{
      const data = doc.data();
      return `**\`\`\`yaml\n${index + 1}. ${data.course} ${data.task}\n${moment(new Date(data.date)).fromNow()}\n${formatDate((new Date(data.date)).toISOString())}\n\`\`\`**`
    }) : ['**\`\`\`diff\n- No tasks added\n\`\`\`**'];
    msg.reply("\n"+messages.join("\n"))
  }catch(err){
    msg.reply([`**\`\`\`diff\n- ${err.message}\n\`\`\`**`])
  }
}
