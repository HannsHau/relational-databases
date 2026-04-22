const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

//select author, sum(1) as articles, sum(likes) as likes from blogs group by author;

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author', 
      [sequelize.fn('COUNT', 1), 'articles'], 
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']],
    group: 'author',
    order: [['likes', 'DESC']]
  })
  res.json(blogs)
})

module.exports = router