import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import vv_logo from './../images/vv_logo.png';
import vV_west from './../images/vv_west.png';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link to="/landing" style={{ textDecoration: 'none' }}>
                    <Navbar.Brand>
                        <img
                            src={vv_logo}
                            height="35"
                            className="d-inline-block align-middle"
                            alt="Voluntering Victoria Logo"
                        />
                        <img
                            src={vV_west}
                            height="40"
                            className="d-inline-block align-middle"
                            alt="Voluntering Victoria Logo"
                        />
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Account" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Account Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <NavDropdown.Item href="#action/3.4">
                                    Logout
                                </NavDropdown.Item>
                            </Link>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
