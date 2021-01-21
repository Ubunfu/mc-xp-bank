const queryHandler = require('../src/handlers/queryHandler.js')
const index = require('../src/index.js')
const sinon = require('sinon')
const expect = require('chai').expect
const queryErrorHandler = require('../src/handlers/queryErrorHandler.js');

const EVENT_QUERY = {
    requestContext: {
        routeKey: 'GET /xp/query'
    },
    queryStringParameters: {
        userId: 'player'
    }
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

describe('Index: When query event is received', function() {
    describe('When query controller returns successfully', function() {
        it('Returns HTTP 200', async function() {
            const queryControllerMock = sinon.stub(queryHandler, "handle")
                .returns(QUERY_HANDLER_RESP_200)
            const indexResp = await index.handler(EVENT_QUERY)
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(QUERY_HANDLER_RESP_200)
            expect(indexResp.statusCode).to.be.equal('200')
            queryControllerMock.restore()
        })
    })
    describe('When query controller throws an error', function() {
        it('Returns error handler mapped response', async function() {
            const queryControllerMock = sinon.stub(queryHandler, "handle")
                .throws()
            const errorHandlerMock = sinon.stub(queryErrorHandler, "handle")
                .returns(ERROR_HANDLER_RESP)
            const indexResp = await index.handler(EVENT_QUERY)
            expect(indexResp.statusCode).to.be.equal(ERROR_HANDLER_RESP.statusCode)
            expect(JSON.parse(indexResp.body)).to.be.deep.equal(ERROR_HANDLER_RESP.body)
            queryControllerMock.restore()
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