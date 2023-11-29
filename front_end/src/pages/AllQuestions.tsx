import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import NavigationBar from './NavigationBar';
import Row from 'react-bootstrap/Row';
import Footer from './Footer';
import './AllQuestions.css';
import { Badge } from 'react-bootstrap';
import QuestionWrapper from './QuestionWrapper';
import NumberTable from './NumberTable';
import YesNoTable from './YesNoTable';
import DateRange from './DateRange';
import { getCookie } from '../global/Cookies';
import BaseUrl from '../global/Constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question, SurveyResponses } from '../global/Types';
import * as XLSX from 'xlsx';
import { Button } from 'react-bootstrap';

var wellbeing: Question[] = [];

const mockQuestions: Question[] = [];

const mapQuestionToUI = (questions: Question[]): any[] => {
    return questions.map((question) => {
        return (
            <>
                <QuestionWrapper heading={question.q}>
                    {mapQuestionToInfo(question)}
                </QuestionWrapper>
            </>
        );
    });
};

const downloadExcel = (data: any) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, 'QuestionData.xlsx');
};

const mapQuestionToInfo = (question: Question): any => {
    if (
        question.qType === 'RatingOneToFiveQs' ||
        question.qType === 'RatingOneToTenQs' ||
        question.qType === 'NumberQs'
    ) {
        return NumberTable(
            question.data.map((num: string) => parseInt(num))[0],
            question.data.map((num: string) => parseInt(num))[1]
        );
    }
    if (question.qType === 'Text' || question.qType === 'DropDownQs') {
        return (
            <Button
                className="download-button"
                variant="danger"
                onClick={() => downloadExcel(question.data)}
            >
                {' '}
                Download As Excel
            </Button>
        );
    }
    if (question.qType === 'YesOrNoQs') {
        return YesNoTable(
            question.data.slice(0, 2).map((num: string) => parseInt(num)),
            question.data.slice(2, 4).map((num: string) => parseInt(num))
        );
    }
};

function AllQuestions() {
    const [surveyData, setSurveyData] = useState<null | SurveyResponses>(null);
    const { id } = useParams();
    const config = {
        headers: {
            Authorization: getCookie('token'),
        },
    };

    function getResponses() {
        // send the log in request, expecting a token response
        axios
            .get(BaseUrl + `/organisations/answers/${id}`, config)
            .then((response: any) => {
                console.log('Response:', response.data);
                setSurveyData(response.data);
            })
            .catch((error: any) => {
                // Handle errors
                console.error('Error:', error);
            });
    }
    useEffect(() => {
        getResponses();
    }, []);
    if (surveyData === null) {
        return (
            <div className="questions-page">
                <NavigationBar />
                <h1 className="all-questions">
                    All <Badge bg="danger">Questions</Badge>
                </h1>
                <Row>
                    <div className="date-range">
                        <DateRange setSurveyData={setSurveyData} />
                    </div>
                    <Tabs
                        defaultActiveKey="wellbeing"
                        id="chart-tabs"
                        className="mb-3 custom-tab"
                        justify
                    >
                        <Tab eventKey="wellbeing" title="Wellbeing"></Tab>
                        <Tab
                            eventKey="employability"
                            title="Employability"
                        ></Tab>
                        <Tab
                            eventKey="volunteerconfidence"
                            title="Volunteer Confidence"
                        ></Tab>
                        <Tab eventKey="stories" title="Stories"></Tab>
                        <Tab eventKey="service" title="Service"></Tab>
                    </Tabs>
                </Row>
                <div className="Landing-footer">
                    <Footer />
                </div>
            </div>
        );
    }
    return (
        <div className="questions-page">
            <NavigationBar />
            <h1 className="all-questions">
                All <Badge bg="danger">Questions</Badge>
            </h1>
            <Row>
                <div className="date-range">
                    <DateRange setSurveyData={setSurveyData} />
                </div>
                <div className="question-tabs">
                    <Tabs
                        defaultActiveKey="wellbeing"
                        id="chart-tabs"
                        className="mb-3 custom-tab"
                        justify
                    >
                        <Tab eventKey="wellbeing" title="Wellbeing">
                            {mapQuestionToUI(surveyData.wellbeing)}
                        </Tab>
                        <Tab eventKey="employability" title="Employability">
                            {mapQuestionToUI(surveyData.employability)}
                        </Tab>
                        <Tab
                            eventKey="volunteerconfidence"
                            title="Volunteer Confidence"
                        >
                            {mapQuestionToUI(surveyData.volunteerConfidence)}
                        </Tab>
                        <Tab eventKey="stories" title="Stories">
                            {mapQuestionToUI(surveyData.stories)}
                        </Tab>
                        <Tab eventKey="service" title="Service">
                            {mapQuestionToUI(surveyData.service)}
                        </Tab>
                    </Tabs>
                </div>
            </Row>
            <div className="Landing-footer">
                <Footer />
            </div>
        </div>
    );
}

export default AllQuestions;
