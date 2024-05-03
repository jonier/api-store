const Sequelize = require('sequelize')
const sequelize = require('../db/db')

const OrderDetail = sequelize.define('orderDetail', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  numberOfItems: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

module.exports = OrderDetail
