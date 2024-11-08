import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './components/homepage';
import Indoorair from './components/indoorair';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/smartcity5gusecases" element={<HomePage />} />
          <Route path="/smartcity5gusecases/indoorair" element={<Indoorair/>} />
        
          <Route path="*" element={<Navigate to="/smartcity5gusecases" />} />
        </Routes>
      </div>
    
    </Router>
  );
}

export default App;
