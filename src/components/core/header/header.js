import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

import logo from '../../../assets/hey_cheff_black.png';

import './header.css';

function Header() {
    return (
        <Navbar>
            <Container className='d-flex justify-content-between'>
                <Image src={logo} height='45px' />
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Pesquise Aqui..."
                        className="me-2"
                        aria-label="Search"
                    />
                </Form>
                <Link to={'/cadastro-receita'}>
                    <Button variant="outline-danger">Cadastrar Receita</Button>
                </Link>
            </Container>
        </Navbar>
    );
}

export default Header;