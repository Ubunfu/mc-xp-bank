const transferHandlerErrorEnum = require('../../src/enums/transferHandlerErrorEnum.js')
const transferErrorHandler = require('../../src/handlers/transferErrorHandler.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')
const expect = require('chai').expect

describe('Transfer Error Handler Test', function() {
    describe('When handling invalid request error', function() {
        it('Should map to HTTP 400', async function() {
            const handlerResp = await transferErrorHandler.handle(new Error(transferHandlerErrorEnum.INVALID_REQUEST))
            expect(handlerResp.statusCode).to.be.equal('400')
            expect(handlerResp.body.errorDetail).to.be.equal(transferHandlerErrorEnum.INVALID_REQUEST)
        })
    })
    describe('When handling negative amount error', function() {
        it('Should map to HTTP 400', async function() {
            const handlerResp = await transferErrorHandler.handle(new Error(transferHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE))
            expect(handlerResp.statusCode).to.be.equal('400')
            expect(handlerResp.body.errorDetail).to.be.equal(transferHandlerErrorEnum.AMOUNT_MUST_BE_POSITIVE)
        })
    })
    describe('When handling insufficient xp error', function() {
        it('Should map to HTTP 403', async function() {
            const handlerResp = await transferErrorHandler.handle(new Error(transferHandlerErrorEnum.INSUFFICIENT_XP))
            expect(handlerResp.statusCode).to.be.equal('403')
            expect(handlerResp.body.errorDetail).to.be.equal(transferHandlerErrorEnum.INSUFFICIENT_XP)
        })
    })
    describe('When handling xp account not found error', function() {
        it('Should map to HTTP 404', async function() {
            const handlerResp = await transferErrorHandler.handle(new Error(dbServiceErrorEnum.ACCOUNT_NOT_FOUND))
            expect(handlerResp.statusCode).to.be.equal('404')
            expect(handlerResp.body.errorDetail).to.be.equal(dbServiceErrorEnum.ACCOUNT_NOT_FOUND)
        })
    })
    describe('When handling unmapped error', function() {
        it('Should map to HTTP 500', async function() {
            const handlerResp = await transferErrorHandler.handle(new Error(dbServiceErrorEnum.QUERY_FAILED))
            expect(handlerResp.statusCode).to.be.equal('500')
            expect(handlerResp.body.errorDetail).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
        })
    })
})