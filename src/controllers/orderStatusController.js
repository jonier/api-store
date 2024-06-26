const OrderStatus = require('../models/orderStatus')
const { getErrorFromCoreOrDb } = require('../library/error/list-errors')
const HttpStatusCode = require('../library/error/status')
const HttpError = require('../library/error/http-error')
const { validationResult } = require('express-validator')

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = HttpStatusCode

const getAllOrderStatus = (req, res, next) => {
  OrderStatus.findAll()
    .then(orders => {
      res.status(OK).send({ data: orders })
    })
}

const getAOrderStatus = (req, res, next) => {
  const orderStatusId = req.params.orderStatusId
  OrderStatus.findByPk(orderStatusId)
    .then(status => {
      if (status) {
        res.status(OK).send({ data: status })
      } else {
        res.status(NOT_FOUND).send({ data: 'The record does not exist' })
      }
    })
}

const createAOrderStatus = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { title, active } = req.body

  try {
    const [order, created] = await OrderStatus.findOrCreate({
      where: { title },
      defaults: {
        title,
        active,
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      }
    })

    if (created) {
      res.status(CREATED).send({ data: order })
    } else {
      res.status(OK).send({ data: order })
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const updateAOrderStatus = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { id, title, active } = req.body

  try {
    const order = await OrderStatus.findByPk(id)
    if (order === null) {
      res.status(NOT_FOUND).send({ data: 'The record does not exist' })
    } else {
      order.title = title
      order.active = active
      order.updatedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      const obj = await order.save()

      if (obj) {
        res.status(OK).send({ data: obj })
      }
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const deleteOrderStatusById = async (req, res, next) => {
  const orderStautsId = req.params.orderStatusId

  try {
    const order = await OrderStatus.findByPk(orderStautsId)
    if (order) {
      order.destroy()
      res.status(OK).send({ data: 'The record has been deleted' })
    } else {
      res.status(NOT_FOUND).send({ data: 'The record does not exist' })
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

module.exports = {
  getAllOrderStatus,
  getAOrderStatus,
  createAOrderStatus,
  updateAOrderStatus,
  deleteOrderStatusById
}
