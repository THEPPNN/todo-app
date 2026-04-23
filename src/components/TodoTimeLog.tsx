import { useTimeLog, formatTime, formatDuration } from "../hook/useTimeLog"

type LogEvent = {
    id: number
    title: string
    action: "started" | "completed"
    time: string
    pairedTime?: string
}

export default function TodoTimeLog() {
    const { logs } = useTimeLog()

    const events: LogEvent[] = []
    for (const [idStr, log] of Object.entries(logs)) {
        const id = Number(idStr)
        const title = log.title ?? `Task #${id}`
        if (log.startedAt) {
            events.push({ id, title, action: "started", time: log.startedAt, pairedTime: log.completedAt })
        }
        if (log.completedAt) {
            events.push({ id, title, action: "completed", time: log.completedAt, pairedTime: log.startedAt })
        }
    }
    events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    if (events.length === 0) return null

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-3">
            <h2 className="text-lg font-semibold mb-4">Activity Log</h2>

            <div className="relative pl-5">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gray-200" />
                <div className="space-y-4">
                    {events.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-3 relative">
                            <div className={`w-3 h-3 rounded-full shrink-0 border-2 border-white ring-2 z-10 mt-1
                                ${event.action === "completed"
                                    ? "ring-green-400 bg-green-400"
                                    : "ring-blue-400 bg-blue-400"}`}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                                <p className={`text-xs mt-0.5 ${event.action === "completed" ? "text-green-600" : "text-blue-500"}`}>
                                    {event.action === "started"
                                        ? `🔄 Started · ${formatTime(event.time)}`
                                        : event.pairedTime
                                            ? `✅ Completed · ${formatTime(event.time)} (${formatDuration(event.pairedTime, event.time)})`
                                            : `⚡ Done · ${formatTime(event.time)}`
                                    }
                                </p>
                            </div>
                            <span className="text-[11px] text-gray-400 whitespace-nowrap mt-1">
                                {new Date(event.time).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
