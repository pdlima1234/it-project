import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import vv_logo from './../images/vv_logo.png';
import axios from 'axios';
import BaseUrl from '../global/Constants';
import { setCookie, getCookie } from '../global/Cookies';
import './Login.css';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const sendLoginRequest = async () => {
        // send the log in request, expecting a token response
        try {
            const response = await axios.post(BaseUrl + '/admins/login', {
                Email: email,
                Password: password,
            });

            // set login token
            setCookie('token', response.data.authorization, 1);
        } catch (error) {
            setCookie('token', '', 1);
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }
    };

    const handleLogin = async () => {
        await sendLoginRequest();

        // retrieve login token
        const token = getCookie('token');

        if (token !== '') {
            navigate('/landing');
        } else {
            const loginText = document.getElementById('login-text');

            if (loginText) {
                loginText.innerText =
                    'The email or password you entered is incorrect. Please try again!';
                loginText.className = 'text-danger 50 mb-5';
            }

            // reset password to blank
            setPassword('');
        }
    };

    // reset the cookie everytime we enter the page
    useEffect(() => {
        setCookie('token', '', 1);
    }, []); // Pass an empty array to only call the function once on mount.

    return (
        <div className="login-body">
            <Outlet />
            <MDBContainer fluid>
                <MDBRow className="d-flex justify-content-center align-items-center h-100">
                    <MDBCol col="12">
                        <MDBCard
                            className="bg-light text-black my-5 mx-auto"
                            style={{ borderRadius: '1rem', maxWidth: '400px' }}
                        >
                            <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                                <div className="mb-5">
                                    <img
                                        src={vv_logo}
                                        height="70"
                                        className="d-inline-block align-middle"
                                        alt="Voluntering Victoria Logo"
                                    />
                                </div>

                                <h2 className="fw-bold mb-2 text-uppercase">
                                    Login
                                </h2>
                                <p
                                    id="login-text"
                                    className="text-black-50 mb-5"
                                >
                                    Please enter your login and password!
                                </p>

                                <MDBInput
                                    wrapperClass="mb-4 mx-5 w-100"
                                    labelClass="text-black"
                                    label="Email address"
                                    id="formControlLg"
                                    type="email"
                                    size="lg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <MDBInput
                                    wrapperClass="mb-4 mx-5 w-100"
                                    labelClass="text-black"
                                    label="Password"
                                    id="formControlLg"
                                    type="password"
                                    size="lg"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <MDBBtn
                                    outline
                                    className="mx-2 px-5"
                                    color="danger"
                                    size="lg"
                                    style={{ width: '200px', height: '50px' }}
                                    onClick={handleLogin}
                                    disabled={!email || !password}
                                >
                                    Login
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}

export default Login;
