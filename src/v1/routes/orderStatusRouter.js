const express = require('express')
const { check } = require('express-validator')

const orderStatusController = require('../../controllers/orderStatusController')

const router = express.Router()

router.get('/', orderStatusController.getAllOrderStatus)
router.get('/:orderStatusId', orderStatusController.getAOrderStatus)
router.post('/',
  [
    check('title').notEmpty().withMessage("The string can't be empty."),
    check('title').isLength({ min: 5 }).withMessage('The string can be less than 5 characters')
  ],
  orderStatusController.createAOrderStatus)
router.patch('/',
  [
    check('title').notEmpty().withMessage("The string can't be empty."),
    check('title').isLength({ min: 5 }).withMessage('The string can be less than 5 characters')
  ],
  orderStatusController.updateAOrderStatus)
router.delete('/:orderStatusId', orderStatusController.deleteOrderStatusById)

module.exports = router
