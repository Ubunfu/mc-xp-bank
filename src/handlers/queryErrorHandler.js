const rconServiceErrorEnum = require('../enums/rconServiceErrorEnum.js')
const logger = require('../util/logger.js')

async function handle(err) {
    const mappedStatusCode = await mapStatusCode(err)
    return {
        statusCode: mappedStatusCode,
        body: {
            error: 'Failed to query player XP',
            errorDetail: err.message
        }
    }
}

async function mapStatusCode(err) {
    if (err.message == rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log(`[queryErrorHandler] Mapping error '${err.message}' to HTTP 404`)
        return '404'
    } else {
        logger.log(`[queryErrorHandler] Mapping error '${err.message}' to HTTP 500`)
        return '500'
    }
}

exports.handle = handle