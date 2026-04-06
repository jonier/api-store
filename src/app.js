const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express')

const HttpError = require('./library/error/http-error')
const { apiLimiter, docsLimiter } = require('./middleware/rateLimit')
const swaggerSpec = require('./v1/swagger')

const productRouter = require('./v1/routes/productRouter')
const userRouter = require('./v1/routes/userRouter')
const kindOfProductRouter = require('./v1/routes/kindOfProductRouter')
const orderStatusRouter = require('./v1/routes/orderStatusRouter')
const orderRouter = require('./v1/routes/orderRouter')

const app = express()

// Only log HTTP requests outside of tests to keep test output clean
if (process.env.NODE_ENV !== 'test') {
  const morgan = require('morgan')
  app.use(morgan('tiny'))
}

// Security headers (removes X-Powered-By, sets CSP, HSTS, etc.)
app.use(helmet())

// CORS — restrict to allowed origin(s) in production
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/v1/doc', docsLimiter, swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.use('/api/v1', apiLimiter)

app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/orderstatus', orderStatusRouter)
app.use('/api/v1/kindofproduct', kindOfProductRouter)
app.use('/api/v1/order', orderRouter)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }
  const message = typeof error.message === 'string' ? error.message : 'An unknown error occurred'
  res.status(error.code || 500).send({ message })
})

module.exports = app
