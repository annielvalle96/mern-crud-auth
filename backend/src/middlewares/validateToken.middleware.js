import jwt from 'jsonwebtoken'

export const authRequire = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'No Token,  authorization denied!' })
  // Verificar que el Token obtenido es válido para esta aplicación. Esta acción devuelve, o el error o el contenido del Token decodificado si el Token es válido para esta app (comproeba su validez al lograrse la decodificación del Token con mi SECRET_KEY).
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid Token!' })
    // El middleware se va a ejecutar primero que la función controladora, por lo que pongo todo el Token en la variable 'req' para luego poder obtenerla en la función controladora y de esta forma obtener todo el Token en la controladora.
    req.user = decoded

    next()
  })
}

export default authRequire
