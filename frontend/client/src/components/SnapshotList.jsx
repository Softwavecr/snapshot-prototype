import { useEffect, useState } from 'react';
import supabaseApp from '../lib/supabaseClient'; // adjust path as needed

export default function SnapshotList() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
    
  const apiUrl = import.meta.env.VITE_API_URL;

fetch(`${apiUrl}/snapshots`)
  .then(res => res.json())
  .then(data => setSnapshots(data.snapshots));

  useEffect(() => {
    const fetchSnapshots = async () => {
      const { data, error } = await supabaseApp
        .from('snapshots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching snapshots:', error);
      else setSnapshots(data);

      setLoading(false);
    };

    fetchSnapshots();
  }, []);

  if (loading) return <p>Loading snapshots...</p>;

  return (
    <div className="snapshot-grid">
      {snapshots.map((snap) => (
        <div key={snap.id} className="snapshot-card">
          <img src={snap.image_url} alt="Snapshot" />
          <p>{new Date(snap.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
