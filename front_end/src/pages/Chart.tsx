import { queries } from '@testing-library/react';
import React, { PureComponent } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Question } from '../global/Types';

type questionData = {
    name: string;
    'Survey 1': number;
    'Survey 2': number;
    Change: number;
};

export const Chart = (questions: Question[]) => {
    var data: questionData[] = [];
    for (let i = 0; i < Object.keys(questions).length; i++) {
        const survey1: number = questions[i].data[0];
        const survey2: number = questions[i].data[1];
        const question: questionData = {
            name: questions[i].q,
            'Survey 1': questions[i].data[0],
            'Survey 2': questions[i].data[1],
            Change: survey2 - survey1,
        };
        data.push(question);
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <div>
                <BarChart
                    width={window.innerWidth * 0.673}
                    height={window.innerHeight * 0.45}
                    data={data}
                    margin={{
                        top: 10,
                        right: 150,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Survey 1" fill="#8884d8" />
                    <Bar dataKey="Survey 2" fill="#da1a32" />
                    <Bar dataKey="Change" fill="#FFA500" />
                </BarChart>
            </div>
        </ResponsiveContainer>
    );
};
