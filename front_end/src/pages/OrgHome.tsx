import 'bootstrap/dist/css/bootstrap.min.css';
import './OrgHome.css';
import NavigationBar from './NavigationBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Footer from './Footer';
import Pichart from './Piechart';
import { Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCookie } from '../global/Cookies';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BaseUrl from '../global/Constants';

function OrganisationHome() {
    const { id, org_name } = useParams();
    const navigate = useNavigate();
    const [valid, setValid] = useState(true);
    const [data, setData] = useState([
        { name: 'Survery One', value: 0 },
        { name: 'Survey Two', value: 0 },
        { name: 'No Surveys', value: 0 },
    ]);

    useEffect(() => {
        const config = {
            headers: {
                Authorization: getCookie('token'),
            },
        };

        const getData = async () => {
            // send the log in request, expecting a token response
            axios
                .get(BaseUrl + '/organisations/details/' + id, config)
                .then((response) => {
                    console.log('Response:', response.data);
                    const newData = [
                        { name: 'Survery One', value: response.data.surveyOne },
                        { name: 'Survey Two', value: response.data.surveyTwo },
                        {
                            name: 'No Surveys',
                            value:
                                response.data.total -
                                response.data.surveyTwo -
                                response.data.surveyOne,
                        },
                    ];

                    setData(newData);
                })
                .catch((error) => {
                    // Handle errors
                    console.error('Error:', error);
                });
        };

        const sendValidationRequest = async () => {
            // send the log in request, expecting a token response
            try {
                const response = await axios.post(
                    BaseUrl + '/admins/validate',
                    {
                        id: id,
                    },
                    config
                );

                setValid(response.data);
                console.log(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error(error);
                }
            }
        };

        sendValidationRequest();
        getData();
    }, [id]); // Pass an empty array to only call the function once on mount.

    useEffect(() => {
        console.log(valid);
        if (getCookie('token') === '' || !valid) {
            console.log(valid);
            navigate('/');
        }
    }, [valid, data, navigate]);

    return (
        <div className="home">
            <NavigationBar />
            <div className="display">
                <Row>
                    <Col sm={4}>
                        <h1 className="stats-header">{org_name}</h1>
                        <div className="num-volunteers">
                            <h2>
                                {' '}
                                {data[0].value +
                                    data[1].value +
                                    data[2].value}{' '}
                                <Badge bg="danger">Volunteers</Badge> Registered
                            </h2>
                        </div>
                    </Col>
                    <Col sm={8}>
                        <div className="org-chart">
                            <Pichart data={data} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <p> </p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <h2 className="push-left">View Results</h2>
                        <div className="push-left">
                            <Link
                                to={`/stats/${org_name}/${id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Button variant="danger">View</Button>
                            </Link>
                        </div>
                    </Col>
                    <Col sm={1}></Col>
                    <Col sm={3}>
                        <div className="push-left">
                            <h2>View Questions</h2>
                            <Link
                                to={`/all-questions/${org_name}/${id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Button variant="danger">View</Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="Landing-footer">
                <Footer />
            </div>
        </div>
    );
}

export default OrganisationHome;
