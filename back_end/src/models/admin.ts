import mongoose, { Document, Model, Schema } from 'mongoose';

interface AdminDocument extends Document {
    Name: string;
    Email: string;
    Organisations: mongoose.Types.ObjectId[];
    Password: string;
}

const AdminSchema: Schema<AdminDocument> = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Organisations: [
        {
            type: Schema.Types.ObjectId,
            required: true,
        },
    ],
    Password: {
        type: String,
        required: true,
    },
});

const AdminModel: Model<AdminDocument> = mongoose.model<AdminDocument>(
    'Admin',
    AdminSchema
);

export default AdminModel;
