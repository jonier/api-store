const express = require('express')
const { check } = require('express-validator')
const User = require('../../controllers/userController')

const routes = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: User id
 *        email:
 *          type: string
 *          description: The user email
 *        userName:
 *          type: string
 *          description: the user userName
 *        firstName:
 *          type: string
 *          description: the user first name
 *        lastName:
 *          type: string
 *          description: the user last name
 *        photo:
 *          type: string
 *          description: the src of the user image
 *        address:
 *          type: string
 *          description: the user address
 *        telephone:
 *          type: string
 *          description: the user telephone
 *        password:
 *          type: string
 *          description: the user password
 *        active:
 *          type: number
 *          description: by default the user will be active
 *        createdAt:
 *          type: string
 *          description: the created date of user
 *        updateAt:
 *          type: string
 *          description: the updated date of user
 *      required:
 *        - email
 *        - userName
 *        - firstName
 *        - lastName
 *        - address
 *        - telephone
 *        - password
 *      example:
 *        id: 1
 *        email: jonierm.edu@gmail.com
 *        userName: jonierm.edu
 *        firstName: Jonier
 *        lastName: Murillo
 *        photo: null
 *        address: 16 rue Maurice Saint-Constant, J5A 1T8, QC, Canada
 *        telephone: 1234567890
 *        password: 12345678
 *        active: true
 *        createAt: "2024-04-11T01:36:21.000Z"
 *        updateAt: "2024-04-11T01:36:21.000Z"
 *    error:
 *      type: object
 *      properties:
 *        type:
 *          type: string
 *          description: field
 *        msg:
 *          type: string
 *          description: Error description
 *        path:
 *          type: string
 *          description: Path
 *        location:
 *          type: string
 *          description: Body
 *      example:
 *        type: field
 *        msg: The string can't be empty
 *        path: userName
 *        location: Body 
 */

/**
 * @swagger
 * /api/v1/users:
 *  post:
 *    summary: Create a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user is already exists.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *      201:
 *        description: The user was created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *      400:
 *        description: The server cannot or will not process the request due to something that is perceived to be a client error. Errors are collected by Sequelize.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: object
 *                  properties:
 *                    errors:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/error'
 */
routes.post('/', [
  check('email').normalizeEmail() // jonierm@gmail.com => jonierm@gmail.com
    .isEmail().withMessage('Not a valid e-mail address'),
  check('userName').notEmpty().withMessage("The string can't be empty"),
  check('userName').isLength({ min: 8 }).withMessage('The string can be less than 8 characters'),
  check('firstName').notEmpty().withMessage("The string can't be empty"),
  check('lastName').notEmpty().withMessage("The string can't be empty"),
  check('address').notEmpty().withMessage("The string can't be empty"),
  check('telephone').notEmpty().withMessage("The string can't be empty")
], User.createAUser)

/**
 * @swagger
 * /api/v1/users:
 *  patch:
 *    summary: Update a user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user has been updated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *      400:
 *        description: The server cannot or will not process the request due to something that is perceived to be a client error. Errors are collected by Sequelize.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: object
 *                  properties:
 *                    errors:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/error'
 */
routes.patch('/', [
  check('id').notEmpty().withMessage('The id field is missing'),
  check('email').normalizeEmail() // jonierm@gmail.com => jonierm@gmail.com
    .isEmail().withMessage('Not a valid e-mail address'),
  check('userName').notEmpty().withMessage("The userName can't be empty"),
  check('userName').isLength({ min: 8 }).withMessage('The userName can be less than 8 characters'),
  check('firstName').notEmpty().withMessage("The firstName can't be empty"),
  check('lastName').notEmpty().withMessage("The lastName can't be empty"),
  check('address').notEmpty().withMessage("The address can't be empty"),
  check('telephone').notEmpty().withMessage("The telephone can't be empty")
], User.updateAUser)

/**
 * @swagger
 * /api/v1/users:
 *  get:
 *    summary: Return all users
 *    tags: [User]
 *    responses:
 *      200:
 *        description: Successfully returned information about users
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 */
routes.get('/', User.getAllUsers)

/**
 * @swagger
 * /api/v1/users/{userId}:
 *  get:
 *    summary: Return a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: number
 *        required: true
 *        description: User id
 *    responses:
 *      200:
 *        description: Get a user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *      404:
 *        description: The record does not exist
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The record does not exist
 */
routes.get('/:userId', User.getAUserByPk)

/**
 * @swagger
 * /api/v1/users/{userId}:
 *  delete:
 *    summary: Delete a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: number
 *        required: true
 *        description: User id
 *    responses:
 *      200:
 *        description: The record has been deleted.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The record has been deleted
 *      404:
 *        description: The record does not exist.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The record does not exist
 */
routes.delete('/:userId', User.deleteAUserByPk)

module.exports = routes
