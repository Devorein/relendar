export interface ITask {
  course: string
  date: string
  task: string
}

export interface ITaskCreateTaskInput extends ITask {
}

export interface IDeleteTaskInput{
  course: string
  task: string
}