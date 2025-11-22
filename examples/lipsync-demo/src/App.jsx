import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from "@react-three/drei";
import { Lipsync } from "wawa-lipsync";
import { UI } from "./components/UI";
import Dashboard from "./components/Dashboard";

export const lipsyncManager = new Lipsync({});

function AppRoutes() {
  return (
    <Routes>
      {/* Default route - redirect to lipsync demo */}
      <Route path="/" element={<MainApp />} />

      {/* Dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Lipsync demo route */}
      <Route path="/demo" element={<MainApp />} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Original App component as MainApp
function MainApp() {
  return (
    <>
      <Loader />
      <UI />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
