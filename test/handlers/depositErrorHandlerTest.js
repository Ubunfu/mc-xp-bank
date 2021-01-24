const { expect } = require('chai')
const depositErrorHandler = require('../../src/handlers/depositErrorHandler.js')
const depositHandlerErrorEnum = require('../../src/enums/depositHandlerErrorEnum.js')
const rconServiceErrorEnum = require('../../src/enums/rconServiceErrorEnum.js')

const ERROR_MAP_AMOUNT_MUST_BE_POSITIVE = {
    statusCode: '400',
    body: {
        error: 'Failed to deposit XP',
        errorDetail: depositHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE
    }
}

const ERROR_MAP_INSUFFICIENT_XP = {
    statusCode: '403',
    body: {
        error: 'Failed to deposit XP',
        errorDetail: depositHandlerErrorEnum.INSUFFICIENT_XP
    }
}

const ERROR_MAP_NO_PLAYER_FOUND = {
    statusCode: '404',
    body: {
        error: 'Failed to deposit XP',
        errorDetail: rconServiceErrorEnum.NO_PLAYER_FOUND
    }
}

const ERROR_MAP_UNMAPPED = {
    statusCode: '500',
    body: {
        error: 'Failed to deposit XP',
        errorDetail: rconServiceErrorEnum.RCON_FAILED
    }
}

describe('depositErrorHandler test: ', function() {
    describe('When handling amount must be positive error', function() {
        it('Returns correctly mapped error response', async function() {
            const errorHandlerResp = await depositErrorHandler.handle(new Error(depositHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE))
            expect(errorHandlerResp).to.be.deep.equal(ERROR_MAP_AMOUNT_MUST_BE_POSITIVE)
        })
    })
    describe('When handling insufficient xp error', function() {
        it('Returns correctly mapped error response', async function() {
            const errorHandlerResp = await depositErrorHandler.handle(new Error(depositHandlerErrorEnum.INSUFFICIENT_XP))
            expect(errorHandlerResp).to.be.deep.equal(ERROR_MAP_INSUFFICIENT_XP)
        })
    })
    describe('When handling no player found error', function() {
        it('Returns correctly mapped error response', async function() {
            const errorHandlerResp = await depositErrorHandler.handle(new Error(rconServiceErrorEnum.NO_PLAYER_FOUND))
            expect(errorHandlerResp).to.be.deep.equal(ERROR_MAP_NO_PLAYER_FOUND)
        })
    })
    describe('When handling unmapped error', function() {
        it('Returns correctly mapped error response', async function() {
            const errorHandlerResp = await depositErrorHandler.handle(new Error(rconServiceErrorEnum.RCON_FAILED))
            expect(errorHandlerResp).to.be.deep.equal(ERROR_MAP_UNMAPPED)
        })
    })
})