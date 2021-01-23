const rconServiceErrorEnum = require('../enums/rconServiceErrorEnum.js')
const logger = require('../util/logger.js')

const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS

async function queryXpLevels(rconClient, userId) {
    const cmdString = `xp query ${userId} levels`
    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()
    const levels = await parseQueryResp(serverResp)
    logger.log(`[rconService] User ${userId} has ${levels} levels`)
    return levels
}

async function queryXpPoints(rconClient, userId) {
    const cmdString = `xp query ${userId} points`
    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()
    const points = await parseQueryResp(serverResp)
    logger.log(`[rconService] User ${userId} has ${points} points`)
    return points
}

async function parseQueryResp(serverResponse) {
    if (serverResponse == rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    } else if (serverResponse.includes('experience')) {
        return parseInt(serverResponse.split(' ')[2])
    } else {
        logger.log('[rconService] Unexpected server response: ' + serverResponse)
        throw Error(rconServiceErrorEnum.RCON_FAILED)
    }
}

exports.queryXpLevels = queryXpLevels
exports.queryXpPoints = queryXpPoints