import { motion } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import NavButton from './NavButton';
import { navItems } from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function MobileNav({ open, onClose }) {
  const { user, logout } = useAuth();
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: open ? 0 : '-100%' }}
      transition={{ type: 'tween' }}
      className="fixed inset-0 z-50 bg-sidebar text-default p-4 flex flex-col md:hidden"
    >
      <button onClick={onClose} className="self-end mb-4 focus:outline-none focus:ring-2 focus:ring-focus rounded">
        <X />
      </button>
      <nav className="flex-1">
        {navItems
          .filter((item) => !(item.adminOnly && (!user || user.visitor)))
          .map((item) => (
            <NavButton key={item.to} {...item} collapsed={false} onClick={onClose} />
          ))}
      </nav>
      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xs mx-auto mt-4 flex items-center justify-center rounded-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-focus"
      >
        <LogOut className="w-5 h-5 mr-2" /> Logout
      </motion.button>
    </motion.div>
  );
}
