const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUI = require('swagger-ui-express')

const HttpError = require('./library/error/http-error')
const sequelize = require('./db/db')
const swaggerSpec = require('./v1/swagger')

//  Models
const Product = require('./models/product')
const User = require('./models/user')
const KindOfProduct = require('./models/kindOfProduct')
const Order = require('./models/order')
const OrderStatus = require('./models/orderStatus')
const OrderDetail = require('./models/orderDetail')

// Creating relation between trables
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

// Routers
const productRouter = require('./v1/routes/productRouter')
const userRouter = require('./v1/routes/userRouter')
const kindOfProductRouter = require('./v1/routes/kindOfProductRouter')
const orderStatusRouter = require('./v1/routes/orderStatusRouter')
const orderRouter = require('./v1/routes/orderRouter')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-
app.use('/api/v1/product', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/kindofproduct', kindOfProductRouter)
app.use('/api/v1/orderstatus', orderStatusRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/doc', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSend) {
    return next(error)
  }
  // res.status(error.code || 500).send({ status: error.code || 500, message: JSON.parse(error.message) || 'An unknown error occurred' })
  res.status(error.code || 500).send({ message: JSON.parse(error.message) || 'An unknown error occurred' })
})

sequelize
  .sync() // { force: true }
  .then(result => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch(err => {
    console.log(err)
  })
