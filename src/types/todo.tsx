export interface Todo {
    id: number
    title: string
    note: string
    createdAt: string
    status: "pending" | "in-progress" | "done"
    completed: boolean
  }