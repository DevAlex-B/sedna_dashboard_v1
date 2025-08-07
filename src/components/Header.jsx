import ThemeToggle from './ThemeToggle';
import logo from '../assets/sedna_logo.png';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-[#20252a] text-gray-900 dark:text-white shadow">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="logo" className="h-8 w-8" />
        <span className="font-bold">Sedna</span>
      </div>
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 rounded bg-main text-white hover:bg-blue-700">Support</button>
        <button className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
        <ThemeToggle />
      </div>
    </header>
  );
}
