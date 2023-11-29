import mongoose, { Document, Model, Schema } from 'mongoose';

interface VolunteerDocument extends Document {
    Name: string;
    Email: string;
    Password: string;
    SurveysSubmitted: mongoose.Types.ObjectId[];
    SurveysToDo: string;
}

const volunteerSchema: Schema<VolunteerDocument> = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    SurveysSubmitted: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SurveySubmissions',
            required: true,
        },
    ],
    SurveysToDo: [
        {
            type: String,
            default: [],
            required: true,
        },
    ],
});

const VolunteerModel: Model<VolunteerDocument> =
    mongoose.model<VolunteerDocument>('Volunteer', volunteerSchema);

export default VolunteerModel;
