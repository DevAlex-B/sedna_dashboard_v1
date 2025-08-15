

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VisitorCollectForm from '../components/VisitorCollectForm';
import OtpInput from '../components/OtpInput';
import { logEvent } from '../utils/visitor';

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
  const [mode, setMode] = useState('visitor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { login, loginVisitor, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/equipment-location');
  }, [user, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password, rememberMe);
    if (res.success) {
      setMsg('Logged in successfully');
      setMsgType('success');
      setTimeout(() => navigate('/equipment-location'), 500);
    } else {
      setMsg(res.message);
      setMsgType('error');
    }
  };

  const sendOtp = async () => {
    if (!consent) return;
    const res = await fetch('/api/visitor.php?action=send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    if (res.ok) {
      setStep(2);
      setOtp('');
      setResendCooldown(30);
      logEvent('otp_requested', { emailHash: btoa(email) });
    } else {
      setMsg('Failed to send OTP');
      setMsgType('error');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await sendOtp();
    logEvent('otp_resent', { emailHash: btoa(email) });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/visitor.php?action=verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, otp })
    });
    if (res.ok) {
      await loginVisitor(name, email);
      logEvent('otp_verified', { emailHash: btoa(email) });
      navigate('/equipment-location');
    } else {
      setMsg('Invalid code');
      setMsgType('error');
      logEvent('otp_failed', { emailHash: btoa(email) });
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

        <div role="tablist" className="flex mb-6 bg-white/30 dark:bg-black/30 rounded-full p-1">
          <button
            role="tab"
            aria-selected={mode === 'visitor'}
            className={`flex-1 py-2 rounded-full ${mode === 'visitor' ? 'bg-primary text-white' : ''}`}
            onClick={() => setMode('visitor')}
          >
            Visitor
          </button>
          <button
            role="tab"
            aria-selected={mode === 'admin'}
            className={`flex-1 py-2 rounded-full ${mode === 'admin' ? 'bg-primary text-white' : ''}`}
            onClick={() => setMode('admin')}
          >
            Admin
          </button>
        </div>

        {mode === 'admin' && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/40 dark:border-white/20 bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/40 dark:border-white/20 bg-white/30 dark:bg-black/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-[#036EC9] bg-transparent border-white/40 rounded focus:ring-[#036EC9] dark:focus:ring-[#036EC9]"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-800 dark:text-gray-200"
              >
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-primary/40 transition-all duration-300"
            >
              Log In
            </button>
          </form>
        )}

        {mode === 'visitor' && (
          step === 1 ? (
            <VisitorCollectForm
              name={name}
              email={email}
              consent={consent}
              setName={setName}
              setEmail={setEmail}
              setConsent={setConsent}
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp();
              }}
            />
          ) : (
            <form className="space-y-4" onSubmit={handleVerify}>
              <OtpInput value={otp} onChange={setOtp} />
              <p className="text-sm text-gray-600">Code expires in 5 minutes.</p>
              <div className="flex justify-between text-sm">
                <button type="button" className="underline" onClick={() => setStep(1)}>Change email</button>
                <button type="button" className="underline" disabled={resendCooldown>0} onClick={handleResend}>
                  {resendCooldown>0 ? `Resend OTP (${resendCooldown})` : 'Resend OTP'}
                </button>
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-white rounded hover:bg-primary-hover">Verify</button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
