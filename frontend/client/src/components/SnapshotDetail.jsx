import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

function SnapshotDetail() {
  const { id } = useParams();
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('snapshot id:', id);
    fetch(`${apiUrl}/snapshot/${id}`)
      .then(res => res.json())
      .then(data => setSnapshot(data.snapshot))
      .catch(() => setError('Failed to load snapshot'));
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!snapshot) return <div>Loading...</div>;

  return (
    <div className="snapshot-detail">
      <img src={snapshot.image_url} alt="Snapshot" style={{ maxWidth: '100%' }} />
      <p><strong>Comment:</strong> {snapshot.comment}</p>
      <p><strong>Location:</strong> {JSON.stringify(snapshot.location)}</p>
      <p><strong>Created:</strong> {new Date(snapshot.created_at).toLocaleString()}</p>
    </div>
  );
}

export default SnapshotDetail;
