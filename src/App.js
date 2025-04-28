// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ModeratorDashboard } from './components/ModerationDashboard';
import TakedownRequestForm from './components/TakedownRequestForm';
import { RequestProvider } from './components/RequestContext';
import { AuthProvider } from './components/AuthContext';
import LandingPage from './components/LandingPage';
import ContactPage from './components/ContactPage';
import Settings from './components/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RequestProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<ModeratorDashboard />} />
              <Route path="/request" element={<TakedownRequestForm />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </RequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;