import mongoose, { Document, Model, Schema } from 'mongoose';

interface OrganisationDocument extends Document {
    Name: string;
    Logo: string;
    Admins: mongoose.Types.ObjectId[];
    Volunteers: mongoose.Types.ObjectId[];
}

const OrganisationSchema: Schema<OrganisationDocument> = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Logo: {
        type: String,
        required: true,
    },
    Admins: [
        {
            type: Schema.Types.ObjectId,
            required: true,
        },
    ],
    Volunteers: [
        {
            type: Schema.Types.ObjectId,
            required: true,
        },
    ],
});

const OrganisationModel: Model<OrganisationDocument> =
    mongoose.model<OrganisationDocument>('Organisation', OrganisationSchema);

export default OrganisationModel;
