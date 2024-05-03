const HttpStatusCode = require('./status')
const { BAD_REQUEST } = HttpStatusCode

const getErrorFromCoreOrDb = (arr) => {
  let msg = ''
  const status = BAD_REQUEST

  if (arr) {
    // origin = 'CORE' => Possibly some data is missing in the body
    // origin = 'DB'   => The error is caused by the Database when it is validating Primary and unique keys
    console.log('Ingreso por aqui')
    const message = []
    switch (arr[0].origin) {
      case 'CORE':
        message.push('The following information is not present in the api body: ')
        for (const e in arr) {
          message.push(arr[e].path)
        }
        msg = JSON.stringify(message).replaceAll('"', '')
        msg = msg.replaceAll(' ,', ' ')
        msg = msg.replaceAll(',', ', ')
        msg = msg.replace('[', '')
        msg = msg.replace(']', '')

        break
      case 'ER_NO_REFERENCED_ROW_2':
        break
      case 'DB':
        break

      default:
        msg = arr[0].message
        break
    }
    // if (arr[0].origin === 'CORE') {
    //   const message = []
    //   message.push('The following information is not present in the api body: ')
    //   for (const e in arr) {
    //     message.push(arr[e].path)
    //   }
    //   msg = JSON.stringify(message).replaceAll('"', '')
    //   msg = msg.replaceAll(' ,', ' ')
    //   msg = msg.replaceAll(',', ', ')
    //   msg = msg.replace('[', '')
    //   msg = msg.replace(']', '')
    // } else {
    //   // error 400
    //   msg = arr[0].message
    // }
  }

  return { status, msg }
}

module.exports = {
  getErrorFromCoreOrDb
}
