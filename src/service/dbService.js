const { log } = require("../util/logger");
const dbServiceErrorEnum = require('../enums/dbServiceErrorEnum.js')

const TABLE_XP = process.env.TABLE_XP

async function getBalance(docClient, userId) {
    
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
        await log(`[dbService] DB Query Params: ${params}`)
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