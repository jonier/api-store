const Product = require('../models/product')
const User = require('../models/user')
const KOP = require('../models/kindOfProduct')

const { getErrorFromCoreOrDb } = require('../library/error/list-errors')
const HttpStatusCode = require('../library/error/status')
const HttpError = require('../library/error/http-error')
const { validationResult } = require('express-validator')

const { OK, CREATED, NOT_FOUND, BAD_REQUEST } = HttpStatusCode

const getAllProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.status(OK).send({ status: OK, data: products })
    })
}

const getAProductByPk = (req, res, next) => {
  const productId = req.params

  Product.findByPk(productId)
    .then(product => {
      if (product) {
        res.status(OK).send({ status: OK, data: { product } })
      } else {
        res.status(OK).send({ status: NOT_FOUND, data: 'The record does not exist' })
      }
    })
    .catch(error => {
      res.status(NOT_FOUND).send({ status: NOT_FOUND, data: error })
    })
}

const postCreateAProduct = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.send({ error: result })
  }

  const { title, description, price, imageUrl, userId, kindOfProductId } = req.body

  const validatingForeingKeys = []
  const user = await User.findByPk(userId)
  if (user === null) {
    validatingForeingKeys.push(`The user ${userId} does not exist`)
  }

  const kindOfProduct = await KOP.findByPk(kindOfProductId)
  if (kindOfProduct === null) {
    validatingForeingKeys.push(`The kind of product ${kindOfProductId} does not exist`)
  }

  if (validatingForeingKeys.length > 0) {
    next(new HttpError(validatingForeingKeys, BAD_REQUEST))
  }

  const newProduct = {
    title,
    description,
    price,
    imageUrl,
    userId,
    kindOfProductId,
    createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
    updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
  }

  try {
    Product.create(newProduct)
      .then(product => {
        res.status(CREATED).send({ status: CREATED, data: product })
      })
      .catch(error => {
        const e = getErrorFromCoreOrDb(error.errors)
        next(new HttpError(e.msg, e.status))
      })
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const patchUpdateAProduct = async (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.send({ error: result })
  }

  const { id, title, description, price, imageUrl, active, userId, kindOfProductId } = req.body

  const validatingForeingKeys = []
  const user = await User.findByPk(userId)
  if (user === null) {
    validatingForeingKeys.push(`The user ${userId} does not exist`)
  }

  const kindOfProduct = await KOP.findByPk(kindOfProductId)
  if (kindOfProduct === null) {
    validatingForeingKeys.push(`The kind of product ${kindOfProductId} does not exist`)
  }

  if (validatingForeingKeys.length > 0) {
    next(new HttpError(validatingForeingKeys, BAD_REQUEST))
  }

  try {
    const product = await Product.findByPk(id)
    if (product === null) {
      next(new HttpError('The record does not exist', NOT_FOUND))
    } else {
      product.title = title
      product.description = description
      product.price = price
      product.imageUrl = imageUrl
      product.active = active
      product.userId = userId
      product.kindOfProductId = kindOfProductId
      product.updatedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      const obj = await product.save()

      if (obj) {
        res.status(OK).send({ status: OK, data: obj })
      }
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const deleteAProductByPk = async (req, res, next) => {
  const { productId } = req.params

  try {
    const product = await Product.findByPk(productId)
    if (product) {
      product.destroy()
      next(new HttpError('The record has been deleted', OK))
    } else {
      next(new HttpError('The record does not exist', NOT_FOUND))
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

module.exports = {
  getAllProducts,
  getAProductByPk,
  postCreateAProduct,
  patchUpdateAProduct,
  deleteAProductByPk
}
