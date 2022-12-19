const rconService = require('../service/rconService.js')
const xpCalculatorService = require('../service/xpCalculatorService.js')
const { default: RCON } = require('rcon-srcds')
const logger = require('../util/logger.js')

const rconClient = new RCON({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_RCON_PORT,
    timeout: parseInt(process.env.SERVER_RCON_TIMEOUT_MS)
});

async function handle(event) {

    const userId = event.queryStringParameters.userId
    const totalXpPoints = await getPlayerXp(userId)
    
    return {
        userId: userId,
        amount: totalXpPoints
    }
}

async function getPlayerXp(userId) {
    logger.log(`[queryHandler] Querying XP for ${userId}`)
    if (process.env.FEATURE_ENABLED_ESSENTIALS_X_PLUGIN === 'true') {
        return await rconService.queryXpPoints(rconClient, userId)
    }
    const playerLevels = await rconService.queryXpLevels(rconClient, userId)
    const playerPoints = await rconService.queryXpPoints(rconClient, userId)
    return await xpCalculatorService.calculatePoints(playerLevels, playerPoints)
}

exports.handle = handle;
exports.getPlayerXp = getPlayerXp
