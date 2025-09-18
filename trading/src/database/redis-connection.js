const redis = require('redis');
const { REDIS_URL } = require("../config");

const client = redis.createClient({
    url: 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis Connected'));

(async () => await client.connect())();

module.exports = client;

