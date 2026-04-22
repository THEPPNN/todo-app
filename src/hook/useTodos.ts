import { useQuery } from "@tanstack/react-query"
import { mockTodos } from "../assets/mock/todos.mock.ts"
import type { Todo } from "../types/todo.ts";

type TodosResponse = {
    todos: Todo[]
    total: number
}
async function fetchTodos(page: number, limit: number, search: string): Promise<TodosResponse> {
    const skip = (page - 1) * limit
    const url = search ? `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}&select=brand,title,meta`
        : `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=brand,title,meta`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch todos")

    const data = await res.json()
    const mappedData: Todo[] = data.products.map((product: any, index: number) => ({
        no: skip + index + 1,
        id: product.id,
        title: product.brand || "Demo",
        note: product.title,
        createdAt: new Date(product.meta.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        status: "pending",
        completed: false,
    }))

    return { todos: mappedData, total: data.total }
}

export function useTodos(page: number, limit: number, search: string) {
    return useQuery({
        queryKey: ["todos", page, limit, search],        // cache แยกตาม page+limit
        queryFn: () => fetchTodos(page, limit, search),
        staleTime: 30_000,                       // cache 30 วิ
        placeholderData: (prev) => prev,          // ตอนเปลี่ยนหน้า ใช้ data เก่าก่อน (ไม่กระพริบ)
    })
}

export function useUpcomingTodos() {
    return useQuery({
        queryKey: ["todos", "upcoming"],
        queryFn: () => Promise.resolve(mockTodos),
        staleTime: Infinity
    })
}