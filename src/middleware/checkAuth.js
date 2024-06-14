const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next()
    }

    const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer <Token>'
    if (!token) {
      res.status(401).send({ data: 'A token is needed!' })
    }

    // If the jwt.verify faild, it goes to the catch error
    const decodedToken = jwt.verify(token, 'portfolio21')
    // console.log('Vea pues Isabella: 28 ', decodedToken)
    // console.log('Now: ', new Date())
    // console.log('Token expired: ', new Date(decodedToken.exp * 1000))
    req.userData = { userId: decodedToken.userId, email: decodedToken.email }
    next()
  } catch (error) {
    res.status(401).send({ data: 'A token is needed, it may have expired!' })
  }
}
