const KindOfProduct = require('../models/kindOfProduct')
const { getErrorFromCoreOrDb } = require('../library/error/list-errors')
const HttpStatusCode = require('../library/error/status')
const HttpError = require('../library/error/http-error')
const { validationResult } = require('express-validator')

const { OK, CREATED, NOT_FOUND, BAD_REQUEST } = HttpStatusCode

const getAllKOProduct = (req, res, next) => {
  KindOfProduct.findAll()
    .then(kind => {
      res.status(OK).send({ data: kind })
    })
}

const getAKOProductByPk = (req, res, next) => {
  const { kindOfProductId } = req.params

  KindOfProduct.findByPk(kindOfProductId)
    .then(kind => {
      if (kind) {
        res.status(OK).send({ data: kind })
      } else {
        res.status(OK).send({ data: 'The record does not exist' })
      }
    })
}

const createAKOProduct = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { title, active } = req.body

  try {
    const [kind, created] = await KindOfProduct.findOrCreate({
      where: { title },
      defaults: {
        title,
        active,
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      }
    })

    if (created) {
      res.status(CREATED).send({ data: kind })
    } else {
      res.status(OK).send({ data: kind })
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const updateAKOProduct = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { id, title, active } = req.body

  try {
    const kind = await KindOfProduct.findByPk(id)
    if (kind === null) {
      res.status(NOT_FOUND).send({ data: 'The record does not exist' })
    } else {
      kind.title = title
      kind.active = active
      kind.updatedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      const obj = await kind.save()

      if (obj) {
        res.status(OK).send({ data: obj })
      }
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const deleteAKOProductByPk = async (req, res, next) => {
  const { kindOfProductId } = req.params

  try {
    const kind = await KindOfProduct.findByPk(kindOfProductId)
    if (kind) {
      kind.destroy()
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
  getAllKOProduct,
  getAKOProductByPk,
  createAKOProduct,
  updateAKOProduct,
  deleteAKOProductByPk
}
