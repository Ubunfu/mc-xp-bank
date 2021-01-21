const xpCalculatorService = require('../../src/service/xpCalculatorService.js')
const xpCalculatorServiceErrorEnum = require('../../src/enums/xpCalculatorServiceErrorEnum.js')
const expect = require('chai').expect

const LEVELS_LOW = 5
const XP_LEVELS_LOW = 55
const LEVELS_MID = 20
const XP_LEVELS_MID = 550
const LEVELS_HIGH = 40
const XP_LEVELS_HIGH = 2920
const POINTS_ZERO = 0

describe('xpCalculatorService: calculatePoints', function() {
    describe('When both inputs are not numbers', function() {
        it('Throws NON_NUMBER_INPUT error', async function() {
            try {
                await xpCalculatorService.calculatePoints('a', 'b')
                expect(true).to.be.false
            } catch (err) {
                expect(err.message).to.be.equal(xpCalculatorServiceErrorEnum.NON_NUMBER_INPUT)
            }
        })
    })
    describe('When level is in low range', function() {
        it('Returns correct quantity of points', async function() {
            const calcResp = await xpCalculatorService.calculatePoints(LEVELS_LOW, POINTS_ZERO)
            expect(calcResp).to.be.equal(XP_LEVELS_LOW)
        })
    })
    describe('When level is in mid range', function() {
        it('Returns correct quantity of points', async function() {
            const calcResp = await xpCalculatorService.calculatePoints(LEVELS_MID, POINTS_ZERO)
            expect(calcResp).to.be.equal(XP_LEVELS_MID)
        })
    })
    describe('When level is in high range', function() {
        it('Returns correct quantity of points', async function() {
            const calcResp = await xpCalculatorService.calculatePoints(LEVELS_HIGH, POINTS_ZERO)
            expect(calcResp).to.be.equal(XP_LEVELS_HIGH)
        })
    })
})