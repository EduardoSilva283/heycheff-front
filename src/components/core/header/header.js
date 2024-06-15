import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../../../assets/hey_cheff_black.png';
import { useModal } from '../../shared/modal/ModalContext';
import './header.css';

function Header() {
    const { openModal } = useModal();
    return (
        <>
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
                    <Button variant="outline-danger" onClick={openModal}>Cadastrar Receita</Button>
                </Container>
            </Navbar>
        </>
    )
}
export default Header;