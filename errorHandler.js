const errorHandler = (error, req, res, next) => {
  console.error(
    'ERROR: ',
    error.name,
    ' Message: ',
    error.message,
  )

  if (error.name === 'MissingParameter') {
    console.log('got MissingParameter')
    return res.status(400).json({ error })
    console.log('never reached')
  }

  if (error.name === 'NotFound') {
    return res.status(404).json({ error })
  }

  if (error.name === 'DifferentUser') {
    return res.status(401).json({ error })
  }

  if (
    error.name === 'SequelizeValidationError' &&
    error?.errors?.[0]?.path === 'username'
  ) {
    return res
      .status(400)
      .json({ error: 'username must be a valid email address' })
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error })
  }

  if (error.name === 'DuplicateEntry') {
    return res.status(400).json({ error })
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json(error.original)
  }

  next(error)
}

module.exports = errorHandler
