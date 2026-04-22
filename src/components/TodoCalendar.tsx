import { useTodo } from "../context/Todo"

export default function TodoCalendar() {
    const { updatingTodo } = useTodo()
    console.log('updatingTodo',updatingTodo)
   
    const formatKey = (day: Date) => {
        return day.toISOString().split('T')[0]
    }
  
    const statusStyle: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        'in-progress': "bg-blue-100 text-blue-700",
        done: "bg-green-100 text-green-700",
    }

    return (
        <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm h-full flex flex-col">
            <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-500">📅</span> Upcoming 7 Days
            </h2>
            <div
                className="
                  flex sm:grid sm:grid-cols-7 gap-2
                  overflow-x-auto sm:overflow-visible
                  -mx-4 sm:mx-0 px-4 sm:px-0 pb-2 sm:pb-0
                  snap-x snap-mandatory
                  scrollbar-hide
              ">
                {updatingTodo?.map((todo) => {
                    const total = todo.count
                    const day = new Date(todo.createdAt)
                    return (
                        <div
                            key={todo.id}
                            className={`
                                flex-shrink-0 w-[70px] sm:w-auto snap-center
                                p-3 rounded-xl border text-center transition
                                flex flex-col justify-center items-center gap-1
                                cursor-pointer
                            `}
                        >
                            <div className={`text-[10px] font-medium uppercase tracking-wide text-base
                                }`}>
                                {day.toLocaleDateString("en-GB", {
                                    weekday: "short",
                                })}
                            </div>

                            <div className="text-base font-bold">
                                {day.getDate()}/{day.getMonth() + 1}
                            </div>

                            <div className={`
                                mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium
                                ${total > 0
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-200 text-gray-500"
                                }
                            `}>
                                {total} tasks
                            </div>
                        </div>
                    )
                })}
            </div>

            
        </div>
    )
}