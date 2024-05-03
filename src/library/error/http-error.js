class HttpError extends Error {
  constructor (message, errorCode) {
    super(JSON.stringify(message)) // Add a "message" property
    this.code = errorCode // Adds a "code" property
  }
}

module.exports = HttpError
