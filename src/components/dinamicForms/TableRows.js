import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { API_URL } from '../../constants/const';
import axios from "axios";
import { useEffect, useState } from 'react';

function TableRows({ rowsData, deleteTableRows, handleChange }) {
    const [medidas, setMedidas] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const medidas = await axios.get(API_URL + '/produtos/0/medidas')
                setMedidas(medidas.data);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchAll();

    }, []);

    const handleChangeRow = (event) => {
        setSelectedOption(event.target.value);
    };



    return (

        rowsData.map((data, index) => {
            const { ingrediente, unidade, medida } = data;
            return (

                <tr key={index}>
                    <td>
                        <Form.Control type="text" id="inputPassword5" aria-describedby="passwordHelpBlock" />
                    </td>

                    <td>
                        <Form.Control as="select" value={selectedOption} onChange={handleChangeRow}>
                            {medidas.map((medida, index) => (
                                <option key={index} value={medida.descricao}>
                                    {medida.descricao}
                                </option>
                            ))}
                        </Form.Control>
                    </td>

                    <td><input type="text" value={medida} onChange={(evnt) => (handleChange(index, evnt))} name="medida" className="form-control" /> </td>
                    <td><Button className="btn btn-outline-danger" onClick={() => (deleteTableRows(index))}>x</Button></td>
                </tr>
            )
        })

    )

}
export default TableRows;