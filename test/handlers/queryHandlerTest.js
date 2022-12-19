const sinon = require('sinon')
const expect = require('chai').expect
const rconService = require('../../src/service/rconService.js')
const xpCalculatorService = require('../../src/service/xpCalculatorService.js')
const queryHandler = require('../../src/handlers/queryHandler.js')

const PLAYER_ID = 'player'
const XP_AMOUNT = 1000

const EVENT_QUERY = {
    requestContext: {
        routeKey: 'GET /xp/query'
    },
    queryStringParameters: {
        userId: PLAYER_ID
    }
}

const HANDLER_RESP_SUCCESS = {
    userId: PLAYER_ID,
    amount: XP_AMOUNT
}

describe('Query Handler Test', function() {
    describe('When everything works', function() {
        it('Returns player current XP', async function() {
            const rconServiceQueryXpLevelsMock = sinon.stub(rconService, "queryXpLevels")
                .returns()
            const rconServiceQueryXpPointsMock = sinon.stub(rconService, "queryXpPoints")
                .returns()
            const xpCalculatorServiceMock = sinon.stub(xpCalculatorService, "calculatePoints")
                .returns(XP_AMOUNT)

            const handlerResp = await queryHandler.handle(EVENT_QUERY)

            expect(handlerResp).to.be.deep.equal(HANDLER_RESP_SUCCESS)
            expect(rconServiceQueryXpLevelsMock.calledOnce).to.be.true
            expect(rconServiceQueryXpPointsMock.calledOnce).to.be.true
            expect(xpCalculatorServiceMock.calledOnce).to.be.true

            rconServiceQueryXpLevelsMock.restore()
            rconServiceQueryXpPointsMock.restore()
            xpCalculatorServiceMock.restore()
        })
    })
    describe('Essentials X Version', function () {
        beforeEach(function () {
            process.env.FEATURE_ENABLED_ESSENTIALS_X_PLUGIN = 'true'
        })
        describe('When everything works', function() {
            it('Returns player current XP', async function() {
                const rconServiceQueryXpLevelsMock = sinon.stub(rconService, "queryXpLevels")
                    .returns()
                const rconServiceQueryXpPointsMock = sinon.stub(rconService, "queryXpPoints")
                    .returns(XP_AMOUNT)
                const xpCalculatorServiceMock = sinon.stub(xpCalculatorService, "calculatePoints")
                    .returns()

                const handlerResp = await queryHandler.handle(EVENT_QUERY)

                expect(handlerResp).to.be.deep.equal(HANDLER_RESP_SUCCESS)
                expect(rconServiceQueryXpLevelsMock.called).to.be.false
                expect(rconServiceQueryXpPointsMock.calledOnce).to.be.true
                expect(xpCalculatorServiceMock.called).to.be.false

                rconServiceQueryXpLevelsMock.restore()
                rconServiceQueryXpPointsMock.restore()
                xpCalculatorServiceMock.restore()
            })
        })
    })
})