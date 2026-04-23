import { useState, useEffect } from "react"

export interface TimeLog {
    title?: string
    startedAt?: string
    completedAt?: string
}

const STORAGE_KEY = "todoTimeLogs"

const loadLogs = (): Record<number, TimeLog> => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    } catch {
        return {}
    }
}

// Singleton — ทุก useTimeLog instance แชร์ state เดียวกัน
let _logs: Record<number, TimeLog> = loadLogs()
const _listeners = new Set<(logs: Record<number, TimeLog>) => void>()

const notify = (next: Record<number, TimeLog>) => {
    _logs = next
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    _listeners.forEach(fn => fn({ ...next }))
}

export const formatDuration = (startedAt: string, completedAt: string): string => {
    const diff = new Date(completedAt).getTime() - new Date(startedAt).getTime()
    const totalMinutes = Math.floor(diff / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
    if (hours > 0) return `${hours}h`
    if (totalMinutes < 1) return "< 1m"
    return `${mins}m`
}

export const formatTime = (iso: string): string => {
    return new Date(iso).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

export const useTimeLog = () => {
    const [logs, setLogs] = useState<Record<number, TimeLog>>(() => ({ ..._logs }))

    useEffect(() => {
        const listener = (next: Record<number, TimeLog>) => setLogs(next)
        _listeners.add(listener)
        return () => { _listeners.delete(listener) }
    }, [])

    const logStatusChange = (id: number, newStatus: string, title?: string) => {
        const current = _logs[id] ?? {}
        const next = { ..._logs }

        if (newStatus === "in-progress" && !current.startedAt) {
            next[id] = { ...current, title, startedAt: new Date().toISOString() }
        } else if (newStatus === "done" && !current.completedAt) {
            next[id] = { ...current, title, completedAt: new Date().toISOString() }
        } else if (newStatus === "pending") {
            delete next[id]
        }
        notify(next)
    }

    const clearTimeLog = (id: number) => {
        const next = { ..._logs }
        delete next[id]
        notify(next)
    }

    const getTimeLog = (id: number): TimeLog => logs[id] ?? {}

    return { logs, logStatusChange, clearTimeLog, getTimeLog }
}
