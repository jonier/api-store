const HttpStatusCode = require('./status')
class BaseError extends Error {
  name
  httpCode
  isOperational

  constructor (name, httpCode, isOperational, description) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

// free to extend the BaseError
class APIError extends BaseError {
  constructor (name, httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true, description = 'internal server error') {
    super(name, httpCode, isOperational, description)
  }
}

class HTTP400Error extends BaseError {
  constructor (description = 'bad request') {
    super('NOT FOUND', HttpStatusCode.BAD_REQUEST, true, description)
  }
}

module.exports = BaseError
module.exports = APIError
module.exports = HTTP400Error
