const sinon = require('sinon')
const expect = require('chai').expect
const dbService = require('../../src/service/dbService.js')
const dbServiceErrorEnum = require('../../src/enums/dbServiceErrorEnum.js')

const USER_ID = 'player'
const XP_AMOUNT = 100

describe('dbService:', function() {
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