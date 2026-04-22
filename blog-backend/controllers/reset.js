const router = require('express').Router()

const { Blog, User } = require('../models')

router.post('/', async (req, res) => {
  console.log('remove enties from blogs and users')

  const resultBlog = await Blog.destroy({ where: {}, force: true })
  console.log('resultBlog: ', resultBlog)

  const resultUser = await User.destroy({ where: {}, force: true })
  console.log('resultUser: ', resultUser)

  res.status(204).end()
})

module.exports = router