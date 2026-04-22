const router = require('express').Router()

router.get('/', async (req, res) => {
  console.log('request health check')
  res.status(200).end()
})

module.exports = router