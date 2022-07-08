require('dotenv').config();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.DB_URL;
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app')
const {loadPlanetsData} = require('./models/planets.model')

const server = http.createServer(app);

mongoose.connection.on('open', () => {
    console.log('MongoDB ready');
});

mongoose.connection.on('err', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();


