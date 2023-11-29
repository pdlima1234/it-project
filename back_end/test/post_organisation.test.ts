import supertest from 'supertest';
import app from '../src/server';

describe('1.1', () => {
    it('Has everything Valid', async () => {
        const requestBody = {
            SubmissionDate: '2023-11-11T08:00:00.000Z',
            Volunteer: '6505325cab7fca80c7a56cd0',
            QuestionSet: '650536fd099b3e6604f3ce6d',
            Answers: [
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
            ],
            Iteration: 1,
            Reminded: false,
        };

        const response = await supertest(app)
            .post('/survey_submissions/submit')
            .send(requestBody);

        expect(response.status).toBe(201);
    });
});

describe('1.2', () => {
    it('Has invalid volunteer value', async () => {
        const requestBody = {
            SubmissionDate: '2023-11-11T08:00:00.000Z',
            Volunteer: 'abc',
            QuestionSet: '650536fd099b3e6604f3ce6d',
            Answers: [
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
            ],
            Iteration: 1,
            Reminded: false,
        };

        const response = await supertest(app)
            .post('/survey_submissions/submit')
            .send(requestBody);

        expect(response.status).toBe(400);
    });
});

describe('1.3', () => {
    it('Has invalid answers value', async () => {
        const requestBody = {
            SubmissionDate: '2023-11-11T08:00:00.000Z',
            Volunteer: '6505325cab7fca80c7a56cd0',
            QuestionSet: '650536fd099b3e6604f3ce6d',
            Answers: ['1', '1', '1', '1', '1'],
            Iteration: 1,
            Reminded: false,
        };

        const response = await supertest(app)
            .post('/survey_submissions/submit')
            .send(requestBody);

        expect(response.status).toBe(400);
    });
});

describe('1.4', () => {
    it('Has invalid Iteration value', async () => {
        const requestBody = {
            SubmissionDate: '2023-11-11T08:00:00.000Z',
            Volunteer: '6505325cab7fca80c7a56cd0',
            QuestionSet: '650536fd099b3e6604f3ce6d',
            Answers: [
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
            ],
            Iteration: 20,
            Reminded: false,
        };

        const response = await supertest(app)
            .post('/survey_submissions/submit')
            .send(requestBody);

        expect(response.status).toBe(400);
    });
});

describe('1.5', () => {
    it('Has invalid QuestionSet Value', async () => {
        const requestBody = {
            SubmissionDate: '2023-11-11T08:00:00.000Z',
            Volunteer: '6505325cab7fca80c7a56cd0',
            QuestionSet: 'abc',
            Answers: [
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
                '1',
            ],
            Iteration: 1,
            Reminded: false,
        };

        const response = await supertest(app)
            .post('/survey_submissions/submit')
            .send(requestBody);

        expect(response.status).toBe(400);
    });
});
