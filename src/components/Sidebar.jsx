import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, MapPin, Activity, DollarSign, FileText } from 'lucide-react';
import NavButton from './NavButton';
import qr from '../assets/dashboard_qr.png';
import driLogo from '../assets/DRi_logo_v3_white (2).png';
import logo from '../assets/sedna_logo.png';

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
      animate={{ width: collapsed ? 72 : 260 }}
      className="hidden md:flex flex-col h-screen bg-sidebar text-default border-r border-border"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <img src={logo} alt="Sedna logo" className="h-8 w-auto" />
        <button
          className="focus:outline-none focus:ring-2 focus:ring-focus rounded"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Open navigation"
        >
          <Menu />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2">
        {navItems.map((item) => (
          <NavButton key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>
      <div className="p-4 flex flex-col items-center space-y-4 border-t border-border">
        <motion.a
          href="https://sa.digirockinnovations.com/equipment_form"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${collapsed ? 'w-10 h-10' : 'w-32 px-4 py-2'} mx-auto flex items-center justify-center rounded-full text-white transition-colors bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus`}
        >
          {collapsed ? <FileText className="w-5 h-5" /> : 'Forms'}
        </motion.a>
        {!collapsed && <img src={qr} alt="Dashboard QR" className="w-24 h-24" />}
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <em className="text-xs text-muted">Powered by</em>
            <img src={driLogo} alt="DRi logo" className="h-4" />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
