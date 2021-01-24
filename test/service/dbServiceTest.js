const sinon = require('sinon')
const expect = require('chai').expect
const dbService = require('../../src/service/dbService.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')

const USER_ID = 'player'
const XP_AMOUNT = 100
const XP_ACCOUNT = {
    userId: USER_ID,
    balance: XP_AMOUNT
}

describe('dbService: get balance', function() {
    describe('When db returns an xp account', function() {
        it('Returns the item object', async function() {
            const docClientMock = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().returns({Item: XP_ACCOUNT})
            }
            const dbServiceResp = await dbService.getBalance(docClientMock, 'player')
            expect(dbServiceResp).to.be.deep.equal(XP_ACCOUNT)
        })
    })
    describe('When account for user is not found', function() {
        it('Throw account not found error', async function() {
            const docClientMock = {
                get: sinon.stub().returnsThis(),
                promise: sinon.stub().returns({})
            }
            try {
                await dbService.getBalance(docClientMock, USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.ACCOUNT_NOT_FOUND)
            }
        })
    })
    describe('When database query fails', function() {
        it('Throw query failed error', async function() {
            const docClientMock = {
                update: sinon.stub().returnsThis(),
                promise: sinon.stub().rejects()
            }
            try {
                await dbService.getBalance(docClientMock, USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
            }
        })
    })
})

describe('dbService: add XP points', function() {
    describe('When database query fails', function() {
        it('Throw query failed error', async function() {
            const docClientMock = {
                update: sinon.stub().returnsThis(),
                promise: sinon.stub().rejects()
            }
            try {
                await dbService.addXpPoints(docClientMock, USER_ID, XP_AMOUNT)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(dbServiceErrorEnum.QUERY_FAILED)
            }
        })
    })
})