import { useState } from "react"
import { useTodo } from "../context/Todo"

export default function TodoCalendar() {
    const { todos } = useTodo()
    const [selectedDay, setSelectedDay] = useState<Date>(new Date())
    const formatLocalDate = (day: Date) => {
        const y = day.getFullYear()
        const m = String(day.getMonth() + 1).padStart(2, "0")
        const d = String(day.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
    }
    
    const getNext7Days = (): Date[] => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setHours(0, 0, 0, 0)
            d.setDate(d.getDate() + i)
            return d
        })
    }

    const getTodosByDay = (day: Date) =>
        todos.filter(t => t.createdAt === formatLocalDate(day) && t.status !== "done")

    const isToday = (day: Date) => day.toDateString() === new Date().toDateString()
    const isSelected = (day: Date) => day.toDateString() === selectedDay.toDateString()

    const days = getNext7Days()
    const selectedTodos = getTodosByDay(selectedDay)

    const statusStyle: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        "in-progress": "bg-blue-100 text-blue-700",
        done: "bg-green-100 text-green-700",
    }

    return (
        <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm h-full flex flex-col">
            <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-500">📅</span> Upcoming 7 Days
            </h2>

            <div className="flex sm:grid sm:grid-cols-7 gap-2 overflow-x-auto sm:overflow-visible -mx-4 sm:mx-0 px-4 sm:px-0 pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-hide">
                {days.map((day, idx) => {
                    const count = getTodosByDay(day).length
                    const today = isToday(day)
                    const selected = isSelected(day)
                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedDay(day)}
                            className={`
                                flex-shrink-0 w-[70px] sm:w-auto snap-center
                                p-3 rounded-xl border text-center transition
                                flex flex-col justify-center items-center gap-1 cursor-pointer
                                ${selected
                                    ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/30 ring-2 ring-blue-300"
                                    : today
                                        ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                                }
                            `}
                        >
                            <div className="text-[10px] font-medium uppercase tracking-wide">
                                {day.toLocaleDateString("en-GB", { weekday: "short" })}
                            </div>
                            <div className="text-base font-bold">
                                {day.getDate()}/{day.getMonth() + 1}
                            </div>
                            <div className={`mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${count > 0 ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"}`}>
                                {count} tasks
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-4 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                        {selectedDay.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                    </h3>
                    <span className="text-xs text-gray-500">{selectedTodos.length} รายการ</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {selectedTodos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <span className="text-3xl mb-2">🎉</span>
                            <p className="text-sm">ไม่มีรายการในวันนี้</p>
                        </div>
                    ) : (
                        selectedTodos.map(todo => (
                            <div key={todo.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                    todo.status === "done" ? "bg-green-500"
                                    : todo.status === "in-progress" ? "bg-blue-500"
                                    : "bg-yellow-500"
                                }`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>
                                        {todo.title}
                                    </p>
                                    {todo.note && (
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{todo.note}</p>
                                    )}
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusStyle[todo.status] ?? "bg-gray-100 text-gray-600"}`}>
                                    {todo.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}