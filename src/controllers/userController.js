const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { getErrorFromCoreOrDb } = require('../library/error/list-errors')
const HttpStatusCode = require('../library/error/status')
const HttpError = require('../library/error/http-error')
const { validationResult } = require('express-validator')

const { AUTH_IS_NO_OK, OK, CREATED, NOT_FOUND, BAD_REQUEST } = HttpStatusCode

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

// const saveImageChange = async (file) => {
//   const imgData = new FormData()
//   imgData.append('photo', file)
//   try {
//     const response = await fetch('http://localhost:3006/upload', {
//       method: 'POST',
//       body: imgData
//     })

//     if (!response.ok) {
//       throw new Error('Error al subir el archivo.')
//     }

//     const data = await response.json()
//     return data.filePath

//     // Mostrar una vista previa de la imagen subida
//     // preview.innerHTML = `<img src="${data.filePath}" alt="Imagen subida" style="max-width: 300px; margin-top: 20px;" />`;
//   } catch (err) {
//     console.log(err.message)
//   }
// }

const createAUser = async (req, res, next) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).send({ error: result })
  }
  const photo = req.file.path

  if (!photo) {
    // return res.status(400).json({ message: 'Photo is required' })
    return res.status(BAD_REQUEST).send({ error: 'Photo is required' })
  }

  const { email, userName, firstName, lastName, address, telephone, password } = req.body
  // const photo = await saveImageChange(imagePreview)
  // console.log('req.body', photo)

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

const postLogin = async (req, res, next) => {
  let { identity, password } = req.body

  if (typeof password === 'number') {
    password = password.toString()
  }

  const resUser = await User.findAll({ where: { [Op.or]: [{ email: identity }, { userName: identity }] } })
  if (resUser.length === 1) {
    const user = resUser[0]

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (isValidPassword) {
      let token

      try {
        token = jwt.sign(
          { userId: user.id, email: user.email },
          'portfolio21',
          { expiresIn: '1h' }
        )
      } catch (error) {
        res.status(BAD_REQUEST).send({ data: error })
      }

      res.status(OK).send({
        data: {
          id: user.id,
          name: user.name,
          userName: user.userName,
          address: user.address,
          email: user.email,
          token
        }
      })
    } else {
      res.status(AUTH_IS_NO_OK).send({ data: 'The password is wrong' })
    }
  } else {
    res.status(AUTH_IS_NO_OK).send({ data: 'User does not exist' })
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
  postLogin,
  updateAUser,
  deleteAUserByPk
}
