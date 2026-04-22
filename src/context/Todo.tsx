import { createContext, useContext, useEffect, useState } from "react"
import type { Todo } from "../types/todo"
import { mockTodos } from "../assets/mock/todos.mock"
import ToastMessage from "../components/Toast.tsx";

interface TodoContextType {
    todos: Todo[]
    addTodo: (details: { title: string, note: string, createdAt: string }) => void
    updateTodo: (id: number, details: { title?: string, note?: string, createdAt?: string }) => void
    deleteTodo: (id: number) => void
    loading: boolean
    updatingTodo: Todo | null
    setUpdatingTodo: (todo: Todo | null) => void
    total: number
    page: number
    setPage: (page: number) => void
    totalPages: number
    search: string
    setSearch: (s: string) => void
    toggleTodoStatus: (id: number, status: string) => void
    showToast: (message: string, color: string) => void
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
    const [upcomingTodos, setUpcomingTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(false)
    const [updatingTodo, setUpdatingTodo] = useState<Todo | null>(null)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState("")
    const limit = 10

    const [toast, setToast] = useState<{ message: string, color: string } | null>(null)
    const showToast = (message: string, color: string) => {
        setToast({ message: message, color: color })
        setTimeout(() => setToast(null), 3000)
    }

    const fetchTodos = async (page: number, limit: number, search: string): Promise<void> => {
        setLoading(true)
        try {
            const skip = (page - 1) * limit
            const url = search
                ? `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}&select=brand,title,meta`
                : `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=brand,title,meta`
            const res = await fetch(url)
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()

            const mapped: Todo[] = data.products.map((product: any) => {
                return {
                    id: product.id,
                    title: product.brand || "Demo",
                    note: product.title,
                    createdAt: product.meta.createdAt,
                    status: "pending" as const,
                    completed: false,
                }
            })
            setTodos(mapped)
            setTotal(data.total)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTodos(page, limit, search)
    }, [page, search])

    const totalPages = Math.ceil(total / limit)

    const addTodo = (details: { title: string, note: string, createdAt: string }) => {
        const newTodo: Todo = {
            id: Date.now(),
            ...details,
            status: "pending" as const,
            completed: false,
        }
        setTodos(prev => [newTodo, ...prev])
        showToast("Todo added successfully", "green")
    }
    const updateTodo = (id: number, details: { title?: string, note?: string, createdAt?: string }) => {
        showToast("Todo updated successfully", "green")
        setTodos(todos.map(todo => todo.id === id ? { ...todo, ...details } : todo))
    }
    const deleteTodo = (id: number) => {
        console.log('deleteTodo', id);
        showToast("Todo deleted successfully", "red")
        setTodos(todos.filter(todo => todo.id !== id))
    }
    const toggleTodoStatus = (id: number, status: string) => {
        console.log('toggleTodoStatus', id, status);

        if (status === 'done') {
            showToast("Todo completed successfully", "green")
            setTodos(todos.filter(todo => todo.id !== id))
        } else {
            showToast("Updated status to " + status, "green")
            setTodos(todos.map(todo => todo.id === id ? { ...todo, status: status as Todo["status"] } : todo))
        }
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
            setUpcomingTodos(data)
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
            loading,
            total,
            page,
            setPage,
            totalPages,
            search,
            setSearch,
            addTodo,
            updateTodo,
            deleteTodo,
            updatingTodo,
            setUpdatingTodo,
            upcomingTodos,
            toggleTodoStatus,
            showToast
        }}>
            {children}
            {toast && <ToastMessage message={toast.message} color={toast.color} />}
        </TodoContext.Provider>
    )
}