import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import NavigationBar from './NavigationBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Chart } from './Chart';
import Footer from './Footer';
import './Stats.css';
import { Badge } from 'react-bootstrap';
import DateRange from './DateRange';
import { useEffect, useState } from 'react';
import { getCookie } from '../global/Cookies';
import BaseUrl from '../global/Constants';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Question, SurveyResponses } from '../global/Types';
import { Link } from 'react-router-dom';

const mockQuestions: Question[] = [];

var wellbeing1: Question[] = [];

var wellbeing2: Question[] = [];

var wellbeing3: Question[] = [];

var employability1: Question[] = [];

var employability2: Question[] = [];

var volunteerConfidence1: Question[] = [];

var wellbeing4: Question[];

function Stats() {
    const [surveyData, setSurveyData] = useState<null | SurveyResponses>(null);
    const { org_name, id } = useParams();
    const config = {
        headers: {
            Authorization: getCookie('token'),
        },
    };
    var wellbeing: Question[];
    var employability: Question[];
    var volunteerConfidence: Question[];

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
    // question titles are edited to make chart titles make sense
    // To remove this we must edit database so that there are parent Questions that can have multiple child questions
    // eg parent "How often do you practice 5 ways of wellbeing?" has 5 children, Connect, Be Active ect..
    function editQuestions() {
        wellbeing[0].q = '';
        wellbeing[1].q = 'Connect';
        wellbeing[2].q = 'Be Active';
        wellbeing[3].q = 'Keep Learning';
        wellbeing[4].q = 'Be Aware';
        wellbeing[5].q = 'Help Others';
        wellbeing[6].q = 'Connect';
        wellbeing[7].q = 'Be Active';
        wellbeing[8].q = 'Keep Learning';
        wellbeing[9].q = 'Be Aware';
        wellbeing[10].q = 'Help Others';
        wellbeing[11].q = '';
        employability[1].q = 'Practical Skills';
        employability[2].q = 'Knowlege';
        employability[3].q = 'Confidence';
        employability[4].q = 'Social & Professional connection';
        employability[5].q = 'Practical Skills';
        employability[6].q = 'Knowlege';
        employability[7].q = 'Confidence';
        employability[8].q = 'Social & Professional connection';
        volunteerConfidence[0].q = 'Finding volunteering opportunities';
        volunteerConfidence[1].q = 'Applying for a volunteering role';
        volunteerConfidence[2].q = 'Knowing about my rights & responsibilities';
        volunteerConfidence[3].q = 'Asserting my rights & responsibilities';

        wellbeing1 = [wellbeing[0]];
        wellbeing4 = [wellbeing[11]];
        wellbeing2 = wellbeing.slice(1, 6);
        wellbeing3 = wellbeing.slice(6, 11);
        employability1 = employability.slice(1, 5);
        employability2 = employability.slice(5, 9);
        volunteerConfidence1 = volunteerConfidence.slice(0, 4);

        console.log('edited responses');
    }

    useEffect(() => {
        getResponses();
    }, []);
    if (surveyData === null) {
        return (
            <div className="stats">
                <NavigationBar />
                <h1 className="stats-header">
                    {org_name} <Badge bg="danger">Results</Badge>
                </h1>
                <div className="date-range">
                    <DateRange setSurveyData={setSurveyData} />
                </div>
                <Row>
                    <Col sm={8}>
                        <h3 className="category">Category</h3>
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
                        </Tabs>
                    </Col>
                    <Col sm={4}>
                        <div className="View-questions">
                            <Link
                                to={`/all-questions/${org_name}/${id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Button variant="danger" size="lg">
                                    View all questions
                                </Button>{' '}
                            </Link>
                        </div>
                    </Col>
                </Row>
                <div className="Landing-footer">
                    <Footer />
                </div>
            </div>
        );
    }
    wellbeing = surveyData.wellbeing;
    employability = surveyData.employability;
    volunteerConfidence = surveyData.volunteerConfidence;
    editQuestions();
    return (
        <div className="stats">
            <NavigationBar />
            <h1 className="stats-header">
                {org_name} <Badge bg="danger">Results</Badge>
            </h1>
            <div className="date-range">
                <DateRange setSurveyData={setSurveyData} />
            </div>
            <Row>
                <Col sm={8}>
                    <h3 className="category">Category</h3>
                    <Tabs
                        defaultActiveKey="wellbeing"
                        id="chart-tabs"
                        className="mb-3 custom-tab"
                        justify
                    >
                        <Tab eventKey="wellbeing" title="Wellbeing">
                            <h3 className="question">
                                How would you rate your wellbeing status?
                            </h3>
                            <Chart {...wellbeing1} />
                            <h3 className="question">
                                Survey 1: Do you think volunteering could help
                                improve your wellbeing? <br /> Survey 2: Do you
                                think volunteerng has helped you improve your
                                wellbeing?
                            </h3>
                            <Chart {...wellbeing4}></Chart>
                            <h3 className="question">
                                How often do you practice 5 ways of wellbeing?
                            </h3>
                            <Chart {...wellbeing2} />
                            <h3 className="question">
                                Survey 1: Do you think volunteering could help
                                you to practice the 5 ways of wellbeing? <br />{' '}
                                Survey 2: Has volunteering helped you to
                                practice the 5 ways of wellbeing?{' '}
                            </h3>
                            <Chart {...wellbeing3} />
                            <h3 className="question"></h3>
                        </Tab>
                        <Tab eventKey="employability" title="Employability">
                            <h3 className="question">
                                Do you feel you have enough of the following to
                                make changes to your work life?
                            </h3>
                            <Chart {...employability1} />
                            <h3 className="question">
                                Survey 1: Do you think volunteering could help
                                you improve the following abilities? <br />{' '}
                                Survey 2: Do you think volunteering has helped
                                you improve the following abilites?{' '}
                            </h3>
                            <Chart {...employability2} />
                        </Tab>
                        <Tab
                            eventKey="volunteerconfidence"
                            title="Volunteer Confidence"
                        >
                            <h3 className="question">
                                As a volunteer I am confident in
                            </h3>
                            <Chart {...volunteerConfidence1} />
                        </Tab>
                    </Tabs>
                </Col>
                <Col sm={4}>
                    <div className="View-questions">
                        <Link
                            to={`/all-questions/${org_name}/${id}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button variant="danger" size="lg">
                                View all questions
                            </Button>{' '}
                        </Link>
                    </div>
                </Col>
            </Row>
            <div className="Landing-footer">
                <Footer />
            </div>
        </div>
    );
}

export default Stats;
