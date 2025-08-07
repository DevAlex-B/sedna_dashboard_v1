import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, MapPin, Activity, DollarSign, FileText } from 'lucide-react';
import NavButton from './NavButton';

const navItems = [
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
      className="h-screen bg-[#2e353b] text-white flex flex-col"
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
    </motion.aside>
  );
}
