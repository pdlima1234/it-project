import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import cron from 'node-cron';
import { reminderFreq, reminderAction } from './cron/survey_reminder_vars';

// code inspiration from https://www.youtube.com/watch?v=fgTGADljAeg
// connect to database
mongoose.connect(process.env.DATABASE_URL!);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// server to accept JSON
app.use(express.json());

// adds cors headers so our frontend app can make requests
const corsOpts = {
    origin: '*',
    methods: 'GET,POST',
};

app.use(cors(corsOpts));

// set up routes
import surveySubmissionsRouter from './routes/survey_submissions';
import organisationRouter from './routes/organisations';
import adminRouter from './routes/admins';
import volunteerRouter from './routes/volunteers';
app.use('/survey_submissions', surveySubmissionsRouter);
app.use('/organisations', organisationRouter);
app.use('/admins', adminRouter);
app.use('/volunteers', volunteerRouter);

if (process.env.NODE_ENV !== 'test')
    app.listen(process.env.BACK_END_LISTENING_PORT!, () =>
        console.log('Server Started')
    );

cron.schedule(reminderFreq, reminderAction);

export default app;
