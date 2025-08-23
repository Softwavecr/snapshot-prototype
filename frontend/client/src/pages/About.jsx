import { useEffect } from 'react';
export default function About() {
const apiUrl = import.meta.env.VITE_API_URL;


//const image_url= 'https://www.istockphoto.com/photo/red-eyed-tree-frog-smile-gm1049028724-280573845';
const image_url= 'https://media.istockphoto.com/id/1049028724/photo/red-eyed-tree-frog-smile.jpg?s=1024x1024&w=is&k=20&c=caPNXQBS53vhHmeKH9F9Xwtha-zBregIZxvbcgj1qso=';

//INSERT INTO your_table (location_data) VALUES (
  //'{"location": {"type": "Point", "coordinates": [-74.0060, 40.7128]}, "metadata": {"city": "Brooklyn", "state": "NY", "postal_code": "11232"}}'::jsonb
const location=  '{"location": {"type": "Point", "coordinates": [-74.0060, 40.7128]}, "metadata": {"city": "Brooklyn", "state": "NY", "postal_code": "11232"}}';
const comment= 'frontend A red-eyed tree frog smiling in the rainforest';

  useEffect(() => {
    // fetch(`${apiUrl}/snapshot/count`)
    //   .then(res => res.json())
    //   .then(data => console.log('Snapshot count:', data.count))
    //   .catch(err => console.error('API error:', err));
    fetch(`${apiUrl}/snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url, location, comment }),
    })
      .then(data => console.log('Created snapshot:', data))
      .catch(err => console.error('API error:', err));
  });
  return <h1>About This App</h1>;
}