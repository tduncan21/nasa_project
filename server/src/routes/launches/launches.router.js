const express = require('express');
const launchesRouter = express.Router();
const {httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunchById} = require('./launches.controller');

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunchById);

module.exports = launchesRouter;

