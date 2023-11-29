export enum QuestionType {
    NUMBER,
    TEXT,
    YESNO,
}

export type TextData = {
    '1': string;
    '2': string;
};

export type Question = {
    q: string;
    qType: string;
    data: any;
};

export type SurveyResponses = {
    demographicQuestions: Question[];
    employability: Question[];
    numbers: Question[];
    service: Question[];
    stories: Question[];
    volunteerConfidence: Question[];
    wellbeing: Question[];
};
