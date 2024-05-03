const Order = require('../models/order')
const OrderDetail = require('../models/orderDetail')
const User = require('../models/user')
const Product = require('../models/product')
const HttpError = require('../library/error/http-error')
const { OK, BAD_REQUEST } = require('../library/error/status')
const { getErrorFromCoreOrDb } = require('../library/error/list-errors')

const getAllOrders = (req, res, next) => {
  Order.findAll()
    .then(orders => {
      res.status(OK).send({ status: OK, data: orders })
    })
}

const getAOrder = (req, res, next) => {
  const { orderId } = req.params
  Order.findByPk(orderId)
    .then(order => {
      res.status(OK).send({ status: OK, data: order })
    })
}

const createAOrder = async (req, res, next) => {
  const { userId, productId, numberOfItems, price } = req.body

  try {
    const validatingForeingKeys = []
    const user = await User.findByPk(userId)
    if (user === null) {
      validatingForeingKeys.push(`The user ${userId} does not exist`)
    }

    const product = await Product.findByPk(productId)
    if (product === null) {
      validatingForeingKeys.push(`The product ${productId} does not exist`)
    }

    if (validatingForeingKeys.length > 0) {
      return next(new HttpError(validatingForeingKeys, BAD_REQUEST))
    } else {
      const orderTem = await Order.findAll({
        where: {
          orderStatusId: 1
        }
      })
      let newOrden = null
      let addItem = null
      if (orderTem.length === 0) {
        newOrden = {
          userId,
          orderStatusId: 1,
          subTotal: price * numberOfItems,
          total: price * numberOfItems,
          tps: 0,
          tvq: 0,
          createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
        }
        const order = await Order.create(newOrden)
        // if (order !== null) {
        addItem = {
          orderId: order.id, // order.isSoftDeleted,
          numberOfItems,
          productId,
          unitPrice: price,
          createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
          updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' })

        }
        const resOrderDetail = await OrderDetail.create(addItem)
        console.log('Isabella es un amor: ', resOrderDetail)
        order.orderDetail = resOrderDetail
        // }
        res.status(OK).send({ status: OK, data: order })
        // crear nuevo registro
      } else {
        // adicionar producto al detalle de la orden
      }
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

module.exports = {
  getAllOrders,
  getAOrder,
  createAOrder
}
