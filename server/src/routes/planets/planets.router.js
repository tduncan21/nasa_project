const express = require('express');

const planetsRouter = express.Router();

const {getAllPlanets} = require('./planets.controller')

planetsRouter.use((req, res, next) => {
    console.log('ip address: ', req.ip);
    next();
});

planetsRouter.get('/', getAllPlanets);

module.exports = planetsRouter;