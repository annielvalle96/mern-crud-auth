import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute () {
  // Para poder porteger las rutas, debemos saber si hay un ususario autenticado.
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <h1>Loading...</h1>
  // La propiedad: replace, es para que luego que direcciones a esta url especificada, no se pueda regresar a la anterior de nuevo.
  if (!loading && !isAuthenticated) return <Navigate to='/login' replace />
  // El componente: ProtectedRoute, está englobando a los componentes que deben ser protegidos, por tanto, si el flujo de eventos llega hasta este return de abajo es pq el usuario si está autenticado (en este caso) y entonces, se prosigue a renderizar el componente siguiente en la secuencia. Resumiendo: si el usuario si está autenticado, puede acceder a las rutas protegidas.
  return <Outlet />
}

export default ProtectedRoute
