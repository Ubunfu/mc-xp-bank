const withdrawHandlerErrorEnum = require('../enums/withdrawHandlerErrorEnum.js')
const dbServiceErrorEnum = require('../enums/dbServiceErrorEnum.js')
const rconServiceErrorEnum = require('../enums/rconServiceErrorEnum')

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
    if (err.message == withdrawHandlerErrorEnum.INVALID_REQUEST) {
        return '400'
    }
    if (err.message == withdrawHandlerErrorEnum.INSUFFICIENT_XP) {
        return '403'
    }
    if (err.message == dbServiceErrorEnum.ACCOUNT_NOT_FOUND) {
        return '404'
    }
    if (err.message == rconServiceErrorEnum.NO_PLAYER_FOUND) {
        return '404'
    }
    return '500'
}

exports.handle = handle