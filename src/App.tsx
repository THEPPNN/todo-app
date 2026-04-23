import { TodoProvider } from './context/Todo'
import TodoForm from './components/TodoForm'
import TodoCalendar from './components/TodoCalendar'
import TodoTable from './components/TodoTable'
import TodoMonthly from './components/TodoMonthly'
import TodoTimeLog from './components/TodoTimeLog'

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-500">
        To Do List
      </h1>
      <TodoProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <TodoForm />
          </div >
          <div className="md:col-span-1">
            <TodoCalendar />
          </div >
          <div className="md:col-span-2">
            <TodoTable />  
            <TodoMonthly />
            <TodoTimeLog />
          </div >
        </div >
      </TodoProvider>
    </div >
  )
}

export default App
