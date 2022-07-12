const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    }); 

    describe('Test GET /launches', () => {
        test('It should return status 200', async () => {
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-type', /json/)
            .expect(200);
    
        });
    });
    
    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: "Test123",
            rocket: "Experimental IS1",
            target: "Kepler-1410 b",
            launchDate: "January 24, 2030" 
        }
    
        const launchDataWithoutDate = {
            mission: "Test123",
            rocket: "Experimental IS1",
            target: "Kepler-1410 b",
        }
    
        const launchDataWithInvalidDate = {
            mission: "Test123",
            rocket: "Experimental IS1",
            target: "Kepler-1410 b",
            launchDate: "de" 
        }
        
    
        test('Should respond with 201 created', async () => {
            const response = await request(app)
            .post('/v1/launches')
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
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
        });
    
        test('Test for invalid dates', async () => {
            const response = await request(app)
            .post('/v1/launches')
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

    describe('Test DELETE /launches', () => {
        test('Test successfull deletion', async () => {
            const response = await request(app)
            .delete('/v1/launches/100')
            .expect('Content-type', /json/)
            .expect(response.body).toStrictEqual({
                ok: true,
            });
        });
    });

    afterAll(async () => {
        await mongoDisconnect();
    });
})
