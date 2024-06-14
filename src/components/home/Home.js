import Header from '../core/header/header';
import Feed from './feed/Feed'
import { ModalProvider } from '../shared/modal/ModalContext';
import ModalCadReceita from '../shared/modal/modalCadReceita';
import ModalReviewReceita from '../shared/modal/modalReviewReceita';

function Home() {
    return (
        <>
            <ModalProvider>
                <Header />
                <ModalCadReceita />
            </ModalProvider>
            <ModalProvider>
                <Feed />
                <ModalReviewReceita />
            </ModalProvider>
        </>
    );
}

export default Home;