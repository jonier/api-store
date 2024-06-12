const express = require('express')
const KindOfProduct = require('../../controllers/kindOfProductController')
const { check } = require('express-validator')
const routes = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    KindOfProduct:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: Kind of Product id
 *        title:
 *          type: string
 *          description: The kind of product name
 *        active:
 *          type: number
 *          description: by default the kind of product will be active
 *        createdAt:
 *          type: string
 *          description: the created date of kind of product
 *        updateAt:
 *          type: string
 *          description: the updated date of kind of product
 *      required:
 *        - title
 *      example:
 *        id: 1
 *        title: Desserts
 *        active: true
 *        createAt: "2024-04-11T01:36:21.000Z"
 *        updateAt: "2024-04-11T01:36:21.000Z"
 *    createKindOfProduct:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: The kind of product name
 *      required:
 *        - title
 *      example:
 *        title: Desserts
 *    updateKindOfProduct:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: id of kind of product
 *        title:
 *          type: string
 *          description: The kind of product name
 *      required:
 *        - id
 *        - title
 *      example:
 *        id: 1
 *        title: Desserts
 */

/**
 * @swagger
 * /api/v1/kindofproduct:
 *  post:
 *    summary: Create a new kind of product
 *    tags: [KindOfProduct]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/createKindOfProduct'
 *    responses:
 *      200:
 *        description: The kind of product is already exists.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/KindOfProduct'
 *      201:
 *        description: The kind of proeuct was created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/KindOfProduct'
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
routes.post('/',
  [
    check('title').notEmpty().withMessage("The string can't be empty")
  ], KindOfProduct.createAKOProduct)

/**
 * @swagger
 * /api/v1/kindofproduct:
 *  patch:
 *    summary: Update a kind of product
 *    tags: [KindOfProduct]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/updateKindOfProduct'
 *    responses:
 *      200:
 *        description: The kind of product has been updated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/KindOfProduct'
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
    check('id').notEmpty().withMessage("The string can't be empty"),
    check('title').notEmpty().withMessage("The string can't be empty")
  ], KindOfProduct.updateAKOProduct)

/**
 * @swagger
 * /api/v1/kindofproduct:
 *  get:
 *    summary: Return all kind of product
 *    tags: [KindOfProduct]
 *    responses:
 *      200:
 *        description: Successfully returned information about kind of product
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/KindOfProduct'
 */
routes.get('/', KindOfProduct.getAllKOProduct)

/**
 * @swagger
 * /api/v1/kindofproduct/{kindOfProductId}:
 *  get:
 *    summary: Return a kind of product
 *    tags: [KindOfProduct]
 *    parameters:
 *      - in: path
 *        name: kindOfProductId
 *        schema:
 *          type: number
 *        required: true
 *        description: kind of product id
 *    responses:
 *      200:
 *        description: Get a kind of product.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/KindOfProduct'
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
routes.get('/:kindOfProductId', KindOfProduct.getAKOProductByPk)

/**
 * @swagger
 * /api/v1/kindofproduct/{kindOfProductId}:
 *  delete:
 *    summary: Delete a kind of product
 *    tags: [KindOfProduct]
 *    parameters:
 *      - in: path
 *        name: kindOfProductId
 *        schema:
 *          type: number
 *        required: true
 *        description: kind of product id
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
routes.delete('/:kindOfProductId', KindOfProduct.deleteAKOProductByPk)

module.exports = routes
