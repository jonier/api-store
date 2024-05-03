const express = require('express')
const orderController = require('../../controllers/orderController')
const routers = express.Router()

routers
  .get('/', orderController.getAllOrders)
  .get('/:orderId', orderController.getAOrder)
  .post('/', orderController.createAOrder)
  .delete('/:orderId', (req, res, next) => {
    res.status(200).send({ status: 400, data: 'Delete una reservasion' })
  })
module.exports = routers
