const expect = require('chai').expect
const sinon = require('sinon')
const dbService = require('../../src/service/dbService.js')
const balanceHandler = require('../../src/handlers/balanceHandler.js')
const balanceHandlerErrorEnum = require('../../src/enums/balanceHandlerErrorEnum.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')

const EVENT_BALANCE = {
    requestContext: {
        routeKey: 'GET /xp/balance'
    },
    queryStringParameters: {
        userId: 'player'
    }
}

const EVENT_BALANCE_MISSING_USER_ID = {
    requestContext: {
        routeKey: 'GET /xp/balance'
    },
    queryStringParameters: {}
}

const EVENT_BALANCE_MISSING_QUERY_PARAMS = {
    requestContext: {
        routeKey: 'GET /xp/balance'
    }
}

const BALANCE_HANDLER_RESP_200 = {
    userId: 'player',
    balance: 200
}

describe('Balance Handler Test:', function() {
    describe('When user ID query parameter does not exist', function() {
        it('Throws invalid request error', async function() {
            try {
                await balanceHandler.handle(EVENT_BALANCE_MISSING_USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID)
            }
        })
    })
    describe('When no query parameters are received', function() {
        it('Throws invalid request error', async function() {
            try {
                await balanceHandler.handle(EVENT_BALANCE_MISSING_QUERY_PARAMS)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID)
            }
        })
    })
    describe('When the database service throws an error', function() {
        it('Throws the same error', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .throws('', dbServiceErrorEnum.QUERY_FAILED)
            try {
                await balanceHandler.handle(EVENT_BALANCE)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
            } finally {
                dbServiceMock.restore()
            }
        })
    })
    describe('When everything seems to work', function() {
        it('Returns an account balance', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .returns(BALANCE_HANDLER_RESP_200)
            const handlerResp = await balanceHandler.handle(EVENT_BALANCE)
            expect(handlerResp).to.be.deep.equal(BALANCE_HANDLER_RESP_200)
            dbServiceMock.restore()
        })
    })
})