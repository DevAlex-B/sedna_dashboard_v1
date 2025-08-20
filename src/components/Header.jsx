import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import FullscreenToggle from './FullscreenToggle';
import { useAuth } from '../context/AuthContext';
import { Menu, FileText, LifeBuoy, LogOut } from 'lucide-react';
import MobileNav from './MobileNav';

export default function Header() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);
  return (
    <header className="flex items-center justify-between h-14 px-4 rounded-xl bg-header text-default shadow border border-border mx-2 my-2">
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-focus rounded"
        aria-label="Open navigation"
      >
        <Menu />
      </button>
      <div className="flex items-center space-x-2 ml-auto">
        <a
          href="https://sa.digirockinnovations.com/equipment_form"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 flex items-center rounded-full text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus text-sm"
        >
          Forms <FileText className="w-4 h-4 ml-2" />
        </a>
        <button className="px-3 py-1.5 flex items-center rounded-full text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-focus text-sm">
          Support <LifeBuoy className="w-4 h-4 ml-2" />
        </button>
        <button
          onClick={logout}
          className="hidden md:flex px-3 py-1.5 items-center rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-focus text-sm"
        >
          Logout <LogOut className="w-4 h-4 ml-2" />
        </button>
        <div className="hidden md:block">
          <FullscreenToggle />
        </div>
        <ThemeToggle />
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
