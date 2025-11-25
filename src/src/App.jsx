import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ResenasJuego from './pages/ResenasJuego';  
import BibliotecaJuegos from './pages/BibliotecaJuegos';
import FormularioJuego from './pages/FormularioJuego';
import BuscarJuegos from './pages/BuscarJuegos';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BibliotecaJuegos />} />
        <Route path="/agregar" element={<FormularioJuego />} />
        <Route path="/editar/:id" element={<FormularioJuego />} />
        <Route path="/resenas/:id" element={<ResenasJuego />} />
        <Route path="/buscar" element={<BuscarJuegos />} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{style: {textAlign: 'center', background: '#000000ff', color: '#ff0000ff', border: '1px solid #ff0000ff'}}}/>
    </Router>
    
  );
}

export default App;
