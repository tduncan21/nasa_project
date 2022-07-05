const express = require('express');

const planetsRouter = express.Router();

const {httpGetAllPlanets} = require('./planets.controller')

planetsRouter.use((req, res, next) => {
    console.log('ip address: ', req.ip);
    next();
});

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;