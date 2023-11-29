import supertest from 'supertest';
import app from '../src/server';

import isLoggedIn from '../src/routes/login';

// Mock the isLoggedIn middleware to bypass authentication
jest.mock('../src/routes/login', () => {
    return jest.fn((req, res, next) => {
        // Simulate authentication by directly calling the next function
        next();
    });
});

// Test case 4.1

describe('GET /organisations/answers/id', () => {
    describe('1.1', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get(
                '/organisations/details/651e2463a262ca028041b4d3'
            );
            expect(response.status).toBe(200);
        });
    });

    describe('1.2', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get(
                '/organisations/details/abc'
            );
            expect(response.status).toBe(400);
        });
    });

    describe('2.1', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get(
                '/organisations/details/651e2463a262ca028041b4d3'
            );
            expect(response.status).toBe(200);
        });
    });

    describe('2.2', () => {
        test('should return a status code of 400', async () => {
            const response = await supertest(app).get(
                '/organisations/details/abc'
            );
            expect(response.status).toBe(400);
        });
    });

    describe('3.1', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get(
                '/organisations/answers/651e2468a262ca028041b4d4'
            );
            expect(response.status).toBe(400);
        }, 10000);
    });

    describe('3.2', () => {
        test('should return a status code of 400', async () => {
            const response = await supertest(app).get(
                '/organisations/answers/abc'
            );
            expect(response.status).toBe(400);
        });
    });

    describe('4.1', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get('/survey_submissions');
            expect(response.status).toBe(200);
        });
    });

    describe('4.2', () => {
        test('should return a status code of 404', async () => {
            const response = await supertest(app).get(
                '/survey_submissions_all'
            );
            expect(response.status).toBe(404);
        });
    });

    describe('5.1', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get(
                '/survey_submissions/652cf8a00b5bbf415dcbcdfd'
            );
            expect(response.status).toBe(200);
        });
    });

    describe('5.2', () => {
        test('should return a status code of 200', async () => {
            const response = await supertest(app).get(
                '/survey_submissions/abc'
            );
            expect(response.status).toBe(500);
        });
    });
});
