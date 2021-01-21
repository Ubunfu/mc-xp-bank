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
            rconServiceQueryXpLevelsMock.restore()
            rconServiceQueryXpPointsMock.restore()
            xpCalculatorServiceMock.restore()
        })
    })
})