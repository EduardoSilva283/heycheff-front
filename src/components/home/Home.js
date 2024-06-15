import Header from '../core/header/header';
import Feed from './feed/Feed'
import { ModalProvider } from '../shared/modal/ModalContext';
import ModalCadReceita from '../shared/modal/modalCadReceita';
import ModalReviewReceita from '../shared/modal/modalReviewReceita';
import { useState } from 'react';

function Home() {
    const [refreshReceitas, setRefreshReceitas] = useState(false);

    const handleRefresh = () => {
        setRefreshReceitas(prev => !prev);
    };

    return (
        <>
            <ModalProvider>
                <Header />
                <ModalCadReceita onRefresh={handleRefresh} />
            </ModalProvider>
            <ModalProvider>
                <Feed refresh={{ refreshReceitas }} />
                <ModalReviewReceita />
            </ModalProvider>
        </>
    );
}

export default Home;