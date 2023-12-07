import axios from 'axios'
import { createContext, useContext, useState } from 'react'

// Crear una instancia de; axios, para poder hacer algunas configuraciones a dicha librería.
const axiosInstance = axios.create({
  // Dominio base de la api por el que siempre va a hacer las onsultas.
  baseURL: 'http://localhost:4000/api',
  // Permite extrablecer las cookies en la app que hace las peticiones.
  withCredentials: true
})

const TasksContext = createContext()

export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) throw new Error('useTasks must be used within a TasksProvider')
  return context
}

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  // Guadar los errores para luego poder mostrarlos donde sea (globalmente).
  const [errors, setErrors] = useState([])

  const getTasks = async () => {
    try {
      const res = await axiosInstance.get('/tasks')
      setTasks(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createTask = async (task) => {
    try {
      const res = await axiosInstance.post('/tasks', task)
      if (res.status === 200) getTasks()
      return res.status
    } catch (error) {
      setErrors([error.response.data.message])
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await axiosInstance.delete(`/tasks/${id}`)
      if (res.status === 200) setTasks(tasks.filter(task => task._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const getTask = async (id) => {
    try {
      const res = await axiosInstance.get(`/tasks/${id}`)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  const updateTask = async (id, task) => {
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, task)
      if (res.status === 200) getTasks()
      return res.status
    } catch (error) {
      setErrors([error.response.data.message])
    }
  }

  return (
    <TasksContext.Provider value={{ tasks, getTasks, createTask, getTask, deleteTask, updateTask, errors }}>
      {children}
    </TasksContext.Provider>
  )
}
