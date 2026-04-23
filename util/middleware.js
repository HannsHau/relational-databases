const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const { User, Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

      console.log('got token: ', authorization.substring(7));

      const session = await Session.findOne({ where: { token: authorization.substring(7)}})
      if (session === null) {
        return res.status(401).json({ error: 'token invalid' })
      } 

      console.log('token valid')

    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }