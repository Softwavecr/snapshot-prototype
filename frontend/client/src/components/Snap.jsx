import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
const Snap = () => {
  const [imageFile, setImageFile] = useState(null);
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('');

const mylocation=  '{"location": {"type": "Point", "coordinates": [-74.0060, 40.7128]}, "metadata": {"city": "Brooklyn", "state": "NY", "postal_code": "11232"}}';

  useEffect(() => {
    setLocation(mylocation)
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !location) {
      setStatus('Missing image or location');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('comment', comment);
    formData.append('location', location);
    //formData.append('lng', location.lng);

    try {
      const res = await fetch(`${apiUrl}/snapshot`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setStatus('Snapshot submitted!');
        setImageFile(null);
        setComment('');
      } else {
        setStatus('Submission failed');
      }
    } catch {
      setStatus('Error submitting snapshot');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', maxWidth: '400px', margin: 'auto' }}>
      <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
      <textarea
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        style={{ width: '100%', marginTop: '0.5rem' }}
      />
      <button type="submit" style={{ marginTop: '1rem' }}>Submit Snapshot</button>
      <p>{status}</p>
    </form>
  );
};

export default Snap;
