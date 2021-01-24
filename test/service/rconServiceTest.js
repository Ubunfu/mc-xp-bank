const rconService = require('../../src/service/rconService.js')
const rconServiceErrorEnum = require('../../src/enums/rconServiceErrorEnum.js')
const expect = require('chai').expect
const sinon = require('sinon')

const USER_ID = 'player'
const XP_POINTS = 100
const RESP_QUERY_LEVELS = 'player has 10 experience levels'
const RESP_QUERY_POINTS = 'player has 10 experience points'
const RESP_UNEXPECTED = 'some crap'

describe('rconService: addXpPoints:', function() {
    describe('When no player is online', function() {
        it('Throws NO_PLAYER_FOUND error', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(rconServiceErrorEnum.NO_PLAYER_FOUND),
                disconnect: sinon.stub().returns()
            }
            try {
                await rconService.addXpPoints(rconClientMock, USER_ID, XP_POINTS)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.NO_PLAYER_FOUND)
            }
        })
    })
})

describe('rconService: removeXpPoints:', function() {
    describe('When no player is online', function() {
        it('Throws NO_PLAYER_FOUND error', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(rconServiceErrorEnum.NO_PLAYER_FOUND),
                disconnect: sinon.stub().returns()
            }
            try {
                await rconService.removeXpPoints(rconClientMock, USER_ID, XP_POINTS)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.NO_PLAYER_FOUND)
            }
        })
    })
})

describe('rconService: queryXpPoints:', function() {
    describe('When no player is online', function() {
        it('Throws NO_PLAYER_FOUND error', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(rconServiceErrorEnum.NO_PLAYER_FOUND),
                disconnect: sinon.stub().returns()
            }
            try {
                await rconService.queryXpPoints(rconClientMock, USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.NO_PLAYER_FOUND)
            }
        })
    })
    describe('When server returns unexpected response', function() {
        it('Throws RCON_FAILED error', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(RESP_UNEXPECTED),
                disconnect: sinon.stub().returns()
            }
            try {
                await rconService.queryXpPoints(rconClientMock, USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.RCON_FAILED)
            }
        })
    })
    describe('When player points are returned', function() {
        it('Returns player points count', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(RESP_QUERY_POINTS),
                disconnect: sinon.stub().returns()
            }
            const rconServiceResp = await rconService.queryXpPoints(rconClientMock, USER_ID)
            expect(rconServiceResp).to.be.equal(10)
        })
    })
})

describe('rconService: queryXpLevels:', function() {
    describe('When no player is online', function() {
        it('Throws NO_PLAYER_FOUND error', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(rconServiceErrorEnum.NO_PLAYER_FOUND),
                disconnect: sinon.stub().returns()
            }
            try {
                await rconService.queryXpLevels(rconClientMock, USER_ID)
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(rconServiceErrorEnum.NO_PLAYER_FOUND)
            }
        })
    })
    describe('When player levels are returned', function() {
        it('Returns player levels count', async function() {
            const rconClientMock = {
                authenticate: sinon.stub().returns(),
                execute: sinon.stub().returns(RESP_QUERY_LEVELS),
                disconnect: sinon.stub().returns()
            }
            const rconServiceResp = await rconService.queryXpLevels(rconClientMock, USER_ID)
            expect(rconServiceResp).to.be.equal(10)
        })
    })
})