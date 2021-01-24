const sinon = require('sinon')
const expect = require('chai').expect
const withdrawHandler = require('../../src/handlers/withdrawHandler.js')
const withdrawHandlerErrorEnum = require('../../src/enums/withdrawHandlerErrorEnum.js')
const dbService = require('../../src/service/dbService.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')
const rconService = require('../../src/service/rconService.js')
const rconServiceErrorEnum = require('../../src/enums/rconServiceErrorEnum.js')

const EVENT_WITHDRAW = {
    requestContext: {
        routeKey: 'POST /xp/withdraw'
    },
    body: '{"userId": "player", "amount": "100"}'
}

const EVENT_WITHDRAW_NEGATIVE = {
    requestContext: {
        routeKey: 'POST /xp/withdraw'
    },
    body: '{"userId": "player", "amount": "-100"}'
}

const EVENT_WITHDRAW_MISSING_BODY = {
    requestContext: {
        routeKey: 'POST /xp/withdraw'
    }
}

const EVENT_WITHDRAW_MISSING_USER_ID = {
    requestContext: {
        routeKey: 'POST /xp/withdraw'
    },
    body: '{"amount": "100"}'
}

const EVENT_WITHDRAW_MISSING_AMOUNT = {
    requestContext: {
        routeKey: 'POST /xp/withdraw'
    },
    body: '{"userId": "player"}'
}

const XP_ACCOUNT = {
    userId: 'player',
    balance: 10000
}

const XP_ACCOUNT_INSUFFICIENT = {
    userId: 'player',
    balance: 0
}

describe('Withdraw Handler Test', function() {
    describe('When everything seems to work ok', function() {
        it('Calls all services', async function() {
            const dbServiceGetBalanceMock = sinon.stub(dbService, "getBalance")
                .returns(XP_ACCOUNT)
            const rconServiceAddXpMock = sinon.stub(rconService, "addXpPoints")
                .returns()
            const dbServiceRemoveXpMock = sinon.stub(dbService, "removeXpPoints")
                .returns()
            await withdrawHandler.handle(EVENT_WITHDRAW)
            expect(dbServiceGetBalanceMock.calledOnce).to.be.true
            expect(rconServiceAddXpMock.calledOnce).to.be.true
            expect(dbServiceRemoveXpMock.calledOnce).to.be.true
            dbServiceGetBalanceMock.restore()
            rconServiceAddXpMock.restore()
            dbServiceRemoveXpMock.restore()
        })
    })
    describe('When amount field is empty', function() {
        it('Throws invalid request an error', async function() {
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW_MISSING_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(withdrawHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When user id field is empty', function() {
        it('Throws invalid request an error', async function() {
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW_MISSING_USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(withdrawHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When request body is empty', function() {
        it('Throws invalid request an error', async function() {
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW_MISSING_BODY)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(withdrawHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When player tries to withdraw a non-positive amount', function() {
        it('Throws an error', async function() {
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW_NEGATIVE)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(withdrawHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
            }
        })
    })
    describe('When database service throws an error', function() {
        it('Throws the same error', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .throws('', dbServiceErrorEnum.QUERY_FAILED)
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
            } finally {
                dbServiceMock.restore()
            }
        })
    })
    describe('When player account has insufficient xp', function() {
        it('Throws error', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .returns(XP_ACCOUNT_INSUFFICIENT)
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(withdrawHandlerErrorEnum.INSUFFICIENT_XP)
            } finally {
                dbServiceMock.restore()
            }
        })
    })
    describe('When rcon service throws an error', function() {
        it('Throws the same error', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .returns(XP_ACCOUNT)
            const rconServiceMock = sinon.stub(rconService, "addXpPoints")
                .throws('', rconServiceErrorEnum.RCON_FAILED)
            try {
                await withdrawHandler.handle(EVENT_WITHDRAW)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.RCON_FAILED)
            } finally {
                rconServiceMock.restore()
                dbServiceMock.restore()
            }
        })
    })
})