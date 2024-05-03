const express = require('express')
const Product = require('../../controllers/productController')
const { check } = require('express-validator')

const routes = express.Router()

routes.get('/', Product.getAllProducts)

routes.get('/:productId', Product.getAProductByPk)

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
 *        title: Cien anos de soledad
 *        description: Libro de Gabriel Garcia Marquez
 *        price: 20
 *        imageUrl: /imagen/ejemplo
 *        userId: 1
 *        kindOfProductId: 1
 */

/**
 * @swagger
 * /api/v1/product:
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
 *      201:
 *        description: The Product has been created.
 *        content:
 *          application/json:
 *            example:
 *              status: 201
 *              data:
 *                active: true
 *                id: 1
 *                title: Cien anos de soledad
 *                description: Libro de Gabriel Garcia Marquez
 *                price: 20
 *                imageUrl: /imagen/ejemplo
 *                userId: 1
 *                kindOfProductId: 1
 *                createdAt: 2024-04-30T22:34:29.000Z
 *                updateAt: 2024-04-30T18:34:29.214Z
 *      200:
 *        description: The product already exists.
 *        content:
 *          application/json:
 *            example:
 *              status: 200
 *              data:
 *                active: true
 *                id: 1
 *                title: Cien anos de soledad
 *                description: Libro de Gabriel Garcia Marquez
 *                price: 20
 *                imageUrl: /imagen/ejemplo
 *                userId: 1
 *                kindOfProductId: 1
 *                createdAt: 2024-04-30T22:34:29.000Z
 *                updateAt: 2024-04-30T18:34:29.214Z
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

routes.delete('/:productId', Product.deleteAProductByPk)

module.exports = routes
