import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
