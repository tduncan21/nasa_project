require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URL = process.env.DB_URL;

mongoose.connection.on('open', () => {
    console.log('MongoDB ready');
});

mongoose.connection.on('err', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {mongoConnect, mongoDisconnect};