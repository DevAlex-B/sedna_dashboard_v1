import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr] bg-app text-default">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
