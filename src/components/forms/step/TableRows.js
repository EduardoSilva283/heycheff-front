import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";

import api from '../../../service/api';

function TableRows({ rowsData, deleteTableRows, handleChange }) {
    const [medidas, setMedidas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const urlProdutos = "/produtos";

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const respMedidas = await api.get(urlProdutos + '/0/medidas');
                setMedidas(respMedidas.data);
                const respProdutos = await api.get(urlProdutos);
                setProdutos(respProdutos.data);
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
                                type='text'
                                value={desc}
                                onChange={(evnt) => handleChange(index, evnt)}
                                name="desc"
                                placeholder="Ingrediente"
                                list='produtos'
                            />
                            <datalist id='produtos'>
                                {produtos.map(prod => (
                                    <option key={prod.produtoDesc}>{prod.produtoDesc}</option>
                                ))}
                            </datalist>
                        </td>

                        <td>
                            <Form.Control
                                as="select"
                                value={unidMedida}
                                onChange={(evnt) => handleChange(index, evnt)}
                                name="unidMedida"
                            >
                                <option>Selecione a unidade</option>
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
