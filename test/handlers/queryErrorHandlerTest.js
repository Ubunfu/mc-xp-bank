const { expect } = require('chai')
const queryErrorHandler = require('../../src/handlers/queryErrorHandler.js')
const rconServiceErrorEnum = require('../../src/enums/rconServiceErrorEnum.js')

const ERROR_MAP_NO_PLAYER_FOUND = {
    statusCode: '404',
    body: {
        error: 'Failed to query player XP',
        errorDetail: rconServiceErrorEnum.NO_PLAYER_FOUND
    }
}

const ERROR_MAP_UNMAPPED = {
    statusCode: '500',
    body: {
        error: 'Failed to query player XP',
        errorDetail: rconServiceErrorEnum.RCON_FAILED
    }
}

describe('queryErrorHandler test: ', function() {
    describe('When handling no player found error', function() {
        it('Returns correctly mapped error response', async function() {
            const errorHandlerResp = await queryErrorHandler.handle(new Error(rconServiceErrorEnum.NO_PLAYER_FOUND))
            expect(errorHandlerResp).to.be.deep.equal(ERROR_MAP_NO_PLAYER_FOUND)
        })
    })
    describe('When handling unmapped error', function() {
        it('Returns correctly mapped error response', async function() {
            const errorHandlerResp = await queryErrorHandler.handle(new Error(rconServiceErrorEnum.RCON_FAILED))
            expect(errorHandlerResp).to.be.deep.equal(ERROR_MAP_UNMAPPED)
        })
    })
})