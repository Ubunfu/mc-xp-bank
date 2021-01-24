const expect = require('chai').expect
const withdrawHandlerErrorEnum = require('../../src/enums/withdrawHandlerErrorEnum.js')
const withdrawErrorHandler = require('../../src/handlers/withdrawErrorHandler.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')

describe('Withdraw Error Handler Test', function() {
    describe('When handling invalid request error', function() {
        it('Should map to HTTP 400', async function() {
            const handlerResp = await withdrawErrorHandler.handle(new Error(withdrawHandlerErrorEnum.INVALID_REQUEST))
            expect(handlerResp.statusCode).to.be.equal('400')
            expect(handlerResp.body.errorDetail).to.be.equal(withdrawHandlerErrorEnum.INVALID_REQUEST)
        })
    })
    describe('When handling insufficient xp error', function() {
        it('Should map to HTTP 403', async function() {
            const handlerResp = await withdrawErrorHandler.handle(new Error(withdrawHandlerErrorEnum.INSUFFICIENT_XP))
            expect(handlerResp.statusCode).to.be.equal('403')
            expect(handlerResp.body.errorDetail).to.be.equal(withdrawHandlerErrorEnum.INSUFFICIENT_XP)
        })
    })
    describe('When handling xp account not found error', function() {
        it('Should map to HTTP 404', async function() {
            const handlerResp = await withdrawErrorHandler.handle(new Error(dbServiceErrorEnum.ACCOUNT_NOT_FOUND))
            expect(handlerResp.statusCode).to.be.equal('404')
            expect(handlerResp.body.errorDetail).to.be.equal(dbServiceErrorEnum.ACCOUNT_NOT_FOUND)
        })
    })
    describe('When handling unmapped error', function() {
        it('Should map to HTTP 500', async function() {
            const handlerResp = await withdrawErrorHandler.handle(new Error(dbServiceErrorEnum.QUERY_FAILED))
            expect(handlerResp.statusCode).to.be.equal('500')
            expect(handlerResp.body.errorDetail).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
        })
    })
})