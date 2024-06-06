import { Button, Form } from "react-bootstrap";
import { API_URL } from '../../constants/const';
import axios from "axios";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function TableRows({ rowsData, deleteTableRows, handleChange }) {
    const [medidas, setMedidas] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await axios.get(API_URL + '/produtos/0/medidas');
                setMedidas(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAll();
    }, []);

    return (
        <>
            {rowsData.map((data, index) => {
                const { desc, unidMedida, medida } = data;
                return (
                    <tr key={index}>
                        <td>
                            <Form.Control
                                type="text"
                                value={desc}
                                onChange={(evnt) => handleChange(index, evnt)}
                                name="desc"
                                placeholder="Ingrediente"
                            />
                        </td>

                        <td>
                            <Form.Control
                                as="select"
                                value={unidMedida}
                                onChange={(evnt) => handleChange(index, evnt)}
                                name="unidMedida"
                            >
                                <option value="">Selecione a unidade</option>
                                {medidas.map((medida, idx) => (
                                    <option key={idx} value={medida.index}>
                                        {medida.descricao}
                                    </option>
                                ))}
                            </Form.Control>
                        </td>

                        <td>
                            <Form.Control
                                type="text"
                                value={medida}
                                onChange={(evnt) => handleChange(index, evnt)}
                                name="medida"
                                placeholder="Medida"
                            />
                        </td>

                        <td className='d-flex justify-content-end'>
                            <Button variant="danger" onClick={() => deleteTableRows(index)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </Button>
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default TableRows;
