const swaggerJsDoc = require('swagger-jsdoc')
const path = require('path')

// Metadata info
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API Store',
      version: '1.0'
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'API Server'
      }
    ]
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`]
}

// Docs and JSON Format
const swaggerSpec = swaggerJsDoc(options)

module.exports = swaggerSpec
// app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
