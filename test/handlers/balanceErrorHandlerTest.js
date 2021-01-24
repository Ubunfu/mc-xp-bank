const expect = require('chai').expect
const balanceErrorHandler = require('../../src/handlers/balanceErrorHandler.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')
const balanceHandlerErrorEnum = require('../../src/enums/balanceHandlerErrorEnum.js')

const MAPPED_RESP_ACCOUNT_NOT_FOUND = {
    statusCode: '404',
    body: {
        error: 'Failed to check xp account balance',
        errorDetail: dbServiceErrorEnum.ACCOUNT_NOT_FOUND
    }
}

const MAPPED_RESP_INVALID_REQUEST = {
    statusCode: '400',
    body: {
        error: 'Failed to check xp account balance',
        errorDetail: balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID
    }
}

const MAPPED_RESP_UNMAPPED = {
    statusCode: '500',
    body: {
        error: 'Failed to check xp account balance',
        errorDetail: dbServiceErrorEnum.QUERY_FAILED
    }
}

describe('Balance error handler test:', function() {
    describe('When error is account not found', function() {
        it('Maps error to HTTP 404', async function() {
            const errorHandlerResp = await balanceErrorHandler.handle(new Error(dbServiceErrorEnum.ACCOUNT_NOT_FOUND))
            expect(errorHandlerResp).to.be.deep.equal(MAPPED_RESP_ACCOUNT_NOT_FOUND)
        })
    })
    describe('When error is invalid request', function() {
        it('Maps error to HTTP 400', async function() {
            const errorHandlerResp = await balanceErrorHandler.handle(new Error(balanceHandlerErrorEnum.INVALID_REQUEST_MISSING_USER_ID))
            expect(errorHandlerResp).to.be.deep.equal(MAPPED_RESP_INVALID_REQUEST)
        })
    })
    describe('When error is unmapped', function() {
        it('Maps error to HTTP 500', async function() {
            const errorHandlerResp = await balanceErrorHandler.handle(new Error(dbServiceErrorEnum.QUERY_FAILED))
            expect(errorHandlerResp).to.be.deep.equal(MAPPED_RESP_UNMAPPED)
        })
    })
})