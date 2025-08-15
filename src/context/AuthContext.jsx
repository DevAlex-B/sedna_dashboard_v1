import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username, password, remember) => {
    if (username === 'sedna' && password === 'sedna123') {
      try {
        await fetch('/api/admin_session.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ action: 'login', username, password })
        });
      } catch (e) {
        console.error(e);
      }
      const userData = { username };
      setUser(userData);
      if (remember) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user');
      }
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const loginVisitor = async (fullName, email) => {
    try {
      await fetch('/api/admin_session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' })
      });
    } catch (e) {
      console.error(e);
    }
    const userData = { fullName, email, visitor: true };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = async () => {
    try {
      await fetch('/api/admin_session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' })
      });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginVisitor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
