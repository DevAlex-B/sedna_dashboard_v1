import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';

export default function Header() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="flex items-center justify-between h-14 px-4 rounded-xl bg-header text-default shadow border border-border mx-2 my-2">
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-focus rounded"
        aria-label="Open navigation"
      >
        <Menu />
      </button>
      <div className="flex items-center space-x-3 ml-auto">
        <button className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus">Support</button>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full bg-secondary text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-focus"
        >
          Logout
        </button>
        <ThemeToggle />
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
