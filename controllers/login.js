const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username,
      disabled: false,
    },
  })

  const passwordCorrect = await bcrypt.compare(body.password, user.passwordhash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  try {
    const session = {
      token: token,
      userId: user.id,
    }
    const newSession = await Session.create(session)
  } catch (error) {
    next(error)
  }

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
