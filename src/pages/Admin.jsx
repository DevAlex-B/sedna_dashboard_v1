import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import AdminUserTable from '../components/AdminUserTable';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

export default function Admin() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('none');

  const fetchData = async () => {
    const params = new URLSearchParams();
    params.set('sort_by', sortBy || 'created_at');
    params.set('sort_dir', sortDir);
    try {
      const res = await fetch(`/api/admin_users.php?${params.toString()}`, {
        credentials: 'include'
      });
      if (res.status === 403) {
        navigate('/login');
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortBy, sortDir]);

  const handleSort = (column) => {
    if (sortBy === column && sortDir === 'desc') {
      setSortDir('asc');
    } else if (sortBy === column && sortDir === 'asc') {
      setSortBy(null);
      setSortDir('none');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-semibold mb-4">Admin</h1>
        <div className={`flex flex-col flex-1 ${panelClasses}`}>
          <h2 className="mb-2 font-medium">User Information</h2>
          <AdminUserTable data={data} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
        </div>
      </div>
    </PageContainer>
  );
}
