const express = require('express')
const { check } = require('express-validator')
const orderStatusController = require('../../controllers/orderStatusController')
const checkAuth = require('../../middleware/checkAuth')
const routes = express.Router()

routes.use(checkAuth)
/**
 * @swagger
 * components:
 *  schemas:
 *    OrderStatus:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: Status id
 *        title:
 *          type: string
 *          description: The status name
 *        active:
 *          type: number
 *          description: by default the status will be active
 *        createdAt:
 *          type: string
 *          description: the created date of status
 *        updateAt:
 *          type: string
 *          description: the updated date of status
 *      required:
 *        - title
 *      example:
 *        id: 1
 *        title: New
 *        active: true
 *        createAt: "2024-04-11T01:36:21.000Z"
 *        updateAt: "2024-04-11T01:36:21.000Z"
 *    createOrderStatus:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: The status name
 *      required:
 *        - title
 *      example:
 *        title: New
 *    updateOrderStatus:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: id of status
 *        title:
 *          type: string
 *          description: The status name
 *      required:
 *        - id
 *        - title
 *      example:
 *        id: 1
 *        title: New
 */

/**
 * @swagger
 * /api/v1/orderstatus:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Create a new status
 *    tags: [OrderStatus]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/createOrderStatus'
 *    responses:
 *      200:
 *        description: The status is already exists.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/OrderStatus'
 *      201:
 *        description: The status was created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/OrderStatus'
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
 *      401:
 *        description: The username or password is incorrect
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The user does not exist
 */
routes.post('/',
  [
    check('title').notEmpty().withMessage("The string can't be empty."),
    check('title').isLength({ min: 5 }).withMessage('The string can be less than 5 characters')
  ], orderStatusController.createAOrderStatus)

/**
 * @swagger
 * /api/v1/orderstatus:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: Update a status
 *    tags: [OrderStatus]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/updateOrderStatus'
 *    responses:
 *      200:
 *        description: The status has been updated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/OrderStatus'
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
 *      401:
 *        description: The username or password is incorrect
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The user does not exist
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
routes.patch('/',
  [
    check('title').notEmpty().withMessage("The string can't be empty."),
    check('title').isLength({ min: 5 }).withMessage('The string can be less than 5 characters')
  ], orderStatusController.updateAOrderStatus)

/**
 * @swagger
 * /api/v1/orderstatus:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Return all status
 *    tags: [OrderStatus]
 *    responses:
 *      200:
 *        description: Successfully returned information about status
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/OrderStatus'
 *      401:
 *        description: The username or password is incorrect
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The user does not exist
 */
routes.get('/', orderStatusController.getAllOrderStatus)

/**
 * @swagger
 * /api/v1/orderstatus/{orderStatusId}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Return a status
 *    tags: [OrderStatus]
 *    parameters:
 *      - in: path
 *        name: orderStatusId
 *        schema:
 *          type: number
 *        required: true
 *        description: Status id
 *    responses:
 *      200:
 *        description: Get a status.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/OrderStatus'
 *      401:
 *        description: The username or password is incorrect
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The user does not exist
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
routes.get('/:orderStatusId', orderStatusController.getAOrderStatus)

/**
 * @swagger
 * /api/v1/orderstatus/{orderStatusId}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: Delete a status
 *    tags: [OrderStatus]
 *    parameters:
 *      - in: path
 *        name: orderStatusId
 *        schema:
 *          type: number
 *        required: true
 *        description: Status id
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
 *      401:
 *        description: The username or password is incorrect
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: The user does not exist
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
routes.delete('/:orderStatusId', orderStatusController.deleteOrderStatusById)

module.exports = routes
