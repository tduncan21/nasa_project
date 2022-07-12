const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');


describe('Planets API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    describe('Test GET /planets', () => {
        test('It should return status 200', async () => {
            const response = await request(app)
            .get('/v1/planets')
            .expect('Content-type', /json/)
            .expect(200);
        });
    });

    afterAll(async () => {
        await mongoDisconnect();
    });
});
