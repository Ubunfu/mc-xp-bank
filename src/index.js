require('dotenv').config();
const { log } = require('./util/logger.js');
const queryHandler = require('./handlers/queryHandler.js')
const queryErrorHandler = require('./handlers/queryErrorHandler.js')
const depositHandler = require('./handlers/depositHandler.js')
const depositErrorHandler = require('./handlers/depositErrorHandler.js')
const balanceHandler = require('../src/handlers/balanceHandler.js')
const balanceErrorHandler = require('./handlers/balanceErrorHandler.js')
const withdrawHandler = require('./handlers/withdrawHandler.js')
const withdrawErrorHandler = require('./handlers/withdrawErrorHandler.js')
const transferHandler = require('./handlers/transferHandler.js')
const transferErrorHandler = require('./handlers/transferErrorHandler.js')

exports.handler = async (event, context) => {
    logEvent(event);

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.requestContext.routeKey == 'GET /xp/query') {
        try {
            body = await queryHandler.handle(event)
        } catch (err) {
            const errorHandlerResp = await queryErrorHandler.handle(err)
            statusCode = errorHandlerResp.statusCode
            body = errorHandlerResp.body
        }
    } else if (event.requestContext.routeKey == 'POST /xp/deposit') {
        try {
            await depositHandler.handle(event)
        } catch (err) {
            const errorHandlerResp = await depositErrorHandler.handle(err)
            statusCode = errorHandlerResp.statusCode
            body = errorHandlerResp.body
        }
    } else if (event.requestContext.routeKey == 'GET /xp/balance') {
        try {
            body = await balanceHandler.handle(event)
        } catch (err) {
            const errorHandlerResp = await balanceErrorHandler.handle(err)
            statusCode = errorHandlerResp.statusCode
            body = errorHandlerResp.body
        }
    } else if (event.requestContext.routeKey == 'POST /xp/withdraw') {
        try {
            body = await withdrawHandler.handle(event)
        } catch (err) {
            const errorHandlerResp = await withdrawErrorHandler.handle(err)
            statusCode = errorHandlerResp.statusCode
            body = errorHandlerResp.body
        }
    } else if (event.requestContext.routeKey == 'POST /xp/transfer') {
        try {
            body = await transferHandler.handle(event)
        } catch (err) {
            const errorHandlerResp = await transferErrorHandler.handle(err)
            statusCode = errorHandlerResp.statusCode
            body = errorHandlerResp.body
        }
    } else {
        statusCode = '404'
    }

    body = JSON.stringify(body);
    return {
        statusCode,
        body,
        headers,
    };
};

async function logEvent(event) {
    if (event.headers) {
        event.headers.host = "XXX";
    }
    if (event.requestContext) {
        event.requestContext.domainName = "XXX";
    }
    await log(JSON.stringify(event, null, 2));
}