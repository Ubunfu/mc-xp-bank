const rconServiceErrorEnum = require('../enums/rconServiceErrorEnum.js')
const depositHandlerErrorEnum = require('../enums/depositHandlerErrorEnum.js')

async function handle(err) {
    const mappedStatusCode = await mapStatusCode(err)
    return {
        statusCode: mappedStatusCode,
        body: {
            error: 'Failed to deposit XP',
            errorDetail: err.message
        }
    }
}

async function mapStatusCode(err) {
    if (err.message == depositHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE) {
        return '400'
    } else if (err.message == depositHandlerErrorEnum.INSUFFICIENT_XP) {
        return '403'
    } else if (err.message == rconServiceErrorEnum.NO_PLAYER_FOUND) {
        return '404'
    } else {
        return '500'
    }
}

exports.handle = handle