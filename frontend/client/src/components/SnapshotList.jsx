import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';


export default function SnapshotList() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const LIMIT = 10;

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchSnapshots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/snapshots?limit=${LIMIT}&offset=${offset}`);
      const data = await res.json();
      const newSnaps = data.mysnapshots || [];

      setSnapshots((prev) => [...prev, ...newSnaps]);
      setHasMore(newSnaps.length === LIMIT);
    } catch (err) {
      console.error('Error fetching snapshots:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, offset]);

  useEffect(() => {
    fetchSnapshots();
  }, [offset, fetchSnapshots]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setOffset((prev) => prev + LIMIT);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="snapshot-grid">
      {snapshots.length === 0 ? (
        <p>No snapshots found.</p>
      ) : (
        snapshots.map((snap) => (
  <Link to={`/snapshot/${snap.id}`} key={snap.id} className="snapshot-card">
    <img
      src={snap.image_url}
      alt="Snapshot"
      style={{ width: '100%', borderRadius: '8px' }}
    />
    <p>{new Date(snap.created_at).toLocaleString()}</p>
    {snap.comment && <p>{snap.comment}</p>}
  </Link>
))
      )}
      {loading && <p>Loading more snapshots...</p>}
      <div ref={loaderRef} style={{ height: '1px' }} />
      {!hasMore && <p>No more snapshots to load.</p>}
    </div>
  );
}
