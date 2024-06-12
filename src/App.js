import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FormLoginV2 from './components/core/login/FormLoginV2';
import Home from './components/home/Home';
import FormLogin from './components/core/login/FormLogin';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<FormLoginV2 />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </>
  );
}

export default App;
