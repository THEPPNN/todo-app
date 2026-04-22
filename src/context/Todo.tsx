import { createContext, useContext, useEffect, useState } from "react"
import type { Todo } from "../types/todo"
import { mockTodos } from "../assets/mock/todos.mock"

interface TodoContextType {
    todos: Todo[]
    addTodo: (details: { title: string, note: string, createdAt: string }) => void
    updateTodo: (id: number, details: { title?: string, note?: string, createdAt?: string }) => void
    deleteTodo: (id: number) => void
    loading: boolean
    updatingTodo: Todo | null
    setUpdatingTodo: (todo: Todo | null) => void
}

const TodoContext = createContext<TodoContextType>(null)

export const useTodo = () => {
    const context = useContext(TodoContext)
    if (!context) {
        throw new Error("useTodo must be used within a TodoProvider")
    }
    return context
}

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(false)
    const [updatingTodo, setUpdatingTodo] = useState<Todo[]>()

    const addTodo = (todo: Todo) => {
        setTodos([...todos, todo])
    }
    const updateTodo = (id: number, todo: Todo) => {
        setTodos(todos.map(t => t.id === id ? todo : t))
    }
    const deleteTodo = (id: number) => {
        setTodos(todos.filter(t => t.id !== id))
    }

    const getUpcomingTodos = async () => {
        setLoading(true)
        try {
            const data: Todo[] = mockTodos.map((item) => ({
                id: item.id,
                title: item.title,
                note: item.note,
                createdAt: item.createdAt.split("T")[0],
                status: item.status,
                completed: false,
            }))
            setTodos(data)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getUpcomingTodos()
    }, [])

    return (
        <TodoContext.Provider value={{
            todos,
            addTodo,
            updateTodo,
            deleteTodo,
            loading,
            updatingTodo,
            setUpdatingTodo,
        }}>
            {children}
        </TodoContext.Provider>
    )
}