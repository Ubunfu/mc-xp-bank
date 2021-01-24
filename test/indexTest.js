const sinon = require('sinon')
const expect = require('chai').expect
const index = require('../src/index.js')
const queryHandler = require('../src/handlers/queryHandler.js')
const queryErrorHandler = require('../src/handlers/queryErrorHandler.js');
const depositHandler = require('../src/handlers/depositHandler.js')
const depositErrorHandler = require('../src/handlers/depositErrorHandler.js');

const EVENT_QUERY = {
    requestContext: {
        routeKey: 'GET /xp/query'
    },
    queryStringParameters: {
        userId: 'player'
    }
}

const EVENT_DEPOSIT = {
    requestContext: {
        routeKey: 'POST /xp/deposit'
    },
    body: '{"userId": "player", "amount": "100"}'
}

const EVENT_INVALID_PATH = {
    requestContext: {
        routeKey: 'GET /invalid/path'
    }
}

const QUERY_HANDLER_RESP_200 = {
    userId: 'player',
    amount: 200
}

const ERROR_HANDLER_RESP = {
    statusCode: '400',
    body: {}
}

describe('Index: When deposit event is received', function() {
    describe('When deposit handler returns successfully', function() {
        it('Returns HTTP 200', async function() {
            const depositHandlerMock = sinon.stub(depositHandler, "handle")
                .returns()
            const indexResp = await index.handler(EVENT_DEPOSIT)
            expect(indexResp.statusCode).to.be.equal('200')
            depositHandlerMock.restore()
        })
    })
    describe('When deposit handler throws an error', function() {
        it('Returns error handler mapped response', async function() {
            const depositHandlerMock = sinon.stub(depositHandler, "handle")
                .throws()
            const errorHandlerMock = sinon.stub(depositErrorHandler, "handle")
                .returns(ERROR_HANDLER_RESP)
            const indexResp = await index.handler(EVENT_DEPOSIT)
            expect(indexResp.statusCode).to.be.equal(ERROR_HANDLER_RESP.statusCode)
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_HANDLER_RESP.body)
            depositHandlerMock.restore()
            errorHandlerMock.restore()
        })
    })
})

describe('Index: When query event is received', function() {
    describe('When query handler returns successfully', function() {
        it('Returns HTTP 200', async function() {
            const queryHandlerMock = sinon.stub(queryHandler, "handle")
                .returns(QUERY_HANDLER_RESP_200)
            const indexResp = await index.handler(EVENT_QUERY)
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(QUERY_HANDLER_RESP_200)
            expect(indexResp.statusCode).to.be.equal('200')
            queryHandlerMock.restore()
        })
    })
    describe('When query handler throws an error', function() {
        it('Returns error handler mapped response', async function() {
            const queryHandlerMock = sinon.stub(queryHandler, "handle")
                .throws()
            const errorHandlerMock = sinon.stub(queryErrorHandler, "handle")
                .returns(ERROR_HANDLER_RESP)
            const indexResp = await index.handler(EVENT_QUERY)
            expect(indexResp.statusCode).to.be.equal(ERROR_HANDLER_RESP.statusCode)
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_HANDLER_RESP.body)
            queryHandlerMock.restore()
            errorHandlerMock.restore()
        })
    })
})

describe('Index: When invalid endpoint event received', function() {
    it('Returns HTTP 404', async function() {
        const indexResp = await index.handler(EVENT_INVALID_PATH)
        expect(indexResp.statusCode).to.be.equal('404')
    })
})