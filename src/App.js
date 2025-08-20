import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  // Refresh the page every 30 seconds so graphs update without manual input
  useEffect(() => {
    const id = setInterval(() => {
      // Reload from cache to minimize any visible flicker
      window.location.reload(false);
    }, 30000);

    return () => clearInterval(id);
  }, []);

  return <AppRoutes />;
}

export default App;
