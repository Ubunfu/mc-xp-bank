const rconServiceErrorEnum = require('../enums/rconServiceErrorEnum.js')
const logger = require('../util/logger.js')

const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS
const ESSENTIALS_X = process.env.ESSENTIALS_X

async function queryXpLevels(rconClient, userId) {
    if (ESSENTIALS_X){
        const cmdString = `xp show ${userId}`
    } else {
        const cmdString = `xp query ${userId} levels`
    }

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

async function removeXpPoints(rconClient, userId, amount) {
    const cmdString = `xp add ${userId} -${amount} points`
    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()
    await parseRemoveXpPointsResp(serverResp)
}

async function addXpPoints(rconClient, userId, amount) {
    const cmdString = `xp add ${userId} ${amount} points`
    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()
    await parseAddXpPointsResp(serverResp)
}

async function parseQueryResp(serverResponse) {
    if (ESSENTIALS_X){
        // Query using regex. Return kk
    }
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

async function parseRemoveXpPointsResp(serverResponse) {
    if (serverResponse == rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    }
}

async function parseAddXpPointsResp(serverResponse) {
    if (serverResponse == rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    }
}

exports.queryXpLevels = queryXpLevels
exports.queryXpPoints = queryXpPoints
exports.removeXpPoints = removeXpPoints
exports.addXpPoints = addXpPoints