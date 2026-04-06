// Set env vars before any module is loaded
process.env.JWT_SECRET = 'test-secret'
process.env.NODE_ENV = 'test'

const request = require('supertest')
const jwt = require('jsonwebtoken')

// --- Mock all models so db.js never connects ---
jest.mock('../models/user', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  findOrCreate: jest.fn(),
  scope: jest.fn()
}))
jest.mock('../models/product', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}))
jest.mock('../models/kindOfProduct', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}))
jest.mock('../models/order', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  sequelize: { transaction: jest.fn() }
}))
jest.mock('../models/orderDetail', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn()
}))
jest.mock('../models/orderStatus', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}))

const User = require('../models/user')
const Product = require('../models/product')
const Order = require('../models/order')
const OrderDetail = require('../models/orderDetail')
const app = require('../app')

// A valid signed token for user id=1
const validToken = jwt.sign(
  { userId: 1, email: 'test@test.com' },
  'test-secret',
  { expiresIn: '1h' }
)

let mockTransaction

beforeEach(() => {
  jest.clearAllMocks()
  mockTransaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined)
  }
  Order.sequelize.transaction.mockResolvedValue(mockTransaction)
})

// ─── GET /api/v1/order ───────────────────────────────────────────────────────

describe('GET /api/v1/order', () => {
  test('401 — no Authorization header', async () => {
    const res = await request(app).get('/api/v1/order')
    expect(res.status).toBe(401)
  })

  test('401 — malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/order')
      .set('Authorization', 'Bearer invalid.token.here')
    expect(res.status).toBe(401)
  })

  test('200 — returns orders list for authenticated user', async () => {
    Order.findAll.mockResolvedValue([])

    const res = await request(app)
      .get('/api/v1/order')
      .set('Authorization', `Bearer ${validToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

// ─── GET /api/v1/order/:orderId ──────────────────────────────────────────────

describe('GET /api/v1/order/:orderId', () => {
  test('401 — no token', async () => {
    const res = await request(app).get('/api/v1/order/99')
    expect(res.status).toBe(401)
  })

  test('404 — order not found or belongs to another user', async () => {
    Order.findOne.mockResolvedValue(null)

    const res = await request(app)
      .get('/api/v1/order/99')
      .set('Authorization', `Bearer ${validToken}`)

    expect(res.status).toBe(404)
  })

  test('200 — returns the order', async () => {
    const fakeOrder = { id: 1, userId: 1, OrderDetails: [] }
    Order.findOne.mockResolvedValue(fakeOrder)

    const res = await request(app)
      .get('/api/v1/order/1')
      .set('Authorization', `Bearer ${validToken}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ id: 1, userId: 1 })
  })
})

// ─── POST /api/v1/order ──────────────────────────────────────────────────────

describe('POST /api/v1/order', () => {
  test('401 — no token', async () => {
    const res = await request(app)
      .post('/api/v1/order')
      .send({ productId: 1, numberOfItems: 2 })
    expect(res.status).toBe(401)
  })

  test('400 — missing productId', async () => {
    const res = await request(app)
      .post('/api/v1/order')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ numberOfItems: 2 })
    expect(res.status).toBe(400)
  })

  test('400 — missing numberOfItems', async () => {
    const res = await request(app)
      .post('/api/v1/order')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ productId: 1 })
    expect(res.status).toBe(400)
  })

  test('400 — product does not exist (FK validation)', async () => {
    User.findByPk.mockResolvedValue({ id: 1, email: 'test@test.com' })
    Product.findByPk.mockResolvedValue(null) // product not found

    const res = await request(app)
      .post('/api/v1/order')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ productId: 999, numberOfItems: 2 })

    expect(res.status).toBe(400)
    expect(mockTransaction.rollback).toHaveBeenCalled()
  })

  test('200 — creates order successfully', async () => {
    const fakeProduct = { id: 1, price: '25.00' }
    const fakeOrderInstance = {
      id: 10,
      userId: 1,
      orderStatusId: 1,
      subTotal: 0,
      total: 0,
      tps: '0',
      tvq: '0',
      save: jest.fn().mockResolvedValue(undefined)
    }
    const fakeDetail = {
      id: 1,
      orderId: 10,
      productId: 1,
      numberOfItems: 2,
      unitPrice: '25.00'
    }

    User.findByPk.mockResolvedValue({ id: 1, email: 'test@test.com' })
    Product.findByPk.mockResolvedValue(fakeProduct)
    Order.findOne.mockResolvedValue(null) // no existing open order
    Order.create.mockResolvedValue(fakeOrderInstance)
    OrderDetail.findOne.mockResolvedValue(null) // new line item
    OrderDetail.create.mockResolvedValue(fakeDetail)
    OrderDetail.findAll.mockResolvedValue([fakeDetail])

    const res = await request(app)
      .post('/api/v1/order')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ productId: 1, numberOfItems: 2 })

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('order')
    expect(res.body.data).toHaveProperty('orderDetail')
    expect(mockTransaction.commit).toHaveBeenCalled()
  })
})
