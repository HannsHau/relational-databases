const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const Session = require('../models/session')

router.delete('/', tokenExtractor, async (req, res, next) => {
  console.log('Logout requested: ', req.decodedToken)
  try {
    await Session.destroy({
      where: {
        userId: req.decodedToken.id,
      },
    })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
