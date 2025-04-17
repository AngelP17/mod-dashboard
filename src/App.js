// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ModeratorDashboard } from './components/ModerationDashboard';
import TakedownRequestForm from './components/TakedownRequestForm';
import { RequestProvider } from './components/RequestContext';

function App() {
  return (
    <ThemeProvider>
      <RequestProvider>
        <Router>
          <Routes>
            <Route path="/dashboard" element={<ModeratorDashboard />} />
            <Route path="/request" element={<TakedownRequestForm />} />
            <Route path="/" element={<Navigate to="/request" replace />} />
          </Routes>
        </Router>
      </RequestProvider>
    </ThemeProvider>
  );
}

export default App;