

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/equipment-location');
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(username, password, rememberMe);
    if (res.success) {
      setMsg('Logged in successfully');
      setMsgType('success');
      setTimeout(() => navigate('/equipment-location'), 500);
    } else {
      setMsg(res.message);
      setMsgType('error');
    }
  };

  return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#20252A]">
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
              msgType === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {msg}
          </motion.div>
        )}
        {/* Background Animation */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Login Card with Glassmorphism */}
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-3xl 
        bg-white/20 dark:bg-black/20 backdrop-blur-2xl 
        border border-white/30 dark:border-white/10 shadow-lg 
        shadow-black/10 dark:shadow-white/5"
      >
        {/* Company Branding */}
        <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-900 dark:text-white">
          Sedna
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Sign in to continue
        </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Username
            </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/40 dark:border-white/20
                bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-main focus:border-main outline-none
                placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Password
            </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/40 dark:border-white/20
                bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-main focus:border-main outline-none
                placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 text-[#036EC9] bg-transparent border-white/40 rounded 
              focus:ring-[#036EC9] dark:focus:ring-[#036EC9]"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-gray-800 dark:text-gray-200"
            >
              Remember me
            </label>
          </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-xl
              bg-main hover:bg-blue-700 text-white shadow-lg
              hover:shadow-main/40 transition-all duration-300"
            >
              Log In
            </button>
          </form>
      </div>
    </div>
  );
}
