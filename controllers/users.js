const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Blog } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = {name, username, passwordHash}

    const user = await User.create(newUser)
    res.json(user)
  } catch (error) {
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
