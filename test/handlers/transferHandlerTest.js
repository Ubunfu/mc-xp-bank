const expect = require('chai').expect
const sinon = require('sinon')
const transferHandler = require('../../src/handlers/transferHandler.js')
const transferHandlerErrorEnum = require('../../src/enums/transferHandlerErrorEnum.js')
const dbService = require('../../src/service/dbService.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')

const EVENT_TRANSFER = {
    requestContext: {
        routeKey: 'POST /xp/transfer'
    },
    body: '{"payerUserId": "player", "payeeUserId": "player2", "amount": "100"}'
}

const EVENT_TRANSFER_NEGATIVE = {
    requestContext: {
        routeKey: 'POST /xp/transfer'
    },
    body: '{"payerUserId": "player", "payeeUserId": "player2", "amount": "-100"}'
}

const EVENT_TRANSFER_MISSING_BODY = {
    requestContext: {
        routeKey: 'POST /xp/transfer'
    }
}

const EVENT_TRANSFER_MISSING_PAYER_USER_ID = {
    requestContext: {
        routeKey: 'POST /xp/transfer'
    },
    body: '{"payeeUserId": "player2", "amount": "100"}'
}

const EVENT_TRANSFER_MISSING_PAYEE_USER_ID = {
    requestContext: {
        routeKey: 'POST /xp/transfer'
    },
    body: '{"payerUserId": "player", "amount": "100"}'
}

const EVENT_TRANSFER_MISSING_AMOUNT = {
    requestContext: {
        routeKey: 'POST /xp/transfer'
    },
    body: '{"payerUserId": "player", "payeeUserId": "player2"}'
}

const XP_ACCOUNT = {
    userId: 'player1',
    balance: 10000
}

const XP_ACCOUNT_INSUFFICIENT = {
    userId: 'player1',
    balance: 0
}

describe('Transfer Error Handler Test', function() {
    describe('When body is missing', function() {
        it('Throws invalid request error', async function() {
            try {
                await transferHandler.handle(EVENT_TRANSFER_MISSING_BODY)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(transferHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When payerUserId is missing', function() {
        it('Throws invalid request error', async function() {
            try {
                await transferHandler.handle(EVENT_TRANSFER_MISSING_PAYER_USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(transferHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When payeeUserId is missing', function() {
        it('Throws invalid request error', async function() {
            try {
                await transferHandler.handle(EVENT_TRANSFER_MISSING_PAYEE_USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(transferHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When amount is missing', function() {
        it('Throws invalid request error', async function() {
            try {
                await transferHandler.handle(EVENT_TRANSFER_MISSING_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(transferHandlerErrorEnum.INVALID_REQUEST)
            }
        })
    })
    describe('When transfer amount is non-positive', function() {
        it('Throws amount must be non-negative error', async function() {
            try {
                await transferHandler.handle(EVENT_TRANSFER_NEGATIVE)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(transferHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
            }
        })
    })
    describe('When db service throws an error', function() {
        it('Throws the same error error', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .throws('', dbServiceErrorEnum.QUERY_FAILED)
            try {
                await transferHandler.handle(EVENT_TRANSFER)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
            } finally {
                dbServiceMock.restore()
            }
        })
    })
    describe('When payer has insufficient xp', function() {
        it('Throws insufficient xp error', async function() {
            const dbServiceMock = sinon.stub(dbService, "getBalance")
                .returns(XP_ACCOUNT_INSUFFICIENT)
            try {
                await transferHandler.handle(EVENT_TRANSFER)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(transferHandlerErrorEnum.INSUFFICIENT_XP)
            } finally {
                dbServiceMock.restore()
            }
        })
    })
    describe('When everything appears to work ok', function() {
        it('Calls all the right services', async function() {
            const dbServiceGetBalanceMock = sinon.stub(dbService, "getBalance")
                .returns(XP_ACCOUNT)
            const dbServiceRemoveXpMock = sinon.stub(dbService, "removeXpPoints")
                .returns()
            const dbServiceAddXpMock = sinon.stub(dbService, "addXpPoints")
                .returns()
            await transferHandler.handle(EVENT_TRANSFER)
            expect(dbServiceGetBalanceMock.calledOnce).to.be.true
            expect(dbServiceRemoveXpMock.calledOnce).to.be.true
            expect(dbServiceAddXpMock.calledOnce).to.be.true
            dbServiceGetBalanceMock.restore()
            dbServiceRemoveXpMock.restore()
            dbServiceAddXpMock.restore()
        })
    })
})