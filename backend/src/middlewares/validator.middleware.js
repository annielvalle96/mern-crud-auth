// Se le debe pasar por parámetros el esquema y también las variable propias de los middlewares.
export const validateSchema = (schema) => (req, res, next) => {
  // Si la validación con el esquema falla, se cae el servidor. Para manejar mejor esa situación hay que usar try - catch, como se muestra en el código para poder manejar los errores.
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    // Cuando el esquema falla, devuelve un error, el cual tiene una forma peculiar. La mejor forma de manejar los errores antes dichos es como se muestra en el código.
    return res.status(400).json({ message: error.errors.map((error) => error.message) })
  }
}
