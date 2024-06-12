import Header from '../core/header/header';
import Feed from './feed/Feed'
import { ModalProvider } from '../shared/modal/ModalContext';
import ModalCadReceita from '../shared/modal/modalCadReceita';

function Home() {
    return (
        <>
            <ModalProvider>
                <Header />
                <ModalCadReceita />
            </ModalProvider>
            <Feed />
        </>
    );
}

export default Home;