const { rateLimit, ipKeyGenerator } = require('express-rate-limit')

const buildKey = (req) => {
  if (process.env.NODE_ENV === 'test' && req.headers['x-test-key']) {
    return req.headers['x-test-key']
  }

  return ipKeyGenerator(req.ip)
}

const createLimiter = ({ windowMs, max, message, skipSuccessfulRequests = false }) => rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests,
  keyGenerator: buildKey,
  handler: (req, res) => {
    res.status(429).send({ data: message })
  }
})

const apiLimiter = createLimiter({
  windowMs: Number(process.env.API_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.API_MAX_REQUESTS || 200),
  message: 'Too many API requests. Please try again later.'
})

const docsLimiter = createLimiter({
  windowMs: Number(process.env.DOCS_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.DOCS_MAX_REQUESTS || 20),
  message: 'Too many documentation requests. Please try again later.'
})

const loginLimiter = createLimiter({
  windowMs: Number(process.env.LOGIN_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
  message: 'Too many login attempts. Please try again later.',
  skipSuccessfulRequests: true
})

const signupLimiter = createLimiter({
  windowMs: Number(process.env.SIGNUP_WINDOW_MS || 60 * 60 * 1000),
  max: Number(process.env.SIGNUP_MAX_ATTEMPTS || 3),
  message: 'Too many signup attempts. Please try again later.'
})

const writeLimiter = createLimiter({
  windowMs: Number(process.env.WRITE_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.WRITE_MAX_REQUESTS || 30),
  message: 'Too many write requests. Please try again later.'
})

module.exports = {
  apiLimiter,
  docsLimiter,
  loginLimiter,
  signupLimiter,
  writeLimiter
}