// src/App.js
import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { ModeratorDashboard } from './components/ModerationDashboard';

function App() {
  return (
    <ThemeProvider>
      <ModeratorDashboard />
    </ThemeProvider>
  );
}

export default App;