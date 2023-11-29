import Table from 'react-bootstrap/Table';

function NumberTable(survey1: number, survey2: number) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Survey 1</th>
                    <th>Survey 2</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{survey1}</td>
                    <td>{survey2}</td>
                    <td>{(survey1 - survey2).toFixed(2)}</td>
                </tr>
            </tbody>
        </Table>
    );
}

export default NumberTable;
