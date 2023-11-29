import 'bootstrap/dist/css/bootstrap.min.css';
import './Landing.css';
import NavigationBar from './NavigationBar';
import OrganisationCards from './OrganisationCards';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../global/Cookies';
import { useEffect } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        if (getCookie('token') === '') {
            navigate('/');
        }
    }, [navigate]); // Pass an empty array to only call the function once on mount.

    return (
        <div className="Landing">
            <NavigationBar />
            <h1 className="Landing-header">
                View
                <Badge bg="danger">Organisations</Badge>
                <Link to={`/register`} style={{ textDecoration: 'none' }}>
                    <Button
                        className="Landing-button"
                        variant="danger"
                        size="lg"
                    >
                        Register Volunteers
                    </Button>
                </Link>
            </h1>
            <div className="Landing-organisations">
                <OrganisationCards />
            </div>
            <div className="Landing-footer">
                <Footer />
            </div>
        </div>
    );
}

export default Landing;
