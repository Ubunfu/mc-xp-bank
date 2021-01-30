const transferHandlerErrorEnum = require('../enums/transferHandlerErrorEnum.js')
const dbService = require('../service/dbService.js')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const logger = require('../util/logger.js')

async function handle(event) {
    await validateInput(event)
    const payerUserId = JSON.parse(event.body).payerUserId
    const payeeUserId = JSON.parse(event.body).payeeUserId
    const amount = parseInt(JSON.parse(event.body).amount)
    await logger.log(`[transferHandler] ${payerUserId} requested to transfer ${amount} xp to ${payeeUserId}`)
    const payerAccount = await dbService.getBalance(docClient, payerUserId)
    await logger.log(`[transferHandler] Retrieved xp account: ${JSON.stringify(payerAccount)}`)
    if (payerAccount.balance < amount) {
        await logger.log(`[transferHandler] ${payerUserId} has insufficient xp to complete the transfer`)
        throw Error(transferHandlerErrorEnum.INSUFFICIENT_XP)
    }
    await dbService.removeXpPoints(docClient, payerUserId, amount)
    await dbService.addXpPoints(docClient, payeeUserId, amount)
}

async function validateInput(event) {
    if (event.body == undefined) {
        throw Error(transferHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).payerUserId == undefined) {
        throw Error(transferHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).payeeUserId == undefined) {
        throw Error(transferHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).amount == undefined) {
        throw Error(transferHandlerErrorEnum.INVALID_REQUEST)
    }
    if (JSON.parse(event.body).amount < 1) {
        throw Error(transferHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
    }
}

exports.handle = handle