import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BaseUrl from '../global/Constants';
import { getCookie } from '../global/Cookies';
import { useEffect, useState } from 'react';

function OrganisationCards() {
    const [organisations, setOrganisations] = useState({
        ids: [],
        names: [],
        logos: [],
    });

    useEffect(() => {
        const config = {
            headers: {
                Authorization: getCookie('token'),
            },
        };

        const getOrganisations = async () => {
            // send the log in request, expecting a token response
            axios
                .get(BaseUrl + '/admins/organisations', config)
                .then((response) => {
                    console.log('Response:', response.data);
                    setOrganisations(response.data);
                })
                .catch((error) => {
                    // Handle errors
                    console.error('Error:', error);
                });
        };

        getOrganisations();
    }, []); // Pass an empty array to only call the function once on mount.

    return (
        <Row xs={1} md={12} className="g-4">
            {' '}
            {/* Set md={4} for 4 columns on medium screens */}
            {Array.from({ length: organisations.ids.length }).map((_, idx) => (
                <Col key={idx} md={3}>
                    {' '}
                    {/* Set md={6} to take up 6 columns on medium screens */}
                    <Link
                        to={`/org_home/${organisations.names[idx]}/${organisations.ids[idx]}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Card>
                            <Card.Img
                                variant="top"
                                height="250"
                                src={organisations.logos[idx]}
                            />
                            <Card.Body>
                                <Card.Title>
                                    {organisations.names[idx]}
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            ))}
        </Row>
    );
}

export default OrganisationCards;
