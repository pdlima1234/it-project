import Table from 'react-bootstrap/Table';

function YesNoTable(survey1: number[], survey2: number[]) {
    const yesPercent1: number = (survey1[0] / (survey1[0] + survey1[1])) * 100;
    const yesPercent2: number = (survey2[0] / (survey2[0] + survey2[1])) * 100;
    const change: number = yesPercent2 - yesPercent1;

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Survey 1</th>
                    <th>Survey 2</th>
                    <th>Change (Percentage Points)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{`${yesPercent1.toFixed(2)}% Yes`}</td>
                    <td>{`${yesPercent2.toFixed(2)}% Yes`}</td>
                    <td>{change.toFixed(2)}</td>
                </tr>
            </tbody>
        </Table>
    );
}

export default YesNoTable;
