require('dotenv').config();
const PORT = process.env.PORT || 8000;
const http = require('http');
const app = require('./app')
const {loadPlanetsData} = require('./models/planets.model');
const {mongoConnect} = require('./services/mongo');

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();


