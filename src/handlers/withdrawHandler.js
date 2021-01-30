const withdrawHandlerErrorEnum = require('../enums/withdrawHandlerErrorEnum.js')
const dbService = require('../service/dbService.js')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const logger = require('../util/logger.js')
const rconService = require('../service/rconService.js')
const { default: RCON } = require('rcon-srcds')

const rconClient = new RCON({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_RCON_PORT,
    timeout: parseInt(process.env.SERVER_RCON_TIMEOUT_MS)
});

async function handle(event) {
    await validateInput(event)
    const userId = JSON.parse(event.body).userId
    const amount = parseInt(JSON.parse(event.body).amount)
    await logger.log(`[withdrawHandler] User ${userId} requested to withdraw ${amount} xp`)
    const dbResp = await dbService.getBalance(docClient, userId)
    await logger.log(`[withdrawHandler] Retrieved account balance: ${JSON.stringify(dbResp)}`)
    if (dbResp.balance < amount) {
        await logger.log(`[withdrawHandler] User ${userId} has insuffient xp`)
        throw Error(withdrawHandlerErrorEnum.INSUFFICIENT_XP)
    }
    await rconService.addXpPoints(rconClient, userId, amount)
    await dbService.removeXpPoints(docClient, userId, amount)
}

async function validateInput(event) {
    if (event.body == undefined) {
        throw Error(withdrawHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).userId == undefined) {
        throw Error(withdrawHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).amount == undefined) {
        throw Error(withdrawHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).amount < 1) {
        throw Error(withdrawHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
    }
}

exports.handle = handle