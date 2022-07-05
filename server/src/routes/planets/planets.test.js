const request = require('supertest');
const app = require('../../app');

describe('Test GET /planets', () => {
    test('It should return status 200', async () => {
        const response = await request(app)
        .get('/planets')
        .expect('Content-type', /json/)
        .expect(200);
    });
});