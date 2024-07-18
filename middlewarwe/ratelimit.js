const ApiKey = require('../models/apiKeyModel');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const planLimits = {
    free: 1000,
    standard: 10000,
    premium: 100000,
};

async function rateLimit(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).send('API key required');
    }

    const apiKeyDetails = await ApiKey.findOne({ apiKey });
    if (!apiKeyDetails) {
        return res.status(401).send('Invalid API key');
    }

    const plan = apiKeyDetails.plan;
    const limit = planLimits[plan];

    const usageCount = await getUsageCount(apiKey);
    if (usageCount >= limit) {
        return res.status(429).send('Rate limit exceeded');
    }

    await recordUsage(apiKey);
    next();
}

async function getUsageCount(apiKey) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const res = await pool.query(
        'SELECT COUNT(*) FROM Usage WHERE apiKey = $1 AND timestamp >= $2',
        [apiKey, startOfDay]
    );
    return parseInt(res.rows[0].count, 10);
}

async function recordUsage(apiKey) {
    await pool.query('INSERT INTO Usage (apiKey) VALUES ($1)', [apiKey]);
}

module.exports = rateLimit;
