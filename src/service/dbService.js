const { log } = require("../util/logger");
const dbServiceErrorEnum = require('../enums/dbServiceErrorEnum.js')

const TABLE_XP = process.env.TABLE_XP

async function getBalance(docClient, userId) {
    const params = {
        TableName: TABLE_XP,
        Key: {
            'userId': userId
        }
    }
    let dbResp
    try {
        await log(`[dbService] DB Query Params: ${JSON.stringify(params)}`)
        dbResp = await docClient.get(params).promise()
    } catch (err) {
        await log(`[dbService] Error querying database: ${err}`)
        throw Error(dbServiceErrorEnum.QUERY_FAILED)
    }
    if (dbResp.Item == undefined) {
        await log(`[dbService] XP account not found for user ${userId}`)
        throw Error(dbServiceErrorEnum.ACCOUNT_NOT_FOUND)
    }
    await log(`[dbService] Returned account details: ${JSON.stringify(dbResp.Item)}`)
    return dbResp.Item
}

async function addXpPoints(docClient, userId, amount) {
    const params = {
        TableName: TABLE_XP,
        Key: {
            'userId': userId
        },
        ExpressionAttributeValues: {
            ':amount': amount
        },
        UpdateExpression: 'ADD balance :amount'
    }
    try {
        await log(`[dbService] DB Query Params: ${JSON.stringify(params)}`)
        await docClient.update(params).promise()
    } catch (err) {
        await log(`[dbService] Error querying database: ${err}`)
        throw Error(dbServiceErrorEnum.QUERY_FAILED)
    }
    
}

async function removeXpPoints(docClient, userId, amount) {

}

exports.getBalance = getBalance
exports.addXpPoints = addXpPoints
exports.removeXpPoints = removeXpPoints