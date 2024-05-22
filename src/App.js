import './App.css';
import ModalCadReceita from './components/modal/modalCadReceita';
import { ModalProvider } from './components/modal/ModalContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header/header';

function App() {
  return (
    <div className="App">

    <ModalProvider>
      <Header />
      <ModalCadReceita />
    </ModalProvider>


    </div>
  );
}

export default App;
