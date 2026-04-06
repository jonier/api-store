// Set env vars before any module is loaded
process.env.JWT_SECRET = 'test-secret'
process.env.NODE_ENV = 'test'

const request = require('supertest')

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
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  hashSync: jest.fn(),
  genSaltSync: jest.fn().mockReturnValue('salt')
}))

const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')

describe('POST /api/v1/users/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('200 — returns token on valid credentials', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@test.com',
      userName: 'testuser',
      address: '123 Main St',
      password: '$2b$10$hashedpassword'
    }
    User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(fakeUser) })
    bcrypt.compare.mockResolvedValue(true)

    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ identity: 'test@test.com', password: '12345678' })

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data).toHaveProperty('email', 'test@test.com')
  })

  test('401 — wrong password returns Invalid credentials', async () => {
    const fakeUser = {
      id: 1,
      email: 'test@test.com',
      password: '$2b$10$hashedpassword'
    }
    User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(fakeUser) })
    bcrypt.compare.mockResolvedValue(false)

    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ identity: 'test@test.com', password: 'wrong' })

    expect(res.status).toBe(401)
    expect(res.body.data).toBe('Invalid credentials')
  })

  test('401 — user not found returns Invalid credentials', async () => {
    User.scope.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) })

    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ identity: 'nobody@test.com', password: '12345678' })

    expect(res.status).toBe(401)
    expect(res.body.data).toBe('Invalid credentials')
  })
})
