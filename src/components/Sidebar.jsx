import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, MapPin, Activity, DollarSign, FileText } from 'lucide-react';
import NavButton from './NavButton';
import qr from '../assets/dashboard_qr.png';
import driLogo from '../assets/DRi_logo_v3_white (2).png';

export const navItems = [
  { to: '/equipment-location', icon: MapPin, label: 'Equipment Location' },
  { to: '/equipment-status', icon: Activity, label: 'Equipment Status' },
  { to: '/finance', icon: DollarSign, label: 'Finance' },
  { to: '/log-details', icon: FileText, label: 'Log Details' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      className="hidden h-full bg-gray-100 text-gray-900 dark:bg-[#2e353b] dark:text-white flex-col md:flex"
    >
      <button
        className="p-4 focus:outline-none"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <Menu />
      </button>
      <nav className="flex-1 px-2">
        {navItems.map((item) => (
          <NavButton key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>
      <div className="p-4 flex flex-col items-center space-y-4">
        <motion.a
          href="https://sa.digirockinnovations.com/equipment_form"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${collapsed ? 'w-10 h-10' : 'w-32 px-4 py-2'} mx-auto flex items-center justify-center rounded-full text-white transition-colors hover:bg-blue-600 focus:outline-none`}
          style={{ backgroundColor: '#036EC8' }}
        >
          {collapsed ? <FileText className="w-5 h-5" /> : 'Forms'}
        </motion.a>
        {!collapsed && <img src={qr} alt="Dashboard QR" className="w-24 h-24" />}
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <em className="text-xs">Powered by</em>
            <img src={driLogo} alt="DRi logo" className="h-4" />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
