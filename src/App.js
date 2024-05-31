import './App.css';
import ModalCadReceita from './components/modal/modalCadReceita';
import { ModalProvider } from './components/modal/ModalContext';
import ModalCadStep from './components/modal/modalCadStep';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header/header';
import Feed from './components/feed/Feed'

function App() {
  return (
    <div className="App">

    <ModalProvider>
      <Header />
      <ModalCadReceita />
      
    </ModalProvider>

    <Feed/>

    </div>
  );
}

export default App;
