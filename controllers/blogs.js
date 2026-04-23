const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const { tokenExtractor } = require('../util/middleware')
const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: '%' + req.query.search + '%' } },
        { author: { [Op.iLike]: '%' + req.query.search + '%' } },
      ],
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})



router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    next({ name: 'NotFound', message: 'Blog not found' })
  }
  next()
}

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  console.log('delete: ', req.blog.dataValues.userId, ':', req.decodedToken.id)

  if (req.blog.dataValues.userId != req.decodedToken.id) {
    next({
      name: 'DifferentUser',
      message: 'user is not owner, delete not possible',
    })
  } else {
    await req.blog.destroy()
    res.status(204).end()
  }
})

module.exports = router
