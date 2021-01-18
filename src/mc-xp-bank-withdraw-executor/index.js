require('dotenv').config();
const { log } = require('../util/logger.js');

exports.handler = async (event) => {
    await log(JSON.stringify(event, null, 2));

};