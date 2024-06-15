import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Table } from 'react-bootstrap';
import TableRows from "./TableRows";

function AddDeleteTableRows({ rowsData, setRowsData }) {

    const addTableRows = () => {
        const rowsInput = {
            desc: '',
            unidMedida: '',
            medida: ''
        };
        setRowsData(step => ({ ...step, produtos: [...rowsData, rowsInput] }));
    };

    const deleteTableRows = (index) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(step => ({ ...step, produtos: rows }));
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(step => ({ ...step, produtos: rowsInput }));
    };

    return (
        <Table>
            <thead className="justify-content-center">
                <tr>
                    <th>Ingrediente</th>
                    <th>Unidade</th>
                    <th>Medida</th>
                    <th className='d-flex justify-content-end'>
                        <Button variant="success" onClick={addTableRows}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </th>
                </tr>
            </thead>
            <tbody className="justify-content-between">
                <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
            </tbody>
        </Table>
    );
}

export default AddDeleteTableRows;
