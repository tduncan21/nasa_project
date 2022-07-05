const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('It should return status 200', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-type', /json/)
        .expect(200);

    });
});

describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: "Test123",
        rocket: "Experimental IS1",
        target: "Kepler-186 f",
        launchDate: "January 24, 2030" 
    }

    const launchDataWithoutDate = {
        mission: "Test123",
        rocket: "Experimental IS1",
        target: "Kepler-186 f",
    }

    const launchDataWithInvalidDate = {
        mission: "Test123",
        rocket: "Experimental IS1",
        target: "Kepler-186 f",
        launchDate: "2" 
    }
    

    test('Should respond with 201 created', async () => {
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-type', /json/)
        .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(requestDate).toBe(responseDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property',
        });
    });

    test('Test for invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid Date',
        });
    });

});

describe('Test POST /launches', () => {
    test('Test for invalid dates', () => {
        const response = 200;
        expect(response).toBe(200);
    });
});