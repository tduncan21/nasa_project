const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Test',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['Home', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

async function launchExistsById(launchId){
    const foundLaunch = await launches.findOne({flightNumber: launchId});
    if(!foundLaunch) return false;
    return true;
}

async function getLatestFlightNumber(){
    const latestFlightNumber = await launches.findOne().sort('-flightNumber');
    if(!latestFlightNumber){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestFlightNumber.flightNumber;
}

async function getAllLaunches() {
    return launches.find({}, {'id': 0, '__v':0});
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
        throw new Error('No matching planet found');
    }

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ['Home', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false,
    });
    return aborted.modifiedCount === 1;
}

module.exports = {
    launchExistsById,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,    
}