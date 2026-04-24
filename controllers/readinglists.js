const router = require('express').Router()

const { Blog, User, UserBlogs } = require('../models')
const { sequelize } = require('../util/db')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId, caseId } = req.body

    console.log('post entered blogId: ', blogId, ' userId: ', userId, 'caseId: ', caseId )

    if (blogId !== null && blogId !== undefined) {
      const blog = await Blog.findByPk(blogId)
      if (!blog) {
        return next({ name: 'NotFound', message: 'blog not found' })
      }
    } else {
      return next({ name: 'MissingParameter', message: 'blogId is missing' })
    }

    if (userId !== null && userId !== undefined) {
      const user = await User.findByPk(userId)
      if(!user) {
        return next({ name: 'NotFound', message: 'user not found' })
      }
    } else {
      return next({ name: 'MissingParameter', message: 'userId is missing' })
    }

    console.log('HHA blogId: ', blogId, ' userId: ', userId)

    const entry = await UserBlogs.findOne({
      where: {
        userId,
        blogId,
      },
    })

    if (entry !== null) {
      return next({ name: 'DuplicateEntry', message: 'Entry already exists' })
    }

    const newEntry = { userId, blogId }

    const readinglistEntry = await UserBlogs.create(newEntry)

    const parsedEntry = {
      read: readinglistEntry.dataValues.read,
      id: readinglistEntry.dataValues.id,
      user_id: readinglistEntry.dataValues.userId,
      blog_id: readinglistEntry.dataValues.blogId,
    }

    res.status(201).json(parsedEntry)
  } catch (error) {
    return next(error)
  }
})

const userBlogsFinder = async (req, res, next) => {
  req.userBlog = await UserBlogs.findByPk(req.params.id)
  if (!req.userBlog) {
    return next({ name: 'NotFound', message: 'UserBlog (readinglist) not found' })
  }
  next()
}

router.put('/:id', userBlogsFinder, tokenExtractor, async (req, res, next) => {
  if (req.userBlog.dataValues.userId != req.decodedToken.id) {
    return next({
      name: 'DifferentUser',
      message: 'user is not owner, modification not possible',
    })
  } else {
    req.userBlog.read = req.body.read
    await req.userBlog.save()
    res.json(req.userBlog)
  }
})

module.exports = router
