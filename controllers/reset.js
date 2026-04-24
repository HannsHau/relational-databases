const router = require('express').Router()

const { Blog, User, UserBlogs, Session } = require('../models')

router.post('/', async (req, res) => {
  console.log('remove enties from blogs and users')

  const resultUserBlog = await UserBlogs.destroy({ where: {}, force: true})
  console.log('resultUserBlog: ', resultUserBlog)

  const resultBlog = await Blog.destroy({ where: {}, force: true })
  console.log('resultBlog: ', resultBlog)

  const resultSession = await Session.destroy({ where: {}, force: true })
  console.log('resultSession', resultSession)

  const resultUser = await User.destroy({ where: {}, force: true })
  console.log('resultUser: ', resultUser)

  res.status(204).end()
})

module.exports = router