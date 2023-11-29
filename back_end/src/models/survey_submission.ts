import mongoose, { Document, Model, Schema } from 'mongoose';

interface SurveySubmissionDocument extends Document {
    SubmissionDate: Date;
    Volunteer: mongoose.Types.ObjectId;
    QuestionSet: mongoose.Types.ObjectId;
    Answers: string[];
    Iteration: number;
    Reminded: boolean;
}

const surveySubmissionSchema: Schema<SurveySubmissionDocument> =
    new mongoose.Schema({
        SubmissionDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        Volunteer: {
            type: Schema.Types.ObjectId,
            ref: 'Volunteers',
            required: true,
        },
        QuestionSet: {
            type: Schema.Types.ObjectId,
            ref: 'QuestionSets',
            required: true,
        },
        Answers: [
            {
                type: String,
                required: true,
            },
        ],
        Iteration: {
            type: Number,
            required: true,
        },
        Reminded: {
            type: Boolean,
            required: true,
            default: false,
        },
    });

const SurveySubmissionModel: Model<SurveySubmissionDocument> =
    mongoose.model<SurveySubmissionDocument>(
        'survey_submission',
        surveySubmissionSchema
    );

export default SurveySubmissionModel;
