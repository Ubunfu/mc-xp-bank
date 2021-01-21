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
    logger.log(`[queryHandler] Querying XP for ${userId}`)

    const playerLevels = await rconService.queryXpLevels(rconClient, userId)
    const playerPoints = await rconService.queryXpPoints(rconClient, userId)
    const totalXpPoints = await xpCalculatorService.calculatePoints(playerLevels, playerPoints)
    
    return {
        userId: userId,
        amount: totalXpPoints
    }
}

exports.handle = handle;