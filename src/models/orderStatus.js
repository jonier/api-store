const Sequelize = require('sequelize')
const sequelize = require('../db/db')

/**
 * OrderStatus is the state of the order made by the user.
 * IN PROGRESS:   creating a order by the user.
 * ACCEPTED:      sending the merchandises by the store.
 * CANCELLED:     withdrawing the order by the user.
 * @author: Jonier Murillo
 */

const OrderStatus = sequelize.define('orderStatus', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
})

module.exports = OrderStatus
