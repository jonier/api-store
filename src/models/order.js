const Sequelize = require('sequelize')
const sequelize = require('../db/db')

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  tps: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  tvq: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  subTotal: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  total: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

module.exports = Order
