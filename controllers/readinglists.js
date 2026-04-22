const router = require('express').Router()

const { Blog, User, UserBlogs } = require('../models')
const { sequelize } = require('../util/db')

router.post('/', async (req, res, next) => {
  console.log('got in readinglists')

  try {
    const { blogId, userId } = req.body;  
    console.log('with blodId: ', blogId, ' and userId: ', userId)
    console.log('maybe check if entries exists')

    const newEntry = {userId, blogId}

    console.log('newEntry: ', newEntry)

    const readinglistEntry = await UserBlogs.create(newEntry)

    res.status(201).json(readinglistEntry)
  } catch (error) {
    next(error)
  }
})


module.exports = router