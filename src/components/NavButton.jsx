import { NavLink } from 'react-router-dom';

export default function NavButton({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center px-4 py-2 my-1 rounded transition-colors text-gray-800 dark:text-gray-200 hover:text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
        }`
      }
    >
      <Icon className="w-5 h-5 transition-colors group-hover:text-secondary" />
      {!collapsed && (
        <span className="ml-3 whitespace-nowrap transition-colors group-hover:text-secondary">{label}</span>
      )}
    </NavLink>
  );
}
