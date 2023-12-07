import Task from '../models/task.model.js'

export const getTasks = async (req, res) => {
  try {
    // Encuentra todas las tareas que sean del usuario autenticado, para ello es que: "user: req.user.id".
    // La función populate('user') es para que no solo traiga el id del usuario, sino para que haga la consulta a la tabla usuario y muestre todo el usuario.
    // De manera que find({ user: req.user.id }).populate('user') va a mostrar todas las tareas del usuario autenticado, listando los datos de las tareas con los datos del usuario de cada tarea.
    const tasks = await Task.find({ user: req.user.id }).populate('user')
    return res.json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body
    // user: req.user.id esto lo puedo hacer pq antes de poder crear una tarea, tiene que estar algún usuario autenticado (según el middleware que tiene la ruta de crear una tera nueva) y dicho middleware pone en req.user el id del usuario autenticado (línea 10 del middleware authRequire()).
    const newTask = new Task({
      title,
      description,
      date,
      user: req.user.id
    })
    const sevedTask = await newTask.save()
    return res.status(200).json({ sevedTask, mesagge: 'Saved Task!' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user')
    if (!task) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(task)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id).populate('user')
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json({ message: 'Deleted Task!' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    // El tercer parámetro de la función findByIdAndUpdate() es para que me de el dato nuevo, no el viejo (retorno por defecto).
    const taskUpdated = await Task.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('user')
    if (!taskUpdated) return res.status(404).json({ message: 'Task not found!' })
    return res.status(200).json({ taskUpdated, message: 'Updated Task!' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
