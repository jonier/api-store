const { Sequelize } = require('sequelize')
const sequelize = require('../db/db')

const KindOfProduct = sequelize.define('kindOfProduct', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
})

module.exports = KindOfProduct
