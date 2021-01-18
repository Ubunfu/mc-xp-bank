require('dotenv').config();
const { log } = require('../util/logger.js');

exports.handler = async (event, context) => {
    logEvent(event);

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    if (event.requestContext.routeKey == 'POST /bank/deposit') {
        
        // something

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