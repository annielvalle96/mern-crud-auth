import { useEffect } from 'react'
import { useTasks } from '../context/TasksContext.jsx'
import TaskCard from '../components/TaskCard.jsx'

function TasksPage () {
  const { tasks, getTasks } = useTasks()

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <>
      {tasks.length === 0 && (
        <div className='flex justify-center items-center p-10'>
          <div>
            <h1 className='font-bold text-xl'>
              No tasks yet, please add a new task
            </h1>
          </div>
        </div>
      )}

      <div className='grid sm:grid-cols-2 grid-cols-3 gap-2'>
        {tasks.map((task) => (
          <TaskCard task={task} key={task._id} />
        ))}
      </div>
    </>
  )
}

export default TasksPage
