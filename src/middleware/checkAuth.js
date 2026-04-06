const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next()
    }

    const authHeader = req.headers.authorization || ''
    const [schema, token] = authHeader.split(' ')

    if (schema !== 'Bearer' || !token) {
      return res.status(401).send({ data: 'A valid bearer token is needed!' })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return res.status(500).send({ data: 'Server configuration error.' })
    }

    // Authorization: 'Bearer <Token>'
    if (!token) {
      return res.status(401).send({ data: 'A token is needed!' })
    }

    // If the jwt.verify faild, it goes to the catch error
    const decodedToken = jwt.verify(token, jwtSecret)
    // console.log('Vea pues Isabella: 28 ', decodedToken)
    // console.log('Now: ', new Date())
    // console.log('Token expired: ', new Date(decodedToken.exp * 1000))
    req.userData = { userId: decodedToken.userId, email: decodedToken.email }
    next()
  } catch (error) {
    res.status(401).send({ data: 'A token is needed, it may have expired!' })
  }
}
