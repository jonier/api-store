const express = require('express')
const Product = require('../../controllers/productController')
const { check } = require('express-validator')

const routes = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: numeric
 *          description: The product id
 *        title:
 *          type: string
 *          description: The product name
 *        description:
 *          type: string
 *          description: the product description
 *        price:
 *          type: number
 *          description: the product price
 *        imageUrl:
 *          type: string
 *          description: the src of the image
 *        active:
 *          type: number
 *          description: by default the product will be active
 *        userId:
 *          type: number
 *          description: the user that registers the product
 *        kindOfProductId:
 *          type: number
 *          description: the kind of product
 *        createdAt:
 *          type: string
 *          description: the created date of product
 *        updateAt:
 *          type: string
 *          description: the updated date of product
 *      required:
 *        - title
 *        - description
 *        - price
 *        - imageUrl
 *        - userId
 *        - kindOfProductId
 *      example:
 *        id: 1
 *        title: Cien anos de soledad
 *        description: Libro de Gabriel Garcia Marquez
 *        price: 20
 *        imageUrl: /imagen/ejemplo
 *        userId: 1
 *        kindOfProductId: 1
 *        createdAt: 2024-06-12T19:17:53.000Z
 *        updatedAt: 2024-06-12T15:17:53.471Z
 */

/**
 * @swagger
 * /api/v1/products:
 *  post:
 *    summary: Create a new user
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: The Product has been created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/Product'
 *      201:
 *        description: The Product has been created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/Product'
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
 *        description: The user or kind of product does not exist
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  example: ["The user 16 does not exist", "The kind of product 44 does not exist"]
 */
routes.post('/',
  [
    check('title').notEmpty().withMessage("The string can't be empty"),
    check('title').isLength({ min: 3 }).withMessage('The string can be less than 3 characters'),
    check('description').notEmpty().withMessage("The string can't be empty"),
    check('description').isLength({ min: 8 }).withMessage('The string can be less than 8 characters'),
    check('price').notEmpty().withMessage("The string can't be empty"),
    check('imageUrl').notEmpty().withMessage("The string can't be empty"),
    check('userId').notEmpty().withMessage('The userId can not empty'),
    check('kindOfProductId').notEmpty().withMessage('The kindOfProductId can not empty')
  ], Product.postCreateAProduct)

/**
 * @swagger
 * /api/v1/products:
 *  patch:
 *    summary: Update a product
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: The product has been updated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/Product'
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
    check('title').notEmpty().withMessage("The string can't be empty"),
    check('title').isLength({ min: 3 }).withMessage('The string can be less than 3 characters'),
    check('description').notEmpty().withMessage("The string can't be empty"),
    check('description').isLength({ min: 8 }).withMessage('The string can be less than 8 characters'),
    check('price').notEmpty().withMessage("The string can't be empty"),
    check('imageUrl').notEmpty().withMessage("The string can't be empty"),
    check('userId').notEmpty().withMessage('The userId can not empty'),
    check('kindOfProductId').notEmpty().withMessage('The kindOfProductId can not empty')
  ], Product.patchUpdateAProduct)

/**
 * @swagger
 * /api/v1/products:
 *  get:
 *    summary: Return all products
 *    tags: [Product]
 *    responses:
 *      200:
 *        description: Successfully returned information about products
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Product'
 */
routes.get('/', Product.getAllProducts)

/**
 * @swagger
 * /api/v1/products/{productId}:
 *  get:
 *    summary: Return a product
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: productId
 *        schema:
 *          type: number
 *        required: true
 *        description: Product id
 *    responses:
 *      200:
 *        description: Get a product.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  $ref: '#/components/schemas/Product'
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
routes.get('/:productId', Product.getAProductByPk)

/**
 * @swagger
 * /api/v1/products/{productId}:
 *  delete:
 *    summary: Delete a product
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: productId
 *        schema:
 *          type: number
 *        required: true
 *        description: Product id
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

routes.delete('/:productId', Product.deleteAProductByPk)

module.exports = routes
