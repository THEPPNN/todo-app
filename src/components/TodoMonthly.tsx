import { useState } from "react"
import { useTodo } from "../context/Todo"
import type { Todo } from "../types/todo"

export default function TodoMonthCalendar() {
    const { upcomingTodos, addUpcomingTodo } = useTodo()
    const [current, setCurrent] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState<{ date: Date; todos: Todo[] } | null>(null)
    const [creatingDay, setCreatingDay] = useState<Date | null>(null)
    const [newTitle, setNewTitle] = useState("")
    const [newNote, setNewNote] = useState("")

    const year = current.getFullYear()
    const month = current.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const cells: { date: Date; isCurrentMonth: boolean }[] = []

    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({
            date: new Date(year, month - 1, daysInPrevMonth - i),
            isCurrentMonth: false,
        })
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ date: new Date(year, month, d), isCurrentMonth: true })
    }
    while (cells.length < 42) {
        const lastDate = cells[cells.length - 1].date
        cells.push({
            date: new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + 1),
            isCurrentMonth: false,
        })
    }

    const formatKey = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

    const getTodosOfDay = (d: Date) => {
        const key = formatKey(d)
        return upcomingTodos.filter(t => t.createdAt.startsWith(key))
    }

    const isToday = (d: Date) => d.toDateString() === new Date().toDateString()

    const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrent(new Date(year, month + 1, 1))
    const goToday = () => setCurrent(new Date())

    const openCreateModal = (date: Date) => {
        setCreatingDay(date)
        setNewTitle("")
        setNewNote("")
    }

    const closeCreateModal = () => {
        setCreatingDay(null)
        setNewTitle("")
        setNewNote("")
    }

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newTitle.trim() || !creatingDay) return
        addUpcomingTodo({ title: newTitle.trim(), note: newNote.trim(), createdAt: formatKey(creatingDay) })
        closeCreateModal()
    }

    const statusStyle: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        "in-progress": "bg-blue-100 text-blue-700",
        done: "bg-green-100 text-green-700",
    }

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-3">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        {current.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h2>
                    <div className="flex gap-1">
                        <button type="button" onClick={prevMonth}
                            className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center">
                            ‹
                        </button>
                        <button type="button" onClick={goToday}
                            className="px-3 h-9 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium">
                            Today
                        </button>
                        <button type="button" onClick={nextMonth}
                            className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center">
                            ›
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekdays.map(w => (
                        <div key={w} className="text-center text-xs font-semibold text-gray-500 py-2">{w}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {cells.map((cell, idx) => {
                        const dayTodos = getTodosOfDay(cell.date)
                        const isCurrentDay = isToday(cell.date)

                        return (
                            <div
                                key={idx}
                                onClick={() => openCreateModal(cell.date)}
                                className={`
                                    min-h-[90px] p-2 rounded-lg border
                                    ${isCurrentDay
                                        ? "bg-blue-50 border-blue-300"
                                        : cell.isCurrentMonth
                                            ? "bg-white border-gray-100 hover:border-blue-200"
                                            : "bg-gray-50 border-gray-100"
                                    }
                                    transition cursor-pointer
                                `}
                            >
                                <div className={`
                                    text-xs font-semibold mb-1
                                    ${isCurrentDay ? "text-blue-600"
                                        : cell.isCurrentMonth ? "text-gray-700" : "text-gray-400"}
                                `}>
                                    {cell.date.getDate()}
                                </div>

                                <div className="space-y-0.5">
                                    {dayTodos.slice(0, 2).map(t => (
                                        <div key={t.id} className={`
                                            text-[10px] px-1.5 py-0.5 rounded truncate
                                            ${t.status === "done"
                                                ? "bg-green-100 text-green-700 line-through"
                                                : t.status === "in-progress"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-700"}
                                        `}>
                                            {t.title}
                                        </div>
                                    ))}
                                    {dayTodos.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={e => { e.stopPropagation(); setSelectedDay({ date: cell.date, todos: dayTodos }) }}
                                            className="text-[10px] text-blue-500 hover:text-blue-700 hover:underline px-1.5"
                                        >
                                            +{dayTodos.length - 2} more
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* View all todos modal */}
            {selectedDay && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedDay(null)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-5"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">
                                {selectedDay.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                            </h3>
                            <button type="button" onClick={() => setSelectedDay(null)}
                                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {selectedDay.todos.map(t => (
                                <div key={t.id} className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100">
                                    <span className={`text-sm flex-1 truncate ${t.status === "done" ? "line-through text-gray-400" : "text-gray-700"}`}>
                                        {t.title}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusStyle[t.status] ?? "bg-gray-100 text-gray-600"}`}>
                                        {t.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick-add modal */}
            {creatingDay && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={closeCreateModal}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-5"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Add todo —{" "}
                                {creatingDay.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </h3>
                            <button type="button" onClick={closeCreateModal}
                                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="Title *"
                                    autoFocus
                                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                />
                            </div>
                            <div>
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    placeholder="Note (optional)"
                                    rows={3}
                                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={closeCreateModal}
                                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                                    disabled={!newTitle.trim()}>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
