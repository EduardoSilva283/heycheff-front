import Header from '../core/header/Header';
import { ModalProvider } from '../shared/modal/ModalContext';
import ModalReviewReceita from '../shared/modal/ModalReviewReceita';
import Feed from './feed/Feed';

function Home() {
    return (
        <>
            <Header />
            <ModalProvider>
                <Feed />
                <ModalReviewReceita />
            </ModalProvider>
        </>
    );
}

export default Home;