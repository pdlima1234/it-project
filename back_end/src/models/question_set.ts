import mongoose, { Document, Model, Schema } from 'mongoose';

const positiveIntTest = (num: number) => {
    num > 0 && Number.isInteger(num);
};

interface QuestionSetDocument extends Document {
    Name: string;
    TextQs: number[];
    RatingOneToFiveQs: number[];
    RatingOneToTenQs: number[];
    YesOrNoQs: number[];
    NumberQs: number[];
    DropDownQs: number[];
    Qs: string[];
    QAmount: number;
    Categories: number[];
    CategoryIdx: String[];
}

const QuestionSetSchema: Schema<QuestionSetDocument> = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    TextQs: [
        {
            type: Number,
            required: true,
            validate: {
                validator: positiveIntTest,
                message: 'TestQs must be a positive integer.',
            },
        },
    ],
    RatingOneToFiveQs: [
        {
            type: Number,
            required: true,
            validate: {
                validator: positiveIntTest,
                message: 'TestQs must be a positive integer.',
            },
        },
    ],
    RatingOneToTenQs: [
        {
            type: Number,
            required: true,
            validate: {
                validator: positiveIntTest,
                message: 'TestQs must be a positive integer.',
            },
        },
    ],
    YesOrNoQs: [
        {
            type: Number,
            required: true,
            validate: {
                validator: positiveIntTest,
                message: 'TestQs must be a positive integer.',
            },
        },
    ],
    NumberQs: [
        {
            type: Number,
            required: true,
            validate: {
                validator: positiveIntTest,
                message: 'TestQs must be a positive integer.',
            },
        },
    ],
    DropDownQs: [
        {
            type: Number,
            required: true,
            validate: {
                validator: positiveIntTest,
                message: 'TestQs must be a positive integer.',
            },
        },
    ],
    Qs: [
        {
            type: String,
            required: true,
        },
    ],
    QAmount: {
        type: Number,
        required: true,
    },
    Categories: [
        {
            type: Number,
            required: true,
        },
    ],
    CategoryIdx: [
        {
            type: String,
            required: true,
        },
    ],
});

const QuestionSetModel: Model<QuestionSetDocument> =
    mongoose.model<QuestionSetDocument>('question_set', QuestionSetSchema);

export default QuestionSetModel;
