import { TodoProvider } from './context/Todo'
import TodoForm from './components/TodoForm'
import './index.css'

function App() {
  return (
    <div className="container mx-auto p-4">
      <TodoProvider>
        <TodoForm />
      </TodoProvider>
    </div>
  )
}

export default App
