import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

  const coordinates = snapshot.location?.location?.coordinates;
  const metadata = snapshot.location?.metadata;

  const latitude = coordinates?.[1];
  const longitude = coordinates?.[0];
  const mapUrl = latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : null;

  return (
    <div className="snapshot-detail">
      <Link to="/snapshots" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Snapshot List
      </Link>

      <img src={snapshot.image_url} alt="Snapshot" style={{ maxWidth: '100%' }} />
      <p><strong>Comment:</strong> {snapshot.comment}</p>

      {snapshot.location ? (
        <div style={{ marginTop: '1rem' }}>
          <h3>Location</h3>
          {latitude && longitude && (
            <>
              <p><strong>Coordinates:</strong> {latitude}, {longitude}</p>
              <p>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  View on Google Maps
                </a>
              </p>
            </>
          )}
          {metadata && (
            <p>
              <strong>City:</strong> {metadata.city}<br />
              <strong>State:</strong> {metadata.state}<br />
              <strong>Postal Code:</strong> {metadata.postal_code}
            </p>
          )}
        </div>
      ) : (
        <p><strong>Location:</strong> Not available</p>
      )}

      <p><strong>Created:</strong> {new Date(snapshot.created_at).toLocaleString()}</p>
    </div>
  );
}

export default SnapshotDetail;
