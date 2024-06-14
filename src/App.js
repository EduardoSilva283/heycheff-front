import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FormLoginV2 from './components/core/login/FormLoginV2';
import CadReceita from './components/forms/receita/CadReceita';
import Home from './components/home/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<FormLoginV2 />} />
          <Route path='/cadastro-receita' element={<CadReceita />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
