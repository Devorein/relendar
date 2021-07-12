export interface ITask {
  course: string
  date: string
  task: string
}

export interface ICreateTaskInput extends ITask {
}

export interface IGetTaskInput {
  filter?: string
  sort?: string
  limit?: number
}

export interface IDeleteTaskInput{
  course: string
  task: string
}