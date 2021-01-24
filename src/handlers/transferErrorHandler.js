const transferHandlerErrorEnum = require('../enums/transferHandlerErrorEnum.js')
const dbServiceErrorEnum = require('../enums/dbServiceErrorEnum.js')

async function handle(err) {
    const mappedStatusCode = await mapStatusCode(err)
    return {
        statusCode: mappedStatusCode,
        body: {
            error: 'Failed to withdraw xp',
            errorDetail: err.message
        }
    }
}

async function mapStatusCode(err) {
    if (err.message == transferHandlerErrorEnum.INVALID_REQUEST) {
        return '400'
    }
    if (err.message == transferHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE) {
        return '400'
    }
    if (err.message == transferHandlerErrorEnum.INSUFFICIENT_XP) {
        return '403'
    }
    if (err.message == dbServiceErrorEnum.ACCOUNT_NOT_FOUND) {
        return '404'
    }
    return '500'
}

exports.handle = handle