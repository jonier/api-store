const User = require('../models/user')
const { getErrorFromCoreOrDb } = require('../library/error/list-errors')
const HttpStatusCode = require('../library/error/status')
const HttpError = require('../library/error/http-error')
const { validationResult } = require('express-validator')

const { OK, CREATED, NOT_FOUND, BAD_REQUEST } = HttpStatusCode

const getAllUsers = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.status(OK).send({ data: users })
    })
}

const getAUserByPk = (req, res, next) => {
  const userId = req.params.userId
  User.findByPk(userId)
    .then(user => {
      if (user) {
        res.status(OK).send({ data: user })
      } else {
        res.status(NOT_FOUND).send({ data: 'The record does not exist' })
      }
    })
}

const createAUser = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { email, userName, firstName, lastName, address, telephone, password, photo } = req.body

  try {
    const [user, created] = await User.findOrCreate({
      where: { email, userName, telephone },
      defaults: {
        email,
        userName,
        firstName,
        lastName,
        address,
        telephone,
        photo,
        password,
        createdAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
        updatedAt: new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      }
    })
    if (created) {
      res.status(CREATED).send({ data: user })
    } else {
      res.status(OK).send({ data: user })
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const updateAUser = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }

  const { id, email, userName, firstName, lastName, address, telephone, photo, active } = req.body

  try {
    const user = await User.findByPk(id)
    if (user === null) {
      res.status(NOT_FOUND).send({ data: 'The record does not exist' })
    } else {
      user.email = email
      user.userName = userName
      user.firstName = firstName
      user.lastName = lastName
      user.address = address
      user.telephone = telephone
      user.photo = photo
      user.active = active
      user.updatedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' })
      const obj = await user.save()

      if (obj) {
        res.status(OK).send({ data: obj })
      }
    }
  } catch (error) {
    const e = getErrorFromCoreOrDb(error.errors)
    next(new HttpError(e.msg, e.status))
  }
}

const deleteAUserByPk = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const user = await User.findByPk(userId)
    if (user) {
      user.destroy()
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
  getAllUsers,
  getAUserByPk,
  createAUser,
  updateAUser,
  deleteAUserByPk
}
