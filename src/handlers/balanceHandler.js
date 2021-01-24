const balanceHandlerErrorEnum = require('../enums/balanceHandlerErrorEnum.js')
const dbService = require('../service/dbService.js')
const logger = require('../../src/util/logger.js')
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function handle(event) {
    await validateInput(event)
    const userId = event.queryStringParameters.userId
    logger.log(`[balanceHandler] XP Account balance requested by user ${userId}`)
    return await dbService.getBalance(docClient, userId)
}

async function validateInput(event) {
    if (event.queryStringParameters == undefined) {
        logger.log(`[balanceHandler] Invalid request - missing user ID`)
        throw Error(balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID)
    }
    if (event.queryStringParameters.userId == undefined) {
        logger.log(`[balanceHandler] Invalid request - missing user ID`)
        throw Error(balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID)
    }
}

exports.handle = handle