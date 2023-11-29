import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';
import NavigationBar from './NavigationBar';
import { Badge } from 'react-bootstrap';
import Multiselect from './Multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; //core
import Footer from './Footer';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { getCookie } from '../global/Cookies';
import BaseUrl from '../global/Constants';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import AlertTitle from '@mui/material/AlertTitle';

function RegisterForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedOrganisations, setSelectedOrganisations] = useState([]);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [successText, setSuccessText] = useState(
        'miscellaneous error occured'
    );
    const [errorText, setErrorText] = useState('miscellaneous error occured');

    const handleOrganisationsChange = (selectedOrganisations: any) => {
        setSelectedOrganisations(selectedOrganisations);
        console.log(selectedOrganisations);
    };

    const handleFirstNameChange = (e: any) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: any) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const config = {
        headers: {
            Authorization: getCookie('token'),
        },
    };

    const handleSubmit = async () => {
        // Access the values of firstName, lastName, and email here
        const organisations: String[] = [];
        for (let i = 0; i < selectedOrganisations.length; i++) {
            console.log(selectedOrganisations[i]);
            organisations.push(selectedOrganisations[i]['id']);
        }

        try {
            const response = await axios.post(
                BaseUrl + '/volunteers/register',
                {
                    Email: email,
                    Name: firstName + ' ' + lastName,
                    Organisations: organisations,
                },
                config
            );

            setSuccessText(response.data);
            setSuccessOpen(true);
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                setErrorText(error.response.data.error);
            } else {
                console.log(error);
            }

            setErrorOpen(true);
        }
    };

    return (
        <div className="home">
            <MDBContainer fluid>
                <NavigationBar />
                <MDBRow className="justify-content-center align-items-center m-5">
                    <MDBCard>
                        <MDBCardBody className="px-4">
                            <h1
                                className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5"
                                style={{ paddingTop: '10px' }}
                            >
                                <Badge bg="danger">
                                    Volunteer Registration
                                </Badge>
                            </h1>

                            <MDBRow>
                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-4"
                                        label="First Name*"
                                        size="lg"
                                        id="form1"
                                        type="text"
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                    />
                                </MDBCol>

                                <MDBCol md="6">
                                    <MDBInput
                                        wrapperClass="mb-4"
                                        label="Last Name"
                                        size="lg"
                                        id="form2"
                                        type="text"
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <MDBRow>
                                <MDBCol md="12">
                                    <MDBInput
                                        wrapperClass="mb-4"
                                        label="Email*"
                                        size="lg"
                                        id="form4"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </MDBCol>
                            </MDBRow>

                            <div style={{ paddingBottom: '50px' }}>
                                <Multiselect
                                    onOrganisationsChange={
                                        handleOrganisationsChange
                                    }
                                />
                            </div>

                            <MDBBtn
                                className="mb-4"
                                color="danger"
                                size="lg"
                                style={{ width: '100px', height: '50px' }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </MDBBtn>

                            <MDBCol md="12">
                                <Collapse in={successOpen}>
                                    <Alert
                                        severity="success"
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setSuccessOpen(false);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                    >
                                        <AlertTitle>Success</AlertTitle>
                                        {successText}
                                    </Alert>
                                </Collapse>
                                <Collapse in={errorOpen}>
                                    <Alert
                                        severity="error"
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setErrorOpen(false);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                    >
                                        <AlertTitle>Error</AlertTitle>
                                        {errorText}
                                    </Alert>
                                </Collapse>
                            </MDBCol>
                        </MDBCardBody>
                    </MDBCard>
                </MDBRow>
            </MDBContainer>
            <div className="Landing-footer">
                <Footer />
            </div>
        </div>
    );
}

export default RegisterForm;
