const express = require('express')
const { check } = require('express-validator')
const orderController = require('../../controllers/orderController')
const checkAuth = require('../../middleware/checkAuth')
const { writeLimiter } = require('../../middleware/rateLimit')
const routers = express.Router()

routers.use(checkAuth)

routers
  .get('/', orderController.getAllOrders)
  .get('/:orderId', orderController.getAOrder)
  .post('/', writeLimiter, [
    check('productId').notEmpty().withMessage('The productId can not be empty'),
    check('productId').isInt({ min: 1 }).withMessage('The productId must be greater than 0'),
    check('numberOfItems').notEmpty().withMessage('The numberOfItems can not be empty'),
    check('numberOfItems').isInt({ min: 1 }).withMessage('The numberOfItems must be greater than 0')
  ], orderController.createAOrder)
  .delete('/:orderId', writeLimiter, (req, res, next) => {
    res.status(501).send({ data: 'Delete order endpoint is not implemented yet' })
  })
module.exports = routers
