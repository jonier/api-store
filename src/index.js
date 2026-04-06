require('dotenv').config()
const app = require('./app')
const sequelize = require('./db/db')

// Models — imported here to register associations before sync
const Product = require('./models/product')
const User = require('./models/user')
const KindOfProduct = require('./models/kindOfProduct')
const Order = require('./models/order')
const OrderStatus = require('./models/orderStatus')
const OrderDetail = require('./models/orderDetail')

// Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)

Product.belongsTo(KindOfProduct, { constraints: true, onDelete: 'CASCADE' })
KindOfProduct.hasMany(Product)

Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Order)

Order.belongsTo(OrderStatus, { constraints: true, onDelete: 'CASCADE' })
OrderStatus.hasMany(Order)

OrderDetail.belongsTo(Order, { constraints: true, onDelete: 'CASCADE' })
Order.hasMany(OrderDetail)

OrderDetail.belongsTo(Product, { constraints: true, onDelete: 'CASCADE' })
Product.hasMany(OrderDetail)

const PORT = process.env.PORT || 3000

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch(err => {
    console.log(err)
  })
