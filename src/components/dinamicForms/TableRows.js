import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { API_URL } from '../../constants/const';
import axios from "axios";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
                        <Form.Control type="text"/>
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

                    <td><Form.Control type="text" value={medida} onChange={(evnt) => (handleChange(index, evnt))} name="medida"/> </td>
                    <td className='d-flex justify-content-end'><Button variant="danger" onClick={() => (deleteTableRows(index))}>
                        <FontAwesomeIcon icon={faXmark} /></Button></td>
                </tr>
            )
        })

    )

}
export default TableRows;