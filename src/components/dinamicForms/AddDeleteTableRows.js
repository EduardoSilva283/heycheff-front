import { useState } from 'react';
import TableRows from "./TableRows"
import { Table, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
function AddDeleteTableRows() {


    const [rowsData, setRowsData] = useState([]);

    const addTableRows = () => {

        const rowsInput = {
            ingrediente: '',
            unidade: '',
            medida: ''
        }
        setRowsData([...rowsData, rowsInput])

    }
    const deleteTableRows = (index) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
    }

    const handleChange = (index, evnt) => {

        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);



    }
    return (
        <Table>
            <thead className="justify-content-center" >
                <tr>
                    <th>Ingrediente</th>
                    <th>Unidade</th>
                    <th>Medida</th>
                    <th className='d-flex justify-content-end'>
                        <Button variant="success" onClick={addTableRows} >
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </th>
                </tr>

            </thead>
            <tbody className="justify-content-between">

                <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />

            </tbody>
        </Table>
    )

}
export default AddDeleteTableRows