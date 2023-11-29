import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import BaseUrl from '../global/Constants';
import { useParams } from 'react-router-dom';
import { getCookie } from '../global/Cookies';
import { Question } from '../global/Types';

const DateRange = (props: { setSurveyData: (arg0: any) => void }) => {
    const [startDate, setStartDate] = useState('yyyy-mm-dd');
    const [endDate, setEndDate] = useState('yyyy-mm-dd');
    const [postcode, setPostcode] = useState('');
    const { id } = useParams();
    var postcodeParam;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: getCookie('token'),
            },
        };
        // send the log in request, expecting a token response
        if (postcode !== '') {
            postcodeParam = `&postcode=${postcode}`;
        } else {
            postcodeParam = '';
        }
        axios
            .get(
                BaseUrl +
                    `/organisations/answers/${id}?startDate=${startDate}&endDate=${endDate}${postcodeParam}`,
                config
            )
            .then((response: any) => {
                console.log('Response:', response.data);
                props.setSurveyData(response.data);
            })
            .catch((error: any) => {
                // Handle errors
                props.setSurveyData(null);
                console.error('Error:', error);
            });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="d-flex">
                <div className="mx-3">
                    <Form.Group controlId="formStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>
                </div>

                <div className="mx-3">
                    <Form.Group controlId="formEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                </div>

                <div className="mx-3">
                    <Form.Group controlId="formPostcode">
                        <Form.Label>Postcode</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Postcode"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                        />
                    </Form.Group>
                </div>

                <Button
                    variant="outline-danger"
                    type="submit"
                    style={{ marginTop: '32px', marginLeft: '10px' }}
                >
                    Search
                </Button>
            </div>
        </Form>
    );
};

export default DateRange;
