import React, { useEffect, useState } from 'react';
import { fetchSnapshotCount } from '../utils/fetchSnapshotCount';

function SnapshotCountBadge() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSnapshotCount()
      .then(setCount)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (count === null) return <div>Loading snapshot count...</div>;

  return (
    <div style={{ padding: '8px', background: '#eee', borderRadius: '4px' }}>
      Total Snapshots: <strong>{count}</strong>
    </div>
  );
}

export default SnapshotCountBadge;
