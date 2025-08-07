import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import EquipmentLocation from '../pages/EquipmentLocation';
import EquipmentStatus from '../pages/EquipmentStatus';
import Finance from '../pages/Finance';
import LogDetails from '../pages/LogDetails';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/equipment-location" />} />
        <Route path="equipment-location" element={<EquipmentLocation />} />
        <Route path="equipment-status" element={<EquipmentStatus />} />
        <Route path="finance" element={<Finance />} />
        <Route path="log-details" element={<LogDetails />} />
      </Route>
    </Routes>
  );
}
