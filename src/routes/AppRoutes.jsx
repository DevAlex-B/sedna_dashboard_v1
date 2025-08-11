import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import EquipmentLocation from '../pages/EquipmentLocation';
import EquipmentStatus from '../pages/EquipmentStatus';
import Finance from '../pages/Finance';
import LogDetails from '../pages/LogDetails';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/equipment-location" />} />
        <Route path="equipment-location" element={<EquipmentLocation />} />
        <Route path="equipment-status" element={<EquipmentStatus />} />
        <Route path="finance" element={<Finance />} />
        <Route path="log-details" element={<LogDetails />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={user ? '/equipment-location' : '/login'} replace />}
      />
    </Routes>
  );
}
