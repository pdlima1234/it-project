import VolunteerModel from '../models/volunteer';
import SurveySubmissionModel from '../models/survey_submission';
import QuestionSetModel from '../models/question_set';
import nodemailer from 'nodemailer';

export const reminderFreq = '0 0 * * * *';
export const reminderAction = async () => {
    // if it is baseline survey and first of it that is 2 months old then
    // go through surveys and find corresponding 2nd version
    // if not find it then send email (then set reminded on first survey true)

    try {
        const volunteers = await VolunteerModel.find({});
        const currDate = new Date();
        const toDoVolunteers = [];
        const promises = volunteers.map(async (volunteer) => {
            for (const surveySubmissionId of volunteer.SurveysSubmitted) {
                try {
                    const surveySubmission =
                        await SurveySubmissionModel.findById(
                            surveySubmissionId
                        );
                    if (
                        surveySubmission.Iteration === 1 &&
                        surveySubmission.Reminded === false
                    ) {
                        const submissionDate = surveySubmission.SubmissionDate;
                        const monthsDiff =
                            currDate.getMonth() -
                            submissionDate.getMonth() +
                            12 *
                                (currDate.getFullYear() -
                                    submissionDate.getFullYear());
                        if (2 <= monthsDiff) {
                            const questionSet = await QuestionSetModel.findById(
                                surveySubmission.QuestionSet
                            );
                            if (questionSet.Name === 'Baseline survey') {
                                toDoVolunteers.push(volunteer);
                            }
                        }
                    }
                } catch (err: any) {
                    console.log('error retrieving survey submissions', err);
                    return;
                }
            }
        });
        await Promise.all(promises);
        for (const volunteer of toDoVolunteers) {
            const toDo = ['main'];
            volunteer.SurveysToDo = toDo;
            try {
                await volunteer.save((saveErr: any) => {
                    if (saveErr) {
                        console.error('Save error, ', saveErr);
                        return;
                    }
                });
            } catch (err) {
                console.error(err);
            }
            // send push request
        }
    } catch (err) {
        console.log('error while checking to send notifications', err);
    }
};
