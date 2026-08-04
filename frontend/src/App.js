import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Anomalies from './pages/Anomalies';
import NewAnomaly from './pages/NewAnomaly';
import AnomalyDetail from './pages/AnomalyDetail';
import Layout from './components/Layout';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="anomalies" element={<Anomalies />} />
                    <Route path="anomalies/new" element={<NewAnomaly />} />
                    <Route path="anomalies/:id" element={<AnomalyDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;