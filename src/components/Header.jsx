import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.svg';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-[#20252a] text-white">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="logo" className="h-8 w-8" />
        <span className="font-bold">Sedna</span>
      </div>
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 rounded bg-main hover:bg-blue-700">Support</button>
        <button className="px-3 py-1 rounded bg-secondary hover:bg-orange-600">Logout</button>
        <ThemeToggle />
      </div>
    </header>
  );
}
