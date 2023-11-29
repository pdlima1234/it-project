import express, { Request, Response, NextFunction, json } from 'express';
import mongoose from 'mongoose';
import OrganisationModel from '../models/organisation';
import VolunteerModel from '../models/volunteer';
import SurveySubmissionModel from '../models/survey_submission';
import QuestionSetModel from '../models/question_set';
import isLoggedIn from './login';

const organisationRouter = express.Router();

organisationRouter.get(
    '/details/:id',
    isLoggedIn,
    async (req: Request, res: Response) => {
        let total = 0;
        let surveyOne = 0;
        let surveyTwo = 0;

        try {
            const organisationId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(organisationId))
                return res
                    .status(400)
                    .json({ message: 'Is not valid object id' });
            const organisation =
                await OrganisationModel.findById(organisationId);
            if (!organisation)
                return res
                    .status(404)
                    .json({ message: 'Cannot find organisation' });

            total += organisation.Volunteers.length;

            for (const volunteerId of organisation.Volunteers) {
                const volunteer = await VolunteerModel.findById(volunteerId);
                if (volunteer.SurveysSubmitted.length == 1) {
                    surveyOne += 1;
                }
                if (volunteer.SurveysSubmitted.length == 2) {
                    surveyTwo += 1;
                }
            }

            res.json({
                name: organisation.Name,
                total: total,
                surveyOne: surveyOne,
                surveyTwo: surveyTwo,
            });
        } catch (err: any) {
            return res.status(500).json({ message: 'Error in orgRouter' });
        }
    }
);

organisationRouter.get(
    '/answers/:id',
    getOrganisationModel,
    validateGetVolunteers,
    validateGetSurveySubmissions,
    getAnswers,
    (req: Request, res: Response) => {
        res.json(res.locals.answerData);
    }
);

async function getOrganisationModel(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const organisationId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(organisationId))
            return res.status(400).json({ message: 'Is not valid object id' });
        const organisation = await OrganisationModel.findById(organisationId);
        if (!organisation)
            return res
                .status(404)
                .json({ message: 'Cannot find organisation' });
        res.locals.organisation = organisation;
    } catch (err: any) {
        return res.status(500).json({ message: 'Error in getOrgModel' });
    }

    next();
}

async function validateGetVolunteers(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const volunteers = [];

    try {
        for (const volunteerId of res.locals.organisation.Volunteers) {
            if (!mongoose.Types.ObjectId.isValid(volunteerId))
                return res.status(400).json({
                    message: 'Volunteers array of organisation is erraneous',
                });
            const volunteer = await VolunteerModel.findById(volunteerId);
            if (!volunteer)
                return res.status(400).json({
                    message:
                        'A volunteer from the volunteer array of organisation is not found',
                });
            volunteers.push(volunteer);
        }
        if (volunteers.length === 0)
            return res
                .status(404)
                .json({ message: 'Organisation does not have volunteers' });
        res.locals.volunteers = volunteers;
    } catch (err: any) {
        return res.status(500).json({ message: 'validateGetVolunteer' });
    }

    next();
}

async function validateGetSurveySubmissions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const surveySubmissions = [];
    let startDate: Date;
    let endDate: Date;
    let postcode: string;
    if (req.query.startDate && typeof req.query.startDate === 'string') {
        if (!isNaN(Date.parse(req.query.startDate)))
            startDate = new Date(req.query.startDate);
        else return res.status(400).json({ error: 'Invalid date format' });
    }
    if (req.query.endDate && typeof req.query.endDate === 'string') {
        if (!isNaN(Date.parse(req.query.endDate)))
            endDate = new Date(req.query.endDate);
        else return res.status(400).json({ error: 'Invalid date format' });
    }
    if (req.query.postcode && typeof req.query.postcode === 'string') {
        postcode = req.query.postcode;
    }

    try {
        for (const volunteer of res.locals.volunteers) {
            if (volunteer.SurveysSubmitted.length < 2) {
                continue;
            }
            for (const surveySubmissionId of volunteer.SurveysSubmitted) {
                if (!mongoose.Types.ObjectId.isValid(surveySubmissionId))
                    return res.status(400).json({
                        message:
                            'A survey submission id of a volunteer is invalid',
                    });
                const surveySubmission =
                    await SurveySubmissionModel.findById(surveySubmissionId);
                if (!surveySubmission)
                    return res.status(400).json({
                        message:
                            'A survey submission of a volunteer is not found',
                    });
                const submissionDate = surveySubmission.SubmissionDate;
                const submissionPostcode = surveySubmission.Answers[35];
                if (postcode && submissionPostcode !== postcode) {
                    continue;
                }
                if (startDate && submissionDate < startDate) continue;
                if (endDate && endDate < submissionDate) continue;
                surveySubmissions.push(surveySubmission);
            }
        }
        console.log(surveySubmissions);
        if (surveySubmissions.length === 0)
            return res
                .status(404)
                .json({ message: 'No survey submissions found' });
        res.locals.surveySubmissions = surveySubmissions;
    } catch (err: any) {
        return res
            .status(500)
            .json({ message: 'Error in validate get survey submissions' });
    }

    next();
}

async function getAnswers(req: Request, res: Response, next: NextFunction) {
    let categoryFilter: string;
    if (req.query.category && typeof req.query.category === 'string') {
        if (
            req.query.category !== 'wellbeing' &&
            req.query.category !== 'employability' &&
            req.query.category !== 'volunteerConfidence' &&
            req.query.category !== 'demographicQuestions' &&
            req.query.category !== 'numbers' &&
            req.query.category !== 'stories' &&
            req.query.category !== 'service'
        )
            return res.status(400).json({
                message:
                    'category parameter did not match any available existing category',
            });
        categoryFilter = req.query.category;
    }

    const wellbeing = [];
    const employability = [];
    const volunteerConfidence = [];
    const demographicQuestions = [];
    const numbers = [];
    const stories = [];
    const service = [];

    function chooseCategory(category: string, questionObject: any) {
        switch (category) {
            case 'Wellbeing':
                wellbeing.push(questionObject);
                break;
            case 'Employability':
                employability.push(questionObject);
                break;
            case 'Volunteer Confidence':
                volunteerConfidence.push(questionObject);
                break;
            case 'Demographic Questions':
                demographicQuestions.push(questionObject);
                break;
            case 'Numbers':
                numbers.push(questionObject);
                break;
            case 'Stories':
                stories.push(questionObject);
                break;
            case 'Service':
                service.push(questionObject);
                break;
            default:
                break;
        }
    }

    const questionSetId = res.locals.surveySubmissions[0].QuestionSet;

    let questionSet: any;
    try {
        questionSet = await QuestionSetModel.findById(questionSetId);
    } catch (err: any) {
        return res.status(500).json({ message: 'error in choose category' });
    }

    for (const qNum of questionSet.TextQs) {
        const q: number = questionSet.Qs[qNum - 1];
        const qType = 'Text';
        const data = [];
        const category =
            questionSet.CategoryIdx[questionSet.Categories[qNum - 1]];
        for (const surveySubmission of res.locals.surveySubmissions) {
            const whichIteration: number = surveySubmission.Iteration;
            if (whichIteration !== 1 && whichIteration !== 2) {
                return res.status(500).json({
                    message:
                        'a survey submission had an erranously recorded iteration',
                });
            }
            if (whichIteration === 1) {
                var singleData = { '1': surveySubmission.Answers[qNum - 1] };
            }

            if (whichIteration === 2) {
                singleData['2'] = surveySubmission.Answers[qNum - 1];
                data.push(singleData);
            }
        }
        const textQObject = { q, qType, data };
        chooseCategory(category, textQObject);
    }

    for (const qNum of questionSet.YesOrNoQs) {
        const q = questionSet.Qs[qNum - 1];
        const qType = 'YesOrNoQs';
        const data = [];
        let numYesOne = 0;
        let numNoOne = 0;
        let numYesTwo = 0;
        let numNoTwo = 0;
        const category =
            questionSet.CategoryIdx[questionSet.Categories[qNum - 1]];
        for (const surveySubmission of res.locals.surveySubmissions) {
            const whichIteration: number = surveySubmission.Iteration;
            if (whichIteration !== 1 && whichIteration !== 2)
                return res.status(500).json({
                    message:
                        'a survey submission had an erranously recorded iteration',
                });
            if (whichIteration === 1) {
                if ('yes' === surveySubmission.Answers[qNum - 1]) numYesOne++;
                else if ('no' === surveySubmission.Answers[qNum - 1])
                    numNoOne++;
            } else if (whichIteration === 2) {
                if ('yes' === surveySubmission.Answers[qNum - 1]) numYesTwo++;
                else if ('no' === surveySubmission.Answers[qNum - 1])
                    numNoTwo++;
            }
        }
        data.push(numYesOne.toString());
        data.push(numNoOne.toString());
        data.push(numYesTwo.toString());
        data.push(numNoTwo.toString());
        const textQObject = { q, qType, data };
        chooseCategory(category, textQObject);
    }

    for (const qNum of questionSet.RatingOneToFiveQs) {
        const q = questionSet.Qs[qNum - 1];
        const qType = 'RatingOneToFiveQs';
        const data = [];
        let netRatingsOne = 0;
        let numOnes = 0;
        let netRatingsTwo = 0;
        let numTwos = 0;
        const category =
            questionSet.CategoryIdx[questionSet.Categories[qNum - 1]];
        for (const surveySubmission of res.locals.surveySubmissions) {
            const whichIteration: number = surveySubmission.Iteration;
            if (whichIteration !== 1 && whichIteration !== 2)
                return res.status(500).json({
                    message:
                        'a survey submission had an erranously recorded iteration',
                });
            if (whichIteration === 1) {
                netRatingsOne += Number(surveySubmission.Answers[qNum - 1]);
                numOnes++;
            } else if (whichIteration === 2) {
                netRatingsTwo += Number(surveySubmission.Answers[qNum - 1]);
                numTwos++;
            }
        }
        if (numOnes !== 0) data.push((netRatingsOne / numOnes).toString());
        else data.push('-1');
        if (numTwos !== 0) data.push((netRatingsTwo / numTwos).toString());
        else data.push('-1');
        const textQObject = { q, qType, data };
        chooseCategory(category, textQObject);
    }

    for (const qNum of questionSet.RatingOneToTenQs) {
        const q = questionSet.Qs[qNum - 1];
        const qType = 'RatingOneToTenQs';
        const data = [];
        let netRatingsOne = 0;
        let numOnes = 0;
        let netRatingsTwo = 0;
        let numTwos = 0;
        const category =
            questionSet.CategoryIdx[questionSet.Categories[qNum - 1]];
        for (const surveySubmission of res.locals.surveySubmissions) {
            const whichIteration: number = surveySubmission.Iteration;
            if (whichIteration !== 1 && whichIteration !== 2)
                return res.status(500).json({
                    message:
                        'a survey submission had an erranously recorded iteration',
                });
            if (whichIteration === 1) {
                netRatingsOne += Number(surveySubmission.Answers[qNum - 1]);
                numOnes++;
            } else if (whichIteration === 2) {
                netRatingsTwo += Number(surveySubmission.Answers[qNum - 1]);
                numTwos++;
            }
        }
        if (numOnes !== 0) data.push((netRatingsOne / numOnes).toString());
        else data.push('-1');
        if (numTwos !== 0) data.push((netRatingsTwo / numTwos).toString());
        else data.push('-1');
        const textQObject = { q, qType, data };
        chooseCategory(category, textQObject);
    }

    for (const qNum of questionSet.NumberQs) {
        const q = questionSet.Qs[qNum - 1];
        const qType = 'NumberQs';
        const data = [];
        let netOne = 0;
        let numOne = 0;
        let netTwo = 0;
        let numTwo = 0;
        const category =
            questionSet.CategoryIdx[questionSet.Categories[qNum - 1]];
        for (const surveySubmission of res.locals.surveySubmissions) {
            const whichIteration: number = surveySubmission.Iteration;
            if (whichIteration !== 1 && whichIteration !== 2)
                return res.status(500).json({
                    message:
                        'a survey submission had an erranously recorded iteration',
                });
            if (whichIteration === 1) {
                netOne += Number(surveySubmission.Answers[qNum - 1]);
                numOne++;
            } else if (whichIteration === 2) {
                netTwo += Number(surveySubmission.Answers[qNum - 1]);
                numTwo++;
            }
        }
        if (numOne !== 0) data.push((netOne / numOne).toString());
        else data.push('-1');
        if (numTwo !== 0) data.push((netTwo / numTwo).toString());
        else data.push('-1');
        const textQObject = { q, qType, data };
        chooseCategory(category, textQObject);
    }

    for (const qNum of questionSet.DropDownQs) {
        const q = questionSet.Qs[qNum - 1];
        const qType = 'DropDownQs';
        const data = [];
        const category =
            questionSet.CategoryIdx[questionSet.Categories[qNum - 1]];
        for (const surveySubmission of res.locals.surveySubmissions) {
            const whichIteration: number = surveySubmission.Iteration;
            if (whichIteration !== 1 && whichIteration !== 2)
                return res.status(500).json({
                    message:
                        'a survey submission had an erranously recorded iteration',
                });
            if (whichIteration === 1)
                data.push('1: ' + surveySubmission.Answers[qNum - 1]);
            else if (whichIteration === 2)
                data.push('2: ' + surveySubmission.Answers[qNum - 1]);
        }
        const textQObject = { q, qType, data };
        chooseCategory(category, textQObject);
    }

    if (categoryFilter) {
        switch (categoryFilter) {
            case 'wellbeing':
                res.locals.answerData = { wellbeing };
                break;
            case 'employability':
                res.locals.answerData = { employability };
                break;
            case 'volunteerConfidence':
                res.locals.answerData = { volunteerConfidence };
                break;
            case 'demographicQuestions':
                res.locals.answerData = { demographicQuestions };
                break;
            case 'numbers':
                res.locals.answerData = { numbers };
                break;
            case 'stories':
                res.locals.answerData = { stories };
                break;
            case 'service':
                res.locals.answerData = { service };
                break;
        }
    } else {
        const answerData = {
            wellbeing,
            employability,
            volunteerConfidence,
            demographicQuestions,
            numbers,
            stories,
            service,
        };
        res.locals.answerData = answerData;
    }

    next();
}

export default organisationRouter;
