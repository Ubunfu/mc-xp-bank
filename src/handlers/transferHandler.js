const transferHandlerErrorEnum = require('../enums/transferHandlerErrorEnum.js')
const dbService = require('../service/dbService.js')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function handle(event) {
    await validateInput(event)
    const payerUserId = JSON.parse(event.body).payerUserId
    const payeeUserId = JSON.parse(event.body).payeeUserId
    const amount = JSON.parse(event.body).amount
    const payerAccount = await dbService.getBalance(docClient, payerUserId)
    if (payerAccount.balance < amount) {
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