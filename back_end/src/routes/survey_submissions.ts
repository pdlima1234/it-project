import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SurveySubmissionModel from '../models/survey_submission';
import VolunteerModel from '../models/volunteer';
import QuestionSetModel from '../models/question_set';

const surveySubmissionsRouter = express.Router();

// Getting all survey submissions
surveySubmissionsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const surveySubmissions = await SurveySubmissionModel.find();
        res.json(surveySubmissions);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Getting one survey submission
surveySubmissionsRouter.get(
    '/:id',
    getSurveySubmissionModel,
    (req: Request, res: Response) => {
        res.json(res.locals.survey);
    }
);

surveySubmissionsRouter.get(
    '/question_model_id/:name',
    async (req: Request, res: Response) => {
        const question_set = await QuestionSetModel.findOne({
            Name: req.params.name,
        });

        res.json(question_set.id);
    }
);

// Creating one survey submission
surveySubmissionsRouter.post(
    '/submit',
    validateSurveySubmissionModel,
    async (req: Request, res: Response) => {
        const surveySubmission = new SurveySubmissionModel({
            Volunteer: req.body.Volunteer,
            QuestionSet: req.body.QuestionSet,
            Answers: req.body.Answers,
            Iteration: req.body.Iteration,
        });

        try {
            const newSurveySubmissionModel = await surveySubmission.save();
            res.status(201).json(newSurveySubmissionModel);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }

        let volunteer: any;
        try {
            volunteer = await VolunteerModel.findById(
                surveySubmission.Volunteer
            );
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
        const surveysToDo = volunteer.SurveysToDo;
        if (!surveysToDo) return;
        const iteration = surveySubmission.Iteration;
        const idx1 = surveysToDo.indexOf('main');
        const idx2 = surveysToDo.indexOf('baseline');
        const idx3 = surveysToDo.indexOf('service');
        if (iteration == 2 && surveysToDo.includes('main'))
            surveysToDo.splice(idx1, 1);
        else if (iteration == 1 && surveysToDo.includes('baseline'))
            surveysToDo.splice(idx2, 1);
        else if (iteration == 3 && surveysToDo.includes('service'))
            surveysToDo.splice(idx3, 1);

        volunteer.SurveysToDo = surveysToDo;
        try {
            await volunteer.save();
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
);

async function validateSurveySubmissionModel(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // capture fields from JSON object
    const { Volunteer, QuestionSet, Answers, Iteration } = req.body;

    // check all fields are present (submission date does not need to be)
    if (!Volunteer || !QuestionSet || !Answers || !Iteration)
        return res.status(400).json({ message: 'Some fields may be missing' });

    // check if volunteer object id is valid
    if (!mongoose.Types.ObjectId.isValid(Volunteer))
        return res
            .status(400)
            .json({ message: 'Invalid format for volunteer field' });

    // check if question set object id is valid
    if (!mongoose.Types.ObjectId.isValid(QuestionSet))
        return res
            .status(400)
            .json({ message: 'Invalid format for question set field' });

    // check if answers is an array
    if (!Array.isArray(Answers))
        return res
            .status(400)
            .json({ message: 'Answers must be an array of strings' });

    // check if answers is an array of strings
    if (!Answers.every((answer) => typeof answer === 'string'))
        return res
            .status(400)
            .json({ message: 'Answers must be an array of strings' });

    // check if iteration is either one or two
    if (Iteration !== 1 && Iteration !== 2)
        return res
            .status(400)
            .json({ message: 'Iteration must be either one or two' });

    try {
        // check if volunteer object id points to document in volunteers collection
        const volunteer = await VolunteerModel.findById(Volunteer);
        if (!volunteer)
            return res
                .status(400)
                .json({ message: 'Volunteer object id not found' });

        // check if question set object id points to document in volunteers collection
        const questionSet = await QuestionSetModel.findById(QuestionSet);
        if (!questionSet)
            return res
                .status(400)
                .json({ message: 'Question set object id not found' });

        // check if the length of the answers array is equal to the amount of
        // questions in question set
        if (Answers.length !== questionSet.QAmount)
            return res.status(400).json({
                message:
                    'Answer array length does not match the number of questions for the question set',
            });

        // TODO: check if each answer is in the right format according to the
        // question set
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }

    next();
}

async function getSurveySubmissionModel(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const surveySubmission = await SurveySubmissionModel.findById(
            req.params.id
        );
        if (!surveySubmission) {
            return res.status(404).json({ message: 'Cannot find survey' });
        }
        res.locals.surveySubmission = surveySubmission;
        next();
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export default surveySubmissionsRouter;
