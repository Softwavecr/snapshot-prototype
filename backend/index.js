// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Sample snapshot count endpoint
app.get('/api/snapshot/count', (_req, res) => {
  res.json({ count: 42 }); // Replace with DB logic later
  //res.json({ count: new Date().getSeconds() }); // Replace with DB logic later
});

//const image= 'https://www.istockphoto.com/photo/red-eyed-tree-frog-smile-gm1049028724-280573845';

// Sample snapshot count endpoint
app.post('/api/snapshot', async (req, res) => {
  
  const { image_url, location, comment } = req.body;

  const { data, error } = await supabase
    .from('snapshots')
    .insert([{ image_url, location, comment }])
    .select();

  if (error) {
    console.error('Supabase insert error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(500).json({ error: 'Insert succeeded but no data returned' });
  }
    
  res.json({ snapshot: data[0] });
});

// Sample snapshot detail endpoint
app.get('/api/snapshot/:id', async (req, res) => {
  const { id } = req.params;
  console.log('0snapshot id:', id);
  const { data, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('id', id)
    .single(); // Ensures you get one row, not an array

  if (error) {
    console.error('Supabase retrieval error:', error.message);
    return res.status(404).json({ error: 'Snapshot not found' });
  }

  res.json({ snapshot: data });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


// const image_url= 'https://www.istockphoto.com/photo/red-eyed-tree-frog-smile-gm1049028724-280573845';

// //INSERT INTO your_table (location_data) VALUES (
//   //'{"location": {"type": "Point", "coordinates": [-74.0060, 40.7128]}, "metadata": {"city": "Brooklyn", "state": "NY", "postal_code": "11232"}}'::jsonb
// const location=  '{"location": {"type": "Point", "coordinates": [-74.0060, 40.7128]}, "metadata": {"city": "Brooklyn", "state": "NY", "postal_code": "11232"}}';
// const comment= 'backend A red-eyed tree frog smiling in the rainforest';
// //);
