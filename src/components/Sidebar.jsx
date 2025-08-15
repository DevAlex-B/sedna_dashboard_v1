import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, MapPin, Activity, DollarSign, FileText, Shield } from 'lucide-react';
import NavButton from './NavButton';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import qr from '../assets/dashboard_qr.png';
import driLogoLight from '../assets/DRi_logo_v3_white (2).png';
import driLogoDark from '../assets/DRi_Logo_dark.png';
import logoLight from '../assets/sedna_logo.png';
import logoDark from '../assets/sedna_logo_dark.png';

export const navItems = [
  { to: '/equipment-location', icon: MapPin, label: 'Equipment Location' },
  { to: '/equipment-status', icon: Activity, label: 'Equipment Status' },
  { to: '/finance', icon: DollarSign, label: 'Finance' },
  { to: '/log-details', icon: FileText, label: 'Log Details' },
  { to: '/admin', icon: Shield, label: 'Admin', adminOnly: true },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const isLight = theme === 'light';
  const topLogo = isLight ? logoDark : logoLight;
  const bottomLogo = isLight ? driLogoDark : driLogoLight;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      className="hidden md:flex flex-col h-screen bg-sidebar text-default border-r border-border"
      aria-label="Primary sidebar"
    >
      {/* Header */}
      <div
        className={`flex items-center p-4 border-b border-border ${collapsed ? 'justify-end' : 'justify-between'}`}
      >
        {!collapsed && <img src={topLogo} alt="Sedna logo" className="h-8 w-auto" />}
        <button
          className="focus:outline-none focus:ring-2 focus:ring-focus rounded"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          aria-controls="primary-nav"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu />
        </button>
      </div>

      {/* Nav */}
      <nav id="primary-nav" className="flex-1 overflow-y-auto px-2">
        {navItems
          .filter((item) => !(item.adminOnly && (!user || user.visitor)))
          .map((item) => (
            <NavButton key={item.to} {...item} collapsed={collapsed} />
          ))}
      </nav>

      {/* Bottom area (no border here) */}
      <div className="p-4 flex flex-col items-center space-y-4">
        {/* QR + label (expanded only) */}
        {!collapsed && (
          <div className="flex flex-col items-center">
            <img src={qr} alt="Dashboard QR code" className="w-24 h-24" />
            <span className="mt-2 text-xs text-muted">Dashboard QR</span>
          </div>
        )}

        {/* Powered by (expanded only) — gets the thin top border */}
        {!collapsed && (
          <div className="w-full border-t border-border pt-4">
            <div className="flex items-center justify-center space-x-2">
              <em className="text-sm text-muted">Powered by</em>
              <img src={bottomLogo} alt="DRi logo" className="h-8 w-auto" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
