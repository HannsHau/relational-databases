const router = require('express').Router()

const { Blog, User, UserBlogs } = require('../models')
const { sequelize } = require('../util/db')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  console.log('got in readinglists')

  try {
    const { blogId, userId } = req.body
    console.log('with blodId: ', blogId, ' and userId: ', userId)
    console.log('maybe check if entries exists')

    const newEntry = { userId, blogId }

    console.log('newEntry: ', newEntry)

    const readinglistEntry = await UserBlogs.create(newEntry)

    res.status(201).json(readinglistEntry)
  } catch (error) {
    next(error)
  }
})

const userBlogsFinder = async (req, res, next) => {
  req.userBlog = await UserBlogs.findByPk(req.params.id)
  if (!req.userBlog) {
    next({ name: 'NotFound', message: 'UserBlog (readinglist) not found' })
  }
  next()
}

router.put('/:id', userBlogsFinder, tokenExtractor, async (req, res, next) => {
  if (req.userBlog.dataValues.userId != req.decodedToken.id) {
    next({
      name: 'DifferentUser',
      message: 'user is not owner, modification not possible',
    })
  } else {
    req.userBlog.state = req.body.state
    await req.userBlog.save()
    res.json(req.userBlog)
  }
})

module.exports = router
