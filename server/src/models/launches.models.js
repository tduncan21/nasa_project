const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');
const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunchData(){
    const response = await axios.post(SPACEX_API_URL,{
        query: {},
        options: {
            pagination: false,
            populate: [{
                path: 'rocket',
                select: {
                    name: 1
                }
            },
            {
                path: 'payloads',
                select: {
                    'customers': 1
                }
            }]
        }
    });

    if(response.status !== 200){
        console.log('Problem downloading launch data');
        throw new Error('Error loading launch data');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
        };
        console.log(`${launch.flightNumber}, ${launch.mission}`);
        await saveLaunch(launch);
    }
    console.log('Launch data loaded');
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    console.log('Loading launch data...');
    if(firstLaunch){
        console.log('Launch data already loaded');
        return;
    }
    await populateLaunchData();    
}

async function findLaunch(filter){
    return launches.findOne(filter);
}

async function launchExistsById(launchId){
    const foundLaunch = await findLaunch({flightNumber: launchId});
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

async function getAllLaunches(skip, limit) {
    return launches.find({}, {'id': 0, '__v':0})
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch){
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
        throw new Error('No matching planet found');
    }

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
    loadLaunchData,
    launchExistsById,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,    
}