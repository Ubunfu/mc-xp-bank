const xpCalculatorServiceErrorEnum = require('../enums/xpCalculatorServiceErrorEnum.js')
const logger = require('../util/logger.js')

async function calculatePoints(levels, points) {
    await validateInput(levels, points)
    const totalXp = await sumLevelsAndPointsXp(levels, points)
    logger.log(`[xpCalculatorService] Total player XP: ${totalXp}`)
    return totalXp
}

async function sumLevelsAndPointsXp(levels, points) {
    return points + await calculateLevelsXp(levels)
}

async function calculateLevelsXp(levels) {
    if (levels <= 15) {
        return await calculateLevelsXpLow(levels)
    } else if (levels <= 30) {
        return await calculateLevelsXpMid(levels)
    } else {
        return await calculateLevelsXpHigh(levels)
    }
}

async function calculateLevelsXpLow(levels) {
    return (levels*levels) + (6*levels)
}

async function calculateLevelsXpMid(levels) {
    return (2.5*(levels*levels)) - (40.5*levels) + 360
}

async function calculateLevelsXpHigh(levels) {
    return (4.5*(levels*levels)) - (162.5*levels) + 2220
}

async function validateInput(levels, points) {
    if (isNaN(levels) || isNaN(points)) {
        throw Error(xpCalculatorServiceErrorEnum.NON_NUMBER_INPUT)
    }
}

exports.calculatePoints = calculatePoints