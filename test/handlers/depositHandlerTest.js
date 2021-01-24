const sinon = require('sinon')
const expect = require('chai').expect
const depositHandler = require('../../src/handlers/depositHandler.js')
const dbService = require('../../src/service/dbService.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')
const rconService = require('../../src/service/rconService.js')
const rconServiceErrorEnum = require('../../src/enums/rconServiceErrorEnum.js')
const queryHandler = require('../../src/handlers/queryHandler.js')
const depositHandlerErrorEnum = require('../../src/enums/depositHandlerErrorEnum.js')

const EVENT_DEPOSIT = {
    requestContext: {
        routeKey: 'POST /xp/deposit'
    },
    body: '{"userId": "player", "amount": "100"}'
}

const EVENT_DEPOSIT_NEGATIVE = {
    requestContext: {
        routeKey: 'POST /xp/deposit'
    },
    body: '{"userId": "player", "amount": "-100"}'
}

describe('Deposit Handler Test', function() {
    describe('When player tries to deposit non-positive amounts', function() {
        it('Throws an error', async function() {
            try {
                await depositHandler.handle(EVENT_DEPOSIT_NEGATIVE)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(depositHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
            }
        })
    })
    describe('When query xp handler throws an error', function() {
        it('Throws the same error', async function() {
            const queryHandlerMock = sinon.stub(queryHandler, "getPlayerXp")
                .throws('', rconServiceErrorEnum.RCON_FAILED)
            try {
                await depositHandler.handle(EVENT_DEPOSIT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.RCON_FAILED)
            } finally {
                queryHandlerMock.restore()
            }
        })
    })
    describe('When player has insufficient xp', function() {
        it('Throws insufficient xp error', async function() {
            const queryHandlerMock = sinon.stub(queryHandler, "getPlayerXp")
                .returns(50)
            try {
                await depositHandler.handle(EVENT_DEPOSIT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(depositHandlerErrorEnum.INSUFFICIENT_XP)
            } finally {
                queryHandlerMock.restore()
            }
        })
    })
    describe('When rcon service throws an error', function() {
        it('Throws the same error', async function() {
            const queryHandlerMock = sinon.stub(queryHandler, "getPlayerXp")
                .returns(200)
            const rconServiceMock = sinon.stub(rconService, "removeXpPoints")
                .throws('', rconServiceErrorEnum.RCON_FAILED)
            try {
                await depositHandler.handle(EVENT_DEPOSIT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.RCON_FAILED)
            } finally {
                queryHandlerMock.restore()
                rconServiceMock.restore()
            }
        })
    })
    describe('When database service throws an error', function() {
        it('Throws the same error', async function() {
            const queryHandlerMock = sinon.stub(queryHandler, "getPlayerXp")
                .returns(200)
            const rconServiceMock = sinon.stub(rconService, "removeXpPoints")
                .returns()
            const dbServiceMock = sinon.stub(dbService, "addXpPoints")
                .throws('', dbServiceErrorEnum.QUERY_FAILED)
            try {
                await depositHandler.handle(EVENT_DEPOSIT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
            } finally {
                queryHandlerMock.restore()
                rconServiceMock.restore()
                dbServiceMock.restore()
            }
        })
    })
})