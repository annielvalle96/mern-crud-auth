import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Creación del Token.
const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 4 }, (error, token) => { error ? reject(error) : resolve(token) })
  })
}

export const register = async (req, res) => {
  // Obtener los elementos del cuerpo de la petición.
  const { username, email, password } = req.body
  try {
    // Validar que, cuando un usuario se vaya a registrar, lo haga con un correo que no está siendo usado ya en otro usuario registrado.
    // Los correos son único, por lo que esta validación es más bien para validar que el usuario se registre una sola vez, lo cuál es lo típicamente lógico.
    const userFound = await User.findOne({ email })
    // Metí el mensage del error en un [] para que se muestre en el mismo formato que la librería: zod, muestra nuestros errores en este backend.
    if (userFound) return res.status(400).json({ message: 'There is already a user with this email registered!' })
    // Encriptar la contraseña.
    const passwordHash = await bcrypt.hash(password, 10)
    // Crear un objeto con el el cuerpo de la petición (req.body).
    const newUser = new User({ username, email, password: passwordHash })
    // Guardar a la BD este nuevo objeto.
    const userSaved = await newUser.save()
    // Obtener el Token
    const token = await createAccessToken({ id: userSaved._id })
    // Guardar el Token en una Cookie del navegador.
    res.cookie('token', token)
    // res.cookie('token', token, {
    //   // Indicar que la cookie no está en el mismo dominio: el frontend está en el localhost:5176 y el backend está en el localhost:4000.
    //   sameSite: 'none',
    //   secure: true,
    //   httpOnly: false
    // })
    // Responder a la solicitud de registración con los elementos del registro.
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  // Obtener los elementos del cuerpo de la petición.
  const { email, password } = req.body
  if (!email && !password) return res.status(400).json({ message: 'Type your credentials correctly!' })
  try {
    // Buscar si existe el user que se está logueado.
    const userFound = await User.findOne({ email })
    if (!userFound) return res.status(400).json({ message: 'User not found!' })
    // Desencriptar la contraseña.
    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' })
    // Obtener el Token
    const token = await createAccessToken({ id: userFound._id })
    // Guardar el Token en una Cookie del navegador.
    res.cookie('token', token)
    // res.cookie('token', token, {
    //   // Indicar que la cookie no está en el mismo dominio: el frontend está en el localhost:5176 y el backend está en el localhost:4000.
    //   sameSite: 'none',
    //   secure: true,
    //   httpOnly: false
    // })
    // Responder a la solicitud de registración con los elementos del registro.
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updatedAt
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
  // Limpiar el valor del Token y quitar la fecha de expiración.
  res.cookie('token', '', { expires: new Date(0) })
  return res.status(200).json({ message: 'User is logout!' })
}

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id)
  if (!userFound) return res.status(400).json({ message: 'User not found!' })
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updateAt: userFound.updateAt
  })
}

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: 'Unauthorized!' })

  jwt.verify(token, process.env.SECRET_KEY, async (error, user) => {
    if (error) return res.status(401).json({ message: 'Unauthorized!' })

    const userFound = await User.findById(user.id)
    if (!userFound) return res.status(401).json({ message: 'Unauthorized!' })

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
}
