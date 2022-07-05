const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(Number(launch.flightNumber), launch);

function launchExistsById(launchId){
    return launches.has(launchId)
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    latestFlightNumber++;    
    launches.set(latestFlightNumber, 
        Object.assign(launch, {
            upcoming: true,
            success: true,
            customers: ['Home', 'NASA'],
            flightNumber: latestFlightNumber,
        })
    );
}

function abortLaunchById(launchId) {
    const abortedLaunch = launches.get(launchId);
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch;
}

module.exports = {
    launchExistsById,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,    
}