const errorHandler = (error, req, res, next) => {
  console.error('We got an Error in our middleware!', error.message, ':', error.name);
  console.log('Log works: ', error.name, ':', error?.errors?.[0]?.path)

  if (error.name === 'NotFound') {
    return res.status(404).json({ error })
  }

  if (error.name === 'SequelizeValidationError' && error?.errors?.[0]?.path === 'username') {
    return res.status(400).json({error: "username must be a valid email address"})
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({error})
  }

  next(error)
}

module.exports = errorHandler