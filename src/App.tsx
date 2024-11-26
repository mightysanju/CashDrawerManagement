import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CashDrawer } from './components/CashDrawer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<CashDrawer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;