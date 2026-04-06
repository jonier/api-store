const HttpStatusCode = require('./status')
const { BAD_REQUEST } = HttpStatusCode

const getErrorFromCoreOrDb = (arr) => {
  let msg = 'An unknown error occurred'
  const status = BAD_REQUEST

  if (arr && arr.length > 0) {
    // origin = 'CORE' => Possibly some data is missing in the body
    // origin = 'DB'   => The error is caused by the Database when it is validating Primary and unique keys
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
        msg = arr[0].message || msg
        break
    }
  }

  return { status, msg }
}

module.exports = {
  getErrorFromCoreOrDb
}
