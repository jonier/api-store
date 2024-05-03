const express = require('express')
const KindOfProduct = require('../../controllers/kindOfProductController')
const { check } = require('express-validator')
const routes = express.Router()

routes.get('/', KindOfProduct.getAllKOProduct)
routes.get('/:kindOfProductId', KindOfProduct.getAKOProductByPk)


/**
 * @swagger
 * components:
 *  schemas:
 *    KindOfProduct:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: The kind of product name
 *        active:
 *          type: number
 *          description: by default the kind of product will be active
 *      required:
 *        - title
 *      example:
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
 *            $ref: '#/components/schemas/KindOfProduct'
 *    responses:
 *      201:
 *        description: If status = 200 the kind of product is already exists, but if status = 201 the kind of product was created.
 *        content:
 *          application/json:
 *            example:
 *                status: 201
 *                data:
 *                  active: true
 *                  id: 1
 *                  title: Desserts
 *                  createdAt: 2024-04-30T22:34:29.000Z
 *                  updateAt: 2024-04-30T18:34:29.214Z
 */
routes.post('/',
    [
      check('title').notEmpty().withMessage("The string can't be empty")
    ], KindOfProduct.createAKOProduct)
routes.patch('/',
    [
      check('title').notEmpty().withMessage("The string can't be empty")
    ], KindOfProduct.updateAKOProduct)
routes.delete('/:kindOfProductId', KindOfProduct.deleteAKOProductByPk)

module.exports = routes
