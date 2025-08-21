import { useEffect } from 'react';
export default function About() {
const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${apiUrl}/snapshot/count`)
      .then(res => res.json())
      .then(data => console.log('Snapshot count:', data.count))
      .catch(err => console.error('API error:', err));
  });
  return <h1>About This App</h1>;
}