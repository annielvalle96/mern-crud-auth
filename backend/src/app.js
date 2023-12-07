import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './db/db.js'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import tasksRouter from './routes/tasks.routes.js'
import cors from 'cors'

// Usar las variables de entorno desde el archivo ".env".
dotenv.config()

// Ejecutar la conexión a la BD.
connectDB()

// Crear el servidor.
const app = express()

// Definición de CORS para indicar que: todos los dominio se puedan comunicar con este servidor.
// El argumento: {origin: 'http://localhost:5173'}, de la función cors() no es obligatorio usarlo.
// En este caso, dicho argumento está indicando que el servidor solo se conecte con la aplicación desplegada en: http://localhost:5173.
// El atributo: credentials: true, es para que la api, aquí en el backend pueda establecer las cookies.
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// Mandar a escuchar al servidor en un puerto específico y devolver un mensaje por consola para saber si funciona esta operación.
app.listen(process.env.PORT, () => console.log(`>>> Server is running on: http://localhost:${process.env.PORT}`))

// "morgan('dev)" es para mostrar un mensaje corto por consola con las peticiones que llegan al backend para saber que peticiones estamos haciendo a cada momento.
app.use(morgan('dev'))

// "express.json() es para que express pueda convertir y reconocer los "req.body" en JSON.
app.use(express.json())

// Para poder leer cookies con req.cookies, necesitamos usar este middleware.
app.use(cookieParser())

// Decirle a la aplicación que use todas las tutas, las cuales están definidas en el archivo "auth.routes.js", "tasks.router.js".
app.use('/api', authRoutes)
app.use('/api', tasksRouter)
