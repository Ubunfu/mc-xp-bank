const rconServiceErrorEnum = require('../enums/rconServiceErrorEnum.js')
const logger = require('../util/logger.js')

const SERVER_RCON_PASS = process.env.SERVER_RCON_PASS

async function queryXpLevels(rconClient, userId) {
    const cmdString = 'xp query ${userId} level'

    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()

    const levels = await parseQueryResp(serverResp)
    logger.log(`[rconService] User ${userId} has ${levels} levels`)
    return levels
}

async function queryXpPoints(rconClient, userId) {
    let cmdString = ''
    if (process.env.FEATURE_ENABLED_ESSENTIALS_X_PLUGIN === 'true'){
        cmdString = `xp show ${userId}`
    } else {
        cmdString = `xp query ${userId} points`
    }
    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()

    let points = 0
    if (process.env.FEATURE_ENABLED_ESSENTIALS_X_PLUGIN === 'true'){
        points = await parseEssXQueryPoints(serverResp)
    } else {
        points = await parseQueryResp(serverResp)
    }
    logger.log(`[rconService] User ${userId} has ${points} points`)
    return points
}

async function removeXpPoints(rconClient, userId, amount) {
    let cmdString = ''
    if (process.env.FEATURE_ENABLED_ESSENTIALS_X_PLUGIN === 'true'){
        cmdString = `xp give ${userId} -${amount}`
    } else {
        cmdString = `xp add ${userId} -${amount} points`
    }

    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()

    await parseRemoveXpPointsResp(serverResp)
}

async function addXpPoints(rconClient, userId, amount) {
    var cmdString = ''
    if (process.env.FEATURE_ENABLED_ESSENTIALS_X_PLUGIN === 'true'){
        cmdString = `xp give ${userId} ${amount}`
    } else {
        cmdString = `xp add ${userId} ${amount} points`
    }

    await rconClient.authenticate(SERVER_RCON_PASS)
    const serverResp = await rconClient.execute(cmdString)
    rconClient.disconnect()
    await parseAddXpPointsResp(serverResp)
}


async function parseQueryResp(serverResponse) {
    if (serverResponse === rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    } else if (serverResponse.includes('experience')) {
        return parseInt(serverResponse.split(' ')[2])
    } else {
        logger.log('[rconService] Unexpected server response: ' + serverResponse)
        throw Error(rconServiceErrorEnum.RCON_FAILED)
    }
}

async function parseEssXQueryPoints(serverResponse) {
    if (serverResponse === rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    }
    const regexExp = /has.{1,4}?([0-9]+)/

    if (regexExp.test(serverResponse)) {
        return parseInt(serverResponse.match(regexExp)[1])
    } else {
        logger.log('[rconService] Unexpected server response: ' + serverResponse)
        throw Error(rconServiceErrorEnum.RCON_FAILED)
    }
}

async function parseRemoveXpPointsResp(serverResponse) {
    if (serverResponse === rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    }
}

async function parseAddXpPointsResp(serverResponse) {
    if (serverResponse === rconServiceErrorEnum.NO_PLAYER_FOUND) {
        logger.log('[rconService] ' + serverResponse)
        throw Error(rconServiceErrorEnum.NO_PLAYER_FOUND)
    }
}


exports.queryXpLevels = queryXpLevels
exports.queryXpPoints = queryXpPoints
exports.removeXpPoints = removeXpPoints
exports.addXpPoints = addXpPoints