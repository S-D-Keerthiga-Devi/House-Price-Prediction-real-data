import React from 'react'
import { Routes, Route } from 'react-router-dom';
import SmartInsights from './pages/SmartInsights';

const App = () => {
  return (
    <Routes>
      <Route path="/smart-insights" element={<SmartInsights />} />
      {/* Add other routes here as needed */}
    </Routes>
  );
}

export default App;
