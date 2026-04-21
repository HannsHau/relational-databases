const router = require('express').Router()

const { User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    //return res.status(400).json({ error })
    next(error)
  }
})

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['author', 'title']
    }
  })
  res.json(users)
})

const userFinder = async (req, res, next) => {
  console.log('simple log in userFinder')
  req.user = await User.findOne({
    where: { username: req.params.username },
  })
  if (!req.user) {
    next({ name: 'NotFound', message: 'User not found' })
  }
  next()
}

router.put('/:username', userFinder, async (req, res) => {
  console.log('simple log')
  req.user.name = req.body.name
  console.log('body: ', req.body)
  await req.user.save()
  res.json(req.user)
})

module.exports = router
