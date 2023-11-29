import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import BaseUrl from '../global/Constants';
import axios from 'axios';
import { getCookie } from '../global/Cookies';

interface Organisation {
    name: string;
    id: string;
}

interface MultiselectProps {
    onOrganisationsChange: (selectedOrganisations: Organisation[]) => void;
}

export default function Multiselect({
    onOrganisationsChange,
}: MultiselectProps) {
    const navigate = useNavigate();
    const [options, setOptions] = useState([{ name: '...', id: '' }]);
    const [organisations, setOrganisations] = useState([]);

    useEffect(() => {
        const config = {
            headers: {
                Authorization: getCookie('token'),
            },
        };

        const getData = async () => {
            // send the log in request, expecting a token response
            axios
                .get(BaseUrl + '/admins/organisations', config)
                .then((response) => {
                    const names = response.data.names;
                    const ids = response.data.ids;
                    let newOrganisations: Organisation[] = [];
                    for (let i = 0; i < names.length; i++) {
                        newOrganisations.push({ name: names[i], id: ids[i] });
                    }

                    setOptions(newOrganisations);
                })
                .catch((error) => {
                    // Handle errors
                    console.error('Error:', error);
                });
        };

        getData();
    }, []); // Pass an empty array to only call the function once on mount.

    useEffect(() => {
        if (getCookie('token') === '') {
            navigate('/');
        }
    }, [organisations, navigate]);

    const handleOrganisationsChange = (e: any) => {
        setOrganisations(e.value);
        onOrganisationsChange(e.value); // Update selected organisations in the parent component
    };

    return (
        <div className="card flex justify-content-center">
            <MultiSelect
                value={organisations}
                onChange={handleOrganisationsChange}
                options={options}
                optionLabel="name"
                filter
                placeholder="Select Organisations to Add"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
            />
        </div>
    );
}
