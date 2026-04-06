const express = require('express')
const orderController = require('../../controllers/orderController')
const checkAuth = require('../../middleware/checkAuth')
const routers = express.Router()

routers.use(checkAuth)

routers
  .get('/', orderController.getAllOrders)
  .get('/:orderId', orderController.getAOrder)
  .post('/', orderController.createAOrder)
  .delete('/:orderId', (req, res, next) => {
    res.status(501).send({ data: 'Delete order endpoint is not implemented yet' })
  })
module.exports = routers
