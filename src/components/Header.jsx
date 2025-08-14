import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/sedna_logo.png';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';

export default function Header() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-[#20252a] text-gray-900 dark:text-white shadow">
      <div className="flex items-center ml-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="mr-2 md:hidden focus:outline-none"
        >
          <Menu />
        </button>
        <img src={logo} alt="Sedna logo" className="h-8 w-auto" />
      </div>
      <div className="flex items-center space-x-3">
        <button className="px-4 py-2 rounded-full bg-main text-white hover:bg-blue-700">Support</button>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
        <ThemeToggle />
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
