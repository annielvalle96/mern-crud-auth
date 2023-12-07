import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

// Crear una instancia de; axios, para poder hacer algunas configuraciones a dicha librería.
const axiosInstance = axios.create({
  // Dominio base de la api por el que siempre va a hacer las onsultas.
  baseURL: 'http://localhost:4000/api',
  // Permite extrablecer las cookies en la app que hace las peticiones.
  withCredentials: true
})

const AuthContext = createContext()

// Creando un hook que me provee el contexto para luego solo usar el contexto y ya.
// Este hook es para, en vez de estar importando 'AuthContext' y 'useContext', solo importatr el hook 'useAuth' y tendremos acceso el contexto.
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  // Guardar el usuario registrado.
  const [user, setUser] = useState(null)
  // Indicar si el usuario está autenticado.
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Guadar los errores para luego poder mostrarlos donde sea (globalmente).
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)

  const signup = async (user) => {
    try {
      const res = await axiosInstance.post('/register', user)
      if (res.status === 200) {
        setUser(res.data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      setErrors([error.response.data.message])
    }
  }

  const signin = async (user) => {
    try {
      const res = await axiosInstance.post('/login', user)
      if (res.status === 200) {
        setUser(res.data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      setErrors([error.response.data.message])
    }
  }

  const checkLogin = async () => {
    // Al carguar el contexto (el cual carga cada vez que hay un renderizado), necesito saber si hay algún usuario logueado. Cargar las cookies del navegador.
    const cookies = Cookies.get()
    // Si entre las cookies, hay una con el nombre: token.
    if (!cookies.token) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }
    try {
      const res = await axiosInstance.get('/verify', cookies.token)
      if (!res.data) return setIsAuthenticated(false)
      setIsAuthenticated(true)
      setUser(res.data)
      setLoading(false)
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/logout')
      setIsAuthenticated(false)
      setUser(null)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errors])

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <AuthContext.Provider value={{ signup, signin, user, isAuthenticated, errors, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
