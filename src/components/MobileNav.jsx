import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import NavButton from './NavButton';
import { navItems } from './Sidebar';

export default function MobileNav({ open, onClose }) {
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
        {navItems.map((item) => (
          <NavButton key={item.to} {...item} collapsed={false} />
        ))}
      </nav>
      <motion.a
        href="https://sa.digirockinnovations.com/equipment_form"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xs mx-auto mt-4 flex items-center justify-center rounded-full px-4 py-2 text-white transition-colors bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus"
      >
        <FileText className="w-5 h-5 mr-2" /> Forms
      </motion.a>
    </motion.div>
  );
}
