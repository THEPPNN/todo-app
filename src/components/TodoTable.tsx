import { useState } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table"
import type { Todo } from "../types/todo"
import { useTodo } from "../context/Todo"
import { useTimeLog, formatDuration, formatTime } from "../hook/useTimeLog"

export default function TodoTable() {
    const limit = 10
    const [sorting, setSorting] = useState<SortingState>([])

    const {
        todos,
        loading,
        page,
        setPage,
        totalPages,
        total,
        search,
        setSearch,
        deleteTodo,
        setUpdatingTodo,
        toggleTodoStatus,
    } = useTodo()
    const { logStatusChange, clearTimeLog, getTimeLog } = useTimeLog()

    const handleStatusChange = (id: number, newStatus: string, title: string) => {
        logStatusChange(id, newStatus, title)
        toggleTodoStatus(id, newStatus)
    }

    const formatDateForInput = (dateStr: string) => {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    const columns: ColumnDef<Todo>[] = [
        {
            accessorKey: "id",
            header: "NO",
            cell: ({ row }) => <span className="text-gray-500">{(page - 1) * limit + row.index + 1}</span>
        },
        {
            accessorKey: "title",
            header: "TITLE",
            cell: ({ getValue }) => (
                <span className="font-medium">{getValue() as string}</span>
            ),
        },
        {
            accessorKey: "note",
            header: "DESCRIPTION",
            cell: ({ getValue }) => (
                <span className="text-gray-600 truncate max-w-xs block">
                    {getValue() as string}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "DUE DATE",
            cell: ({ getValue }) => {
                if (!getValue()) return ""
                const date = new Date(getValue() as string)
                return date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })
            },
        },
        {
            accessorKey: "status",
            header: "STATUS",
            cell: ({ getValue, row }) => {
                const status = getValue() as Todo["status"]
                const log = getTimeLog(row.original.id)
                const styles = {
                    pending: "bg-yellow-100 text-yellow-700",
                    "in-progress": "bg-blue-100 text-blue-700",
                    done: "bg-green-100 text-green-700",
                }
                return (
                    <div className="flex flex-col gap-1">
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(row.original.id, e.target.value, row.original.title)}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                        {status === "done" && log.startedAt && log.completedAt && (
                            <span className="text-[10px] text-green-600">
                                ✅ {formatDuration(log.startedAt, log.completedAt)}
                                <span className="text-gray-400 ml-1">
                                    ({formatTime(log.startedAt)} → {formatTime(log.completedAt)})
                                </span>
                            </span>
                        )}
                        {status === "done" && !log.startedAt && log.completedAt && (
                            <span className="text-[10px] text-gray-400">
                                ⚡ Done {formatTime(log.completedAt)}
                            </span>
                        )}
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button type="button" onClick={() => setUpdatingTodo({ ...row.original, createdAt: formatDateForInput(row.original.createdAt) })}
                        className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" onClick={() => setConfirmId(row.original.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm" >
                        <i className="fa-solid fa-delete-left"></i>
                    </button>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: todos,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
    })

    const [confirmId, setConfirmId] = useState<number | null>(null)

    return (
        <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold">Todo List</h2>
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 ค้นหา..."
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-full sm:w-64"
                />
            </div>

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-gray-50 border-b">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: " ↑",
                                                desc: " ↓",
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading && todos.length === 0 ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i} className="border-b animate-pulse">
                                    {columns.map((_, j) => (
                                        <td key={j} className="p-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                                    ไม่พบข้อมูล
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b odd:bg-white even:bg-gray-50 hover:bg-blue-50/40 transition"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {loading && todos.length > 0 && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <span className="text-sm text-gray-600">
                    หน้า {page} / {totalPages} (ทั้งหมด {total} รายการ)
                </span>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        «
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page >= totalPages}
                        className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ›
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage(totalPages)}
                        disabled={page >= totalPages}
                        className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        »
                    </button>
                </div>
            </div>

            {confirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <p className="text-lg font-bold mb-4">Are you sure you want to delete this item?</p>
                        <div className="flex gap-2 justify-center">
                            <button type="button" onClick={() => { clearTimeLog(confirmId); deleteTodo(confirmId); setConfirmId(null) }} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirm</button>
                            <button type="button" onClick={() => setConfirmId(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
