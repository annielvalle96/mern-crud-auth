import { Router } from 'express'
import authRequire from '../middlewares/validateToken.middleware.js'
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/tasks.controllers.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createTaskSchema } from '../schemas/task.schema.js'

const router = Router()

router.get('/tasks', authRequire, getTasks)
router.get('/tasks/:id', authRequire, getTask)
// El middleware para la validación tiene que ir luego que el middleware de autenticación pq primero debe recibir los datos a validar para luego poder validarlos.
router.post('/tasks', authRequire, validateSchema(createTaskSchema), createTask)
router.delete('/tasks/:id', authRequire, deleteTask)
router.put('/tasks/:id', authRequire, updateTask)

export default router
