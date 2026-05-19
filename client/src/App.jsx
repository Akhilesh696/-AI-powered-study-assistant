import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StudyChat from './pages/StudyChat';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study" element={<StudyChat />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
