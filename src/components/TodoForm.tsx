import { useEffect, useState } from "react"
import { useTodo } from "../context/Todo"

export default function TodoForm() {
    const { addTodo, updateTodo, loading, updatingTodo, setUpdatingTodo, showToast } = useTodo()
    const [title, setTitle] = useState("")
    const [note, setNote] = useState("")
    const [createdAt, setCreatedAt] = useState("")

    useEffect(() => {
        if (updatingTodo) {
            setTitle(updatingTodo.title)
            setNote(updatingTodo.note)
            setCreatedAt(updatingTodo.createdAt)
        }
    }, [updatingTodo])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title) {
            showToast("Title is required", "red")
            return
        }
        if (updatingTodo) {
            updateTodo(updatingTodo.id, { title, note, createdAt })
        } else {
            addTodo({ title, note, createdAt })
        }
        handleReset()
    }

    const handleReset = () => {
        setTitle("")
        setNote("")
        setCreatedAt("")
        setUpdatingTodo(null)
    }
    return (
        <form onSubmit={handleSubmit} className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="mb-2">
                <label htmlFor="Title" className="block mb-1 text-sm font-medium text-heading">Title <span className="text-red-500">*</span></label>
                <input type="text" id="title" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a new todo" />
            </div>
            <div className="mb-2">
                <label htmlFor="note" className="block mb-1 text-sm font-medium text-heading">Description</label>
                <textarea id="note" rows={4}
                    value={note} onChange={(e) => setNote(e.target.value)}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
                    placeholder="Add a description"></textarea>
            </div>
            <div className="mb-2">
                {/* กำหนดส่ง */}
                <label htmlFor="date" className="block mb-1 text-sm font-medium text-heading">Due Date</label>
                <input type="date" id="createdAt" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    value={createdAt} onChange={(e) => setCreatedAt(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="mb-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={loading}>
                    {loading ? "Loading..." : updatingTodo ? 'Update' : 'Create'}
                </button>
                {updatingTodo && (
                    <button type="button" onClick={() => handleReset()}
                        className="bg-red-500 text-white px-4 py-2 rounded-md ml-2">Cancel</button>
                )}
            </div>
        </form>
    )
}