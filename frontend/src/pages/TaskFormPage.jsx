import { useForm } from 'react-hook-form'
import { useTasks } from '../context/TasksContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
// Definiendo el formato de la fecha al que será formateada.
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function TaskFormPage () {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const { createTask, getTask, updateTask, errors: tasksErrors } = useTasks()
  const navigate = useNavigate()
  const params = useParams()

  const onSubmit = handleSubmit((values) => {
    const valuesValid = {
      ...values,
      date: values.date ? dayjs(values.date).utc().format() : dayjs().utc().format()
    }
    if (values.date) valuesValid.date = dayjs.utc(values.date).format()
    // Si: params.id extiste significa que se está editando una tarea, de lo contrario, se está creando una tarea nueva.
    if (params.id) {
      updateTask(params.id, valuesValid)
      navigate('/tasks')
    } else {
      createTask(valuesValid)
      navigate('/tasks')
    }
  })

  const loadTask = async () => {
    if (params.id) {
      const task = await getTask(params.id)
      setValue('title', task.data.title)
      setValue('description', task.data.description)
      setValue('date', dayjs(task.data.date).utc().format('YYYY-MM-DD'))
    }
  }

  useEffect(() => {
    loadTask()
  }, [])

  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
        {
          tasksErrors.map((error, i) => (
            <div key={i} className='bg-red-500 p-2 text-white text-center my-2'>
              {error}
            </div>
          ))
        }
        <h1 className='text-2xl font-bold'>New Task</h1>
        <form onSubmit={onSubmit}>
          <label htmlFor='title'>Title</label>
          <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' type='text' placeholder='Title' {...register('title', { required: true })} autoFocus />
          {errors.title && <p className='text-red-500'>Title is required!</p>}

          <label htmlFor='description'>Description</label>
          <textarea className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' rows='3' placeholder='Description' {...register('description', { required: true })} />
          {errors.description && <p className='text-red-500'>Description is required!</p>}

          <label htmlFor='date'>Date</label>
          <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' type='date' {...register('date')} />

          <button className='bg-indigo-500 px-4 py-2 rounded-md'>Save</button>
        </form>
      </div>
    </div>
  )
}

export default TaskFormPage
