import Login from './pages/Login';
import Landing from './pages/Landing';
import Stats from './pages/Stats';
import OrganisationHome from './pages/OrgHome';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AllQuestions from './pages/AllQuestions';
import RegisterForm from './pages/Register';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/stats/:org_name/:id" element={<Stats />} />
                <Route
                    path="/org_home/:org_name/:id"
                    element={<OrganisationHome />}
                />
                <Route
                    path="/all-questions/:org_name/:id"
                    element={<AllQuestions />}
                />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
