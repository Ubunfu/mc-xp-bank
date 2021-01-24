const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')
const balanceHandlerErrorEnum = require('../../src/enums/balanceHandlerErrorEnum.js')

async function handle(err) {
    const mappedStatusCode = await mapStatusCode(err)
    return {
        statusCode: mappedStatusCode,
        body: {
            error: 'Failed to check xp account balance',
            errorDetail: err.message
        }
    }
}

async function mapStatusCode(err) {
    if (err.message == dbServiceErrorEnum.ACCOUNT_NOT_FOUND) {
        return '404'
    } else if (err.message == balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID) {
        return '400'
    } else {
        return '500'
    }
}

exports.handle = handle