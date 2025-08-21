import { Link, Outlet } from 'react-router-dom';

//const apiUrl = import.meta.env.VITE_API_URL;

/*
useEffect(() => {
  fetch(`${apiUrl}/snapshot/count`)
    .then(res => res.json())
    .then(data => console.log('Snapshot count:', data.count))
    .catch(err => console.error('API error:', err));
}, []);
*/

export default function Layout() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
