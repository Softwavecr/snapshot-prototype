// backend/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const fileUpload = require('express-fileupload');
app.use(fileUpload());

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
  const file = req.files?.image; // Assuming you're using express-fileupload or multer
  const { comment, location } = req.body;

  console.log('*****************************************');

  console.log('Body:', req.body);

  console.log('Files:', req.files);

  if (!file || !location) { 
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const filePath = `snapshots/${Date.now()}_${file.name}`;
  console.log('** filePath:', filePath);

  const { data: uploadData, error } = await supabase.storage
    .from('snapshots')
    .upload(filePath, file.data, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) return res.status(500).json({ error: "Insert to img storage error: "+ error.message });

  const { data: publicUrlData } = supabase.storage
    .from('snapshots')
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData?.publicUrl;
  console.log('Public URL:', publicUrl);

  // Insert metadata into DB
  const { data: snapshotData, error: dbError } = await supabase
    .from('snapshots')
    .insert([{
      image_url: publicUrl,
      location: JSON.parse(location), // Ensure location is stored as JSONB
      comment,
    }])
    .select();

  if (dbError) return res.status(500).json({ error: "Insert to DB error: " + dbError.message });

  // if (error) {
  //   console.error('Supabase insert error:', error.message);
  //   return res.status(500).json({ error: error.message });
  // }

  // if (!data || data.length === 0) {
  //   return res.status(500).json({ error: 'Insert succeeded but no data returned' });
  // }
    
  res.json({ snapshot: snapshotData[0] });
});

app.get('/api/snapshots', async (req, res) => {
const { data: mysnapshots, error } = await supabase
  .from('snapshots')
  .select('*')
  .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mysnapshots });
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
