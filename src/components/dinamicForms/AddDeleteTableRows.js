import { useState } from 'react';
import TableRows from "./TableRows"
import { Table } from 'react-bootstrap';
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
        <Table className="table">
            <thead>
                <tr>
                    <th>Ingrediente</th>
                    <th>Unidade</th>
                    <th>Medida</th>
                    <th><button className="btn btn-outline-success" onClick={addTableRows} >+</button></th>
                </tr>

            </thead>
            <tbody>

                <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />

            </tbody>
        </Table>
    )

}
export default AddDeleteTableRows