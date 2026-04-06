const Order = require('../models/order')
const OrderDetail = require('../models/orderDetail')
const User = require('../models/user')
const Product = require('../models/product')
const HttpError = require('../library/error/http-error')
const { validationResult } = require('express-validator')
const { OK, BAD_REQUEST, NOT_FOUND, AUTH_IS_NO_OK } = require('../library/error/status')
const { getErrorFromCoreOrDb } = require('../library/error/list-errors')

const getAllOrders = (req, res, next) => {
  Order.findAll({
    where: { userId: req.userData.userId },
    include: [OrderDetail]
  })
    .then(orders => {
      res.status(OK).send({ status: OK, data: orders })
    })
    .catch(error => {
      next(new HttpError(error.message, BAD_REQUEST))
    })
}

const getAOrder = (req, res, next) => {
  const { orderId } = req.params
  Order.findOne({
    where: { id: orderId, userId: req.userData.userId },
    include: [OrderDetail]
  })
    .then(order => {
      if (!order) {
        return res.status(NOT_FOUND).send({ status: NOT_FOUND, data: 'The record does not exist' })
      }

      res.status(OK).send({ status: OK, data: order })
    })
    .catch(error => {
      next(new HttpError(error.message, BAD_REQUEST))
    })
}

const createAOrder = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { productId, numberOfItems } = req.body
  const quantity = Number(numberOfItems)
  const userId = req.userData && req.userData.userId

  if (!userId) {
    return res.status(AUTH_IS_NO_OK).send({ data: 'Invalid credentials' })
  }

  const transaction = await Order.sequelize.transaction()

  try {
    const validatingForeingKeys = []
    const user = await User.findByPk(userId, { transaction })
    if (user === null) {
      validatingForeingKeys.push(`The user ${userId} does not exist`)
    }

    const product = await Product.findByPk(productId, { transaction })
    if (product === null) {
      validatingForeingKeys.push(`The product ${productId} does not exist`)
    }

    if (validatingForeingKeys.length > 0) {
      await transaction.rollback()
      return next(new HttpError(validatingForeingKeys, BAD_REQUEST))
    } else {
      const orderTem = await Order.findOne({
        where: {
          userId,
          orderStatusId: 1
        },
        transaction
      })

      let order = orderTem
      if (!order) {
        order = await Order.create({
          userId,
          orderStatusId: 1,
          subTotal: 0,
          total: 0,
          tps: 0,
          tvq: 0
        }, {
          transaction
        })
      }

      const unitPrice = Number(product.price)
      let addItem = await OrderDetail.findOne({
        where: {
          orderId: order.id,
          productId
        },
        transaction
      })

      if (addItem) {
        addItem.numberOfItems += quantity
        addItem.unitPrice = unitPrice
        await addItem.save({ transaction })
      } else {
        addItem = await OrderDetail.create({
          orderId: order.id,
          numberOfItems: quantity,
          productId,
          unitPrice
        }, {
          transaction
        })
      }

      const details = await OrderDetail.findAll({
        where: { orderId: order.id },
        transaction
      })

      const subTotal = details.reduce((acc, item) => {
        return acc + (Number(item.numberOfItems) * Number(item.unitPrice))
      }, 0)

      order.subTotal = subTotal
      order.total = subTotal + Number(order.tps) + Number(order.tvq)
      await order.save({ transaction })

      await transaction.commit()

      res.status(OK).send({
        status: OK,
        data: {
          order,
          orderDetail: addItem
        }
      })
    }
  } catch (error) {
    await transaction.rollback()

    if (error instanceof HttpError) {
      return next(error)
    }

    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

module.exports = {
  getAllOrders,
  getAOrder,
  createAOrder
}
