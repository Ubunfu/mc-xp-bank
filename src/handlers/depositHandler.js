const rconService = require('../service/rconService.js')
const { default: RCON } = require('rcon-srcds')
const logger = require('../util/logger.js')
const dbService = require('../service/dbService.js')
const queryHandler = require('../../src/handlers/queryHandler.js')
const depositHandlerErrorEnum = require('../enums/depositHandlerErrorEnum.js')
const AWS = require('aws-sdk')

const rconClient = new RCON({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_RCON_PORT,
    timeout: parseInt(process.env.SERVER_RCON_TIMEOUT_MS)
});

const docClient = new AWS.DynamoDB.DocumentClient()

async function handle(event) {
    const userId = JSON.parse(event.body).userId
    const amount = parseInt(JSON.parse(event.body).amount)
    await validateInput(userId, amount)
    await logger.log(`[depositHandler] ${userId} requested a deposit of ${amount} XP`)
    const playerCurrentXp = await queryHandler.getPlayerXp(userId)
    if (playerCurrentXp < amount) {
        await logger.log(`[depositHandler] ${depositHandlerErrorEnum.INSUFFICIENT_XP}`)
        throw Error(depositHandlerErrorEnum.INSUFFICIENT_XP)
    }
    await rconService.removeXpPoints(rconClient, userId, amount)
    await dbService.addXpPoints(docClient, userId, amount)
}

async function validateInput(userId, amount) {
    if (amount < 1) {
        throw Error(depositHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
    }
}

exports.handle = handle