import Feed from './components/feed/Feed';
import Header from './components/header/header';
import ModalCadReceita from './components/modal/modalCadReceita';
import { ModalProvider } from './components/modal/ModalContext';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <ModalProvider>
        <Header />
        <ModalCadReceita />
      </ModalProvider>
      <Feed />
    </div>
  );
}

export default App;
